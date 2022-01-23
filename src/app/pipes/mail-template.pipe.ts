import { Pipe, PipeTransform } from '@angular/core';
import { CompanyService } from '../services/company.service';
import * as moment from 'moment';
import { SingleProjectService } from '../services/single-project.service';
import { FormService } from '../services/form.service';
import { asyncReplace } from '../utils/asyncReplace.util';
import { firstValueFrom } from 'rxjs';
import { IProject } from '../interfaces/project.interface';
import { mailDateFormat } from '../utils/regex.util';

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

    const projectData = await firstValueFrom(this.singleProjectService.projectData$);

    return await asyncReplace(value, /{{\s*([A-z]*)\s*}}/g, async (foundSubstring: string, firstGroup: keyof IProject): Promise<string> => {
      switch (firstGroup) {
        case 'company': return await firstValueFrom(this.companyService.companyName(projectData.company));
        case 'datePlanned': return moment(projectData.datePlanned).format(mailDateFormat);
        case 'hourPlanned': return projectData.hourPlanned;
        default: return String(projectData[firstGroup]) || foundSubstring;
      }
    });
  }
}
