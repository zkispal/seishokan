import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamregComponent } from './examreg.component';

describe('ExamregComponent', () => {
  let component: ExamregComponent;
  let fixture: ComponentFixture<ExamregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
