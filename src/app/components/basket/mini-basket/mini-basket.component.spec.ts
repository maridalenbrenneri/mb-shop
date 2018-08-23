import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniBasketComponent } from './mini-basket.component';

describe('MiniBasketComponent', () => {
  let component: MiniBasketComponent;
  let fixture: ComponentFixture<MiniBasketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniBasketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
