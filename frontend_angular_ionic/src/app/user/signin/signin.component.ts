import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  public error = false;
  public authFailed = false;
  public signinpwdForm: UntypedFormGroup;
  public signinOtpForm: UntypedFormGroup;
  public enterOtpForm: UntypedFormGroup;
  public showSocial = false;
  public signinStatus: Boolean = true;
  public sendOtpSuccess: Boolean = true;

  constructor(
    private fb: UntypedFormBuilder,
    private user: UserService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    public platform: Platform,
    public route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.signinOtpForm = this.fb.group({
      mobile_number: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
    });
    this.signinpwdForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.enterOtpForm = this.fb.group({
      otp: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.signinStatus = true;
    });
  }

  // call when user entered mobile number
  public async sendOtp() {
    if (this.signinOtpForm.valid) {
      const loading = await this.presentLoading();
      loading.present();
      const response: Promise<any> = this.user.sendOtp(
        this.signinOtpForm.value
      );
      await loading.dismiss();
      console.log('90--', response);
      response
        .then((value) => {
          console.log('76--', value);
        })
        .catch((error) => {
          switch (error.status) {
            case 400:
              alert(
                '400--Bad Request: The server could not understand the request due to invalid syntax.'
              );
              break;
            case 401:
              alert(
                '401---Unauthorized: The client must authenticate itself to get the requested response.'
              );
              break;
            case 403:
              alert(
                '403-- Forbidden: The client does not have access rights to the content'
              );
              break;
            case 404:
              alert(
                '404 --Not Found: The server can not find the requested resourcet'
              );
              break;
            case 500:
              alert(
                "500 -- Internal Server Error: The server has encountered a situation it doesn't know how to handle.t"
              );
              break;
            case 0:
              alert('0 --CORS Error');
              break;
            case 200:
              alert('200--success');
              this.sendOtpSuccess = false;
              break;
            default:
              alert('Not Found Error');
          }
        });
    }
  }
  // call when user entered OTP
  public async otpSignin() {
    if (this.enterOtpForm.valid) {
      const loading = await this.presentLoading();
      loading.present();
      const response: Promise<any> = this.user.enterOtp(
        this.enterOtpForm.value
      );
      await loading.dismiss();
      response
        .then((value) => {
          console.log('76--', value);
        })
        .catch((error) => {
          switch (error.status) {
            case 400:
              alert(
                '400--Bad Request: The server could not understand the request due to invalid syntax.'
              );
              break;
            case 401:
              alert(
                '401---Unauthorized: The client must authenticate itself to get the requested response.'
              );
              break;
            case 403:
              alert(
                '403-- Forbidden: The client does not have access rights to the content'
              );
              break;
            case 404:
              alert(
                '404 --Not Found: The server can not find the requested resourcet'
              );
              break;
            case 500:
              alert(
                "500 -- Internal Server Error: The server has encountered a situation it doesn't know how to handle.t"
              );
              break;
            case 0:
              alert('0 --CORS Error');
              break;
            case 200:
              'presentAlert()';
              break;
            default:
              alert('Not Found Error');
          }
        });
    }
  }

  public switchSignIn() {
    this.signinStatus = false;
  }
  public navToSignIn() {
    this.signinStatus = true;
  }
  // show alert when api fails from server end
  async presentAlert() {
    console.log('Alert Event');
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'Server Error',
      buttons: ['OK'],
    });

    await alert.present();
  }
  // show loader on api calls
  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }
}

// ngAfterViewInit(): void {
//   console.log("ngAfterViewInit---->", this.signinStatus);
//   if (!this.platform.is('capacitor')) {
//     this.initializeGoogleSigninWeb();
//   }
// }

// private initializeGoogleSigninWeb(): void {
//   if (!environment.api.googleAuthClientId) { return; }

//   google.accounts.id.initialize({
//     client_id: environment.api.googleAuthClientId,
//     callback: this.handleCredentialResponse.bind(this),
//     auto_select: false,
//     cancel_on_tap_outside: true,
//   });
//   google.accounts.id.renderButton(document.getElementById('web-google-button'), {
//     theme: 'outline',
//     size: 'large',
//     width: '330px',
//   });
//   google.accounts.id.prompt(async (notification: unknown) => {
//     console.log(notification);
//   });
// }

// private async handleCredentialResponse(response: GoogleAuthResponse) {
//   // Here will be your response from Google.
//   const loading = await this.presentLoading();
//   loading.present();
//   const user = await this.user.googleAuth(response);
//   if (user) {
//     await this.showToast('Success, You are logged in');
//     this.router.navigateByUrl('/map');
//     loading.dismiss();
//   }
// }

// private async showToast(message, color = 'success') {
//   const toast = await this.toastCtrl.create({
//     message,
//     duration: 2000,
//     color,
//   });
//   toast.present();
// }

// public async signInPwd() {
//   if (this.signinForm.invalid) {
//     this.error = true;
//     return;
//   }
//   const loading = await this.presentLoading();
//   loading.present();
//   const { email, password } = this.signinForm.value;
//   const errMssg = 'Something went wrong, try again later.';
//   try {
//     const result = await this.user.signIn(email, password);
//     await loading.dismiss();
//     if (result.error) {
//       await this.showToast(result.error.message || errMssg, 'danger');
//       return;
//     }
//     await this.showToast('Success, You are logged in');
//     this.router.navigateByUrl('/map');
//   } catch (error) {
//     await loading.dismiss();
//     await this.showToast(errMssg, 'danger');
//   }
// }
// this.signinStatus = true;
// this.sendOtpSuccess = true;
//this.showSocial = !!environment.api.googleAuthClientId;
