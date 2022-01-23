import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Observable, BehaviorSubject, switchMap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ITemplate } from 'src/app/interfaces/template.interface';
import { ngFormToFormData } from '../../utils/form.utils';

@Component({
  selector: 'app-admin-mail-templates',
  template: `
    <div class="list templates">
      <h1>Template admin</h1>
      <div class="item" *ngFor="let template of templates$ | async">
        <div>{{template.name}}</div>
        <div class="span2">{{template.subject}}</div>
        <div class="icon" (click)="editTemplate(template)"><img src="assets/images/icon-edit.svg" alt=""></div>
        <div class="icon" (click)="removeTemplate(template)"><img src="assets/images/icon-delete.svg" alt=""></div>
      </div>
    </div>

    <form [formGroup]="templateForm" class="wrapper">
      <div class="inputGroup">
        <label for="name">Templatenaam</label>
        <input type="text" name="name" formControlName="name">
        <p *ngIf="formService.checkInputField(templateForm, 'name', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup">
        <label for="subject">Onderwerp</label>
        <input type="subject" name="subject" formControlName="subject">
        <p *ngIf="formService.checkInputField(templateForm, 'subject', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup textarea">
        <label for="body">Body</label>
        <textarea name="body" cols="30" rows="10" formControlName="body"></textarea>
        <p *ngIf="formService.checkInputField(templateForm, 'body', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup right submit">
        <input type="submit" value="Annuleer" (click)="cancel()">
        <input type="submit" [value]="editState ? 'Template aanpassen' : 'Template toevoegen'" (click)="onSubmit()">
      </div>

      <div>
        <h4>Beschikbare variabelen:</h4>
        <div ngNonBindable>{{company}}</div>
        <div ngNonBindable>{{houseAmount}}</div>
        <div ngNonBindable>{{projectName}}</div>
        <div ngNonBindable>{{street}}</div>
        <div ngNonBindable>{{city}}</div>
        <div ngNonBindable>{{postalCode}}</div>
        <div ngNonBindable>{{name}}</div>
        <div ngNonBindable>{{tel}}</div>
        <div ngNonBindable>{{email}}</div>
        <div ngNonBindable>{{executor}}</div>
        <div ngNonBindable>{{datePlanned}}</div>
        <div ngNonBindable>{{hourPlanned}}</div>
      </div>

    </form>
  `,
  styleUrls: ['./admin-mail-templates.component.scss']
})
export class AdminMailTemplatesComponent {
  templateForm = this.formBuilder.group({
    _id: [''],
    name: ['', Validators.required],
    subject: ['', Validators.required],
    body: ['', [Validators.required]],
  });
  submitted = false
  editState = false
  private templatesSubject$ = new BehaviorSubject(null);
  templates$: Observable<any> = this.templatesSubject$.pipe(
    switchMap(() => this.api.getMailTemplates()),
    shareReplay({ refCount: false, bufferSize: 1 }),
  )

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public formService: FormService,
    private toastr: ToastrService) { }

  onSubmit() {
    this.submitted = true

    if (this.templateForm.invalid) {
      this.toastr.error('Form invalid');
      return;
    }

    this.saveTemplate()
  }

  saveTemplate() {

    const formData = ngFormToFormData(this.templateForm.value);

    firstValueFrom(this.api.saveMailTemplate(formData))
      .then(() => {
        this.refreshTemplates();

        this.templateForm.reset()
        this.editState = false
        this.submitted = false;
        this.toastr.success('Template saved');
      })
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
  }

  editTemplate(template: ITemplate) {
    this.editState = true

    this.templateForm.setValue({
      _id: template._id || "",
      name: template.name || "",
      subject: template.subject || "",
      body: template.body || "",
    })
  }

  cancel() {
    this.editState = false;
    this.templateForm.reset();
  }

  removeTemplate(template: ITemplate) {
    if (confirm(`Are you sure to delete ${template.name}?`)) {
      firstValueFrom(this.api.removeMailTemplate(template._id))
        .then(() => this.refreshTemplates())
        .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
    }
  }

  private refreshTemplates() {
    this.templatesSubject$.next(null);
  }
}
