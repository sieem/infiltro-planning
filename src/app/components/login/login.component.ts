import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formData: any = {}

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  loginUser() {
    console.log(this)
    this.auth.loginUser(this.formData)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      )
  }
}
