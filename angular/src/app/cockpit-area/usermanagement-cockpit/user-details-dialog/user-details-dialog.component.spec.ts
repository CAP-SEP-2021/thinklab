import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../../../core/core.module';
import { PriceCalculatorService } from '../../../sidenav/services/price-calculator.service';
import { WaiterCockpitModule } from '../../cockpit.module';
import { WaiterCockpitService } from '../../services/waiter-cockpit.service';
import { UserDetailsDialogComponent } from './user-details-dialog.component';
import { ConfigService } from '../../../core/config/config.service';
import { provideMockStore } from '@ngrx/store/testing';
import { config } from '../../../core/config/config';
import { getTranslocoModule } from '../../../transloco-testing.module';
import { UserInfo } from '../../../../in-memory-test-data/db-user-details';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import * as fromRoot from '../../store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { JsonpClientBackend } from '@angular/common/http';
import { click } from 'app/shared/common/test-utils';

const mockDialogRef = {
  close: jasmine.createSpy('close'),
};


describe('UserDetailsDialogComponent', () => {
  let component: UserDetailsDialogComponent;
  let fixture: ComponentFixture<UserDetailsDialogComponent>;
  let initialState;
  let el: DebugElement;
  let matDialogRef: MatDialogRef<UserDetailsDialogComponent>;

  beforeEach(async(() => {
    initialState = { config };
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: UserInfo },
        { provide: MatDialogRef, useValue: mockDialogRef },
        WaiterCockpitService,
        PriceCalculatorService,
        provideMockStore({ initialState }),
        ConfigService
      ],
      imports: [
        BrowserAnimationsModule,
        WaiterCockpitModule,
        getTranslocoModule(),
        CoreModule,
        EffectsModule.forRoot([]),
        StoreModule.forRoot(fromRoot.reducers, {
          runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true,
          },
        })
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(UserDetailsDialogComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      matDialogRef = TestBed.inject(MatDialogRef);
    });
  }));


  it('should create and check if user-details match the details from db',() => {
    fixture.detectChanges();
    const username = component.Form.controls.username;
    const email = component.Form.controls.email;

    expect(username.value).toBe('franka');
    expect(email.value).toBe('franky@hi.de');

    /* TODO: default-role value
    const role = el.query(By.css('.formRoleData'));
    console.log(role.nativeElement.value)
    expect(role.nativeElement.value).toBe(2);
    */

    expect(component).toBeTruthy();
  });

  it('should change user-details when filling in new information and submitting',() => {
  fixture.detectChanges();
  const username = component.Form.controls.username;
  const email = component.Form.controls.email;
  const role = component.Form.controls.userRoleId;

  // old values
  expect(username.value).toBe('franka');
  expect(email.value).toBe('franky@hi.de');
  //expect(role.value).toBe(2);

  // new values
  username.setValue('horst'); // new value
  email.setValue('horst@mail.de');
  role.setValue(2);

  // submit button
  component.onSubmit();

  expect(username.value).toBe('horst');
  expect(email.value).toBe('horst@mail.de');
  expect(role.value).toBe(2);

  expect(component.userInfo.username).toBe('horst');
  expect(component.userInfo.email).toBe('horst@mail.de');
  expect(component.userInfo.userRoleId).toBe(2);
  });

  it('should close user-details when clicking the delete button',() => {
    fixture.detectChanges();
    const button = el.query(By.css('.mat-stroked-button'));
    click(button);
    expect(matDialogRef.close).toHaveBeenCalled();
  });

});
