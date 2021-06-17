import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../core/config/config.service';
import { TranslocoService } from '@ngneat/transloco';
import { UserInfo } from 'app/shared/backend-models/interfaces';
import { FormBuilder } from '@angular/forms';
import { UsermanagementCockpitService } from '../../../services/usermanagement-cockpit.service';
import * as fromApp from "../../../../store/reducers";
import * as cockpitAreaActions from "../../../store/actions/cockpit-area.actions";
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  UserInfo: UserInfo = {
    id: 0,
    username: '',
    password: '',
    email: '',
    userRoleId: 0,
    twoFactorStatus: undefined,

  };
    

  dialog : MatDialog;
  constructor( 

    private UsermanagementCockpitService: UsermanagementCockpitService,
    private translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private configService: ConfigService,
    private fb: FormBuilder,
    private store: Store<fromApp.State> , 
    ) { 
   
      this.UserInfo  = dialogData;
    }

  ngOnInit(): void {
  }
  deleteUser(): void {

        console.log();
        this.store.dispatch(cockpitAreaActions.deleteUser({ UserInfo: this.UserInfo }));
       
      }

      public decline() {
       
      }
    
      public accept() {
        
      }
}

