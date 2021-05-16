import { Pipe, PipeTransform } from '@angular/core';
import { FormService } from '../services/form.service';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  public constructor(private formService: FormService) { }

  transform(value: string, param: string = ""): string {
    if (param === "time") {
      return this.formService.formatDateTime(value);
    }
    return this.formService.formatDate(value, undefined, param === 'empty');
  }

}
