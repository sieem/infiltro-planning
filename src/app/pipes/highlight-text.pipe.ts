import { Pipe, PipeTransform } from '@angular/core';
import { escapeRegExp } from '../utils/escapeRegExp.util';
import { Observable, combineLatest, of, map } from 'rxjs';

@Pipe({
  name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {

  transform(value: string | null, searchTerm$: Observable<string>): Observable<string> {
    return combineLatest([of(value), searchTerm$]).pipe((
      map(([value, searchTerm]) => {
        if (searchTerm === '' || !value) {
          return value ?? '';
        }
        return value.replace(new RegExp(escapeRegExp(searchTerm), "gi"), (match: string) => `<mark>${match}</mark>`);
      })
    ))

  }

}
