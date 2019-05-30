import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formData: any = {}

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  registerUser() {
    console.log(this)
    this.api.registerUser(this.formData)
    .subscribe(
      (res:any) => {
        localStorage.setItem('token', res.token)
        this.router.navigate(['/overview'])
        
      },
      err => console.log(err)
    )
  }

}
