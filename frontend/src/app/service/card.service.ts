import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card } from '../models/card-servico.model';
import { Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({ providedIn: 'root' })
export class CardService {
    private apiUrl = `http://${window.location.hostname}:8080/api/cards`;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  listar(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  criar(descricao: string, imagem?: File | null): Observable<Card> {
    const formData = new FormData();
    formData.append('descricao', descricao);
    if (imagem) {
      formData.append('imagem', imagem);
    }

    const headers = new HttpHeaders({
      'X-Admin': this.usuarioService.usuarioEhAdmin().toString(),
    });

    return this.http.post<Card>(this.apiUrl, formData, { headers });
  }

  atualizar(
    id: number,
    descricao: string,
    imagem?: File | null
  ): Observable<Card> {
    const formData = new FormData();
    formData.append('descricao', descricao);
    if (imagem) {
      formData.append('imagem', imagem);
    }

    const headers = new HttpHeaders({
      'X-Admin': this.usuarioService.usuarioEhAdmin().toString(),
    });

    return this.http.put<Card>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  deletar(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'X-Admin': this.usuarioService.usuarioEhAdmin().toString(),
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
