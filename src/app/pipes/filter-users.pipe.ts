import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

  constructor(private auth:AuthService) {}

  transform(value, companyId): any {
    return (value) ? value.filter((el) => el.company === companyId) : value;
  }

}
