import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  planningData: any = []

  constructor(private api:ApiService, private auth:AuthService) { }

  ngOnInit() {
    this.getPlanningData()
  }

  getPlanningData() {
    console.log(this.auth.userDetails)
    this.api.getPlanningData().subscribe(
      res => this.planningData = res,
      err => console.log(err)
    )
  }

}
