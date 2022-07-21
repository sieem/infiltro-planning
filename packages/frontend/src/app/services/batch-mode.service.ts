import { Injectable } from '@angular/core';
import { IProject } from '@infiltro/shared';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchModeService {
  batchMode$ = new BehaviorSubject<boolean>(false);
  selectedProjects$ = new BehaviorSubject<IProject[]>([]);
}
