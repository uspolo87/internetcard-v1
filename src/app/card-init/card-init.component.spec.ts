import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInitComponent } from './card-init.component';

describe('CardInitComponent', () => {
  let component: CardInitComponent;
  let fixture: ComponentFixture<CardInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardInitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
