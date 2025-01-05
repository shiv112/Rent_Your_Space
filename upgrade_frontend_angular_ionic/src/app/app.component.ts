import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from './shared/interface/user';
import { EnquiriesService } from './enquiries/enquiries.service';
import { UserService } from './user/user.service';
import { PropertiesNewComponent } from './properties/properties-new-modal/properties-new.component';
import { PropertiesUploadsComponent } from './properties/properties-uploads-modal/properties-uploads.component';
import { Property } from './shared/interface/property';

// Register swiper js
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public isUser: Boolean = false;
  data: any;

  constructor(
    public modalController: ModalController,
    private user: UserService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private enquiriesService: EnquiriesService
  ) {}

  // ngOnInit lifecycle hook to subscribe to user session status
  ngOnInit() {
    console.log("oninit");
    this.user.userSessionSub.subscribe(({ isSession }) => {
      console.log("prop session", isSession);
      this.isUser = isSession;
    });
  }

  // Method to handle user sign-out
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
            this.data = await this.user.signOut();
            this.showToast(); // Show a toast upon successful sign-out
            this.user.headerDynVal(this.data.session, this.data.full_name);
          },
        },
      ],
    });
    await alert.present();
  }

  // Helper method to show toast message
  private async showToast() {
    const toast = await this.toastCtrl.create({
      message: 'Success, you have signed out.',
      color: 'success',
      duration: 3000,
    });
    toast.present();
  }

  // Method to open the modal for posting a new property
  async presentModal() {
    const modalPropertiesNew = await this.modalController.create({
      component: PropertiesNewComponent,
    });
    await modalPropertiesNew.present();

    const { data } = await modalPropertiesNew.onDidDismiss();
    if (data) {
      this.presentUploadModal(data); // If modal data exists, open the upload modal
    }
  }

  // Method to open the upload modal after a new property is created
  private async presentUploadModal(property: Property) {
    const modalUploads = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: { property },
    });
    await modalUploads.present();
  }
}

