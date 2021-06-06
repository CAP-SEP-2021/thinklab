
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ConfigService } from '../../../core/config/config.service';
import { BookingView, DishView, OrderListView, OrderView } from '../../../shared/view-models/interfaces';
import { WaiterCockpitService } from '../../services/waiter-cockpit.service';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { UserInfo } from 'app/shared/backend-models/interfaces';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {  Input  } from '@angular/core';
import {  FormBuilder } from '@angular/forms';
import { UsermanagementCockpitService } from '../../services/usermanagement-cockpit.service';

import { MatDialogRef } from "@angular/material/dialog";
import * as fromApp from '../../../store/reducers';
import * as cockpitAreaActions from "../../store/actions/cockpit-area.actions";
import { emailValidator } from '../../../shared/directives/email-validator.directive';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss']
})
export class UserDetailsDialogComponent implements OnInit {
//data :UserInfo[] = [];
panelOpenState ;
checkoutForm : FormGroup= new FormGroup({});
checkoutForm2 : FormGroup= new FormGroup({});
REGEXP_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
UserInfo :UserInfo ={
  id :0,
  username: '',
  password: '',
  email: '',
  userRoleId: 0,
  twoFactorStatus: undefined

};
 icon = 'visibility_off'; 
resetPasswordFormGroup;
fieldTextType: boolean =false;
temp ='';

columnst: string[] = [
  'id',
  'username',
  'email',
  'userRoleId',
];

  constructor(
    private waiterCockpitService: WaiterCockpitService,
    private UsermanagementCockpitService : UsermanagementCockpitService,
    private translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private configService: ConfigService,
    private fb: FormBuilder,
    private store: Store<fromApp.State>, 
  ) {
    
  
   // this.data.push(dialogData);
   delete dialogData.modificationCounter;
   delete dialogData.twoFactorStatus;
    this.UserInfo=dialogData;
    
    console.log("this is the user info ");
    console.log(this.UserInfo);
    //first  tab form
    this.checkoutForm2 = new FormGroup({
      username: new FormControl(this.UserInfo.username, Validators.required),
      email: new FormControl(this.UserInfo.email , [
        Validators.required,
        Validators.pattern(this.REGEXP_EMAIL),
      ]),
      userRoleId: new FormControl(this.UserInfo.userRoleId , Validators.required),
    });
     //second tab form
   this.checkoutForm = fb.group({
    password: ['', [Validators.required ,Validators.min(8)]],
    confirmedPassword: ['', [Validators.required , Validators.min(8)]]
  }, { 
    validator: this.ConfirmedValidator('password', 'confirmedPassword')
  });
  }

  ngOnInit(): void {
    this.panelOpenState=false;

 /* this.checkoutForm = new FormGroup({
    password: new FormControl(this.UserInfo.password ,Validators.required), //@later review
    confirmedPassword: new FormControl( [this.UserInfo.email, Validators.minLength(2),{ 
      validator:  this.checkPasswords(this.checkoutForm)}]),
  });*/
  
}



  ConfirmedValidator(controlName: string, matchingControlName: string){
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

get f(){
  return this.checkoutForm.controls;
}

/*
  function passwordMatchValidator(g: FormGroup) {
     return g.get('password').value === g.get('passwordConfirm').value
        ? null : {'mismatch': true};
  }*/
 /* checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmedPassword.value;

    return pass === confirmPass ? null : { notSame: true };
}*/
onSubmit(): void {
  console.log("submited");
  console.log('checkoutForm bevor editing ', this.checkoutForm.value);


  this.UserInfo.password = this.checkoutForm.get("password").value;
  console.log(this.UserInfo);
  this.store.dispatch(cockpitAreaActions.updateUser( {UserInfo :  this.UserInfo}));
  
}
onSubmit2(): void {
  // Process checkout data here
  console.log('checkoutForm second form ', this.checkoutForm2.value);
  delete  this.UserInfo.password;
  this.UserInfo.username = this.checkoutForm2.get("username").value;
  this.UserInfo.email = this.checkoutForm2.get("email").value;
  this.UserInfo.userRoleId = this.checkoutForm2.get("userRoleId").value;
  console.log('this is user info  ', this.UserInfo);
  this.store.dispatch(cockpitAreaActions.updateUser( {UserInfo :  this.UserInfo}));
  
  
}
get password(): AbstractControl {
  return this.checkoutForm.get('password');
}

get confirmedPassword(): AbstractControl {
  return this.checkoutForm.get('confirmedPassword');
}
//first form getters 
get username(): AbstractControl {
  return this.checkoutForm2.get('username');
} 
get email(): AbstractControl {
  return this.checkoutForm2.get('email');
}
get userRoleId(): AbstractControl {
  return this.checkoutForm2.get('userRoleId');
}




sendGetCancelOrder(): void{

}
deleteUser():void {/*
this.UsermanagementCockpitService.deleteUser(this.data[0].id).subscribe((data: any) => {
console.log(data);
});
*/
console.log();
this.store.dispatch(cockpitAreaActions.deleteUser( {UserInfo :  this.UserInfo}));
}



toggleFieldTextType() {
  if (this.icon === 'visibility_off'){
    this.icon='visibility';
  }else {
    this.icon='visibility_off';

  }
  this.fieldTextType = !this.fieldTextType;
}

}
