import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IplthemeComponent } from './ipltheme.component';

describe('IplthemeComponent', () => {
  let component: IplthemeComponent;
  let fixture: ComponentFixture<IplthemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IplthemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IplthemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
