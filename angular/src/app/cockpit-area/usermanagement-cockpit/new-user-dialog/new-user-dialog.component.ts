import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserInfo } from 'app/shared/backend-models/interfaces';
import { UsermanagementCockpitService } from '../../services/usermanagement-cockpit.service';
import * as fromApp from '../../../store/reducers';

import { MatDialogRef } from "@angular/material/dialog";
import * as cockpitAreaActions from "../../store/actions/cockpit-area.actions";

import { emailValidator } from '../../../shared/directives/email-validator.directive';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss']
})
export class NewUserDialogComponent implements OnInit {


 checkoutForm: FormGroup;
  REGEXP_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  invalidmassage =""

  UserInfo : UserInfo ={    
    id : 0 ,
    username: '',
    password: '' ,
    email: '',
    userRoleId: 0,
    twoFactorStatus: undefined,
  };
  icon = 'visibility_off';
  fieldTextType: boolean =false;
  userRoles:String[]=["User", "Waiter" , "Manger" ,"Admin" ];
  userRoles2=[{roleTyp :"User" , id : 0}, {roleTyp :"Waiter" , id : 1} , {roleTyp :"Manger" , id : 2}  ,{roleTyp :"Admin" , id : 3}  ];

    //selected = 'option2';
  selectedRole  = {roleTyp :"User" , id : 0};
  constructor(  
  private store: Store<fromApp.State>, 
    private dialogRef: MatDialogRef<NewUserDialogComponent>,
    private UsermanagementCockpitService :UsermanagementCockpitService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {

    this.checkoutForm = this.fb.group({
      username: new FormControl(this.UserInfo.username, Validators.required),
     
      email: new FormControl(this.UserInfo.email , [
        Validators.required,
        Validators.pattern(this.REGEXP_EMAIL),
      ]),
      password: new FormControl(this.UserInfo.password, Validators.required), //@later review
      confirmedPassword: ['', [Validators.required , Validators.min(8)]],
      //repeatedPassword: new FormControl(),
      userRoleId: new FormControl(this.UserInfo.userRoleId , Validators.required)  }, { 
        validator: this.ConfirmedValidator('password', 'confirmedPassword')
      });
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
  get username(): AbstractControl {
    return this.checkoutForm.get('username');
  }
  get email(): AbstractControl {
    return this.checkoutForm.get('email');
  }
  get password(): AbstractControl {
    return this.checkoutForm.get('password');
  }

  get userRoleId(): AbstractControl {
    return this.checkoutForm.get('userRoleId');
  }

  toggleFieldTextType() {
    if (this.icon === 'visibility_off'){
      this.icon='visibility';
    }else {
      this.icon='visibility_off';
  
    }
    this.fieldTextType = !this.fieldTextType;
  }

//@mo delete later not needed 
checkIfEmpty (obj ){
  for (let key of Object.keys(obj)) {
    let mealName = obj[key];
    // ... do something with mealName
   /* console.log(key);
    console.log(mealName);*/
    if (!mealName && key != "userRoleId"){
      return false;
    }   
  }
return true;
}



  onSubmit(): void {
    // Process checkout data here
    console.log('checkoutForm bevor editing ', this.checkoutForm.value);
    if (this.checkIfEmpty(this.checkoutForm.value)){
  /* this.UsermanagementCockpitService.postNewUser(this.checkoutForm.value).subscribe((data: any) => {
      
      console.log(data);
    
  });
  
  */
  var tempData = this.checkoutForm.value;
  delete tempData.confirmedPassword;
  this.store.dispatch(cockpitAreaActions.createUser( {UserInfo :  tempData}));
 // this.dialogRef.close([]);
  
}

    //this.items = this.cartService.clearCart();
  /*  var mytemp = this.checkoutForm.value;
delete mytemp.repeatedPassword;

var user : UserInfo =mytemp;
    user.userRoleId = this.selectedRole.id;
   
    console.log('Your order has been submitted checkoutForm.value', this.checkoutForm.value);
    console.log('Your order has been submitted user', user);
    */
    //this.checkoutForm.reset();
  }



  sendStatus(option ){
    console.log("option");
    console.log(option);
    console.log("selectedRole");
    console.log(this.selectedRole);
    this.selectedRole =option;
  }

}
