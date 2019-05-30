import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formData: any = {}

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  loginUser() {
    this.api.loginUser(this.formData)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      )
  }
}
