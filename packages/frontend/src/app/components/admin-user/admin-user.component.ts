import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { IUser, emailRegex } from '@infiltro/shared';
import { firstValueFrom, Subscription, switchMap } from 'rxjs';
import { ngFormToFormData } from '../../utils/form.utils';

@Component({
  selector: 'infiltro-admin-user',
  template: `
    <div class="list users">
      <h1>User admin</h1>
      <div class="item heading">
        <div>Naam</div>
        <div>Email</div>
        <div>Bedrijf</div>
        <div>Rol</div>
      </div>
      <div class="item" *ngFor="let user of userService.users$ | async">
        <div>{{user.name}}</div>
        <div>{{user.email}}</div>
        <div>{{ user.company | company | async }}</div>
        <div>{{userService.roleName(user.role)}}</div>
        <div class="icon" (click)="editUser(user)"><img src="assets/images/icon-edit.svg" alt=""></div>
        <div class="icon" *ngIf="user._id !== auth.getUserDetails()?.id" (click)="removeUser(user)"><img src="assets/images/icon-delete.svg" alt=""></div>
      </div>
    </div>

    <form [formGroup]="registerForm" class="wrapper">
      <div class="inputGroup">
        <label for="name">Naam</label>
        <input type="text" name="name" formControlName="name">
        <p *ngIf="formService.checkInputField(registerForm, 'name', submitted)" class="error">!</p>
      </div>
      <div class="inputGroup">
        <label for="email">E-mail</label>
        <input type="email" name="email" formControlName="email">
        <p *ngIf="formService.checkInputField(registerForm, 'email', submitted)" class="error">!</p>
      </div>
      <div class="inputGroup">
        <label for="company">Bedrijf</label>
        <select name="company" formControlName="company">
          <option value="">select company</option>
          <option *ngFor="let company of companyService.companies$ | async" [value]="company._id">{{company.name}}</option>
        </select>
        <p *ngIf="formService.checkInputField(registerForm, 'company', submitted)" class="error">!</p>
      </div>


      <div class="inputGroup">
        <label for="role">Rol</label>
        <select name="role" formControlName="role">
          <option value="">select role</option>
          <option *ngFor="let role of userService.getUserRoles()" [value]="role.type">{{role.name}}</option>
        </select>
        <p *ngIf="formService.checkInputField(registerForm, 'role', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup right submit">
        <input type="submit" value="Annuleer" (click)="cancel()">
        <input type="submit" [value]="editState ? 'Gebruiker aanpassen' : 'Gebruiker toevoegen'" (click)="onSubmit()">
      </div>

    </form>
  `,
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit, OnDestroy {
  registerForm = this.formBuilder.group({
    _id: [''],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    company: ['', Validators.required],
    role: ['', Validators.required],
  });
  submitted = false;
  editState = false;
  $roleSetter: Subscription | undefined;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    public formService: FormService,
    public companyService: CompanyService,
    public userService: UserService,
    public auth: AuthService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.$roleSetter = this.registerForm.get('company')?.valueChanges.pipe(
      switchMap((company) => this.companyService.isClientOf(company ?? '')),
    ).subscribe((isClientOf) => {
      if (isClientOf) {
        this.registerForm.get('role')?.setValue('client');
        this.registerForm.get('role')?.disable();
      } else {
        if (this.registerForm.get('role')?.value === 'client') {
          this.registerForm.get('role')?.setValue('');
        }
        this.registerForm.get('role')?.enable();
      }
    })
  }

  ngOnDestroy(): void {
      this.$roleSetter?.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.toastr.error('Form invalid');
      return;
    }

    this.registerUser()
  }

  registerUser() {

    // add back role because disabled element are not added
    const formData = ngFormToFormData({
      ...this.registerForm.value,
      role: this.registerForm.value.role ?? 'client',
    });

    if (!this.registerForm.value._id) {
      formData.delete('_id');
      firstValueFrom(this.api.addUser(formData))
        .then(() => {
          this.userService.refreshUsers();
          this.registerForm.reset()
          this.toastr.success('User saved', 'Sent mail to user!');
          this.submitted = false;
        })

    } else {
      this.editState = false
      firstValueFrom(this.api.editUser(formData))
        .then(() => {
          this.userService.refreshUsers();
          this.registerForm.reset()
          this.toastr.success('User saved');
          this.submitted = false;
        })

    }


  }

  editUser(user: IUser) {
    this.editState = true

    this.registerForm.setValue({
      _id: user._id || '',
      name: user.name || '',
      email: user.email || '',
      company: user.company || '',
      role: user.role || '',
    })
  }

  cancel() {
    this.editState = false;

    this.registerForm.reset();
  }

  removeUser(user: any) {
    if (confirm(`Are you sure to delete ${user.email}?`)) {
      if (confirm(`Are you really sure you want to delete ${user.email}???`)) {
        firstValueFrom(this.api.removeUser(user._id))
          .then(() => this.userService.refreshUsers())

      }
    }
  }
}
