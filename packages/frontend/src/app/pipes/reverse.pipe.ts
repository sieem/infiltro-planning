import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe<T extends unknown> implements PipeTransform {

  transform(value: T[]): T[] {
    return Array.isArray(value) ? value.reverse() : value;
  }

}
