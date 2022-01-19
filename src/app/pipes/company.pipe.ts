import { Pipe, PipeTransform } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { first } from 'rxjs/operators';

@Pipe({
  name: 'company'
})
export class CompanyPipe implements PipeTransform {

  public constructor(private companyService: CompanyService) { }

  transform(value: string): Promise<string> {
    return this.companyService.companyName(value).pipe(first()).toPromise();
  }

}
