import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpViewerComponent } from './wp-viewer.component';

describe('WpViewerComponent', () => {
  let component: WpViewerComponent;
  let fixture: ComponentFixture<WpViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WpViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
