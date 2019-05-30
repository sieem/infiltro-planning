import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formData: any = {}

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  registerUser() {
    console.log(this)
    this.auth.registerUser(this.formData)
    .subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

}
