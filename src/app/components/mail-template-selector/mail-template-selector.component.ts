import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { find, map, shareReplay, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-mail-template-selector',
  templateUrl: './mail-template-selector.component.html',
  styleUrls: ['./mail-template-selector.component.scss']
})
export class MailTemplateSelectorComponent implements OnInit {
  @Input()
  public templateBody: BehaviorSubject<string>;

  @Input()
  public templateSaved: BehaviorSubject<string>;

  private onDestroy$ = new Subject<void>();
  public mailTemplateForm: FormGroup;

  @Input()
  public templates$ = this.api.getMailTemplates().pipe(takeUntil(this.onDestroy$));

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.mailTemplateForm = this.formBuilder.group({
      id: [''],
    });

    this.templateSaved.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: () => this.templates$ = this.api.getMailTemplates().pipe(takeUntil(this.onDestroy$))
    })
  }

  onChange() {
    this.templates$.pipe(shareReplay(1)).subscribe({
      next: (templates: any) => {
        const body = templates
          .find(template => template._id === this.mailTemplateForm.value.id)?.body;

        if (body) {
          this.templateBody.next(body);
        }
      },
      error: (err) => console.error(err)
    })
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
