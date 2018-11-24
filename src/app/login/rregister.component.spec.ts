import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RregisterComponent } from './rregister.component';

describe('RregisterComponent', () => {
  let component: RregisterComponent;
  let fixture: ComponentFixture<RregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
