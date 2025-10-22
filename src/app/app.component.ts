// Modified app.component.ts with AuthService injection for polling initialization
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { navigationEndFilter } from './shared/pipes/rxjs_pipes/navigation-end-filter';
import { AuthService } from './core/services/auth.service';  // Add this import

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showHeader = true;
  showFooter = true;
  showNavbarPadding = true;
  showTopNavbar = true; // Add this property

  hideOnRoutes_header = ['/app-login', '/app-register', '/admin', '', '**']; // routes where navbar should hide
  showOnRoutes_footer = ['/app-home', '/app-about', '/app-profile', '/admin',]; // routes where navbarshould hide
  hideOnRoutes_navbarPadding = ['/app-login', '/app-register', '/app-home', '/app-not-found'];
  
  constructor(private router: Router, private authService: AuthService) {  // Inject AuthService here to ensure polling starts
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        
        // Hide header on login page
        if (currentRoute.includes('/app-login')) {
          this.showHeader = false;
          this.showFooter = false;
        } else {
          this.showHeader = true;
          this.showFooter = true;
        }
      }
    }); 
  }

  ngOnInit() {
    navigationEndFilter(this.router.events)
      .subscribe(event => {
        const navEnd = event as NavigationEnd;
        // Extract base route without query parameters
        const baseRoute = navEnd.urlAfterRedirects.split('?')[0];
        // Hide header/footer for admin routes
        const isAdminRoute = baseRoute.startsWith('/admin');

        this.showHeader = !this.hideOnRoutes_header.includes(baseRoute) && !isAdminRoute;
        this.showFooter = this.showOnRoutes_footer.includes(baseRoute) && !isAdminRoute;
        this.showNavbarPadding = !this.hideOnRoutes_navbarPadding.includes(baseRoute) && !isAdminRoute;
      });
  } // Add this method to handle top navbar visibility changes
  onTopNavbarVisibilityChange(visible: boolean) {
    this.showTopNavbar = visible;
  }
}