import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Horario } from '../models/horario.model';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private baseUrl = 'http://localhost:8080/api/horarios'; // ajuste conforme seu backend

  constructor(private http: HttpClient) {}

  getPorDia(dia: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.baseUrl}/dia/${dia}`);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  atualizar(id: number, dados: Partial<Horario>): Observable<Horario> {
    return this.http.put<Horario>(`${this.baseUrl}/${id}`, dados);
  }

  bloquearDia(dia: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/bloquear-dia`, null, {
      params: { dia },
    });
  }
}
