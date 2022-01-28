import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ExecutorPipe } from './executor.pipe';

describe('ExecutorPipe', () => {
  let spectator: SpectatorPipe<ExecutorPipe>;
  const createPipe = createPipeFactory(ExecutorPipe);

  const testCases = [
    {
      input: 'roel',
      output: 'Roel',
    },
    {
      input: 'david',
      output: 'David',
    },
    {
      input: 'together',
      output: 'Samen',
    },
    {
      input: 'iets anders',
      output: 'Onbeslist',
    }
    ,
    {
      input: undefined,
      output: 'Onbeslist',
    }
  ];

  for (const { input, output } of testCases) {
    it(`'${input}' should be converted to '${output}'`, () => {
      spectator = createPipe(`{{ input | executor }}`, {
        hostProps: { input },
      });
      expect(spectator.element).toHaveText(output);
    });
  }
});

