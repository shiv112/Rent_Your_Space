import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';


// Register swiper js
import { register } from 'swiper/element/bundle';
import { StorageService } from '../../services/storage/storage.service';
import { EnquiriesService } from 'src/app/enquiries/enquiries.service';
import { UserService } from 'src/app/user/user.service';
import { WebSocketService } from 'src/app/web-scoket/web-socket.service';
import { Enquiry } from '../../interface/enquiry';
register();

interface NavLinks {
  title: string;
  url: string;
  icon: string;
  signIn?: boolean;
  guest?: boolean;
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public user: any;
  public isUser: boolean;
  public isLogout:boolean;
  public unreadEnquiries = 0;
  data:any;
  userName:string;

  constructor(

    private userService: UserService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private enquiriesService: EnquiriesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userService.userSessionSub.subscribe(({isSession,userName}) => {
      this.isUser = isSession; 
      this.userName = userName
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