import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivDialogComponent } from './archiv-dialog.component';

describe('ArchivDialogComponent', () => {
  let component: ArchivDialogComponent;
  let fixture: ComponentFixture<ArchivDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
