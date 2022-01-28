import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { NewlineToBrPipe } from './newline-to-br.pipe';

describe('NewlineToBrPipe', () => {
  let spectator: SpectatorPipe<NewlineToBrPipe>;
  const createPipe = createPipeFactory(NewlineToBrPipe);

  it('Should not add <br> without newline', () => {
    spectator = createPipe(`{{ text | newlineToBr }}`, {
      hostProps: {
        text: '123'
      },
    });
    expect(spectator.element).toHaveText('123');
  });

  it('Should add <br> with newline', () => {
    spectator = createPipe(`{{ text | newlineToBr }}`, {
      hostProps: {
        text: '123\n456'
      },
    });
    expect(spectator.element).toHaveText('123<br>456');
  });
});
