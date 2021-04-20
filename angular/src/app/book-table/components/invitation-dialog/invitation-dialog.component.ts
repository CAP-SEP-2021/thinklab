import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BookTableService } from 'app/book-table/services/book-table.service';
import * as fromApp from 'app/store/reducers';
import { Store } from '@ngrx/store';
import * as bookTableActions from 'app/book-table/store/actions/book-table.actions';

@Component({
  selector: 'app-public-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss'],
})
export class InvitationDialogComponent implements OnInit {
  data: any;//@mo  it make sense that is any because of the injection and anyhow the type is not string please check 
  date: string;

  constructor(
    private invitationService: BookTableService,
    private store: Store<fromApp.State>,
    private dialog: MatDialogRef<InvitationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) dialogData: any,
  ) {
    this.data = dialogData;
  }

  ngOnInit(): void {
    this.date = moment(this.data.bookingDate).format('LLL');
    /*
    console.log("myown"+( typeof this.data  =="string"  ));
   console.log("myown"+(this.data.constructor.name ));
   console.log("myown"+(this.data.email ));*/
  }

  sendInvitation(): void {
    const bookingPayload = this.invitationService.composeBooking(this.data, 1);
    this.store.dispatch(
      bookTableActions.inviteFriends({ booking: bookingPayload }),
    );
    this.dialog.close(true);
  }
}
