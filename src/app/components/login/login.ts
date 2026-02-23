import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  username = '';
  password = '';
  error = '';

  constructor(private http: HttpClient,
              private router: Router) {}

  login() {

    this.http.post<any>(
      'https://localhost:7164/api/auth/login',
      {
        username: this.username,
        password: this.password
      }
    ).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/weather']);
      },
      error: () => {
        this.error = 'Invalid credentials';
      },
    
    });
    
  }
    loginWithGoogle(): void {
  window.location.href = 'https://localhost:7164/api/auth/google-login';
}
}