import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-otp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-otp.component.html',
  styleUrls: ['./user-otp.component.scss'],
})
export class UserOtpComponent implements OnInit {
  otpForm: FormGroup = new FormGroup({
    otp_code: new FormControl('')
  });

  constructor(private user: UserService) { }

  ngOnInit() { }

  onSubmit(): void {
    // const { otp_code } = this.otpForm.value;
    // this.user.sendOtp(otp_code);

    console.log("21----", this.otpForm.value);
  }




}
