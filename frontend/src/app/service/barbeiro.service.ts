import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barbeiro } from '../models/barbeiro.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarbeiroService {
  private apiUrl = `http://${window.location.hostname}:8080/api/barbeiros`; // corrigido para "barbeiros"

  constructor(private http: HttpClient) { }

  listar(): Observable<Barbeiro[]> {
    return this.http.get<Barbeiro[]>(this.apiUrl);
  }

  criar(barbeiro: Barbeiro): Observable<Barbeiro> {
    return this.http.post<Barbeiro>(this.apiUrl, barbeiro);
  }

  atualizar(id: number, barbeiro: Barbeiro): Observable<Barbeiro> {
    return this.http.put<Barbeiro>(`${this.apiUrl}/${id}`, barbeiro);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
