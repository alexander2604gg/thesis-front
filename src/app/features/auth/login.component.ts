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

    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(['/configuraciones-registradas']);
    } else {
      this.error = 'Credenciales incorrectas';
      this.loading = false;
    }
  }

  forgotPassword() {
    // Placeholder para funcionalidad futura
    alert('Funcionalidad no implementada aún');
  }
}