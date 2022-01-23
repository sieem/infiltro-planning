import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newlineToBr'
})
export class NewlineToBrPipe implements PipeTransform {

  transform(value: string): string {
    if (value && typeof value == "string") {
      return value.replace(/\n/g, "<br>");
    }

    return '';
  }

}
