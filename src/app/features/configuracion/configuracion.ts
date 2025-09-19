import { Component, OnInit } from '@angular/core';
import { Navbar } from "../../core/layout/navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfiguracionService } from './configuracion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  imports: [Navbar, FormsModule, CommonModule],
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
          alert('Configuración guardada con éxito');
        },
        error: (err: any) => {
          this.cargando = false;
          alert('Error al guardar configuración: ' + err.message);
        }
      });
  }

  volver() {
    this.router.navigate(['/configuraciones-registradas']);
  }
}

