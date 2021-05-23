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
  UserInfo,
} from '../../shared/backend-models/interfaces';
import {
  BookingView,
  OrderListView,
  ReservationView,
  SaveOrderResponse,
  TextLabel,
  UserListResponse,
} from '../../shared/view-models/interfaces';
import { UsermanagementCockpitService } from '../services/usermanagement-cockpit.service';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';

@Component({
  selector: 'app-usermanagement-cockpit',
  templateUrl: './usermanagement-cockpit.component.html',
  styleUrls: ['./usermanagement-cockpit.component.scss']
})
export class UsermanagementCockpitComponent implements OnInit {


    private translocoSubscription = Subscription.EMPTY;
    private pageable: Pageable = {
      pageSize: 8,
      pageNumber: 0,
      // total: 1,
    };
    private sorting: Sort[] = [];
  
    pageSize = 8;
  
    @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;
  
    users: UserInfo[] = [];
    totalOrders: number;
  
    columns: TextLabel[];
  
    displayedColumns: string[] = [
      'id',
      'username',
      'email',
      'role',
    ];
    status: string[] = [
      'Order placed',
      'Food is prepared',
      'Food is delivered',
      'Paid',
    ];
    //status2 :any []; // @mo use later for lang change
  
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
      private UsermanagementCockpitService: UsermanagementCockpitService,
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
  
  /*  sendStatus(option, element: OrderListView): void {
      element.order.status = option;
      let temp = { order: { id: element.order.id, status: option } }; // @mo change later
      this.UsermanagementCockpitService.postOrderStauts(temp).subscribe((data: any) => {
        // @mo musst be changed
        this.applyFilters();
      });
    }*/
  
    setTableHeaders(lang: string): void {
      this.translocoSubscription = this.translocoService
        .selectTranslateObject('cockpit.userTabel', {}, lang)
        .subscribe((cockpitUserTable) => {
          this.columns = [
            { name: 'id', label: cockpitUserTable.id },
            { name: 'username', label: cockpitUserTable.username },
            { name: 'email', label: cockpitUserTable.email },
            { name: 'role', label: cockpitUserTable.role },
          
          ];
          /* this.status2 = [
               cockpitTable.statusHtaken ,
              cockpitTable.statusHprepared ,
             cockpitTable.statusHdelivered ,
              cockpitTable.statusHPaid
           ];*/
        });
    }
  
    applyFilters(): void {
    /*  if (this.sorting.length === 0) {
        // setting two default search crietria first the status of the order second is the date
        this.sorting.push({ property: 'status', direction: 'desc' });
        this.sorting.push({ property: 'booking.bookingDate', direction: 'desc' });
      }*/

      this.UsermanagementCockpitService.getUsers(this.pageable, this.sorting)
        .subscribe((data: any) => {
      
            this.users = data.content;
           console.log('all data ');
            console.log(this.users);
          
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
   addNewUser(): void {
      let dialogRef = this.dialog.open(NewUserDialogComponent, {
        height: '50%',
        width:'35%',
      //  data: selection,
      });
      //refreshing the list after closing the dialog
      dialogRef.afterClosed().subscribe(() => this.applyFilters());
    }
  
    ngOnDestroy(): void {
      this.translocoSubscription.unsubscribe();
    }
  }
  