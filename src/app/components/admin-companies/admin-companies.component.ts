import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ICompany } from '../../interfaces/company.interface';
import { emailRegex } from 'src/app/utils/regex.util';
import { ngFormToFormData } from '../../utils/form.utils';

@Component({
  selector: 'app-admin-companies',
  template: `
    <div class="list companies">
      <h1>Company admin</h1>
      <div class="item" *ngFor="let company of companyService.companies$ | async">
        <div>{{company.name}}</div>
        <div>{{company.email}}</div>
        <div>
          <ng-container *ngIf="company.pricePageVisible">
            Staffel zichtbaar
          </ng-container>
        </div>
        <div class="icon" (click)="editCompany(company)"><img src="assets/images/icon-edit.svg" alt=""></div>
        <div class="icon" *ngIf="company._id !== auth.getUserDetails().company" (click)="removeCompany(company)"><img src="assets/images/icon-delete.svg" alt=""></div>
      </div>
    </div>


    <form [formGroup]="companyForm" class="wrapper">
      <div class="inputGroup">
        <label for="name">Bedrijfsnaam</label>
        <input type="text" name="name" formControlName="name">
        <p *ngIf="formService.checkInputField(companyForm, 'name', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup">
        <label for="email">Emailadres</label>
        <input type="email" name="email" formControlName="email">
        <p *ngIf="formService.checkInputField(companyForm, 'email', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup">
        <label for="pricePageVisible">Staffel pagina zichtbaar</label>
        <input type="checkbox" name="pricePageVisible" formControlName="pricePageVisible">
        <p *ngIf="formService.checkInputField(companyForm, 'pricePageVisible', submitted)" class="error">!</p>
      </div>


      <div class="inputGroup right submit">
        <input type="submit" value="Annuleer" (click)="cancel()">
        <input type="submit" [value]="editState ? 'Bedrijf aanpassen' : 'Bedrijf toevoegen'" (click)="onSubmit()">
      </div>

    </form>
  `,
  styleUrls: ['./admin-companies.component.scss']
})
export class AdminCompaniesComponent {
  companyForm: FormGroup = this.formBuilder.group({
    _id: [''],
    name: ['', Validators.required],
    pricePageVisible: [''],
    email: ['', [Validators.required, Validators.email, Validators.pattern(emailRegex)]],
  })
  submitted = false
  editState = false

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public auth: AuthService,
    public formService: FormService,
    public companyService: CompanyService,
    private toastr: ToastrService) { }

  onSubmit() {
    this.submitted = true

    if (this.companyForm.invalid) {
      this.toastr.error('Form invalid');
      return;
    }

    this.saveCompany()
  }

  saveCompany() {
    const formData = ngFormToFormData(this.companyForm.value);

    firstValueFrom(this.api.saveCompany(formData))
      .then(() => {
        this.companyService.refreshCompanies();

        this.companyForm.reset();
        this.editState = false;
        this.submitted = false;
        this.toastr.success('Company saved');
      })
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
  }

  editCompany(company: ICompany) {
    this.editState = true

    this.companyForm.setValue({
      _id: company._id || "",
      name: company.name || "",
      email: company.email || "",
      pricePageVisible: company.pricePageVisible || "",
    });
  }

  cancel() {
    this.editState = false;

    this.companyForm.setValue({
      _id: '',
      name: '',
      email: '',
      pricePageVisible: '',
    })
  }

  removeCompany(company: ICompany) {
    if (confirm(`Are you sure to delete ${company.name}?`)) {
      firstValueFrom(this.api.removeCompany(company._id))
        .then(() => this.companyService.refreshCompanies())
        .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`))
    }
  }
}
