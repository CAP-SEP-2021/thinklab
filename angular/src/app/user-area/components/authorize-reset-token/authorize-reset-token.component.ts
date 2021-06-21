import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import * as fromApp from '../../../store/reducers';
import * as authActions from "../../store/actions/auth.actions";
import { Store } from '@ngrx/store';
import { TokenString, UserPasswordToken } from 'app/user-area/models/user';
import {UserAreaService} from "../../services/user-area.service"
import { WaiterCockpitService } from 'app/cockpit-area/services/waiter-cockpit.service';

import { catchError, map, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-authorize-reset-token',
  templateUrl: './authorize-reset-token.component.html',
  styleUrls: ['./authorize-reset-token.component.scss']
})
export class AuthorizeResetTokenComponent implements OnInit {
  userResetPassword:UserPasswordToken;
  token : string;
  username:string;
  constructor(private activatedRoute: ActivatedRoute ,
    private router: Router,
    private userAreaService :UserAreaService,

    private store: Store<fromApp.State>,) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      this.username = params['username'];
      this.navigatToResetPassword() ;
    });

  }

  ngOnInit(): void {

     
  }
  navigatToResetPassword() :void{

 /*
var temp : TokenString ;
temp.token = this.token
 this.store.dispatch(authActions.checkToken( {token :temp }));
 not working bug in the action
*/


  this.userAreaService.checkToken(this.token).subscribe(
   data => this.router.navigate(['resetPassword'], { queryParams: {token: this.token, username: this.username}} ),
    error => this.router.navigate(['restaurant'])
);

  

  

    /*  this.router.navigate(['resetPassword'], { queryParams: {token: this.token, username: this.username}}),
),
catchError((error) =>this.router.navigate(['restaurant'])),
);*/
  //this.store.dispatch(authActions.checkToken({ UserInfo: this.UserInfo }));
 
}
fuck(){
  this.router.navigate(['restaurant']);
}
}
