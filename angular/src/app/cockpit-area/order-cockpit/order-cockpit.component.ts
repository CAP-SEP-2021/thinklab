import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslocoService } from '@ngneat/transloco';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../core/config/config.service';
import {
  BookingInfo,
  FilterCockpit,
  Pageable,
} from '../../shared/backend-models/interfaces';
import { BookingView, OrderListView, ReservationView } from '../../shared/view-models/interfaces';
import { WaiterCockpitService } from '../services/waiter-cockpit.service';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';

@Component({
  selector: 'app-cockpit-order-cockpit',
  templateUrl: './order-cockpit.component.html',
  styleUrls: ['./order-cockpit.component.scss'],
})
export class OrderCockpitComponent implements OnInit, OnDestroy {
  private translocoSubscription = Subscription.EMPTY;
  private pageable: Pageable = {
    pageSize: 8,
    pageNumber: 0,
    // total: 1,
  };
  private sorting: any[] = [];

  pageSize = 8;

  @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;

  orders: OrderListView[] = [];
  totalOrders: number;

  columns: any[];
  tempData : ReservationView ; 

  displayedColumns: string[] = [
    'booking.bookingDate',
    'booking.email',
    'booking.bookingToken',
    'booking.status'
  ];

  pageSizes: number[];

  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined,
    status : undefined //@mo added to comlete the structure 
   
  };
  reslut :any ;
  constructor(
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private waiterCockpitService: WaiterCockpitService,
    private configService: ConfigService,
  ) {
    this.pageSizes = this.configService.getValues().pageSizes;
  }

  ngOnInit(): void {
    console.log("ngOnInit" );
    this.applyFilters();
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
    });
  }
  change(event )
  {

    if(event.isUserInput) {
      console.log(event.source.value, event.source.selected ,);
    }
    this.tempData.booking.status=event.source.value;
    let temp = event.source.value;
    /*var tempData :any = {
      "booking": {
        "id": 0,
        "name": "user0",
        "bookingToken": "CB_20170509_123502555Z",
        "comment": "Booking Type CSR",
        "bookingDate": "1620110465.735443",
        "creationDate": "1619678465.735443",
        "email": "user0@mail.com",
        "canceled": true,
        "status": "lucy",
        "bookingType": 0,
        "tableId": 0,
        "orderId": 0,
        "assistants": 3
      }
    };*/
    console.log("tempdata Created ");

    this.waiterCockpitService.postBookingStauts(this.tempData).subscribe((data: any) => {
      console.log(data); 
      console.log("data printed ");  
    });

  this.applyFilters();
   // this.selected1(event);
  }


  onEdit(event :any , selection: OrderListView): void {
    //console.log(((event.target) as HTMLElement).children[0].className);
    console.log("start onEdit methode ");
    console.log(selection.booking); 
   // this.tempData.booking = selection.booking;
    console.log("tempdata  ");
    //console.log(this.tempData.booking); 
    /*
    this.tempData.booking = selection.booking;
    console.log(this.tempData.booking);*/
    console.log("end onEdit methode ");
    this.setRowtempData(selection.booking);
  }
  setRowtempData(booking : BookingView): void{
    console.log("end setRowtempData methode ");
    this.tempData={booking : booking};
    console.log( this.tempData);



   /* console.log("end setRowtempData methode ");
    console.log(booking.name);
    this.tempData.booking.name = booking.name; 
    console.log(this.tempData.booking.name);
    console.log("end setRowtempData methode ");





    this.tempData.booking.bookingDate = booking.bookingDate;
    console.log("end setRowtempData methode ");
    this.tempData.booking.creationDate = booking.creationDate;
    this.tempData.booking.bookingToken = booking.bookingToken;
    this.tempData.booking.status = booking.status;
    this.tempData.booking.email = booking.email;
    console.log(" setRowtempData  ");
    let my   = this.tempData.booking.status;*/
   
  }



  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((cockpitTable) => {
        this.columns = [
          { name: 'booking.bookingDate', label: cockpitTable.reservationDateH },
          { name: 'booking.email', label: cockpitTable.emailH },
          { name: 'booking.bookingToken', label: cockpitTable.bookingTokenH },
          { name: 'booking.status', label: cockpitTable.statusH }
        ];
      });
  }

  applyFilters(): void {
    console.log("First getOrders" );
    this.waiterCockpitService
      .getOrders(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.orders = [];
        } else {
          console.log(data.content);
          console.log("booking date"+data.content[0].booking.bookingDate);
          console.log("c dDate"+data.content[0].booking.creationDate);
          this.orders = data.content;
        }
        this.totalOrders = data.totalElements;
      });
  }

  clearFilters(filters: any): void {
    filters.reset();
    this.applyFilters();
    this.pagingBar.firstPage();
  }

  page(pagingEvent: PageEvent): void {
    this.pageable = {
      pageSize: pagingEvent.pageSize,
      pageNumber: pagingEvent.pageIndex,
      sort: this.pageable.sort,
    };
    this.applyFilters();
  }

  sort(sortEvent: Sort): void {
    this.sorting = [];
    if (sortEvent.direction) {
      this.sorting.push({
        property: sortEvent.active,
        direction: '' + sortEvent.direction,
      });
    }
    this.applyFilters();
  }/*
  @HostListener('click', ['$event'])
  onClick2(row , event) {
    if (event.target.innerHTML === "Bestellung aufgenommen") {
      event.stopPropagation(); //swallow event and prevent it from bubbling up
    } else {
      console.log('@HostListener: ', event.target.innerHTML)
    }
  }*/
  selected(selection: OrderListView ): void {
    console.log("selection metthode select row ");
    console.log(selection);
    //console.log(cloum);
    this.dialog.open(OrderDialogComponent, {
      width: '80%',
      data: selection,
    });
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }
}
