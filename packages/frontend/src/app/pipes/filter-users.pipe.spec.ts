import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { FilterUsersPipe } from './filter-users.pipe';

describe('FilterUserPipe', () => {
  let spectator: SpectatorPipe<FilterUsersPipe>;
  const createPipe = createPipeFactory(FilterUsersPipe);

  const users = [
    {
      _id: 'user_1',
      email: 'string',
      name: 'string',
      company: 'companyId_1',
      role: 'admin',
    },
    {
      _id: 'user_2',
      email: 'string',
      name: 'string',
      company: 'companyId_2',
      role: 'admin',
    },
    {
      _id: 'user_3',
      email: 'string',
      name: 'string',
      company: 'companyId_1',
      role: 'admin',
    }
  ];

  const company = 'companyId_1';

  it(`Should filter the users based on the company`, () => {
    spectator = createPipe(`{{ users | filterUsers:company | json }}`, {
      hostProps: { users, company },
    });
    expect(JSON.parse(spectator.element.innerHTML)[0]._id).toEqual('user_1');
    expect(JSON.parse(spectator.element.innerHTML)[1]._id).toEqual('user_2');
  });
});

