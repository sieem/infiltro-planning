import { Pipe, PipeTransform } from '@angular/core';
import { CompanyPipe } from './company.pipe';
import { UserPipe } from './user.pipe';
import { ProjectTypePipe } from './project-type.pipe';
import { ExecutorPipe } from './executor.pipe';
import { FormatDatePipe } from './format-date.pipe';
import { StatusPipe } from './status.pipe';

@Pipe({
  name: 'dynamicProjectPipe'
})
export class DynamicProjectPipe implements PipeTransform {
  constructor(
    private CompanyPipe:CompanyPipe,
    private UserPipe:UserPipe,
    private ProjectTypePipe:ProjectTypePipe,
    private ExecutorPipe:ExecutorPipe,
    private FormatDatePipe:FormatDatePipe,
    private StatusPipe:StatusPipe,
  ) {}

  async transform(value: any, field: string): Promise<any> {
    switch(field) {
      case 'company':
        return await this.CompanyPipe.transform(value);
      case 'EpbReporter':
        return await this.UserPipe.transform(value);
      case 'projectType':
        return this.ProjectTypePipe.transform(value);
      case 'dateCreated':
      case 'datePlanned':
      case 'dateActive':
        return this.FormatDatePipe.transform(value, undefined);
      case 'status':
        return this.StatusPipe.transform(value);
      case 'executor':
        return this.ExecutorPipe.transform(value, undefined);
      default:
        return value;
    }
  }
}
