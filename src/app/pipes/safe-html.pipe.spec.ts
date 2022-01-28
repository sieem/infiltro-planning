import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  let spectator: SpectatorPipe<SafeHtmlPipe>;
  const createPipe = createPipeFactory(SafeHtmlPipe);

  const testCases = [
    {
      input: '<b>house</b>',
      output: '<span><b>house</b></span>',
    },
    {
      input: '<script>console.log(666)</script>',
      output: '<span></span>',
    },
  ];

  for (const { input, output } of testCases) {
    it(`'${input}' should be converted to '${output}'`, () => {
      spectator = createPipe(`<span [innerHTML]="input | safeHtml"></span>`, {
        hostProps: { input },
      });
      expect(spectator.element.innerHTML).toEqual(output);
    });
  }
});
