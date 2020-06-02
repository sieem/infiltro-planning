import { Injectable } from '@angular/core';
import { SingleProjectService } from './single-project.service';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectArchiveService {
  archiveData: any;
  activeProject: number = 0;

  constructor(
    private singleProjectService: SingleProjectService,
  ) { }

  init(res) {
    this.archiveData = res;
    this.singleProjectService.fillInFormGroup(this.archiveData[this.activeProject].projectData);
  }

  newerProject() {
    if (!this.archiveData[this.activeProject - 1]) {
      return
    }
    this.activeProject--;
    this.singleProjectService.fillInFormGroup(this.archiveData[this.activeProject].projectData);
  }

  olderProject() {
    if (!this.archiveData[this.activeProject + 1]) {
      return
    }
    this.activeProject++;
    this.singleProjectService.fillInFormGroup(this.archiveData[this.activeProject].projectData);
  }

  fieldChanged(field) {
    if (!this.singleProjectService.archiveActive || !this.archiveData) {
      return false;
    }
    
    if (!this.archiveData[this.activeProject + 1]) {
      return true;
    }

    return this.archiveData[this.activeProject + 1].projectData[field] !== this.archiveData[this.activeProject].projectData[field];
  }

  getOldField(field) {
    return (this.archiveData[this.activeProject + 1]) ? this.archiveData[this.activeProject + 1].projectData[field] : '';
  }
}
