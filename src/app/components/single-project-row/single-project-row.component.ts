import { Component, Input } from '@angular/core';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';
import { SingleProjectArchiveService } from 'src/app/services/single-project-archive.service';

@Component({
  selector: 'app-single-project-row',
  template: `
    <form [formGroup]="singleProjectService.projectForm">
        <div class="projectRow" [class]="[type, field]">
            <label [for]="field"><span [innerHTML]='label | safeHtml'></span>&nbsp;<span *ngIf="singleProjectService.projectForm.controls[field].validator !== null && showAsterisk">*</span></label>
            <div class="inputField" [class.fieldChanged]="singleProjectArchiveService.fieldChanged(field)">
                <div class="read" (click)="changeEditState(field, true)" [ngClass]="{'empty': isEmpty(field)}"
                    *ngIf="!singleProjectService.projectEditStates[field] || readOnly || singleProjectService.archiveActive">
                    <span *ngIf="type === 'textarea'" >
                        <span [innerHTML]="singleProjectService.projectForm.value[field] | newlineToBr | safeHtml"></span>
                        <span class="oldField" *ngIf="singleProjectArchiveService.isOlderProjectAvailable() && singleProjectArchiveService.fieldChanged(field)" [innerHTML]="singleProjectArchiveService.getOldField(field) | newlineToBr | safeHtml"></span>
                    </span>
                    <span *ngIf="type !== 'textarea'">
                        <ng-container [ngSwitch]="field">
                            <ng-container *ngSwitchDefault>
                                {{singleProjectService.projectForm.value[field] | dynamicProjectPipe: field | async}}
                                <span class="oldField" *ngIf="singleProjectArchiveService.isOlderProjectAvailable() && singleProjectArchiveService.fieldChanged(field)">{{ singleProjectArchiveService.getOldField(field) | dynamicProjectPipe: field | async}}</span>
                            </ng-container>
                        </ng-container>
                    </span>
                </div>

                <div class="write" *ngIf="singleProjectService.projectEditStates[field] && !readOnly && !singleProjectService.archiveActive">
                    <ng-container *ngIf="type === 'input'">
                        <input type="text" [name]="field" [id]="field" [formControlName]="field">
                    </ng-container>

                    <ng-container *ngIf="type === 'date'">
                        <input type="date" [name]="field" [id]="field" [formControlName]="field">
                    </ng-container>

                    <ng-container *ngIf="type === 'time'">
                        <input type="time" [name]="field" [id]="field" [formControlName]="field">
                    </ng-container>

                    <ng-container *ngIf="type === 'select'">
                        <select [name]="field" [id]="field" [formControlName]="field" (change)="updateStatusDropdowns(field)">
                            <option value="">{{ firstValue }}</option>
                            <option *ngFor="let item of dataSource" [value]="item[valueKey]">{{item.name}}</option>
                        </select>
                    </ng-container>

                    <ng-container *ngIf="type === 'textarea'">
                        <textarea [name]="field" [id]="field" [formControlName]="field" rows="3"></textarea>
                    </ng-container>
                    <p *ngIf="formService.checkInputField(singleProjectService.projectForm, field, singleProjectService.submitted)" class="error">!</p>
                </div>
            </div>
        </div>
    </form>
  `,
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
