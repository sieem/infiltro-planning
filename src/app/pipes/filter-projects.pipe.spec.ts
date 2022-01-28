import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { FilterProjectsPipe } from './filter-projects.pipe';
import { projects } from '../fixtures/projects.mock';
import { UserPipe } from './user.pipe';
import { CompanyPipe } from './company.pipe';
import { ExecutorPipe } from './executor.pipe';
import { FormatDatePipe } from './format-date.pipe';
import { StatusPipe } from './status.pipe';
import { ProjectTypePipe } from './project-type.pipe';

describe('FilterProjectsPipe', () => {
  let spectator: SpectatorPipe<FilterProjectsPipe>;
  const createPipe = createPipeFactory(FilterProjectsPipe);

    it(`title`, () => {
      const activeFilter = {
        status: [],
        executor: [],
        company: [],
      };

      const searchTerm = '';

      spectator = createPipe(`{{ projects | filterProjects:activeFilter:searchTerm }}`, {
        hostProps: { projects, activeFilter, searchTerm },
        providers: [UserPipe, CompanyPipe, ExecutorPipe, FormatDatePipe, StatusPipe, ProjectTypePipe]
      });

      expect(JSON.parse(spectator.element.innerHTML)[0]._id).toEqual('user_1');
    });
});

