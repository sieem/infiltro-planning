import { Pipe, PipeTransform } from '@angular/core';
import { IProject } from '../interfaces/project.interface';

@Pipe({
  name: 'filterProjects',
})
export class FilterProjectsPipe implements PipeTransform {

  transform(projects: IProject[], activeFilter): IProject[] {
    return projects.filter(row => {
      let filterBooleans = []

      for (let [key, values] of Object.entries(activeFilter)) {
        let filterArr: any = values
        if (filterArr.length == 0) {
          return false
        } else if (row[key] !== '') {
          filterBooleans.push(filterArr.includes(row[key]))
        }
      }
      return !filterBooleans.includes(false)
    });
  }

}
