import { Component, OnInit, OnDestroy } from '@angular/core';
import { Toast } from 'src/app/core/models/toast.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe(toasts => {
      this.toasts = toasts;

      // Initialize a timer for each toast
      this.toasts.forEach(toast => {
        if (toast.duration) {
          toast.progress = 100; // Start with 100% progress
          const interval = setInterval(() => {
            if (toast.progress > 0) {
              toast.progress -= 1; // Decrease the progress by 1% each interval
            } else {
              clearInterval(interval); // Stop the timer when the progress reaches 0
              this.remove(toast.id); // Optionally remove toast when time is up
            }
          }, toast.duration / 100); // duration is the total time (in ms) for the progress bar to go from 100% to 0%
        }
      });
    });
  }
  remove(id: number) {
    this.toastService.remove(id);
  }
  ngOnDestroy(): void {
    // Cleanup any ongoing intervals
    this.toasts.forEach(toast => {
      clearInterval(toast.interval);
    });
  }
}
