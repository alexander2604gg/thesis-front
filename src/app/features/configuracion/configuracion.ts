import { Component, OnInit } from '@angular/core';
import { Navbar } from "../../core/layout/navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfiguracionService } from './configuracion.service';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-configuracion',
  imports: [Navbar, FormsModule, CommonModule, ModalComponent],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
  standalone: true
})
export class Configuracion implements OnInit {

  config = {
    subreddit: '',
    startDate: '',
    endDate: '',
    interval: 1
  };

  cargando = false;
  fechasInvalidas = false;
  intervalInvalido = false;
  errores = {
    subreddit: false
  };

  modal = {
    visible: false,
    type: 'info' as 'success' | 'delete' | 'warning' | 'info',
    title: '',
    message: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    showCancel: false
  };

  constructor(
    private configuracionService: ConfiguracionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicializar fechas con valores por defecto
    const hoy = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoy.getDate() + 7);
    
    this.config.startDate = this.formatearFecha(hoy);
    this.config.endDate = this.formatearFecha(proximaSemana);
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  validarCampos() {
    this.errores.subreddit = !this.config.subreddit || this.config.subreddit.trim() === '';
  }

  validarFechas() {
    if (this.config.startDate && this.config.endDate) {
      const inicio = new Date(this.config.startDate);
      const fin = new Date(this.config.endDate);
      this.fechasInvalidas = inicio >= fin;
    } else {
      this.fechasInvalidas = !this.config.startDate || !this.config.endDate;
    }
  }

  validarIntervalo() {
    this.intervalInvalido = !this.config.interval || this.config.interval < 1 || isNaN(this.config.interval);
  }

  guardarConfiguracion() {
    // Validar todos los campos antes de enviar
    this.validarCampos();
    this.validarFechas();
    this.validarIntervalo();
    
    if (this.errores.subreddit || this.fechasInvalidas || this.intervalInvalido) {
      return;
    }

    this.cargando = true;

    this.configuracionService.guardarConfiguracion(this.config)
      .subscribe({
        next: (response: string) => {
          this.cargando = false;
          this.mostrarModal('success', 'Registro exitoso', 'Configuración guardada con éxito');
        },
        error: (err: any) => {
          this.cargando = false;
          const mensaje = this.extraerMensajeError(err);
          this.mostrarModal('warning', 'Error', 'Error al guardar configuración: ' + mensaje);
        }
      });
  }

  volver() {
    this.router.navigate(['/configuraciones-registradas']);
  }

  mostrarModal(
    type: 'success' | 'delete' | 'warning' | 'info',
    title: string,
    message: string,
    showCancel = false,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar'
  ) {
    this.modal.type = type;
    this.modal.title = title;
    this.modal.message = message;
    this.modal.showCancel = showCancel;
    this.modal.confirmText = confirmText;
    this.modal.cancelText = cancelText;
    this.modal.visible = true;
  }

  onModalConfirm() {
    this.modal.visible = false;
  }

  onModalCancel() {
    this.modal.visible = false;
  }

  onModalClose() {
    this.modal.visible = false;
  }

  private extraerMensajeError(err: any): string {
    const porDefecto = 'Ocurrió un error';
    if (!err) return porDefecto;
    const e = err.error;
    if (typeof e === 'string') {
      try {
        const obj = JSON.parse(e);
        return obj?.message || porDefecto;
      } catch {
        return e;
      }
    }
    if (e && typeof e === 'object' && 'message' in e) {
      return (e as any).message || porDefecto;
    }
    return err.message || porDefecto;
  }
}

