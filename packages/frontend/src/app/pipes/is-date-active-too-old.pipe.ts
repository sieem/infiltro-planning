import { Pipe, PipeTransform } from '@angular/core';
import { IStatuses } from '@infiltro/shared';
import * as moment from 'moment';

@Pipe({
  name: 'isDateActiveTooOld'
})
export class IsDateActiveTooOldPipe implements PipeTransform {

  transform(dateActive: Date | null, status: IStatuses['type'] | ''): boolean {
    if (status !== 'toPlan' || !dateActive) {
      return false;
    }
    return moment(dateActive).isSameOrBefore(moment().subtract(14, 'days'));
  }
}
