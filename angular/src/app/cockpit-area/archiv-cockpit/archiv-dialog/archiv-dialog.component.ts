import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ConfigService } from '../../../core/config/config.service';
import { BookingView, OrderListView, OrderView } from '../../../shared/view-models/interfaces';
import { WaiterCockpitService } from '../../services/waiter-cockpit.service';
import { TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-archiv-dialog',
  templateUrl: './archiv-dialog.component.html',
  styleUrls: ['./archiv-dialog.component.scss']
})
export class ArchivDialogComponent implements OnInit {
  private fromRow = 0;
  private currentPage = 1;

  pageSize = 4;

  data: OrderListView;
  datat: BookingView[] = [];
  columnst: any[];
  displayedColumnsT: string[] = [
    'bookingDate',
    'creationDate',
    'name',
    'email',
    'tableId',
  ];

  datao: OrderView[] = [];
  columnso: any[];
  displayedColumnsO: string[] = [
    'dish.name',
    'orderLine.comment',
    'extras',
    'orderLine.amount',
    'dish.price',
  
  ];

  pageSizes: number[];
  filteredData: OrderView[] = this.datao;
  totalPrice: number;

  constructor(
    private waiterCockpitService: WaiterCockpitService,
    private translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private configService: ConfigService,
  ) {
    this.data = dialogData;
    this.pageSizes = this.configService.getValues().pageSizesDialog;
  }

  ngOnInit(): void {
    console.log(this.data) ;
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
    });

    this.totalPrice = this.waiterCockpitService.getTotalPrice(
      this.data.orderLines,
    );
    console.log("befor filtered data ");
    console.log(this.filteredData);
    this.datao = this.waiterCockpitService.orderComposer(this.data.orderLines);
    this.datat.push(this.data.booking);
    this.filter();
  }


  


  setTableHeaders(lang: string): void {
    this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((cockpitTable) => {
        this.columnst = [
          { name: 'bookingDate', label: cockpitTable.reservationDateH },
          { name: 'creationDate', label: cockpitTable.creationDateH },
          { name: 'name', label: cockpitTable.ownerH },
          { name: 'email', label: cockpitTable.emailH },
          { name: 'tableId', label: cockpitTable.tableH },
        ];
      });

    this.translocoService
      .selectTranslateObject('cockpit.orders.dialogTable', {}, lang)
      .subscribe((cockpitDialogTable) => {
        this.columnso = [
         
          { name: 'dish.name', label: cockpitDialogTable.dishH },
          { name: 'orderLine.comment', label: cockpitDialogTable.commentsH },
          { name: 'extras', label: cockpitDialogTable.extrasH },
          { name: 'orderLine.amount', label: cockpitDialogTable.quantityH },
          {
            name: 'dish.price',
            label: cockpitDialogTable.priceH,
            numeric: true,
            format: (v: number) => v.toFixed(2),
          }, 
        ];
      });
  }

  page(pagingEvent: PageEvent): void {
    this.currentPage = pagingEvent.pageIndex + 1;
    this.pageSize = pagingEvent.pageSize;
    this.fromRow = pagingEvent.pageSize * pagingEvent.pageIndex;
    this.filter();
  }
  sendGetCancelOrder(){
    console.log("ts started ");
    console.log(this.data.order.id);
    this.waiterCockpitService.getCancelOrder(this.data.order.id).subscribe((data: any) => {
     console.log("this is the response data ");
     console.log(data);
    });; 
  }

  filter(): void {
    let newData: any[] = this.datao;
    newData = newData.slice(this.fromRow, this.currentPage * this.pageSize);
    setTimeout(() => (this.filteredData = newData));
    console.log("filtered data ");
    console.log(this.filteredData);
  }

  logrow(element :any) :void{
    console.log(element);
  }
  
}
