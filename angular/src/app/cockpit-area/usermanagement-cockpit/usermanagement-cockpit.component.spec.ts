import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanagementCockpitComponent } from './usermanagement-cockpit.component';

describe('UsermanagementCockpitComponent', () => {
  let component: UsermanagementCockpitComponent;
  let fixture: ComponentFixture<UsermanagementCockpitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermanagementCockpitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermanagementCockpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
