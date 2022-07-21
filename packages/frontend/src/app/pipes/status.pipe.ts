import { Pipe, PipeTransform } from '@angular/core';
import { IStatuses, statusName } from '@infiltro/shared';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: IStatuses['type'] | ''): string {
    return statusName(value);
  }


}
