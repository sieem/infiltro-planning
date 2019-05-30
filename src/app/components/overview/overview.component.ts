import { Component, OnInit } from '@angular/core';
import { PlanningDataService } from 'src/app/services/planning-data.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  planningData: any = {}

  constructor(private planningDataService:PlanningDataService) { }

  ngOnInit() {
  }

  getPlanningData() {
    this.planningDataService.getPlanningData().subscribe(
      res => this.planningData = res,
      err => console.log(err)
    )
  }

}
