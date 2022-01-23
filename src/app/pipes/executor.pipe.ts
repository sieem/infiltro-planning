import { Pipe, PipeTransform } from '@angular/core';
import { ProjectEnumsService } from '../services/project-enums.service';

@Pipe({
  name: 'executor'
})
export class ExecutorPipe implements PipeTransform {

  constructor(private projectEnumsService: ProjectEnumsService) { }

  transform(value: string, param: string = ''): string {
    return (param === 'label') ? this.projectEnumsService.executorName(value).substring(0, 1).toUpperCase() : this.projectEnumsService.executorName(value);
  }

}
