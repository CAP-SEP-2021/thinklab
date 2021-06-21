import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TwoFactorDialogComponent } from 'app/user-area/components/two-factor-dialog/two-factor-dialog.component';
import { Observable, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ConfigService } from '../../../core/config/config.service';
import { SnackBarService } from '../../../core/snack-bar/snack-bar.service';
import { WindowService } from '../../../core/window/window.service';
import { LoginDialogComponent } from '../../components/login-dialog/login-dialog.component';
import { UserAreaService } from '../../services/user-area.service';
import * as authActions from '../actions/auth.actions';
import { TranslocoService } from '@ngneat/transloco';
import { TokenString } from 'app/user-area/models/user';

@Injectable()
export class AuthEffects {
  private readonly restPathRoot$: Observable<
    string
  > = this.config.getRestPathRoot();
  private readonly verifyRestPath: string = 'verify';
  private restServiceRoot$: Observable<
    string
  > = this.config.getRestServiceRoot();
  private readonly currentUserRestPath: string = 'security/v1/currentuser/';
  authAlerts: any;

  // Open Login Dialog and dispatch Login
  openDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.openDialog),
      exhaustMap(() => {
        const dialogRef: MatDialogRef<LoginDialogComponent> = this.dialog.open(
          LoginDialogComponent,
          {
            width: this.window.responsiveWidth(),
          },
        );
        return dialogRef.afterClosed();
      }),
      map((result: any) => {
        if (result === undefined) {
          return authActions.closeDialog();
        }
        return authActions.login({
          username: result.username,
          password: result.password,
        });
      }),
    ),
  );

  // Close Login Dialog
  closeDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.closeDialog),
        map(() => {
          const dialogRef = this.dialog.open(LoginDialogComponent);
          return dialogRef.close();
        }),
      ),
    { dispatch: false },
  );

  // Communicate with Server (this.userService.login),
  // check whether user has opted for two-factor authentication,
  // if yes then dispatch VerifyTwoFactor with user details
  // else dispatch Token to get the payload username and role
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      switchMap((user: any) => {
        return this.userService.login(user.username, user.password).pipe(
          map((res) => {
            if (res.headers.get('X-Mythaistar-Otp') === 'NONE') {
              return authActions.token({
                token: { token: res.headers.get('Authorization') },
              });
            } else if (res.headers.get('X-Mythaistar-Otp') === 'OTP') {
              return authActions.verifyTwoFactor({
                username: user.username,
                password: user.password,
              });
            }
          }),
          catchError((error) => of(authActions.loginFail({ error }))),
        );
      }),
    ),
  );

  // Open two-factor dialog for OTP,
  // verify user with payload user details and OTP
  // dispatch Token to get the payload username and role
  verifyTwoFactor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.verifyTwoFactor),
      mergeMap((user) => {
        const dialogRef: MatDialogRef<TwoFactorDialogComponent> = this.dialog.open(
          TwoFactorDialogComponent,
          {
            width: this.window.responsiveWidth(),
          },
        );
        return dialogRef.afterClosed().pipe(
          map((result) => {
            return this.restPathRoot$.pipe(
              exhaustMap((restPathRoot) =>
                this.http.post(
                  `${restPathRoot}${this.verifyRestPath}`,
                  {
                    username: user.username,
                    password: user.password,
                    token: result.token,
                  },
                  { responseType: 'text', observe: 'response' },
                ),
              ),
            );
          }),
        );
      }),
      switchMap((token) => {
        return token.pipe(
          map((res) => {
            return authActions.token({
              token: { token: res.headers.get('Authorization') },
            });
          }),
          catchError((error) => of(authActions.loginFail({ error }))),
        );
      }),
    ),
  );

  // make an http call to get the payload username and role
  token$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.token),
      switchMap((token) => {
        return this.restServiceRoot$.pipe(
          switchMap((restServiceRoot) =>
            this.http.get(`${restServiceRoot}${this.currentUserRestPath}`).pipe(
              map((loginInfo: any) => {
                return authActions.loginSuccess({
                  user: {
                    user: loginInfo.name,
                    role: loginInfo.role,
                    logged: true,
                  },
                });
              }),
            ),
          ),
        );
      }),
    ),
  );

  // navigate on successfull login
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess),
        map((user) => user.user.role),
        exhaustMap((role: string) => {
          this.snackBar.openSnack(
            this.translocoService.translate('alerts.authAlerts.loginSuccess'),
            4000,
            'green',
          );
          if (role === 'CUSTOMER') {
            return this.router.navigate(['restaurant']);
          } else if (role === 'WAITER') {
            return this.router.navigate(['orders']);
          } else if (role === 'MANAGER') {
            return this.router.navigate(['orders']);
          }else if (role === 'ADMIN') { 
            return this.router.navigate(['usermanagement']);}
        }),
      ),
    { dispatch: false },
  );

  // Close Login Dialog
  loginFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginFail),
        map((errorData) => errorData.error),
        tap((error) => {
          this.snackBar.openSnack(error.message, 4000, 'red');
        }),
      ),
    { dispatch: false },
  );

  logOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
          this.router.navigateByUrl('/restaurant');
          this.snackBar.openSnack(
            this.translocoService.translate('alerts.authAlerts.logoutSuccess'),
            4000,
            'black',
          );
        }),
        catchError((error) => of(authActions.logoutFail({ error }))),
      ),
    { dispatch: false },
  );


