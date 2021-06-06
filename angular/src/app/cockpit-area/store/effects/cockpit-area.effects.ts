import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SnackBarService } from '../../../core/snack-bar/snack-bar.service';
import * as fromRoot from '../../../store';
import { UserInfo } from '../../../shared/backend-models/interfaces';
import { UsermanagementCockpitService } from '../../services/usermanagement-cockpit.service';
import { WaiterCockpitService } from '../../services/waiter-cockpit.service';
import * as cockpitActions from '../actions/cockpit-area.actions';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class CockpitAreaEffects {
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cockpitActions.createUser),
      map((UserInfo) => UserInfo),
      switchMap((UserInfo: any) => {
        /*console.log("this is fronm effects file ");
       console.log(UserInfo);
       var tempUserinfo :UserInfo ={
         username : UserInfo.UserInfo.username,
         userRoleId : UserInfo.UserInfo.userRoleId,
          email : UserInfo.UserInfo.email,
         password : UserInfo.UserInfo.password,
       }
      // delete UserInfo.type;
      console.log("this is temp data fronm effects file ");
       console.log(tempUserinfo);*/
        return this.UsermanagementCockpitService.postNewUser( UserInfo.UserInfo ).pipe(
          map((res: any) =>
            cockpitActions.createUserSuccess(
              {
                id:res.id,
                username : res.username,
                email: res.email, 
                password: res.password,
                userRoleId: res.userRoleId,
                twoFactorStatus: res.twoFactorStatus,
                
              },              
            ),
    ),
    catchError((error) => of(cockpitActions.createUserFail({ error }))),
  );
}),
    ),
  );

  createUserSuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(cockpitActions.createUserSuccess),
      tap(() => {
        this.snackBar.openSnack(
          this.translocoService.translate('bookTable.dialog.bookingSuccess'),
          4000,
          'green',
        );
        
      }),
    ),
  { dispatch: false },
);

createUserFail$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(cockpitActions.createUserFail),
      tap(() => {
        this.snackBar.openSnack(
          this.translocoService.translate('bookTable.dialog.bookingError'),
          4000,
          'red',
        );
      }),
    ),
  { dispatch: false },
);

deleteUser$ = createEffect(() =>
this.actions$.pipe(
  ofType(cockpitActions.deleteUser),
  map((UserInfo) => UserInfo),
  switchMap((UserInfo: any) => {
    return this.UsermanagementCockpitService.deleteUser( UserInfo.UserInfo.id ).pipe(
      map((res: any) =>
        cockpitActions.deleteUserSuccess(),
),
catchError((error) => of(cockpitActions.deleteUserFail({ error }))),
);
}),
),
);

deleteUserSuccess$ = createEffect(
() =>
this.actions$.pipe(
  ofType(cockpitActions.deleteUserSuccess),
  tap(() => {
    this.snackBar.openSnack(
      this.translocoService.translate('bookTable.dialog.bookingSuccess'),
      4000,
      'green',
    );
   
  }),
),
{ dispatch: false },
);

deleteUserFail$ = createEffect(
() =>
this.actions$.pipe(
  ofType(cockpitActions.deleteUserFail),
  tap(() => {
    this.snackBar.openSnack(
      this.translocoService.translate('bookTable.dialog.bookingError'),
      4000,
      'red',
    );
  }),
),
{ dispatch: false },
);
updateUser$ = createEffect(() =>
this.actions$.pipe(
  ofType(cockpitActions.updateUser),
  map((UserInfo) => UserInfo),
  switchMap((UserInfo: any) => {
    return this.UsermanagementCockpitService.updateUser( UserInfo.UserInfo ).pipe(
      map((res: any) =>
        cockpitActions.updateUserSuccess(),
),
catchError((error) => of(cockpitActions.updateUserFail({ error }))),
);
}),
),
);

updateUserSuccess$ = createEffect(
() =>
this.actions$.pipe(
  ofType(cockpitActions.updateUserSuccess),
  tap(() => {
    this.snackBar.openSnack(
      this.translocoService.translate('bookTable.dialog.bookingSuccess'),
      4000,
      'green',
    );
    
  }),
),
{ dispatch: false },
);

updateUserFail$ = createEffect(
() =>
this.actions$.pipe(
  ofType(cockpitActions.updateUserFail),
  tap(() => {
    this.snackBar.openSnack(
      this.translocoService.translate('bookTable.dialog.bookingError'),
      4000,
      'red',
    );
  }),
),
{ dispatch: false },
);

constructor(
  private actions$: Actions,
  public translocoService: TranslocoService,
  private WaiterCockpitService: WaiterCockpitService,
  private UsermanagementCockpitService: UsermanagementCockpitService,
  public snackBar: SnackBarService,
) { }
}
