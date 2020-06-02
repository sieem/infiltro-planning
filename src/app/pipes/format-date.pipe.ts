import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  public constructor(private projectService: ProjectService) { }

  transform(value: string): string {
    return this.projectService.formatDate(value);
  }

}
