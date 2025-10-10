import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { navigationEndFilter } from './shared/pipes/rxjs_pipes/navigation-end-filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showHeaderFooter = true;
  hideOnRoutes = ['/app-login', '/app-register']; // routes where navbar/footer should hide

  constructor(private router: Router) { }

  ngOnInit() {
    navigationEndFilter(this.router.events)
      .subscribe(event => {
        const navEnd = event as NavigationEnd;
        this.showHeaderFooter = !this.hideOnRoutes.includes(navEnd.urlAfterRedirects);
      });
  }
}


