import { SpectatorPipe, mockProvider, createPipeFactory } from '@ngneat/spectator/jest';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe<string>>;
  const createPipe = createPipeFactory(ReversePipe);

  it('Should reverse array', () => {
    spectator = createPipe(`{{ array | reverse }}`, {
      hostProps: {
        array: ['123', '456']
      },
    });
    expect(spectator.element).toHaveText(['456','123']);
  });

  it('Should return value when undefined', () => {
    spectator = createPipe(`{{ array | reverse }}`, {
      hostProps: {
        array: undefined
      },
    });
    expect(spectator.element).toHaveText('');
  });
});
