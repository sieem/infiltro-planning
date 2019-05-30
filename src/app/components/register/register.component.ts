import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formData: any = {}

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  registerUser() {
    console.log(this)
    this.auth.registerUser(this.formData)
    .subscribe(
      (res:any) => {
        localStorage.setItem('token', res.token)
        this.router.navigate([''])
        
      },
      err => console.log(err)
    )
  }

}
