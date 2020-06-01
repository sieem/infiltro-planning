import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Pipe({
  name: 'executor'
})
export class ExecutorPipe implements PipeTransform {

  public constructor(private projectService: ProjectService) { }

  transform(value: string): string {
    return this.projectService.executorName(value)
  }

}
