import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ITemplate } from '../../interfaces/template.interface';

@UntilDestroy()
@Component({
  selector: 'app-mail-template-selector',
  templateUrl: './mail-template-selector.component.html',
  styleUrls: ['./mail-template-selector.component.scss']
})
export class MailTemplateSelectorComponent implements OnInit {
  @Input()
  public templateBody!: BehaviorSubject<ITemplate>;

  @Input()
  public templateSaved!: BehaviorSubject<string>;

  private onDestroy$ = new Subject<void>();
  public mailTemplateForm = this.formBuilder.group({
    id: [''],
  });

  @Input()
  public templates$ = this.api.getMailTemplates().pipe(untilDestroyed(this));

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
