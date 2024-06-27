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
  public error = false;
  public registerForm: UntypedFormGroup;

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
        validators: this.customValidators.isDifferent(
          'password',
          'confirm',
          'notConfirmed'
        ),
      }
    );
  }

  ngOnInit() {}
  // call when user hit register button
  public async submit() {
    const loading = await this.presentLoading();
    loading.present();
    try {
      const { full_name, email, password, mobile_number } =
        this.registerForm.value;
      await this.user.register(full_name, email, password, mobile_number);
    } catch (error) {
      await loading.dismiss();
      console.log("inside catch register");
      if (error.error.text === 'already registered' && error.status === 200) {
        this.alertMob();
      } else if (error.error.text === 'done' && error.status === 200) {
        this.navToSigin();
      } else {
        this.alertServer();
      }
    }
  }
  // call when user successfully registered
  navToSigin() {
    this.router.navigate(['/user/signin']);
  }

  // call when user entered mobile number which already registered in database
  private async alertMob() {
    const alert = await this.alertController.create({
      message: 'Mobile Number Already Registered',
      buttons: ['OK'],
    });
    await alert.present();
  }
  // call when backend api fails
  private async alertServer() {
    const alert = await this.alertController.create({
      message: 'Server Error',
      buttons: ['OK'],
    });
    await alert.present();
  }
  // call when api calling inprogress
  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }

}

//----------------------- unused code delete it-----------------

  // private async showToast(message: string, color = 'success') {
  //   const toast = await this.toastCtrl.create({
  //     message,
  //     duration: 2000,
  //     color,
  //   });
  //   toast.present();
  // }

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
