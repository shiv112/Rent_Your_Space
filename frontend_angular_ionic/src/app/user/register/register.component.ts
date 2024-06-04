import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';
import { UserService } from '../user.service';
import { first } from 'rxjs';
import { UserOtpComponent } from '../user-otp/user-otp.component';


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
    private user: UserService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(4)]],
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
        number:['', Validators.required],
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

  public submit() {
    console.log(this.registerForm.value);
    const { name, email, password,number} = this.registerForm.value;
    this.user.register(name, email, password,number);
     this.presentUploadModal();  
  }

  private async presentUploadModal() {
    const modalUploads = await this.modalController.create({
      component: UserOtpComponent,
     // componentProps: { property }
    });
    await modalUploads.present();
  }
  

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

  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }

  private async showToast(message: string, color = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
