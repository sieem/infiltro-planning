import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {
  let spectator: SpectatorPipe<StatusPipe>;
  const createPipe = createPipeFactory(StatusPipe);

  const testCases = [
    {
      input: undefined,
      output: 'Onbekend',
    },
    {
      input: 'contractSigned',
      output: 'Nog niet actief',
    },
    {
      input: 'toContact',
      output: 'Te contacteren',
    },
    {
      input: 'toPlan',
      output: 'Te plannen',
    },
    {
      input: 'proposalSent',
      output: 'Voorstel doorgegeven',
    },
    {
      input: 'planned',
      output: 'Ingepland',
    },
    {
      input: 'onHold',
      output: 'On - Hold',
    },
    {
      input: 'onHoldByClient',
      output: 'On - Hold door klant',
    },
    {
      input: 'executed',
      output: 'Uitgevoerd',
    },
    {
      input: 'reportAvailable',
      output: 'Rapport beschikbaar',
    },
    {
      input: 'conformityAvailable',
      output: 'Conformiteit beschikbaar',
    },
    {
      input: 'completed',
      output: 'Afgerond',
    },
    {
      input: 'deleted',
      output: 'Verwijderd',
    }
  ]

  for (const { input, output } of testCases) {
    it(`'${input}' should be converted to '${output}'`, () => {
      spectator = createPipe(`{{ input | status }}`, {
        hostProps: { input },
      });
      expect(spectator.element).toHaveText(output);
    });
  }
});

