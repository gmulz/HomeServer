import { TestBed, inject } from '@angular/core/testing';

import { ProjectFetchService } from './project-fetch.service';

describe('ProjectFetchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectFetchService]
    });
  });

  it('should be created', inject([ProjectFetchService], (service: ProjectFetchService) => {
    expect(service).toBeTruthy();
  }));
});
