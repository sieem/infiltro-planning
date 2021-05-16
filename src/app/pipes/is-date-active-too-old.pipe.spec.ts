import { IsDateActiveTooOldPipe } from './is-date-active-too-old.pipe';

describe('IsDateActiveTooOldPipe', () => {
  it('create an instance', () => {
    const pipe = new IsDateActiveTooOldPipe();
    expect(pipe).toBeTruthy();
  });
});
