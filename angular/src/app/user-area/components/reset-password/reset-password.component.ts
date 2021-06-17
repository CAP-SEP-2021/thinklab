
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']


})
export class ResetPasswordComponent implements OnInit {
  animationState = false;
  loading = false;
  token: String;
  username: String;
  fieldTextType: boolean = false;
  icon = 'visibility_off';
  checkoutForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      this.username = params['username'];
      console.log(this.token);
      console.log(this.username);// Print the parameter to the console. 
    });

    this.checkoutForm = fb.group({
      password: ['', [Validators.required, Validators.min(8)]],
      confirmedPassword: ['', [Validators.required, Validators.min(8)]]
    }, {
      validator: this.ConfirmedValidator('password', 'confirmedPassword')
    });
  }

  ngOnInit(): void {

  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  get f() {
    return this.checkoutForm.controls;
  }
  get password(): AbstractControl {
    return this.checkoutForm.get('password');
  }

  get confirmedPassword(): AbstractControl {
    return this.checkoutForm.get('confirmedPassword');
  }
  toggleFieldTextType() {
    if (this.icon === 'visibility_off') {
      this.icon = 'visibility';
    } else {
      this.icon = 'visibility_off';

    }
    this.fieldTextType = !this.fieldTextType;
  }
  onSubmit(): void {
    console.log("submited");
    if (this.loading) {
      this.loading = false;
      return;
    }
    this.loading = true;
  }
}
