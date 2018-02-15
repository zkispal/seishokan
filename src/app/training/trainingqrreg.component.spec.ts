import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingqrregComponent } from './trainingqrreg.component';

describe('TrainingqrregComponent', () => {
  let component: TrainingqrregComponent;
  let fixture: ComponentFixture<TrainingqrregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingqrregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingqrregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
