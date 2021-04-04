import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-admin-mail-templates',
  templateUrl: './admin-mail-templates.component.html',
  styleUrls: ['./admin-mail-templates.component.scss']
})
export class AdminMailTemplatesComponent implements OnInit {
  templateForm: FormGroup
  submitted = false
  editState = false
  templates$: Observable<any> = this.api.getMailTemplates().pipe(shareReplay(1));

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public auth: AuthService,
    public formService: FormService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.templateForm = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', [Validators.required]],
    })
  }

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

    this.api.saveMailTemplate(formData).subscribe(
      (res: any) => {
        this.templates$ = this.api.getMailTemplates().pipe(shareReplay(1));
        
        this.templateForm.reset()
        this.editState = false
        this.toastr.success('Template saved');
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  editTemplate(template) {
    this.editState = true

    this.templateForm.setValue({
      _id: template._id || "",
      name: template.name || "",
      subject: template.subject || "",
      body: template.body || "",
    })
  }

  removeTemplate(template: any) {
    if (confirm(`Are you sure to delete ${template.name}?`)) {
      this.api.removeMailTemplate(template._id).subscribe(
        (res: any) => {
          this.templates$ = this.api.getMailTemplates().pipe(shareReplay(1));
        },
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    }
  }
}
