import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { EventComponent } from './index';

describe('NeweventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
