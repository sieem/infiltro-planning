import { Pipe, PipeTransform } from '@angular/core';
import { escapeRegExp } from '../helpers/escapeRegExp.helper';

@Pipe({
  name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {

  transform(value: string | null, searchTerm: string): string {
    if (searchTerm === '' || !value) {
      return value ?? '';
    }
    return value.replace(new RegExp(escapeRegExp(searchTerm), "gi"), match => `<mark>${match}</mark>`);
  }

}
