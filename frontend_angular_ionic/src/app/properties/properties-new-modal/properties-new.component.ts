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

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.scss'],
})
export class PropertiesNewComponent implements OnInit {
  public propertyForm: UntypedFormGroup;
  public propertyTypes = [
    {
      label: 'residential',
      value: PropertyType.residential,
    },
    {
      label: 'commercial',
      value: PropertyType.commercial,
    },
    {
      label: 'industrial',
      value: PropertyType.industrial,
    },
    {
      label: 'land',
      value: PropertyType.land,
    },
  ];
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
    private router: Router
  ) {
    this.propertyForm = this.formBuilder.group({
      propName: ['', [Validators.required, Validators.minLength(4)]],
      propAdd: ['', Validators.required],
      propDes: ['', [Validators.required, Validators.minLength(10)]],
      propType: [PropertyType.residential],
      propRent: ['', Validators.required]
      
    });
  }

  ngOnInit() {}

  //------------- call when property submit
  public async submit() {
    // loader start
    const loading = await this.presentLoading();
    loading.present();
    try {
      const { propName, propAdd, propDes, propType, propRent } = this.propertyForm.value;

      this.data = await this.propertiesService.addProperty(
        propName,
        propAdd,
        propDes,
        propType,
        propRent
      );
      // loader end
      await loading.dismiss();
      this.router.navigateByUrl('/propertiespage');
    } catch (error) {
      // loader end
      await loading.dismiss();
      // when api crash like cors error
      alert(error.statusText);
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
}
