import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-mail-project',
  templateUrl: './mail-project.component.html',
  styleUrls: ['./mail-project.component.scss']
})
export class MailProjectComponent implements OnInit {
  mailForm: FormGroup
  projectId: string
  submitted: boolean = false
  project: any

  constructor(
    private formBuilder: FormBuilder,
    public formService: FormService,
    public singleProjectService: SingleProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private toastr: ToastrService,
    public auth: AuthService
    ) { }

  async ngOnInit() {
    try {
      this.mailForm = this.formBuilder.group({
        _id: [''],
        reciever: ['', [Validators.required]],
        cc: [''],
        subject: [''],
        body: ['']
      })

      const params = await this.route.params.pipe(first()).toPromise();

      if (!params.projectId) {
        return;
      }

      this.projectId = params.projectId;

      await this.singleProjectService.setProjectData(this.projectId);

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


      this.mailForm.setValue({
        _id: this.singleProjectService.projectData._id,
        reciever: this.singleProjectService.projectData.email,
        cc: '',
        subject: mailSubject,
        body: mailBody
      });
    } catch (error) {
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    }
  }


  onSubmit() {
    this.submitted = true;
    if (this.mailForm.invalid) {
      this.toastr.error('Nog niet alle verplichte velden zijn ingevuld.');
      return;
    }

    this.sendMail();
  }

  sendMail() {

    const formData = new FormData();

    formData.append('_id', this.mailForm.value._id)
    formData.append('to', this.mailForm.value.to)
    formData.append('cc', this.mailForm.value.cc)
    formData.append('subject', this.mailForm.value.subject)
    formData.append('body', this.mailForm.value.body)

    this.api.sendMail(formData).subscribe(
      (res: any) => {
        this.toastr.success('Mail sent');
        this.router.navigate(['/project/' + this.projectId])
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  goBack() {
    if (this.mailForm.touched) {
      if (confirm('Ben je zeker dat je de pagina wil verlaten?')) {
        this.router.navigate(['/project/' + this.projectId])
      } else {
        return
      }
    } else {
      this.router.navigate(['/project/' + this.projectId])
    }
  }

}
