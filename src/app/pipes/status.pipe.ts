import { Pipe, PipeTransform } from '@angular/core';
import { ProjectEnumsService } from '../services/project-enums.service';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  constructor(private projectEnumsService: ProjectEnumsService) { }

  transform(value: string): string {
    return this.projectEnumsService.statusName(value)
  }


}
