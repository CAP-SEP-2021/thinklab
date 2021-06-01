import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-public-booking-token-dialog',
    templateUrl: './booking-token-dialog.component.html',
    styleUrls: ['./booking-token-dialog.component.scss'],
})
export class BookingTokenDialogComponent implements OnInit{
    
    bookingToken: String;

    ngOnInit(): void {
    }

constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: String
){
    this.bookingToken = dialogData;
}

}