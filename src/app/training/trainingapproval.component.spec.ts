import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingapprovalComponent } from './trainingapproval.component';

describe('TrainingapprovalComponent', () => {
  let component: TrainingapprovalComponent;
  let fixture: ComponentFixture<TrainingapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
