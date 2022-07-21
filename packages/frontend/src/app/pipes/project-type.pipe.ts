import { Pipe, PipeTransform } from '@angular/core';
import { IProjectTypes, projectTypeName } from '@infiltro/shared';

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {
  transform(value: IProjectTypes['type'] | ''): string {
    return projectTypeName(value)
  }
}
