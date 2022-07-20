import { Pipe, PipeTransform } from '@angular/core';
import { statusName } from '../constants/statuses';
import { IStatuses } from '../interfaces/statuses.interface';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: IStatuses['type'] | ''): string {
    return statusName(value);
  }


}
