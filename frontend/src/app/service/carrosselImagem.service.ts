import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarrosselImagem {
  private readonly apiUrl = 'http://localhost:8080/api/imagens';

  constructor(private http: HttpClient) {}

  listarImagens(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criarImagem(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagem', file);
    return this.http.post(this.apiUrl, formData);
  }

  atualizarImagem(imagem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${imagem.id}`, imagem);
  }

  deletarImagem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
