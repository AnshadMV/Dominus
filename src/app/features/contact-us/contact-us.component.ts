import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  activeTab: string = 'general';
  private route= inject(Router)

  showTab(tab: string) {
    this.activeTab = tab;
  }
}
