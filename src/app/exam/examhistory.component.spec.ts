import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamhistoryComponent } from './examhistory.component';

describe('ExamhistoryComponent', () => {
  let component: ExamhistoryComponent;
  let fixture: ComponentFixture<ExamhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
