import { Pipe, PipeTransform } from '@angular/core';
import { projectTypeName } from '../../../shared/constants/project-types';
import { IProjectTypes } from '../interfaces/project-type.interface';

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {
  transform(value: IProjectTypes['type'] | ''): string {
    return projectTypeName(value)
  }
}
