import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort as MaterialSort } from '@angular/material/sort';
import { TranslocoService } from '@ngneat/transloco';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { elementAt, share } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import {
  BookingInfo,
  FilterCockpit,
  Pageable,
  Sort,
} from '../../shared/backend-models/interfaces';
import {
  BookingView,
  OrderListView,
  ReservationView,
  SaveOrderResponse,
  TextLabel,
} from '../../shared/view-models/interfaces';
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
  private sorting: Sort[] = [];

  pageSize = 8;

  @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;

  orders: OrderListView[] = [];
  totalOrders: number;

  columns: TextLabel[];

  displayedColumns: string[] = [
    'booking.bookingDate',
    'booking.tableId',
    'booking.name',
   // 'booking.bookingToken', no need to display bookingToken on order-cockpit
    'paymentStatus',
    'status',
    'cancel',
  ];
  status: string[];

  paymentStatus: string[];

  pageSizes: number[];

  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined,
    paymentStatus: undefined,
    status: undefined, //@mo added to comlete the structure

  };
  reslut: any;
  constructor(
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private waiterCockpitService: WaiterCockpitService,
    private configService: ConfigService,
  ) {
    this.pageSizes = this.configService.getValues().pageSizes;
  }

  ngOnInit(): void {
    this.applyFilters();
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
    });
  }

  sendStatus(option, element: OrderListView): void {
    let newStatus = option.toString();
    element.order.status = newStatus;
    let temp = { order: { id: element.order.id, status: newStatus } }; // @mo change later
    this.waiterCockpitService.postOrderStauts(temp).subscribe((data: any) => {
      // @mo musst be changed
      this.applyFilters();
    });
  }

  sendGetCancelOrder(element: OrderListView): void{
    console.log("ts started ");
    
    this.waiterCockpitService.getCancelOrder(element.order.id).subscribe((data: any) => {
     console.log("this is the response data ");
     this.applyFilters();
     
    });; 
  }

  sendPaymentStatus(newPaymentStatus: boolean, element: OrderListView): void {
    element.order.paid = newPaymentStatus;
    let temp = { order: { id: element.order.id, paid: newPaymentStatus } }; // @mo change later
    this.waiterCockpitService.postOrderPaymentStatus(temp).subscribe((data: any) => {
      // @mo musst be changed
      this.applyFilters();
    });
  }


  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((cockpitTable) => {
        this.columns = [
          { name: 'booking.bookingDate', label: cockpitTable.reservationDateH },
          { name: 'booking.tableId', label: cockpitTable.tableIdH },
          { name: 'booking.name', label: cockpitTable.ownerH },
        //  { name: 'booking.bookingToken', label: cockpitTable.bookingTokenH }, no need to display bookingToken on order-cockpit
          { name: 'paymentStatus', label: cockpitTable.paymentStatusH },
          { name: 'status', label: cockpitTable.statusH },
          { name: 'cancel', label: cockpitTable.cancelH},
        ];
         this.status = [
            cockpitTable.statusTaken ,
            cockpitTable.statusPrepared ,
            cockpitTable.statusInDelivery ,
            cockpitTable.statusDelivered
         ];
         this.paymentStatus = [
            cockpitTable.paymentStatusNotPaid,
            cockpitTable.paymentStatusPaid
         ]
      });
  }

  applyFilters(): void {
    if (this.sorting.length === 0) {
      // setting two default search crietria first the status of the order second is the date
      this.sorting.push({ property: 'status', direction: 'desc' });
      this.sorting.push({ property: 'paid', direction: 'desc' });
      this.sorting.push({ property: 'booking.bookingDate', direction: 'desc' });
    }
   
    this.waiterCockpitService
      .getOrders(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.orders = [];
        } else {
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

  sort(sortEvent: MaterialSort): void {
    this.sorting = [];
    if (sortEvent.direction) {
      this.sorting.push({
        property: sortEvent.active,
        direction: '' + sortEvent.direction,
      });
    }
    this.applyFilters();
  }
  selected(selection: OrderListView): void {
    let dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '80%',
      data: selection,
    });
    //refreshing the list after closing the dialog
    dialogRef.afterClosed().subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }
}
