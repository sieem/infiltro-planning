import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  public constructor(private projectService: ProjectService) { }

  transform(value: string): string {
    return this.projectService.formatDate(value);
  }

}
