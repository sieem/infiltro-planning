import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { MailTemplatePipe } from 'src/app/pipes/mail-template.pipe';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { ITemplate } from '../../interfaces/template.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-mail-project',
  template: `
    <div class="goBackRow">
      <div class="wrapper">
        <div class="goBack" (click)="goBack()">
          <img src="/assets/images/icon-back.svg" alt="">
        </div>
      </div>
    </div>

    <form *ngIf="auth.isAdmin()" [formGroup]="mailForm" class="wrapper">
      <div class="inputGroup">
        <label for="receiver">Naar e-mailadres</label>
        <input type="email" name="receiver" formControlName="receiver">
        <p *ngIf="formService.checkInputField(mailForm, 'receiver', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup">
        <label for="cc">cc</label>
        <input type="email" name="cc" formControlName="cc">
        <p *ngIf="formService.checkInputField(mailForm, 'cc', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup">
        <label for="subject">Onderwerp</label>
        <input type="email" name="subject" formControlName="subject">
        <p *ngIf="formService.checkInputField(mailForm, 'subject', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup textarea">
        <div class="flex">
          <label for="body">Inhoud</label>
          <app-mail-template-selector [templateBody]="templateBody$" [templateSaved]="templateSaved$">
          </app-mail-template-selector>
        </div>
        <textarea name="body" id="body" formControlName="body" rows="3"></textarea>
        <p *ngIf="formService.checkInputField(mailForm, 'body', submitted)" class="error">!</p>
      </div>
      <div class="inputGroup right submit">
        <input type="submit" class="template" value="Template opslaan" (click)="saveTemplate()">
        <input type="submit" class="send" value="Mail verzenden" (click)="onSubmit()">
      </div>
    </form>

    <div class="wrapper mailPreview noBorder">
      <h2>Mailvoorbeeld</h2>
        <div class="mail">
          <div class="header">
            <div class="sender"><strong>Van:</strong> {{ auth.getUserDetails()?.id ?? '' | user | async }}</div>
            <div class="receiver"><strong>Aan:</strong> {{mailForm.get('receiver')?.value}}</div>
            <div class="cc" *ngIf="mailForm.get('cc')?.value"><strong>Cc:</strong> {{mailForm.get('cc')?.value}}</div>
            <div class="subject" *ngIf="mailForm.get('subject')?.value"><strong>Onderwerp:</strong> <span
                [innerHTML]="mailForm.get('subject')?.value | mailTemplate | async | safeHtml"></span></div>
          </div>
          <div class="body" [innerHTML]="mailForm.get('body')?.value | newlineToBr | mailTemplate | async | safeHtml"></div>
        </div>
    </div>

    <hr>

    <div class="wrapper mailList noBorder" *ngIf="singleProjectService.projectData$ | async">
      <h2>Verzonden mails</h2>
      <div class="mail" *ngFor="let mail of (singleProjectService.projectData$ | async)?.mails | reverse">
        <div class="header">
          <div class="sender"><strong>Van:</strong> {{ mail.sender | user | async }}</div>
          <div class="receiver"><strong>Aan:</strong> {{mail.receiver}}</div>
          <div class="cc" *ngIf="mail.cc"><strong>Cc:</strong> {{mail.cc}}</div>
          <div class="dateSent"><strong>Datum:</strong> {{ mail.dateSent | formatDate: 'time'}}</div>
          <div class="subject" *ngIf="mail.subject"><strong>Onderwerp:</strong> {{mail.subject}}</div>
        </div>
        <div class="body" [innerHTML]="mail.body | safeHtml"></div>
      </div>
    </div>
  `,
  styleUrls: ['./mail-project.component.scss']
})
export class MailProjectComponent implements OnInit {
  mailForm = this.formBuilder.group({
    _id: [''],
    receiver: ['', [Validators.required]],
    cc: [''],
    subject: [''],
    body: ['']
  });
  projectId: string | null = null;
  submitted: boolean = false
  project: any
  templateBody$: BehaviorSubject<ITemplate> = new BehaviorSubject({
    _id: '', body: '', subject: '', name: ''
  });
  templateSaved$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private formBuilder: FormBuilder,
    public formService: FormService,
    public singleProjectService: SingleProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private toastr: ToastrService,
    public auth: AuthService,
    private mailTemplatePipe: MailTemplatePipe,
  ) { }

  async ngOnInit() {
    try {
      const params = await firstValueFrom(this.route.params);

      if (!params.projectId) {
        throw new Error('no projectId');
      }

      this.projectId = params.projectId;
      this.singleProjectService.setProjectId(params.projectId);

      const mailSubject = `Bevestiging afspraak luchtdichtheidstest op {{street}}`;
      const mailBody = `
              Beste,

              Bij deze de bevestiging van onze afspraak voor de luchtdichtheidstest (via {{company}}) op {{datePlanned}} om +/- {{hourPlanned}}h
              De luchtdichtheidstest neemt ongeveer 1h30 in beslag.

              In principe moeten er voor een bewoonde woning geen voorbereidende werken gebeuren.
              Voor niet bewoonde woningen best zien dat de sifons gevuld zijn met water.
              Het afdichten van de ventilatie, doen wij wel ter plaatse.

              Verder best ook eens nakijken of er een deur- of raamopening is van minder dan 2m40 hoog én minder dan 1m13 breed. Indien dit niet zo is, graag met ons contact opnemen.

              Indien er nog vragen zijn, bel of mail gerust.

              Met vriendelijke groeten/Bien cordialement,
    `.replace(/\n */g, "\n").trim();

      const projectData = await firstValueFrom(this.singleProjectService.projectData$);

      if (!projectData) {
        throw Error('No project data found')
      }

      this.mailForm.setValue({
        _id: projectData._id,
        receiver: projectData.email,
        cc: '',
        subject: mailSubject,
        body: mailBody
      });
    } catch (err: any) {
      this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    }

    this.templateBody$.pipe(untilDestroyed(this)).subscribe(
      {
        next: (template: ITemplate) => {
          if (template.body !== '') {
            this.mailForm.controls['body'].setValue(template.body);
            this.mailForm.controls['subject'].setValue(template.subject);
          }
        },
        error: (error) => this.toastr.error(error, `Error`),
      }
    );
  }


  onSubmit() {
    this.submitted = true;
    if (this.mailForm.invalid) {
      this.toastr.error('Nog niet alle verplichte velden zijn ingevuld.');
      return;
    }

    this.sendMail();
  }

  async sendMail() {

    const formData = new FormData();

    formData.append('_id', this.mailForm.value._id);
    formData.append('receiver', this.mailForm.value.receiver);
    formData.append('cc', this.mailForm.value.cc);
    formData.append('subject', await this.mailTemplatePipe.transform(this.mailForm.value.subject));
    formData.append('body', await this.mailTemplatePipe.transform(this.mailForm.value.body));

    firstValueFrom(this.api.sendMail(formData))
      .then(() => {
        this.toastr.success('Mail sent');
        this.router.navigate(['project', this.projectId]);
      })

  }

  saveTemplate() {
    const name = prompt('Vul de templatenaam in:');
    if (!name) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('subject', this.mailForm.value.subject);
    formData.append('body', this.mailForm.value.body);

    firstValueFrom(this.api.saveMailTemplate(formData))
      .then(() => {
        this.toastr.success('Template saved');
        this.templateSaved$.next('');
      })

  }

  goBack() {
    if (this.mailForm.touched) {
      if (confirm('Ben je zeker dat je de pagina wil verlaten?')) {
        this.router.navigate(['project', this.projectId])
      } else {
        return
      }
    } else {
      this.router.navigate(['project', this.projectId])
    }
  }
}
