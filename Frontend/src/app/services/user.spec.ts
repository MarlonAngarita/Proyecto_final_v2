import { TestBed } from '@angular/core/testing';
// Para este test, requerimos Zone.js
import 'zone.js';
import 'zone.js/testing';

import { User } from './user';

describe('User', () => {
  let service: User;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(User);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
