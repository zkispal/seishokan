import { TestBed, async, inject } from '@angular/core/testing';

import { DojochoGuard } from './dojocho.guard';

describe('DojochoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DojochoGuard]
    });
  });

  it('should ...', inject([DojochoGuard], (guard: DojochoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
