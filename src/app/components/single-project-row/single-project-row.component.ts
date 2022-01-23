import { Component, Input } from '@angular/core';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';
import { SingleProjectArchiveService } from 'src/app/services/single-project-archive.service';

@Component({
  selector: 'app-single-project-row',
  templateUrl: './single-project-row.component.html',
  styleUrls: ['./single-project-row.component.scss']
})
export class SingleProjectRowComponent {
  @Input() label!: string;
  @Input() field!: string;
  @Input() type!: string;
  @Input() valueKey!: string;
  @Input() firstValue!: string;
  @Input() readOnly: boolean = false;
  @Input() showAsterisk: boolean = true;
  @Input() dataSource: any;


  constructor(
    public singleProjectService: SingleProjectService,
    public projectService: ProjectService,
    public companyService: CompanyService,
    public userService: UserService,
    public formService: FormService,
    public singleProjectArchiveService: SingleProjectArchiveService,
  ) { }

  isEmpty(inputName: string) {
    return typeof this.singleProjectService.projectForm.value[inputName] === 'string'
      ? this.singleProjectService.projectForm.value[inputName].trim() == ""
      : false
  }

  changeEditState(inputName: string, state: boolean) {
    this.singleProjectService.projectEditStates[inputName] = state;
  }

  updateStatusDropdowns(field: string) {
    if (field === 'status') {
      this.singleProjectService.projectForm.setValue(this.singleProjectService.projectForm.value);
    }
  }

}
