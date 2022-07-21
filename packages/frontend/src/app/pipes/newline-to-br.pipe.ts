import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newlineToBr'
})
export class NewlineToBrPipe implements PipeTransform {

  transform(value: string | undefined | null): string {
    if (value && typeof value == "string") {
      return value.replace(/\n/g, "<br>");
    }

    return '';
  }

}
