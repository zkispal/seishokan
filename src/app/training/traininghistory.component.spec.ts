import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraininghistoryComponent } from './traininghistory.component';

describe('TraininghistoryComponent', () => {
  let component: TraininghistoryComponent;
  let fixture: ComponentFixture<TraininghistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraininghistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraininghistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
