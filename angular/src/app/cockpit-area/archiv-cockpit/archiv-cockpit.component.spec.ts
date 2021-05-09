import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivCockpitComponent } from './archiv-cockpit.component';

describe('ArchivCockpitComponent', () => {
  let component: ArchivCockpitComponent;
  let fixture: ComponentFixture<ArchivCockpitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivCockpitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivCockpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
