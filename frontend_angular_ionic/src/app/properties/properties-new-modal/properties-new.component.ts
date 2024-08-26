import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';

import { PropertyType } from 'src/app/shared/enums/property';
import { PropertiesService } from '../properties.service';
import { PropertiesCoordinatesComponent } from '../properties-coordinates-modal/properties-coordinates.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.scss'],
})
export class PropertiesNewComponent implements OnInit {
  public propertyForm: UntypedFormGroup;
  imageFile: File;
  public isUser: boolean;
  public step = 1;
  public error = false;
  public isSubmit = false;
  data: any;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private propertiesService: PropertiesService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private userService: UserService
  ) {
    this.propertyForm = this.formBuilder.group({
      propName: ['', [Validators.required, Validators.minLength(4)]],
      propAdd: ['', Validators.required],
      propDes: ['', [Validators.required, Validators.minLength(10)]],
      propType: [PropertyType.residential],
      propRent: ['', Validators.required],
      propertyImages:['',Validators.required]
      
    });
  }

  ngOnInit() {
    this.userService.userSessionSub.subscribe(({isSession}) => {
      console.log("prop session",isSession);
      this.isUser = isSession;
    }); 
  }

  //------------- call when property submit
  public async submit() {
      // loader start
      const loading = await this.presentLoading();
      loading.present();
   if(this.isUser){
  
    try {
      //  const formData = new FormData();
      const { propName, propAdd, propDes, propType, propRent } = this.propertyForm.value;
      const json = {
        propName: propName,
        propAdd: propAdd,
        propDes: propDes,
        propType: propType,
        propRent: propRent,
        userId: this.userService.userId
      };

      this.data = await this.propertiesService.addProperty(json,this.imageFile);
      // loader end
     await loading.dismiss();
      // close add your space popup
      this.modalCtrl.dismiss();
      this.router.navigateByUrl('/propertiespage');
    } catch (error) {
      // loader end
      await loading.dismiss();
      // when api crash like cors error
      alert(error.statusText);
    }

   }else{
     // loader end
     await loading.dismiss();
     // close add your space popup
     this.modalCtrl.dismiss();
    this.router.navigate(['/user/signin']);
   }

    // this.isSubmit = true;
    //   const ft = this.propertyForm.get('features').value;

    //   this.propertyForm.patchValue({
    //     features: ft.split(',').filter((item: string) => item.trim() !== '')
    //   });
    //   const { lat, lng } = this.propertyForm.value;
    //   const newProperty = { ...this.propertyForm.value, ...{ position: { lat, lng }, date: new Date() } };
    //   const { data, message } = await this.propertiesService.addProperty(newProperty);
    //   if (data) {
    //     this.modalCtrl.dismiss(data);
    //     this.presentToast(message);
    //     return;
    //   }
    //   this.presentToast('Error:' + message, 'danger');
    //   return;
    // this.presentToast('Error: Invalid, please fill the form properly', 'danger');
  }

  onFileSelected(event: any){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    } 
    // this.imageFile = event.target.files[0].name;
    // console.log(this.imageFile);
    // console.log(event.target.files[0].name);
  }

 
  // call when api calling inprogress
  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }

  public async openMap() {
    const modal = await this.modalCtrl.create({
      component: PropertiesCoordinatesComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const { lat, lng } = data;
      this.propertyForm.patchValue({ lat, lng });
    }
  }

  private validateStepOne() {
    if (
      this.propertyForm.get('name').valid &&
      this.propertyForm.get('address').valid &&
      this.propertyForm.get('description').valid &&
      this.propertyForm.get('type').valid
    ) {
      return true;
    }
    this.error = true;
  }

  private validateStepTwo() {
    if (
      this.propertyForm.get('price').valid &&
      this.propertyForm.get('currency').valid &&
      this.propertyForm.get('lat').valid &&
      this.propertyForm.get('lng').valid
    ) {
      return true;
    }
    this.error = true;
  }

  private async presentToast(
    message: string,
    color = 'success',
    duration = 3000
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
    });
    toast.present();
  }

  formDataToObject(formData: FormData): { [key: string]: any } {
    const obj: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      // For files, get the file name or other properties
      if (value instanceof File) {
        obj[key] = {
          name: value.name,
          size: value.size,
          type: value.type,
        };
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }
  
}