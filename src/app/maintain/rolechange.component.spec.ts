import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolechangeComponent } from './rolechange.component';

describe('RolechangeComponent', () => {
  let component: RolechangeComponent;
  let fixture: ComponentFixture<RolechangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolechangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolechangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
