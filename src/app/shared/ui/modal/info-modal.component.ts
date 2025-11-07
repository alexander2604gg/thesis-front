import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <app-modal
      [visible]="visible"
      [type]="'info'"
      [title]="title"
      [message]="message"
      [confirmText]="confirmText"
      [cancelText]="cancelText"
      [showCancel]="showCancel"
      (confirm)="confirm.emit()"
      (cancel)="cancel.emit()"
      (close)="close.emit()"
    />
  `
})
export class InfoModalComponent {
  @Input() visible = false;
  @Input() title = 'Información';
  @Input() message = '';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancel = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}