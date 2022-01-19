import { Component } from '@angular/core';
import { Router, NavigationStart, Scroll } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  projectsPageActive: boolean = false
  projectPageScrollPos: number = 0

  constructor(private router: Router) {
    this.router.events.subscribe(async (ev) => {
      if (ev instanceof Scroll) {
        if (ev.routerEvent.url == '/projecten') {
          await this.delay(250)
          window.scrollTo({ top: this.projectPageScrollPos })
        }
      }
      if (ev instanceof NavigationStart) {
        if (this.projectsPageActive) {
          this.projectPageScrollPos = window.scrollY
        }

        this.projectsPageActive = (ev.url == '/projecten')
       }
    })
  }

  delay(milliseconds: number) {
    return new Promise((resolve) => setTimeout(() => resolve(true), milliseconds))
  }
}
