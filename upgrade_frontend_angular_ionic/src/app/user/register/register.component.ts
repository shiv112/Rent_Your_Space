import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToastController,
  LoadingController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  // Flag to handle error state
  public error = false;
  // Register form group with form controls and validations
  public registerForm: UntypedFormGroup;
  // Variable to store response data
  data: any;

  constructor(
    public modalController: ModalController,
    private fb: UntypedFormBuilder,
    private customValidators: CustomValidatorsDirective,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private user: UserService,
    public route: ActivatedRoute,
    private alertController: AlertController
  ) {
    // Initialize the form group with form controls and their respective validators
    this.registerForm = this.fb.group(
      {
        full_name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, customValidators.emailValidation()]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.customValidators.patternValidator(/\d/, { hasNumber: true }),
            this.customValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            this.customValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            this.customValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, {
              hasSpecialCharacters: true,
            }),
          ],
        ],
        confirm: ['', Validators.required],
        mobile_number: ['', Validators.required],
        termService: [false, Validators.required],
      },
      {
        // Custom validator to check if password and confirm password match
        validators: this.customValidators.isDifferent(
          'password',
          'confirm',
          'notConfirmed'
        ),
      }
    );
  }

  ngOnInit() {}

  // Function called when the user clicks the "Register" button
  public async submit() {
    // Show loader while processing
    const loading = await this.presentLoading();
    loading.present();

    try {
      // Destructure form values
      const { full_name, email, password, mobile_number } = this.registerForm.value;

      // Call the user service to register the user
      this.data = await this.user.register(
        full_name,
        email,
        password,
        mobile_number
      );

      // Handle response based on status
      if (
        JSON.stringify(this.data.status_code) === '200' &&
        this.data.message === 'done'
      ) {
        // Success: Navigate to sign-in page
        await loading.dismiss();
        this.navToSigin();
      } else if (
        JSON.stringify(this.data.status_code) === '200' &&
        this.data.message === 'already registered'
      ) {
        // Mobile number already registered: Show alert
        await loading.dismiss();
        this.alertMob();
      } else {
        // Server error: Show alert
        await loading.dismiss();
        this.alertServer();
      }
    } catch (error) {
      // Error handling for failed API call
      await loading.dismiss();
      alert(error.statusText);
    }
  }

  // Function to navigate to sign-in page after successful registration
  navToSigin() {
    this.router.navigate(['/user/signin']);
  }

  // Function to display alert when mobile number is already registered
  private async alertMob() {
    const alert = await this.alertController.create({
      message: 'Mobile Number Already Registered',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Function to display alert when server error occurs
  private async alertServer() {
    const alert = await this.alertController.create({
      message: 'Server Error',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Function to show a loading spinner during API request
  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }
}

//----------------------- Unused Code - Removed -----------------

// Function to show toast message (currently unused)
// private async showToast(message: string, color = 'success') {
//   const toast = await this.toastCtrl.create({
//     message,
//     duration: 2000,
//     color,
//   });
//   toast.present();
// }

// Function to handle form submission (removed unused duplicate versions)
// public async submit() {
//   if (this.registerForm.invalid) {
//     this.error = true;
//     return;
//   }
//   const loading = await this.presentLoading();
//   loading.present();

//   const { fullName, email, password } = this.registerForm.value;
//   const result = await this.user.register(fullName, email, password);
//   if (!result.error) {
//     loading.dismiss();
//     await this.showToast('Success, registration is complete.');
//     await this.router.navigateByUrl('/user/account/profile');
//     return;
//   }
//   await this.showToast('Error:' + result.error.message, 'danger');
//   loading.dismiss();
// }

// Code for handling promise and API responses (removed unused versions)
// public async submit() {
//   const loading = await this.presentLoading();
//   loading.present();
//   const { full_name, email, password, mobile_number } =
//     this.registerForm.value;
//   const response: Promise<any> = this.user.register(
//     full_name,
//     email,
//     password,
//     mobile_number
//   );
//   await loading.dismiss();
//   console.log("96----",response);
//   response.then((value) => {
//       console.log('98--', value.ok);
//     })
//     .catch((error) => {
//       console.log("102---",error.error.text);
//       switch (error.status) {
//         case 200:
//           this.navToSigin()
//           break;
//         default:
//           alert('Server Error');
//       }
//     });
//   this.presentUploadModal();
// }
