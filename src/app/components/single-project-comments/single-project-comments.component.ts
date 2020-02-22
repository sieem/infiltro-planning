import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { FormService } from 'src/app/services/form.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-single-project-comments',
  templateUrl: './single-project-comments.component.html',
  styleUrls: ['./single-project-comments.component.scss']
})
export class SingleProjectCommentsComponent implements OnInit {

  _projectId: string;
  @Input('newProject') newProject: boolean;
  @Input() set projectId(projectId: string) {
    this._projectId = (projectId && projectId.trim());
    if (this._projectId) this.getComments(this._projectId)
  }

  _comments: any;
  @Input() set comments(comments: any) {
    this._comments = comments.reverse();
  }

  commentForm: FormGroup;
  submitted = false;
  editState = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public formService: FormService,
    private toastr: ToastrService,
    public userService: UserService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
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
        console.log(res)
        this.comments = res
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  onSubmit() {
    this.submitted = true;

    if (this.commentForm.invalid) {
      this.toastr.error('Lege opmerking');
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

    this.api.saveComment(this._projectId, formData).subscribe(
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
      this.api.removeComment(this._projectId, comment._id).subscribe(
        (res: any) => this.comments = res,
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    }
  }

  commentModified(comment: any) {
    return comment.createdDateTime !== comment.modifiedDateTime
  }
}
