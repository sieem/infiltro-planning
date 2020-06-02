import { Injectable } from '@angular/core';
import { SingleProjectService } from './single-project.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectArchiveService {
  archiveData: any;
  activeProject: number = 0;
  archiveProjectData: any;

  constructor(
    private singleProjectService: SingleProjectService,
    private router: Router,
  ) { }

  init(res) {
    this.archiveData = res;
    this.archiveProjectData = this.archiveData[this.activeProject];
    if (!this.archiveProjectData) {
      this.router.navigate(['/project/' + this.singleProjectService.projectId])
      return;
    }
    this.singleProjectService.fillInFormGroup(this.archiveProjectData.projectData);
  }

  newerProject() {
    if (!this.archiveData[this.activeProject - 1]) {
      return
    }
    this.activeProject--;
    this.archiveProjectData = this.archiveData[this.activeProject];
    this.singleProjectService.fillInFormGroup(this.archiveProjectData.projectData);
  }

  olderProject() {
    if (!this.archiveData[this.activeProject + 1]) {
      return
    }
    this.activeProject++;
    this.archiveProjectData = this.archiveData[this.activeProject];
    this.singleProjectService.fillInFormGroup(this.archiveProjectData.projectData);
  }

  isNewerProjectAvailable() {
    return this.archiveData && this.archiveData[this.activeProject - 1];
  }

  isOlderProjectAvailable() {
    return this.archiveData && this.archiveData[this.activeProject + 1];
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
