import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { IProject } from '../interfaces/project.interface';
import { BehaviorSubject, Observable, shareReplay, switchMap, firstValueFrom, Subject, tap, combineLatest, of } from 'rxjs';
import { mapToForm } from '../utils/mapSingleProjectToForm.util';
import { dateFormat, emailRegex, postalCodeRegex } from '../utils/regex.util';
import { ngFormToFormData } from '../utils/form.utils';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectService {
  projectId$ = new BehaviorSubject<string | null>(null);
  newProject$ = new BehaviorSubject<boolean>(false);

  projectForm!: FormGroup
  projectIsSaving = false;
  projectEditStates: any = {}
  projectSaved$ = new Subject<void>();
  projectData$: Observable<IProject | null> = combineLatest([this.projectId$, this.newProject$]).pipe(
    switchMap(([projectId, newProject]) => !projectId || !!newProject
      ? of(null)
      : this.api.getProject(projectId as string)
    ),
    shareReplay({ refCount: false, bufferSize: 1 }),
    tap((projectData) => this.fillInProject(projectData)),
  );
  submitted = false
  user = this.auth.getUserDetails();
  mailModalOpened = false
  hasCalendarItem = false
  archiveActive = false

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
  ) { }

  private initProject() {
    if (!this.user) {
      throw Error('no user found in token');
    }
    this.projectForm = this.formBuilder.group({
      _id: [''],

      company: [this.user.company, Validators.required],
      dateCreated: [moment().format(dateFormat), Validators.required],
      projectType: ['house', Validators.required],
      houseAmount: [1, Validators.required],
      projectName: ['', Validators.required],
      client: [''],

      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(postalCodeRegex)]],
      extraInfoAddress: [''],

      name: [''],
      tel: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(emailRegex)]],
      extraInfoContact: [''],
      EpbReporter: [this.user.id, Validators.required],

      ATest: [''],
      v50Value: [''],
      protectedVolume: [''],
      EpbNumber: [''],

      executor: [''],
      datePlanned: [''],
      hourPlanned: [''],
      status: ['toPlan'],
      dateActive: ['Nog niet actief'],
    })

    this.setEditState(false);

    this.hasCalendarItem = false;
  }

  private fillInProject(project: IProject | null) {
    if (!!project) {
      this.fillInFormGroup(project);
      this.setEditState(false);
    } else {
      this.initProject();
      this.setEditState(true);
    }
  }

  setProjectId(projectId: string): void {
    this.projectId$.next(projectId);
  }

  fillInFormGroup(formData: IProject) {
    this.projectForm.setValue(mapToForm(formData))

    this.hasCalendarItem = (formData.eventId && formData.calendarId) ? true : false
  }

  saveProject() {
    this.projectIsSaving = true;

    const formData = ngFormToFormData(this.projectForm.value);

    firstValueFrom(this.api.saveProject(formData))
      .then((res: any) => {
        const projectId = res._id;
        this.projectSaved$.next();

        this.newProject$.next(false);
        this.toastr.success('Project succesvol opgeslagen');
        Object.keys(this.projectForm.controls).forEach(key => {
          this.projectEditStates[key] = false
        })

        // reset and refill form so the form isn't touched anymore
        this.projectForm.reset()
        let formDataAsObj: any = {}
        formData.forEach((el: any, key: string) => formDataAsObj = { ...formDataAsObj, [key]: res[key] })
        formDataAsObj.datePlanned = formDataAsObj.datePlanned || 'Invalid Date'
        this.fillInFormGroup(formDataAsObj);
        this.projectIsSaving = false;
        this.hasCalendarItem = (res.eventId && res.calendarId) ? true : false
        this.router.navigate(['project', projectId])
      })
      .catch((err) => {
        this.projectIsSaving = false;
        this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      })
  }

  private setEditState(state: boolean): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      this.projectEditStates[key] = state;
    })
  }
}
