import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePageComponent } from './offline-page.component';

describe('OfflinePageComponent', () => {
  let component: OfflinePageComponent;
  let fixture: ComponentFixture<OfflinePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflinePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
