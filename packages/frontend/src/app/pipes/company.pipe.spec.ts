import { SpectatorPipe, mockProvider, createPipeFactory } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { CompanyService } from '../services/company.service';
import { CompanyPipe } from './company.pipe';

describe('CompanyPipe', () => {
  let spectator: SpectatorPipe<CompanyPipe>;
  const createPipe = createPipeFactory(CompanyPipe);

  it('Should transform company id to company name', () => {
    spectator = createPipe(`{{ companyId | company | async }}`, {
      hostProps: {
        companyId: '123'
      },
      providers: [
        mockProvider(CompanyService, {
          companyName: () => of('companyName')
        }),
      ],
    });
    expect(spectator.element).toHaveText('companyName');
  });
});
