import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {

  public constructor(private projectService: ProjectService) { }

  transform(value: string): string {
    return this.projectService.projectTypeName(value)
  }


}
