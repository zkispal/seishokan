import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamresultsComponent } from './examresults.component';

describe('ExamresultsComponent', () => {
  let component: ExamresultsComponent;
  let fixture: ComponentFixture<ExamresultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
