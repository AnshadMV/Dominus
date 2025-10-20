import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  showFirstAnnouncement: boolean = true;
  showSecondAnnouncement: boolean = true;
  countdownTime: string = '24:00:00';
  private countdownInterval: any;

  @Output() visibilityChange = new EventEmitter<boolean>();

  ngOnInit() {
    this.startCountdown();
    this.emitVisibility(); // Emit initial state
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    // Example countdown logic
    let hours = 24;
    let minutes = 0;
    let seconds = 0;

    this.countdownInterval = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) {
            hours = 0;
            minutes = 0;
            seconds = 0;
            clearInterval(this.countdownInterval);
          }
        }
      }
      
      this.countdownTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  closeFirstAnnouncement() {
    this.showFirstAnnouncement = false; 
    this.showSecondAnnouncement = false;
    this.emitVisibility(); // Emit state after closing
  }

  closeSecondAnnouncement() {
    this.showSecondAnnouncement = false;
    this.emitVisibility(); // Emit state after closing
  }

  private emitVisibility() {
    const isVisible = this.showFirstAnnouncement || this.showSecondAnnouncement;
    this.visibilityChange.emit(isVisible);
  }
}