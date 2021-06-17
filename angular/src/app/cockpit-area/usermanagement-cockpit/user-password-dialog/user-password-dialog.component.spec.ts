import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordDialogComponent } from './user-password-dialog.component';

describe('UserPasswordDialogComponent', () => {
  let component: UserPasswordDialogComponent;
  let fixture: ComponentFixture<UserPasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPasswordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
