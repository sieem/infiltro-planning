import { Pipe, PipeTransform } from '@angular/core';
import { IProject } from '../interfaces/project.interface';
@Pipe({
  name: 'sortProjects'
})
export class SortProjectsPipe implements PipeTransform {

  transform(projects: IProject[], sortOptions): IProject[] {
    let sortedProjects = projects.sort((a, b) => {
      let x: string | Date;
      let y: string | Date;

      if ((sortOptions.field !== 'datePlanned' || sortOptions.field !== 'executor') && !a[sortOptions.field] && !b[sortOptions.field]) {
        x = a.dateEdited;
        y = b.dateEdited;
      } else {
        if (!a[sortOptions.field]) return 1;
        if (!b[sortOptions.field]) return -1;
      }

      x = x || a[sortOptions.field].toLowerCase();
      y = y || b[sortOptions.field].toLowerCase();

      if (x == y) return 0

      return x < y ? -1 : 1
    });

    if (sortOptions.field === 'datePlanned') {
      sortedProjects = sortedProjects.sort((a, b) => {
        if (a.datePlanned) return 1;

        if (a.dateActive == b.dateActive) return 0

        return a.dateActive < b.dateActive ? -1 : 1
      })
    }

    return sortOptions.order == 'desc' ? sortedProjects.reverse() : sortedProjects;
  }

}
