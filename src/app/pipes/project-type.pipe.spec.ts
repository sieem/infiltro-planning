import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ProjectTypePipe } from './project-type.pipe';

describe('ProjectTypePipe', () => {
  let spectator: SpectatorPipe<ProjectTypePipe>;
  const createPipe = createPipeFactory(ProjectTypePipe);

  const testCases = [
    {
      input: 'house',
      output: 'Woning',
    },
    {
      input: 'stairs',
      output: 'Traphal',
    },
    {
      input: 'apartment',
      output: 'Appartement',
    },
    {
      input: 'mixed',
      output: 'Gemengd',
    },
    {
      input: 'other',
      output: 'Andere',
    },
    {
      input: 'iets anders',
      output: 'Onbekend',
    },
    {
      input: undefined,
      output: 'Onbekend',
    }
  ];

  for (const { input, output } of testCases) {
    it(`'${input}' should be converted to '${output}'`, () => {
      spectator = createPipe(`{{ input | projectType }}`, {
        hostProps: { input },
      });
      expect(spectator.element).toHaveText(output);
    });
  }
});

