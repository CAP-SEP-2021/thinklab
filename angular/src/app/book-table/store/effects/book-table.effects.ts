import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SnackBarService } from '../../../core/snack-bar/snack-bar.service';
import * as fromRoot from '../../../store';
import { Booking } from '../../models/booking.model';
import { BookTableService } from '../../services/book-table.service';
import * as bookTableActions from '../actions/book-table.actions';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { BookingTokenDialogComponent } from 'app/book-table/components/booking-token-dialog/booking-token-dialog.component';

@Injectable()
export class BookTableEffects {
  bookTable$ = createEffect(() =>
    this.actions$.pipe(
      ofType(bookTableActions.bookTable),
      map((booking) => booking.booking.booking),
      switchMap((booking: any) => {
        return this.bookTableService.postBooking({ booking }).pipe(
          map((res: any) =>
            bookTableActions.bookTableSuccess({
              bookingResponse: {
                name: res.name,
                bookingDate: res.bookingDate,
                bookingToken: res.bookingToken,
                tableId: res.tableId,
                email: res.email,
              },
            }),
          ),
          catchError((error) => of(bookTableActions.bookTableFail({ error }))),
        );
      }),
    ),
  );

  bookTableSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(bookTableActions.bookTableSuccess),
        map((bookingResponse) =>(this.bookingTokenDialog
          .open(BookingTokenDialogComponent, {data: bookingResponse.bookingResponse.bookingToken}))),
        tap(() => {
          this.snackBar.openSnack(
            this.translocoService.translate('bookTable.dialog.bookingSuccess'),
            4000,
            'green',
          );
          fromRoot.go({ path: ['/menu'] });
        }),
      ),
    { dispatch: false },
  );

  bookTableFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(bookTableActions.bookTableFail),
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

  inviteFriends$ = createEffect(() =>
    this.actions$.pipe(
      ofType(bookTableActions.inviteFriends),
      map((booking) => booking.booking),
      switchMap((booking: Booking) =>
        this.bookTableService.postBooking(booking).pipe(
          map((res: any) => bookTableActions.inviteFriendsSuccess(res)),
          catchError((error) =>
            of(
              bookTableActions.inviteFriendsFail({
                error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  inviteFriendsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(bookTableActions.inviteFriendsSuccess),
        tap(() => {
          this.snackBar.openSnack(
            this.translocoService.translate('bookTable.dialog.bookingSuccess'),
            4000,
            'green',
          );
          fromRoot.go({ path: ['/bookTable'] });
        }),
      ),
    { dispatch: false },
  );

  inviteFriendsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(bookTableActions.inviteFriendsFail),
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
    private bookTableService: BookTableService,
    public snackBar: SnackBarService,
    private bookingTokenDialog: MatDialog,
  ) {}
}
