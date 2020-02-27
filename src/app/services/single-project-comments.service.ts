import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';
import { FormService } from './form.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectCommentsService {

  projectId: string;

  commentForm: FormGroup;
  submitted = false;
  editState = false;
  comments: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public formService: FormService,
    private toastr: ToastrService,
    public userService: UserService,
    private auth: AuthService,
  ) { }

  initForm() {
    this.commentForm = this.formBuilder.group({
      _id: [],
      content: ['', Validators.required],
      user: [this.auth.getUserDetails().id],
      createdDateTime: [],
      modifiedDateTime: [],
    })
  }

  getComments(projectId) {
    this.api.getComments(projectId).subscribe(
      res => {
        this.comments = res
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
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

    this.api.saveComment(this.projectId, formData).subscribe(
      (res: any) => {
        this.comments = res
        this.commentForm.reset()
        this.commentForm.controls.user.setValue(this.auth.getUserDetails().id)
        this.toastr.success('Opmerking opgeslagen');
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  editComment(comment) {
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
      this.api.removeComment(this.projectId, comment._id).subscribe(
        (res: any) => this.comments = res,
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    }
  }
}
