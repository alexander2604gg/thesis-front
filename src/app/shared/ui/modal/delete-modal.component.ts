import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <app-modal
      [visible]="visible"
      [type]="'delete'"
      [title]="title"
      [message]="message"
      [confirmText]="confirmText"
      [cancelText]="cancelText"
      [showCancel]="true"
      (confirm)="confirm.emit()"
      (cancel)="cancel.emit()"
      (close)="close.emit()"
    />
  `
})
export class DeleteModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirmar eliminación';
  @Input() message = '¿Deseas eliminar este elemento?';
  @Input() confirmText = 'Eliminar';
  @Input() cancelText = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}