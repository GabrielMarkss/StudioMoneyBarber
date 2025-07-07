import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = 'http://192.168.100.183:8080/api/usuarios';

  nomeUsuario: string = '';
  private usuarioLogado: {
    nome: string;
    email: string;
    admin: boolean;
  } | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  login(payload: {
    identificador: string;
    senha: string;
    permanecerConectado: boolean;
  }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.api}/login`, payload).pipe(
      tap((response) => {
        const token = response.token;

        if (payload.permanecerConectado) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        this.getUsuarioLogado().subscribe({
          next: (user) => {
            this.nomeUsuario = user.nome;
            this.usuarioLogado = user;
          },
          error: () => {
            this.nomeUsuario = '';
            this.usuarioLogado = null;
          },
        });
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(usuario: any): Observable<string> {
    return this.http.post(`${this.api}/register`, usuario, {
      responseType: 'text',
    });
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.usuarioLogado = null;
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getUsuarioLogado(): Observable<{
    nome: string;
    email: string;
    admin: boolean;
  }> {
    const token = this.getToken();
    if (!token) return of({ nome: '', email: '', admin: false });

    return this.http
      .get<{ nome: string; email: string; admin: boolean }>(`${this.api}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap((user) => {
          this.usuarioLogado = user;
        })
      );
  }

  usuarioEhAdmin(): boolean {
    return this.usuarioLogado?.admin === true;
  }

  loadUsuarioLogado(): void {
    const token = this.getToken();
    if (token && !this.usuarioLogado) {
      this.getUsuarioLogado().subscribe({
        next: (user) => {
          this.nomeUsuario = user.nome;
          this.usuarioLogado = user;
        },
        error: () => {
          this.nomeUsuario = '';
          this.usuarioLogado = null;
        },
      });
    }
  }

}
