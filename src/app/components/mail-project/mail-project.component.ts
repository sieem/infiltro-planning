import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mail-project',
  templateUrl: './mail-project.component.html',
  styleUrls: ['./mail-project.component.scss']
})
export class MailProjectComponent implements OnInit {
  @Input() project: any;

  constructor() { }

  ngOnInit() {
    console.log(this.project)
  }

}