/*
  checkToken$ = createEffect(() =>

    this.actions$.pipe(
      ofType(authActions.checkToken),
      map((TokenString) => TokenString.token),
      switchMap((token: any) => {
        console.log("after switch");

        var tempToken = token;
        console.log(tempToken);
        return this.userService.checkToken(token).pipe(
          map((res: any) =>
          authActions.checkTokenSuccess(token),
          ),
          catchError((error) => of(authActions.checkTokenFail({ error }))),
        );
      }),
    ),
  );
  /*
navigate (tempToken : TokenString){
  this.router.navigate(['restaurant']);
  authActions.checkTokenSuccess(tempToken);
}*/
 /* checkTokenSuccess$ = createEffect(() =>
  this.actions$.pipe(
    ofType(authActions.checkTokenSuccess),
    map((token) => token.token),
    exhaustMap((token: TokenString ) => {
      console.log("succss");
          this.snackBar.openSnack(
            "token has been authorized ",
            4000,
            'green',
          );
          return this.router.navigate(['resetPassword'], { queryParams: {token: token}} );
        }),
        ),
      { dispatch: false },
    );

  checkTokenFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.checkTokenFail),
        tap(() => {
          this.snackBar.openSnack(
            "Error please try again later",
            4000,
            'red',
          );
           this.router.navigate(['restaurant']);
        }),
      ),
    { dispatch: false },
  );
*/


updatePassword$ = createEffect(() =>
this.actions$.pipe(
  ofType(authActions.updatePassword),
  map((UserPasswordToken) => UserPasswordToken),
  switchMap((UserPasswordToken: any) => {
    return this.userService.resetPassword(UserPasswordToken.UserInfo).pipe(
      map((res: any) =>
      authActions.updatePasswordSuccess(),
      ),
      catchError((error) => of(authActions.updatePasswordFail({ error }))),
    );
  }),
),
);

updatePasswordSuccess$ = createEffect(
() =>
  this.actions$.pipe(
    ofType(authActions.updatePasswordSuccess),
    tap(() => {
      this.snackBar.openSnack(
        "the update of User Details was successful",
        7000,
        'green',
      );
      this.router.navigateByUrl('/restaurant');
    }),
  ),
{ dispatch: false },
);

updatePasswordFail$ = createEffect(
() =>
  this.actions$.pipe(
    ofType(authActions.updatePasswordFail),
    tap(() => {
      this.snackBar.openSnack(
        "Error please try again later",
        7000,
        'red',
      );
      this.router.navigateByUrl('/restaurant');
    }),
  ),
{ dispatch: false },
);







  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    public window: WindowService,
    public userService: UserAreaService,
    public translocoService: TranslocoService,
    private router: Router,
    public snackBar: SnackBarService,
    private config: ConfigService,
    private http: HttpClient,
  ) {
    this.translocoService
      .selectTranslateObject('alerts.authAlerts')
      .subscribe((content: any) => {
        this.authAlerts = content;
      });
  }
}
