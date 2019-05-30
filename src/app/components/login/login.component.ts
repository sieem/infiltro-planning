import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formData: any = {}

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    this.api.loginUser(this.formData)
      .subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token)
          this.router.navigate(['/overview'])

        },
        err => console.log(err)
      )
  }
}
