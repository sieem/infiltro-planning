import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { IComment } from '../interfaces/comments.interface';
import { BehaviorSubject, firstValueFrom, Observable, shareReplay, switchMap, combineLatest, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { SingleProjectService } from './single-project.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class SingleProjectCommentsService {

  commentForm = this.formBuilder.group({
    _id: [],
    content: ['', Validators.required],
    user: [this.auth.getUserDetails()?.id],
    createdDateTime: [],
    modifiedDateTime: [],
  });
  submitted = false;
  editState = false;
  private commentsSubject$ = new BehaviorSubject<IComment[] | null>(null);
  comments$: Observable<IComment[]> = combineLatest([this.singleProjectService.projectId$, this.commentsSubject$]).pipe(
    switchMap(([projectId, comments]) => {
      if (comments) {
        return of(comments);
      }

      if (projectId) {
        return this.api.getComments(projectId);
      }

      return of([]);
    }),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService,
    private auth: AuthService,
    private singleProjectService: SingleProjectService,
  ) {
    this.singleProjectService.projectSaved$.pipe(untilDestroyed(this)).subscribe(() => {
      this.onSubmit();
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.commentForm.invalid) {
      return;
    }

    this.addComment()
  }

  addComment() {
    const formData = new FormData();
    formData.append('_id', this.commentForm.value._id || '')
    formData.append('user', this.commentForm.value.user)
    formData.append('createdDateTime', this.commentForm.value.createdDateTime || '')
    formData.append('modifiedDateTime', this.commentForm.value.modifiedDateTime || '')
    formData.append('content', this.commentForm.value.content)

    if (!this.singleProjectService.projectId$.value) {
      throw Error(`Can't save comment, no project id`);
    }

    firstValueFrom(this.api.saveComment(this.singleProjectService.projectId$.value, formData))
      .then((res) => {
        this.refreshComments(res)
        this.commentForm.reset()
        this.commentForm.controls.user.setValue(this.auth.getUserDetails()?.id)
        this.toastr.success('Opmerking opgeslagen');
      })

  }

  editComment(comment: IComment) {
    this.editState = true

    this.commentForm.setValue({
      _id: comment._id || "",
      content: comment.content || "",
      user: comment.user || "",
      createdDateTime: comment.createdDateTime || "",
      modifiedDateTime: comment.modifiedDateTime || ""
    })
  }

  removeComment(comment: any) {
    if (confirm(`Zeker dat je deze opmerking wilt verwijderen?`)) {
      if (!this.singleProjectService.projectId$.value) {
        throw Error(`Can't save comment, no project id`);
      }

      firstValueFrom(this.api.removeComment(this.singleProjectService.projectId$.value, comment._id))
        .then((res) => this.refreshComments(res))

    }
  }

  destroyComments() {
    this.commentsSubject$.next(null)
  }

  private refreshComments(comments: IComment[]) {
    this.commentsSubject$.next(comments)
  }
}
