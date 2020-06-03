import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Pipe({
  name: 'executor'
})
export class ExecutorPipe implements PipeTransform {

  public constructor(private projectService: ProjectService) { }

  transform(value: string, param: string): string {
    return (param === 'label') ? this.projectService.executorName(value).substring(0, 1).toUpperCase(): this.projectService.executorName(value);
  }

}
