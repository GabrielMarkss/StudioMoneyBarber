import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barbeiro } from '../models/barbeiro.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarbeiroService {
  private baseUrl = 'http://localhost:8080/api/barbeiros';

  constructor(private http: HttpClient) {}

  listar(): Observable<Barbeiro[]> {
    return this.http.get<Barbeiro[]>(this.baseUrl);
  }

  criar(barbeiro: Barbeiro): Observable<Barbeiro> {
    return this.http.post<Barbeiro>(this.baseUrl, barbeiro);
  }

  atualizar(id: number, barbeiro: Barbeiro): Observable<Barbeiro> {
    return this.http.put<Barbeiro>(`${this.baseUrl}/${id}`, barbeiro);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
