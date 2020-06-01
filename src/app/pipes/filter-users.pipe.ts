import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

  constructor(private auth:AuthService) {}

  transform(value, companyId): unknown {
    return value.filter((el) => el.company === companyId || this.auth.isAdmin());
  }

}
