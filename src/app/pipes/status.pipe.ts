import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  public constructor(private projectService: ProjectService) { }

  transform(value: string): string {
    return this.projectService.statusName(value)
  }


}
