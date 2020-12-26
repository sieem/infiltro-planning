import { Pipe, PipeTransform } from '@angular/core';
import { IProject } from '../interfaces/project.interface';
import { UserPipe } from './user.pipe';
import { CompanyPipe } from './company.pipe';
import { ExecutorPipe } from './executor.pipe';

@Pipe({
  name: 'filterProjects',
})
export class FilterProjectsPipe implements PipeTransform {

  constructor(
    private userPipe: UserPipe,
    private companyPipe: CompanyPipe,
    private executorPipe: ExecutorPipe,
  ) {}

  async transform(projects: IProject[], activeFilter: any, searchTerm: string): Promise<IProject[]> {
    return await this.asyncFilter(projects, async (row: IProject) => {
      let filterBooleans = [];
      let foundInSearch = false;

      for (let [key, values] of Object.entries(activeFilter)) {
        let filterArr: any = values
        if (filterArr.length == 0) {
          return false
        } else if (row[key] !== '') {
          filterBooleans.push(filterArr.includes(row[key]))
        }
      }

      if (searchTerm === "") {
        // no search, so make it always found
        foundInSearch = true;
      } else {
        for (let [key, value] of Object.entries(row)) {
          if (['dateCreated', 'dateEdited', 'datePlanned', 'lat', 'lng', 'mails', 'comments', 'projectType', '_id', 'calendarId', 'calendarLink', 'eventId', 'hourPlanned', 'status', '__v'].includes(key)) {
            continue;
          }

          switch (key) {
            case 'EpbReporter': value = await this.userPipe.transform(value); break;
            case 'company': value = await this.companyPipe.transform(value); break;
            case 'executor': value = this.executorPipe.transform(value); break;
          }

          if (typeof value === 'string' && new RegExp(this.escapeRegExp(searchTerm), 'gi').test(value)) {
            foundInSearch = true;
            break;
          }
        }
      }

      return !filterBooleans.includes(false) && foundInSearch;
    });
  }

  escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  async asyncFilter (arr, predicate) {
    // https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
    return arr.reduce(async (memo, e) => await predicate(e) ? [...await memo, e] : memo, []);
  };
}
