import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'isDateActiveTooOld'
})
export class IsDateActiveTooOldPipe implements PipeTransform {

  transform([dateActive, status]): boolean {
    if (status !== 'toPlan') {
      return false;
    }
    return moment(dateActive).isSameOrBefore(moment().subtract(14, 'days'));
  }
}
