import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingmanregComponent } from './trainingmanreg.component';

describe('TrainingmanregComponent', () => {
  let component: TrainingmanregComponent;
  let fixture: ComponentFixture<TrainingmanregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingmanregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingmanregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
