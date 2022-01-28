import { Pipe, PipeTransform } from '@angular/core';
import { ProjectEnumsService } from '../services/project-enums.service';

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {
  constructor(private projectEnumsService: ProjectEnumsService) { }

  transform(value: string): string {
    return this.projectEnumsService.projectTypeName(value)
  }
}
