import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PropertyType } from '../shared/enums/property';

import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';
import { PropertiesUploadsComponent } from './properties-uploads-modal/properties-uploads.component';
import { PropertiesListComponent } from './properties-list/properties-list.component';
import { User } from '../shared/interface/user';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit, OnDestroy {
  @ViewChild('propertyLists') propertyListsComponent: PropertiesListComponent;
  public progressBar = false;
  public search = '';
  public properties: Property[] = [];
  public ownedPropertiesOnly = signal(false);
  public filterBy: PropertyType[] = [];
  public user$: Observable<any>;
  public  userSub = new BehaviorSubject<any>("");
  public isUser:boolean;
  public user: User;
  data:any;
  private unSubscribe$ = new Subject<void>();

  constructor(
    public modalController: ModalController,
    private userService: UserService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    console.log("oninit");
    this.userService.userSessionSub.subscribe(({isSession}) => {
      console.log(isSession);
      this.isUser = isSession;
      //this.userName = userName
    }); 
    // this.userService.user$.pipe(takeUntil(this.unSubscribe$)).subscribe((val) => {
    //   console.log('subscsriptoon')
    //   this.user = val
    // })
  }

  ngOnChanges(){
    console.log("onchangesss");
  }

  ngOnDestroy(): void {
      this.unSubscribe$.next();
      this.unSubscribe$.complete();
  }

  async presentModal() {
    // const user = this.userService.user;
    // if (!user) {
    //   this.router.navigateByUrl('/user/signin');
    //   this.toastCtrl.create({
    //     message: 'Please sign in, to continue',
    //     duration: 3000,
    //     color: 'danger'
    //   }).then(toast => toast.present());
    //   return;
    // }
    const modalPropertiesNew = await this.modalController.create({
      component: PropertiesNewComponent
    });
    await modalPropertiesNew.present();
    const { data } = await modalPropertiesNew.onDidDismiss();
    if (data) {
      this.presentUploadModal(data);
    }
  }

  public async presentLoading() {
    this.progressBar = true;
    setTimeout(() => this.progressBar = false, 1500);
  }

  public switchOwnedProperty(event: CustomEvent) {
    this.ownedPropertiesOnly.set(event.detail.checked)
   // this.propertyListsComponent.setOwnedPropertiesOnly(event.detail.checked)
  }

  private async presentUploadModal(property: Property) {
    const modalUploads = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: { property }
    });
    await modalUploads.present();
  }

  public async signOut() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      message: 'You will be Signed out!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Sign out',
          cssClass: 'danger',
          handler: async () => {
            this.data = await this.userService.signOut();
              this.isUser = this.data.session;
            // this.enquiriesService.resetState();
            this.showToast();
            this.router.navigate(['/properties']);
          },
        },
      ],
    });
    await alert.present();
  }

  private async showToast() {
    const toast = await this.toastController.create({
      message: 'Success, you have signed out.',
      color: 'success',
      duration: 3000,
    });
    toast.present();
  }
}