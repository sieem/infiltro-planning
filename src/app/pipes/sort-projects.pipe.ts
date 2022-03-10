import { Pipe, PipeTransform } from '@angular/core';
import { IProject } from '../interfaces/project.interface';
import { sortProjects } from './sort-project.pipe.utils';
@Pipe({
  name: 'sortProjects'
})
export class SortProjectsPipe implements PipeTransform {

  transform(projects: IProject[], {field, order}: { field: keyof IProject, order: 'asc' | 'desc'}): IProject[] {
    const sortedProjects = sortProjects(projects, field);

    return order === 'desc' ? sortedProjects.reverse() : sortedProjects;
  }
}
