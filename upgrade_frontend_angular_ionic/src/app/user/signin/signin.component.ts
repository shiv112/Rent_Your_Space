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
  public signinStatus: boolean = true;
  public sendOtpSuccess: boolean = true;
  public isNewUser: boolean;
  public data: any;

  // Constructor to inject services and initialize forms
  constructor(
    private fb: UntypedFormBuilder,
    private user: UserService,
    public loadingController: LoadingController,
    public platform: Platform,
    public route: ActivatedRoute,
    public router: Router,
    private alertController: AlertController
  ) {
    // Initializing forms with validation
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
    // Called when the signin component is reloaded
    this.route.params.subscribe((params) => {
      this.signinStatus = true;
      this.sendOtpSuccess = true;
    });
  }

  // Handle sign-in with password
  public async signInPwd() {
    const loading = await this.presentLoading();
    loading.present();
    try {
      const { email, password } = this.signinpwdForm.value;
      // Call API to authenticate the user
      this.data = await this.user.signIn(email, password);
      await loading.dismiss();
      
      if (JSON.stringify(this.data.status_code) === '200') {
        // Success: Store session and navigate to properties page
        this.user.headerDynVal(this.data.session, this.data.full_name);
        this.user.userId = this.data._id;
        this.router.navigateByUrl('/properties');
      } else {
        // Server Error: Display an alert
        this.alertServer();
      }
    } catch (error) {
      await loading.dismiss();
      alert(error.statusText);  // Handle API failure (e.g., CORS error)
    }
  }

  // Handle sending OTP to the user
  public async sendOtp() {
    const loading = await this.presentLoading();
    loading.present();
    try {
      this.data = await this.user.sendOtp(this.signinOtpForm.value);
      await loading.dismiss();
      
      if (JSON.stringify(this.data.status_code) === '200') {
        this.sendOtpSuccess = false;  // OTP sent successfully
      } else {
        this.alertServer();  // Server Error: Display an alert
      }
    } catch (error) {
      await loading.dismiss();
      alert(error.statusText);  // Handle API failure (e.g., CORS error)
    }
  }

  // Handle OTP submission for sign-in
  public async otpSignin() {
    const loading = await this.presentLoading();
    loading.present();
    try {
      this.data = await this.user.enterOtp(this.enterOtpForm.value);
      await loading.dismiss();

      // Check if OTP is valid and user type (existing or new)
      if (JSON.stringify(this.data.status_code) === '200') {
        if (this.data.is_new_user === 'no') {
          this.router.navigateByUrl('/properties');  // Existing user
        } else {
          this.isNewUser = true;  // New user: Proceed accordingly
        }
      } else {
        this.wrongOtp();  // Invalid OTP
      }
    } catch (error) {
      await loading.dismiss();
      alert(error.statusText);  // Handle API failure (e.g., CORS error)
    }
  }

  // Switch to OTP sign-in form
  public switchSignIn() {
    this.signinStatus = false;
  }

  // Switch back to password sign-in form
  public navToSignIn() {
    this.signinStatus = true;
  }

  // Display alert when API fails
  private async alertServer() {
    const alert = await this.alertController.create({
      message: 'Server Error',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Show alert for incorrect OTP
  private async wrongOtp() {
    const alert = await this.alertController.create({
      message: 'Please Enter Correct OTP',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Show a loading spinner for API calls
  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }
}
