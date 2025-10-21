import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  showSecondAnnouncement: boolean = true;
  countdownTime: string = '24:00:00';
  private countdownInterval: any;

  @Output() visibilityChange = new EventEmitter<boolean>();

  ngOnInit() {
    this.startCountdown();
    this.emitVisibility(); // Emit initial visibility state
  }

  ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }

  startCountdown() {
    let hours = 24, minutes = 0, seconds = 0;

    this.countdownInterval = setInterval(() => {
      if (--seconds < 0) {
        seconds = 59;
        if (--minutes < 0) {
          minutes = 59;
          if (--hours < 0) {
            hours = minutes = seconds = 0;
            clearInterval(this.countdownInterval);
          }
        }
      }

      this.countdownTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  closeAnnouncement() {
    this.showSecondAnnouncement = false;
    this.emitVisibility();
  }

  private emitVisibility() {
    this.visibilityChange.emit(this.showSecondAnnouncement);
  }
}
