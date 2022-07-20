import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, formatDateTime } from 'shared/utils/formatDate.utils';
import { FormService } from '../services/form.service';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(date: Date | null, param: string = ""): string {
    if (!date) {
      return '';
    }
    if (param === "time") {
      return formatDateTime(date);
    }
    return formatDate(date, undefined, param === 'empty');
  }
}
