import { Pipe, PipeTransform } from '@angular/core';
import { executorName } from '../constants/executors';
import { IExecutors } from '../interfaces/executors.interface';

@Pipe({
  name: 'executor'
})
export class ExecutorPipe implements PipeTransform {
  transform(value: IExecutors['type'] | '', param: string = ''): string {
    return (param === 'label') ? executorName(value).substring(0, 1).toUpperCase() : executorName(value);
  }
}
