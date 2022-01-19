import { Pipe, PipeTransform } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { firstValueFrom } from 'rxjs';

@Pipe({
  name: 'company'
})
export class CompanyPipe implements PipeTransform {

  public constructor(private companyService: CompanyService) { }

  transform(value: string): Promise<string> {
    return firstValueFrom(this.companyService.companyName(value));
  }

}
