import { Pipe, PipeTransform } from '@angular/core';
import { IProject } from '../interfaces/project.interface';
@Pipe({
  name: 'sortProjects'
})
export class SortProjectsPipe implements PipeTransform {

  transform(projects: IProject[], sortOptions: { field: keyof IProject, order: 'asc' | 'desc'}): IProject[] {
    let sortedProjects = projects.sort((a, b) => {
      let x: string | Date | undefined;
      let y: string | Date | undefined;

      if (!['datePlanned', 'executor'].includes(sortOptions.field) && !a[sortOptions.field] && !b[sortOptions.field]) {
        x = a.dateEdited;
        y = b.dateEdited;
      } else {
        if (!a[sortOptions.field]) return 1;
        if (!b[sortOptions.field]) return -1;
      }

      x = x || String(a[sortOptions.field]).toLowerCase();
      y = y || String(b[sortOptions.field]).toLowerCase();

      if (x == y) return 0

      return x < y ? -1 : 1
    });

    if (sortOptions.field === 'datePlanned') {
      sortedProjects = sortedProjects.sort((a, b) => {
        if (a.datePlanned) return 1;

        if (a.dateActive == b.dateActive) return 0;

        return (a.dateActive as Date) < (b.dateActive as Date) ? -1 : 1;
      })
    }

    return sortOptions.order == 'desc' ? projects.reverse() : projects;
  }

}
