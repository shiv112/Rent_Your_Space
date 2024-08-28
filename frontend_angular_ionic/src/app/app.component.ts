import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from './shared/interface/user';

import { EnquiriesService } from './enquiries/enquiries.service';
import { StorageService } from './shared/services/storage/storage.service';
import { UserService } from './user/user.service';
import { WebSocketService } from './web-scoket/web-socket.service';
import { Enquiry } from './shared/interface/enquiry';

// Register swiper js
import { register } from 'swiper/element/bundle';
import { PropertiesNewComponent } from './properties/properties-new-modal/properties-new.component';
import { PropertiesUploadsComponent } from './properties/properties-uploads-modal/properties-uploads.component';
import { Property } from './shared/interface/property';
register();



@Component({
  selector: 'app-root',
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
    private toastController: ToastController,
    private enquiriesService: EnquiriesService
  ) {}
  // ngOnInit() {
  //   console.log( "isuser",this.isUser);
  //   this.userService.userSub.subscribe((user) => {
  //     if (user === 'user_in_session') {
  //       this.isUser = true;
  //       console.log( "isuser",this.isUser);
  //     }
  // });
  // }

  ngOnInit() {
    console.log("oninit");
    this.user.userSessionSub.subscribe(({isSession}) => {
      console.log("prop session",isSession);
      this.isUser = isSession;
      //this.userName = userName
    }); 
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
            this.data = await this.user.signOut();
            this.user.headerDynVal(this.data.session,this.data.full_name);
           // this.enquiriesService.resetState();
            this.showToast();
            //this.ngOnInit();
            // this.router.navigate(['/properties']);
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

  private async presentUploadModal(property: Property) {
    const modalUploads = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: { property }
    });
    await modalUploads.present();
  }
}


// interface NavLinks {
//   title: string;
//   url: string;
//   icon: string;
//   signIn?: boolean;
//   guest?: boolean;
// }
// public appPages: NavLinks[] = [
//   // { title: 'Map', url: '/map', icon: 'map' },
//   { title: 'Properties', url: '/properties', icon: 'home' },
//   // { title: 'Enquiries', url: '/enquiries', icon: 'reader' },
//   // { title: 'Mortgage Calc', url: '/mortgage-calc', icon: 'calculator' },
//   // { title: 'Settings', url: '/settings', icon: 'cog' },
// ];

// public appLowerPages: NavLinks[] = [
//   // { title: 'About', url: '/about', icon: 'help-circle' },
//   // { title: 'Account', url: '/user/account', icon: 'person', signIn: true },
//   { title: 'Register', url: '/user/register', icon: 'create', guest: true },
//   { title: 'Sign In', url: '/user/signin', icon: 'log-in', guest: true },
// ];
// public user: any;
// public isUser: Boolean = false;
// // public user: User;
// public unreadEnquiries = 0;

// constructor(
//   private platform: Platform,
//   private storage: StorageService,
//   private userService: UserService,
//   private alertController: AlertController,
//   private toastController: ToastController,
//   private router: Router,
//   private http: HttpClient,
//   private enquiriesService: EnquiriesService,
//   private webSocket: WebSocketService,
//   public route: ActivatedRoute
// ) {}

// ngOnInit() {
//   this.userService.user$.subscribe((user) => {
//     if (user === 'user_in_session') {
//       this.isUser = true;
//     }
//   });
// }



// public isHidden(link: NavLinks) {
//   if (!link.signIn && !link.guest) {
//     return;
//   }
//   if (link.signIn && this.user) {
//     return;
//   }
//   if (link.guest && !this.user) {
//     return;
//   }
//   return true;
// }





// private checkServer() {
//   firstValueFrom(this.http.get(environment.api.server)).then((data) =>
//     console.log(data)
//   );
// }

// private isUnread(enquiry: Enquiry) {
//   return !enquiry.read && enquiry.users.to.user_id === this.user.user_id;
// }