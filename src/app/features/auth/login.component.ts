import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;
  isRegisterMode: boolean = false;

  // Registro
  regEmail: string = '';
  regPassword: string = '';
  firstName: string = '';
  secondName: string = '';
  country: string = '';
  phoneNumber: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Por favor ingresa email y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (ok) => {
        if (ok) {
          this.router.navigate(['/configuraciones-registradas']);
        } else {
          this.error = 'Credenciales incorrectas';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error de autenticación';
        this.loading = false;
      }
    });
  }

  forgotPassword() {
    // Placeholder para funcionalidad futura
    alert('Funcionalidad no implementada aún');
  }

  toggleRegister(event?: Event) {
    event?.preventDefault();
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
    this.loading = false;
  }

  onRegister() {
    if (!this.regEmail || !this.regPassword || !this.firstName) {
      this.error = 'Completa email, contraseña y nombre';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register({
      email: this.regEmail,
      password: this.regPassword,
      personRegisterDto: {
        firstName: this.firstName,
        secondName: this.secondName,
        country: this.country,
        phoneNumber: this.phoneNumber
      }
    }).subscribe({
      next: (ok) => {
        if (ok) {
          this.email = this.regEmail;
          this.password = this.regPassword;
          this.onSubmit();
        } else {
          this.error = 'No se pudo registrar';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Error al registrar';
        this.loading = false;
      }
    });
  }
}