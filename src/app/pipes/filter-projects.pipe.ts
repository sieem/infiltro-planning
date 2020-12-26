import { Pipe, PipeTransform } from '@angular/core';
import { IProject } from '../interfaces/project.interface';
import { UserPipe } from './user.pipe';
import { CompanyPipe } from './company.pipe';
import { ExecutorPipe } from './executor.pipe';
import { escapeRegExp } from '../helpers/escapeRegExp.helper';
import { FormatDatePipe } from './format-date.pipe';
import { StatusPipe } from './status.pipe';
import { ProjectTypePipe } from './project-type.pipe';
import { asyncFilter } from '../helpers/asyncFilter.helper';

@Pipe({
  name: 'filterProjects',
})
export class FilterProjectsPipe implements PipeTransform {

  constructor(
    private userPipe: UserPipe,
    private companyPipe: CompanyPipe,
    private executorPipe: ExecutorPipe,
    private formatDatePipe: FormatDatePipe,
    private statusPipe: StatusPipe,
    private projectTypePipe: ProjectTypePipe,
  ) {}

  async transform(projects: IProject[], activeFilter: any, searchTerm: string): Promise<IProject[]> {
    const filteredProjects = projects.filter((row) => {
      let filterBooleans = [];

      for (let [key, values] of Object.entries(activeFilter)) {
        let filterArr: any = values
        if (filterArr.length == 0) {
          return false
        } else if (row[key] !== '') {
          filterBooleans.push(filterArr.includes(row[key]))
        }
      }

      return !filterBooleans.includes(false);
    });

    return await asyncFilter(filteredProjects, async (row: IProject) => {
      let foundInSearch = false;

      if (searchTerm === "") {
        // no search, so make it always found
        foundInSearch = true;
      } else {
        for (let [key, value] of Object.entries(row)) {
          if (['dateEdited', 'lat', 'lng', 'mails', 'comments', 'projectType', '_id', 'calendarId', 'calendarLink', 'eventId', '__v'].includes(key)) {
            continue;
          }

          switch (key) {
            case 'EpbReporter': value = await this.userPipe.transform(value); break;
            case 'company': value = await this.companyPipe.transform(value); break;
            case 'executor': value = this.executorPipe.transform(value); break;
            case 'datePlanned': value = this.formatDatePipe.transform(value); break;
            case 'dateCreated': value = this.formatDatePipe.transform(value); break;
            case 'status': value = this.statusPipe.transform(value); break;
            case 'projectType': value = this.projectTypePipe.transform(value); break;
          }

          if (typeof value === 'string' && new RegExp(escapeRegExp(searchTerm), 'gi').test(value)) {
            foundInSearch = true;
            break;
          }
        }
      }

      return foundInSearch;
    });
  }
}
