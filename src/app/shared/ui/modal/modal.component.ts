import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ModalType = 'success' | 'delete' | 'warning' | 'info';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() visible = false;
  @Input() type: ModalType = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancel = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.close.emit();
  }

  onCancel() {
    this.cancel.emit();
    this.close.emit();
  }

  onBackdropClick() {
    this.close.emit();
  }

  get icon(): string {
    switch (this.type) {
      case 'success': return '✓';
      case 'delete': return '🗑';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  }
}