import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormService } from './form.service';
import { IProject } from '../interfaces/project.interface';
import { BehaviorSubject, Observable, shareReplay, switchMap, firstValueFrom, Subject, tap } from 'rxjs';
import { mapToForm } from '../helpers/mapToForm.helper';
import { dateFormat, emailRegex, postalCodeRegex } from '../helpers/regex.helper';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectService {
  projectId$ = new BehaviorSubject<string | null>(null);

  projectForm!: FormGroup
  projectIsSaving: boolean = false;
  projectEditStates: any = {}
  projectSaved$ = new Subject<void>();
  projectData$: Observable<IProject> = this.projectId$.pipe(
    switchMap((projectId) => this.api.getProject(projectId as string)),
    tap((projectData) => this.fillInProject(projectData)),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );
  submitted = false
  user: any
  mailModalOpened: boolean = false
  hasCalendarItem: boolean = false
  newProject: boolean = true
  archiveActive: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private formService: FormService,
    private auth: AuthService,
    private toastr: ToastrService,
  ) { }

  initProject() {
    this.user = this.auth.getUserDetails()

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

  fillInProject(project: IProject) {
    this.setEditState(false);
    this.fillInFormGroup(project);
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

    const formData = new FormData();

    formData.append('_id', this.projectForm.value._id)
    formData.append('company', this.projectForm.value.company)
    formData.append('dateCreated', this.projectForm.value.dateCreated)
    formData.append('projectType', this.projectForm.value.projectType)
    formData.append('houseAmount', this.projectForm.value.houseAmount)
    formData.append('projectName', this.projectForm.value.projectName)
    formData.append('client', this.projectForm.value.client)
    formData.append('street', this.projectForm.value.street)
    formData.append('city', this.projectForm.value.city)
    formData.append('postalCode', this.projectForm.value.postalCode)
    formData.append('extraInfoAddress', this.projectForm.value.extraInfoAddress)
    formData.append('name', this.projectForm.value.name)
    formData.append('tel', this.projectForm.value.tel)
    formData.append('email', this.projectForm.value.email)
    formData.append('extraInfoContact', this.projectForm.value.extraInfoContact)
    formData.append('EpbReporter', this.projectForm.value.EpbReporter)
    formData.append('ATest', this.projectForm.value.ATest)
    formData.append('v50Value', this.projectForm.value.v50Value)
    formData.append('protectedVolume', this.projectForm.value.protectedVolume)
    formData.append('EpbNumber', this.projectForm.value.EpbNumber)
    formData.append('executor', this.projectForm.value.executor)
    formData.append('datePlanned', this.projectForm.value.datePlanned)
    formData.append('hourPlanned', this.projectForm.value.hourPlanned)
    formData.append('status', this.projectForm.value.status)
    formData.append('dateActive', this.projectForm.value.dateActive)

    firstValueFrom(this.api.saveProject(formData))
      .then((res: any) => {
        const projectId = res._id;
        this.projectSaved$.next();

        this.newProject = false
        this.toastr.success('Project succesvol opgeslagen');
        Object.keys(this.projectForm.controls).forEach(key => {
          this.projectEditStates[key] = false
        })

        // reset and refill form so the form isn't touched anymore
        this.projectForm.reset()
        let formDataAsObj: any = {}
        formData.forEach((el, key) => formDataAsObj = { ...formDataAsObj, [key]: res[key] })
        formDataAsObj.datePlanned = formDataAsObj.datePlanned || 'Invalid Date'
        this.fillInFormGroup(formDataAsObj);
        this.projectIsSaving = false;
        this.hasCalendarItem = (res.eventId && res.calendarId) ? true : false
        this.router.navigate(['/project/' + projectId])
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
