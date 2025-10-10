import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private router = inject(Router)
  videoError = false;
  isLoading = true;

  onVideoLoaded() {
    this.isLoading = false;

    // Fade video in
    const video = document.querySelector('video');
    if (video) {
      video.muted = true;    // inline muted work aakunnilla. So i created this
      video.classList.remove('opacity-0');
      video.classList.add('opacity-100');
    }

  }
}
