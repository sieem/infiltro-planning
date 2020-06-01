import { Pipe, PipeTransform } from '@angular/core';
import { CompanyService } from '../services/company.service';

@Pipe({
  name: 'company'
})
export class CompanyPipe implements PipeTransform {

  public constructor(private companyService: CompanyService) { }

  async transform(value: string): Promise<string> {
    return await this.companyService.companyName(value)
  }

}
