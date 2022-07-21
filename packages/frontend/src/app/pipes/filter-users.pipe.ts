import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '@infiltro/shared';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

  transform(value: IUser[] | null, companyId?: string): any {
    if (!value || !companyId) {
      return '';
    }
    return (value) ? value.filter((el) => el.company === companyId) : value;
  }

}
