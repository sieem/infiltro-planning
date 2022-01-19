import { Pipe, PipeTransform } from '@angular/core';
import { CompanyService } from '../services/company.service';
import * as moment from 'moment';
import { SingleProjectService } from '../services/single-project.service';
import { FormService } from '../services/form.service';
import { asyncReplace } from '../helpers/asyncReplace.helper';
import { firstValueFrom } from 'rxjs';

@Pipe({
  name: 'mailTemplate'
})
export class MailTemplatePipe implements PipeTransform {

  constructor(
    private companyService: CompanyService,
    private singleProjectService: SingleProjectService,
    private formService: FormService
  ) {}

  async transform(value: string): Promise<string> {
    if (value === '' || !value) {
      return value;
    }

    return await asyncReplace(value, /{{\s*([A-z]*)\s*}}/g, async (foundSubstring: string, firstGroup: string) => {
      switch (firstGroup) {
        case 'company': return await firstValueFrom(this.companyService.companyName(this.singleProjectService.projectData.company));
        case 'datePlanned': return moment(this.singleProjectService.projectData.datePlanned).format(this.formService.mailDateFormat);
        case 'hourPlanned': return this.singleProjectService.projectData.hourPlanned;
        default: return this.singleProjectService.projectData[firstGroup] || foundSubstring;
      }
    });
  }
}
