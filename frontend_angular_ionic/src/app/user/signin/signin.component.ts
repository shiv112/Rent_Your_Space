import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
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
  public isNewUser: Boolean;
  data: any;

  constructor(
    private fb: UntypedFormBuilder,
    private user: UserService,
    public loadingController: LoadingController,
    public platform: Platform,
    public route: ActivatedRoute,
    public router: Router,
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
    // call when sigin component reloads
    this.route.params.subscribe((params) => {
      this.signinStatus = true;
      this.sendOtpSuccess = true;
    });
  }

  // call when user sigin with password

  public async signInPwd() {
    // loader start
    const loading = await this.presentLoading();
    loading.present();
    try {
      const { email, password,_id } = this.signinpwdForm.value;
      this.data = await this.user.signIn(email, password);
      // loader end
      await loading.dismiss();
       if (JSON.stringify(this.data.status_code) === '200') {
        // loader end
        await loading.dismiss();
        this.user.headerDynVal(this.data.session,this.data.full_name);
        this.user.userId = this.data._id;
        this.router.navigateByUrl('/properties');
      } else {
        // loader end
        await loading.dismiss();
        this.alertServer();
      }
    } catch (error) {
      // loader end
      await loading.dismiss();
      // when api crash like cors error
      alert(error.statusText);
    }
  }

  // call when user entered mobile number
  public async sendOtp() {
    // loader start
    const loading = await this.presentLoading();
    loading.present();
    try {
      this.data = await this.user.sendOtp(this.signinOtpForm.value);
      if (JSON.stringify(this.data.status_code) === '200') {
        // loader end
        await loading.dismiss();
        this.sendOtpSuccess = false;
      } else {
        // loader end
        await loading.dismiss();
        this.alertServer();
      }
    } catch (error) {
      // loader end
      await loading.dismiss();
      // when api crash like cors error
      alert(error.statusText);
    }
  }
  // call when user entered OTP
  public async otpSignin() {
    // loader start
    const loading = await this.presentLoading();
    loading.present();
    try {
      this.data = await this.user.enterOtp(this.enterOtpForm.value);
      if (
        JSON.stringify(this.data.status_code) === '200' &&
        this.data.is_new_user === 'no'
      ) {
        // existing user
        // loader end
        await loading.dismiss();
        this.router.navigateByUrl('/properties');
      } else if (
        JSON.stringify(this.data.status_code) === '200' &&
        this.data.is_new_user === 'yes'
      ) {
        // new user
        // loader end
        await loading.dismiss();
        this.isNewUser = true;
      } else {
        // loader end
        await loading.dismiss();
        this.wrongOtp();
      }
    } catch (error) {
      // loader end
      await loading.dismiss();
      // when api crash like cors error
      alert(error.statusText);
    }
  }
  // call when user click otp signin button
  public switchSignIn() {
    this.signinStatus = false;
  }
  // call when user click password signin link
  public navToSignIn() {
    this.signinStatus = true;
  }

  // call when backend api fails
  private async alertServer() {
    const alert = await this.alertController.create({
      message: 'Server Error',
      buttons: ['OK'],
    });
    await alert.present();
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
  // call when user entered wrong otp
  private async wrongOtp() {
    const alert = await this.alertController.create({
      message: 'Please Enter Correct OTP',
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
// --------------unused code----------------------

// if (JSON.stringify(this.data.status_code) === '200') {
// loader end
// await loading.dismiss();
// this.router.navigateByUrl('/user/account/profile');
//} else {
// loader end
// await loading.dismiss();
//  alert('server error');

// public async sendOtp() {
//   try {
//        if (this.signinOtpForm.valid) {
//    this.user.sendOtp(
//       this.signinOtpForm.value
//     );
//     }
//     } catch (error) {
//     console.log("75--",error);
//     if (error.status === 200) {
//       this.sendOtpSuccess = false;
//     } else {
//       this.alertServer();
//     }
//   }
// }

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
