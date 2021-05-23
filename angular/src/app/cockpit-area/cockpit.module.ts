import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';

import { WaiterCockpitService } from './services/waiter-cockpit.service';
import { WindowService } from '../core/window/window.service';
import { PredictionService } from './services/prediction.service';
import { ClusteringService } from './services/clustering.service';

import { ReservationCockpitComponent } from './reservation-cockpit/reservation-cockpit.component';
import { OrderCockpitComponent } from './order-cockpit/order-cockpit.component';
import { OrderDialogComponent } from './order-cockpit/order-dialog/order-dialog.component';
import { ReservationDialogComponent } from './reservation-cockpit/reservation-dialog/reservation-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { PredictionCockpitComponent } from './prediction-cockpit/prediction-cockpit.component';
import { ClusteringCockpitComponent } from './clustering-cockpit/clustering-cockpit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from '../transloco-root.module';
import { ArchivCockpitComponent } from './archiv-cockpit/archiv-cockpit.component';
import { ArchivDialogComponent } from './archiv-cockpit/archiv-dialog/archiv-dialog.component';
import { UsermanagementCockpitComponent } from './usermanagement-cockpit/usermanagement-cockpit.component';
import { NewUserDialogComponent } from './usermanagement-cockpit/new-user-dialog/new-user-dialog.component';
import { UserDetailsDialogComponent } from './usermanagement-cockpit/user-details-dialog/user-details-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoRootModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    WaiterCockpitService,
    WindowService,
    PredictionService,
    ClusteringService,
  ],
  declarations: [
    ReservationCockpitComponent,
    OrderCockpitComponent,
    ReservationDialogComponent,
    OrderDialogComponent,
    PredictionCockpitComponent,
    ClusteringCockpitComponent,
    ArchivCockpitComponent,
    ArchivDialogComponent,
    UsermanagementCockpitComponent,
    NewUserDialogComponent,
    UserDetailsDialogComponent,
  ],
  exports: [
    ReservationCockpitComponent,
    OrderCockpitComponent,
    PredictionCockpitComponent,
    ClusteringCockpitComponent,
  ],
  entryComponents: [
    ReservationDialogComponent,
    OrderDialogComponent,
    PredictionCockpitComponent,
    ClusteringCockpitComponent,
  ],
})
export class WaiterCockpitModule { }
