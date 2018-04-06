import { TestBed, async, inject } from '@angular/core/testing';

import { AikidokaGuard } from './aikidoka.guard';

describe('AikidokaGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AikidokaGuard]
    });
  });

  it('should ...', inject([AikidokaGuard], (guard: AikidokaGuard) => {
    expect(guard).toBeTruthy();
  }));
});
