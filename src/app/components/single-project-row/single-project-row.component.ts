import { Component, OnInit, Input } from '@angular/core';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-single-project-row',
  templateUrl: './single-project-row.component.html',
  styleUrls: ['./single-project-row.component.scss']
})
export class SingleProjectRowComponent implements OnInit {
  @Input('label') label: string;
  @Input('field') field: string;
  @Input('type') type: string;
  @Input('valueKey') valueKey: string;
  @Input('dataSource') dataSource: [any];


  constructor(
    public singleProjectService: SingleProjectService,
    public projectService: ProjectService,
    public companyService: CompanyService,
    public userService: UserService,
    public formService: FormService,
  ) { }

  ngOnInit(): void {
  }

  isEmpty(inputName) {
    if (typeof this.singleProjectService.projectForm.value[inputName] === 'string')
      return this.singleProjectService.projectForm.value[inputName].trim() == ""
    else
      return false
  }

  changeEditState(inputName, state) {
    this.singleProjectService.projectEditStates[inputName] = state
  }

}
