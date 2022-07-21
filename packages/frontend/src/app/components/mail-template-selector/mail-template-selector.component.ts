import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { ITemplate } from '@infiltro/shared';

@UntilDestroy()
@Component({
  selector: 'infiltro-mail-template-selector',
  template: `
    <form [formGroup]="mailTemplateForm">
        <select formControlName="id" (change)="onChange()">
            <option value="">Kies een template</option>
            <option *ngFor="let template of templates$ | async" [value]="template._id">{{template.name}}</option>
        </select>
    </form>
  `,
  styleUrls: ['./mail-template-selector.component.scss']
})
export class MailTemplateSelectorComponent implements OnInit {
  @Input()
  templateBody!: BehaviorSubject<ITemplate>;

  @Input()
  templateSaved!: BehaviorSubject<string>;

  private onDestroy$ = new Subject<void>();
  mailTemplateForm = this.formBuilder.group({
    id: [''],
  });

  @Input()
  templates$ = this.api.getMailTemplates().pipe(untilDestroyed(this));

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.templateSaved.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: () => this.templates$ = this.api.getMailTemplates().pipe(untilDestroyed(this))
    })
  }

  onChange() {

    this.templates$.pipe(shareReplay(1)).subscribe({
      next: (templates: ITemplate[]) => {
        const template = templates
          .find((template) => template._id === this.mailTemplateForm.value.id);

        this.mailTemplateForm.controls['id'].setValue('');

        if (!template || !confirm(`Wil je wisselen naar template: '${template.name}'?`)) {
          return;
        }

        this.templateBody.next(template);
      },
      error: (err) => console.error(err)
    })
  }
}
