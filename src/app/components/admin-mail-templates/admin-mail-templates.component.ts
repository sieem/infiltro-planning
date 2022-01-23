import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom, Observable, BehaviorSubject, switchMap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ITemplate } from 'src/app/interfaces/template.interface';

@Component({
  selector: 'app-admin-mail-templates',
  templateUrl: './admin-mail-templates.component.html',
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
    public auth: AuthService,
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

    const formData = new FormData();
    formData.append('_id', this.templateForm.value._id);
    formData.append('name', this.templateForm.value.name);
    formData.append('subject', this.templateForm.value.subject);
    formData.append('body', this.templateForm.value.body);

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
