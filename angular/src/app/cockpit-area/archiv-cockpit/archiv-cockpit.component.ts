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
import { debounceTime, share, timeout } from 'rxjs/operators';
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
} from '../../shared/view-models/interfaces';
import { WaiterCockpitService } from '../services/waiter-cockpit.service';
import { ArchivDialogComponent } from './archiv-dialog/archiv-dialog.component';

@Component({
  selector: 'app-archiv-cockpit',
  templateUrl: './archiv-cockpit.component.html',
  styleUrls: ['./archiv-cockpit.component.scss'],
})
export class ArchivCockpitComponent implements OnInit, OnDestroy {
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

  columns: any[];
  tempData: SaveOrderResponse;

  displayedColumns: string[] = [
    'booking.bookingDate',
    'booking.email',
    'booking.bookingToken',
    'status',
  ];
  status: string[];


  status2 :any[];
  
  pageSizes: number[];

  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined,
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
    let newStatus = this.status.indexOf(option).toString();
    element.order.status = newStatus;
    let temp = { order: { id: element.order.id, status: newStatus } }; // @mo change later
    this.waiterCockpitService.postOrderStauts(temp).subscribe((data: any) => {
      this.applyFilters();
    });
  }

 

  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((cockpitTable) => {
        this.columns = [
          { name: 'booking.bookingDate', label: cockpitTable.reservationDateH },
          { name: 'booking.email', label: cockpitTable.emailH },
          { name: 'booking.bookingToken', label: cockpitTable.bookingTokenH },
          { name: 'status', label: cockpitTable.statusH },
        ];
          this.status = [
          cockpitTable.statusHtaken,
          cockpitTable.statusHprepared,
          cockpitTable.statusHdelivered,
          cockpitTable.statusHPaid,
        ];
      });
  }

  applyFilters(): void {
    if (this.sorting.length === 0) {
      // setting two defualt search crietria first the status of the order second the date
      this.sorting.push({ property: 'status', direction: 'desc' });
      this.sorting.push({ property: 'booking.bookingDate', direction: 'desc' });
    }
 
    this.waiterCockpitService
      .getArchivedOrders(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.orders = [];
        } else {
          this.orders = data.content;
          //console.log(this.orders);
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

    var dialgoref = this.dialog.open(ArchivDialogComponent, {
      width: '80%',
      data: selection,
    });
    dialgoref.afterClosed().subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
   
  }
}
