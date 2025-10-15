import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() color: 'blue' | 'gray' | 'red' | 'green' = 'blue';
  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<void>();
}
