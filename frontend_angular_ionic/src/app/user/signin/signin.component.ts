import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { GoogleAuthResponse } from 'src/app/shared/interface/google';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';
import { async } from 'rxjs';
// CDN - https://accounts.google.com/gsi/client
declare let google: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, AfterViewInit {
  public error = false;
  public authFailed = false;
  public signinOtpForm: UntypedFormGroup;
  public signinForm: UntypedFormGroup;
  public showSocial = false;

  constructor(
    private fb: UntypedFormBuilder,
    private user: UserService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    public platform: Platform
  ) {

    
    this.signinOtpForm = this.fb.group({
      mobile_number: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$") ]]
    });
    // this.signinForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', Validators.required],
    // });
  }

  ngOnInit() {
    //this.showSocial = !!environment.api.googleAuthClientId;
  }

  public async signInOtp() {
    if(this.signinOtpForm.valid){
      const loading = await this.presentLoading();
      loading.present();
      const response: Promise<any> = this.user.sendOtp(this.signinOtpForm.value);
      await loading.dismiss();
      response.then((value) => {
        console.log("76--", value);
      }).catch((error) => {
        switch (error.status) {
          case 400:
            alert("400--Bad Request: The server could not understand the request due to invalid syntax.");
            break;
          case 401:
            alert("401---Unauthorized: The client must authenticate itself to get the requested response.");
            break;
          case 403:
            alert("403-- Forbidden: The client does not have access rights to the content");
            break;
          case 404:
            alert("404 --Not Found: The server can not find the requested resourcet");
            break;
          case 500:
            alert("500 -- Internal Server Error: The server has encountered a situation it doesn't know how to handle.t");
            break;
          case 0:
            alert("0 --CORS Error");
            break;
          case 200:
            alert("200--success");
            break;
          default:
            alert("Not Found Error");
        }
      });
    }
   
  }



  ngAfterViewInit(): void {
    if (!this.platform.is('capacitor')) {
      this.initializeGoogleSigninWeb();
    }
  }

  public async submit() {
    // if (this.signinForm.invalid) {
    //   this.error = true;
    //   return;
    // }
    // const loading = await this.presentLoading();
    // loading.present();
    // const { email, password } = this.signinForm.value;
    // const errMssg = 'Something went wrong, try again later.';
    // try {
    //   const result = await this.user.signIn(email, password);
    //   await loading.dismiss();
    //   if (result.error) {
    //     await this.showToast(result.error.message || errMssg, 'danger');
    //     return;
    //   }
    //   await this.showToast('Success, You are logged in');
    //   this.router.navigateByUrl('/map');
    // } catch (error) {
    //   await loading.dismiss();
    //   await this.showToast(errMssg, 'danger');
    // }
  }



  private initializeGoogleSigninWeb(): void {
    if (!environment.api.googleAuthClientId) { return; }

    google.accounts.id.initialize({
      client_id: environment.api.googleAuthClientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    google.accounts.id.renderButton(document.getElementById('web-google-button'), {
      theme: 'outline',
      size: 'large',
      width: '330px',
    });
    google.accounts.id.prompt(async (notification: unknown) => {
      console.log(notification);
    });
  }

  private async handleCredentialResponse(response: GoogleAuthResponse) {
    // Here will be your response from Google.
    const loading = await this.presentLoading();
    loading.present();
    const user = await this.user.googleAuth(response);
    if (user) {
      await this.showToast('Success, You are logged in');
      this.router.navigateByUrl('/map');
      loading.dismiss();
    }
  }

  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }

  private async showToast(message, color = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
