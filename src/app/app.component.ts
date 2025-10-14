import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { navigationEndFilter } from './shared/pipes/rxjs_pipes/navigation-end-filter';
import { CartBadgeService } from './core/services/cartBadge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showHeader = true;
  showFooter=true;
  showNavbarPadding=true;
  hideOnRoutes_header = ['/app-login', '/app-register']; // routes where navbar should hide
  showOnRoutes_footer = ['/app-home','/app-about','/app-profile']; // routes where navbarshould hide
  hideOnRoutes_navbarPadding = ['/app-login', '/app-register','/app-home','/app-not-found']; 
  constructor(private router: Router) { }

  ngOnInit() {
    navigationEndFilter(this.router.events)
      .subscribe(event => {
        const navEnd = event as NavigationEnd;
        this.showHeader= !this.hideOnRoutes_header.includes(navEnd.urlAfterRedirects);
        this.showFooter= this.showOnRoutes_footer.includes(navEnd.urlAfterRedirects)
        this.showNavbarPadding = !this.hideOnRoutes_navbarPadding.includes(navEnd.urlAfterRedirects);
      });
  }
}


