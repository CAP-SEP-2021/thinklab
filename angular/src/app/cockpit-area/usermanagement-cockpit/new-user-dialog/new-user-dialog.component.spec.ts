import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { NewUserDialogComponent } from './new-user-dialog.component';
import { NewUserDialogComponentStub } from '../../../../in-memory-test-data/db-new-user';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NewUserDialogComponent', () => {
  let component: NewUserDialogComponent;
  let fixture: ComponentFixture<NewUserDialogComponent>;
  let dialog: MatDialog;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    dialog = TestBed.inject(MatDialog);
    component = dialog.open(NewUserDialogComponent).componentInstance;
    component.UserInfo = NewUserDialogComponentStub.data;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should verify dialog name property value', () => {
    component.UserInfo = NewUserDialogComponentStub.data;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const name = el.queryAll(By.css('.nameValue'));
    const email = el.queryAll(By.css('.emailValue'));
    expect(name[0].nativeElement.textContent).toBe('test');
    expect(email[0].nativeElement.textContent).toBe('test@gmail.com');
  });
});
