import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <app-modal
      [visible]="visible"
      [type]="'success'"
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
export class SuccessModalComponent {
  @Input() visible = false;
  @Input() title = 'Operación exitosa';
  @Input() message = '';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancel = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}