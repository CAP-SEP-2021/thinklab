import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort as MaterialSort } from '@angular/material/sort';
import { TranslocoService } from '@ngneat/transloco';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../core/config/config.service';
import {
  FilterCockpit,
  Pageable,
  Sort,
  UserInfo,
} from '../../shared/backend-models/interfaces';
import { TextLabel } from '../../shared/view-models/interfaces';
import { UsermanagementCockpitService } from '../services/usermanagement-cockpit.service';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';
import { ConfirmationDialogComponent } from './user-details-dialog/confirmation-dialog/confirmation-dialog.component';
import { UserPasswordDialogComponent } from './user-password-dialog/user-password-dialog.component';
import { MDBBootstrapModule } from "angular-bootstrap-md"; //delete later if do wana use 
import { AuthService } from 'app/core/authentication/auth.service';
import { SnackBarService } from '../../core/snack-bar/snack-bar.service';
import { AvatarModule } from 'ngx-avatar';
@Component({
  selector: 'app-usermanagement-cockpit',
  templateUrl: './usermanagement-cockpit.component.html',
  styleUrls: ['./usermanagement-cockpit.component.scss']
})
export class UsermanagementCockpitComponent implements OnInit {
  @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;
  private translocoSubscription = Subscription.EMPTY;
  private pageable: Pageable = {
    pageSize: 8,
    pageNumber: 0,
    // total: 1,
  };
  private sorting: Sort[] = [];
  selectedRowIndex = -1;
  pageSize = 8;
  users: UserInfo[] = [];
  totalOrders: number;
  columns: TextLabel[];
  displayedColumns: string[] = [
    'id',
    'username',
    'email',
    'role',
    'Avatar'
  ];
  currentUser;
  pageSizes: number[];
  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined,
    paymentStatus: undefined,
    status: undefined,
  };
  reslut: any;
  roles: string[];

  constructor(
    private dialog: MatDialog,
    public snackBar: SnackBarService,

    private authService: AuthService,
    private translocoService: TranslocoService,
    private UsermanagementCockpitService: UsermanagementCockpitService,
    private configService: ConfigService,
  ) {
    this.pageSizes = this.configService.getValues().pageSizes;
  }

  ngOnInit(): void {
    this.applyFilters();
    this.authService.getUser().subscribe((username) => {
      this.currentUser = username;
    });
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());

    });
  }


  /*
  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.userTable', {}, lang)
      .subscribe((cockpitUserTable) => {
        this.columns = [
          { name: 'id', label: cockpitUserTable.id },
          { name: 'username', label: cockpitUserTable.userName },
          { name: 'email', label: cockpitUserTable.emailH },
          { name: 'role', label: cockpitUserTable.userRole },
          { name: 'Avatar', label: cockpitUserTable.Avatar },
        ];

      });
  }*/

  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.userTable', {}, lang)
      .subscribe((cockpitUserTable) => {
        this.columns = [
          { name: 'id', label: cockpitUserTable.id },
          { name: 'username', label: cockpitUserTable.userName },
          { name: 'email', label: cockpitUserTable.emailH },
          { name: 'role', label: cockpitUserTable.userRole },
          { name: 'Avatar', label: cockpitUserTable.Avatar },
        ];

      });
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('userManagement', {}, lang)
      .subscribe((userManagement) => {
        this.roles = [
          userManagement.roleCustomer,
          userManagement.roleWaiter,
          userManagement.roleManager,
          userManagement.roleAdmin
        ];
      });
  }


  applyFilters(): void {
    this.UsermanagementCockpitService.getUsers(this.pageable, this.sorting)
      .subscribe((data: any) => {
        this.users = data.content;
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
    } this.applyFilters();
  }



  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }
  /* getUserRoleText(user: UserInfo) {
     if (user.userRoleId === 0) {
       return "User";
     } else if (user.userRoleId === 1) {
       return "Waiter";
     } else if (user.userRoleId === 2) {
       return "Manager";
     } else if (user.userRoleId === 3) {
       return "Admin";
     }
   }*/
  getUserAvatar(user: UserInfo) {
    if (user.userRoleId === 0) {
      return "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/4_avatar-512.png";
    } else if (user.userRoleId === 1) {
      return "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-maennlicher-avatar-hersteller.jpg";
    } else if (user.userRoleId === 2) {
      return "https://upload.wikimedia.org/wikipedia/commons/a/a0/Arh-avatar.jpg";
    } else if (user.userRoleId === 3) {
      return "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png";
    }
  }

  handelPasswordDialog(userInfo: UserInfo): void {
    if (userInfo.username != this.currentUser) {
      let dialogRef = this.dialog.open(UserPasswordDialogComponent, {
        data: userInfo
      });
      dialogRef.afterClosed().subscribe(() => setTimeout(() => this.applyFilters(), 100)); //working 
    } else {
      this.snackBar.openSnack(
        "Error you cannot change Your Information",
        6000,
        'red',
      );
    }
  }
    getUserRoleText(user : UserInfo){
      return this.roles[user.userRoleId];

  }

  handelNewUserDialog(): void {
    let dialogRef = this.dialog.open(NewUserDialogComponent, {
    });
    dialogRef.afterClosed().subscribe(() => setTimeout(() => this.applyFilters(), 100)); //working
  }

  handelconfirmationDailog(userInfo: UserInfo) :void {
    if (userInfo) {
    let dialog = this.dialog.open(ConfirmationDialogComponent, { data: userInfo });
    dialog.afterClosed().subscribe(() => setTimeout(() => this.applyFilters(), 200)); //working
    }
  }

  handelUserDetailsDialog(userInfo: UserInfo): void {
    this.selectedRowIndex = userInfo.id;//marking ther colum
    if (userInfo.username != this.currentUser){
      let dialogRef = this.dialog.open(UserDetailsDialogComponent, { data: userInfo });
    dialogRef.afterClosed().subscribe((data) => this.handelconfirmationDailog(data));
    }else{
      this.snackBar.openSnack(
        "Error you cannot change Your Information",
        6000,
        'red',
      );

    }

  }

}
