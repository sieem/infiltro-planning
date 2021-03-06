import { Pipe, PipeTransform } from '@angular/core';
import { FormService } from '../services/form.service';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  public constructor(private formService: FormService) { }

  transform(date: Date = null, param: string = ""): string {
    if (param === "time") {
      return this.formService.formatDateTime(date);
    }
    return this.formService.formatDate(date, undefined, param === 'empty');
  }

}
