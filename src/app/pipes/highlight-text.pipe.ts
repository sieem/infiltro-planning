import { Pipe, PipeTransform } from '@angular/core';
import { Observable, combineLatest, of, map } from 'rxjs';
import { escapeRegExp } from 'shared/utils/escapeRegExp.util';

@Pipe({
  name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {

  transform(value: string | null, searchTerm$: Observable<string>): Observable<string> {
    return combineLatest([of(value), searchTerm$]).pipe((
      map(([value, searchTerm]) => {
        if (searchTerm === '' || !value || searchTerm.startsWith('-')) {
          return value ?? '';
        }
        return value.replace(new RegExp(escapeRegExp(searchTerm), "gi"), (match: string) => `<mark>${match}</mark>`);
      })
    ))

  }

}
