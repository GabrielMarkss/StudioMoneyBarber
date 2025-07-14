import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Horario } from '../models/horario.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HorarioService {
    private baseUrl = 'http://localhost:8080/api/horarios';

    constructor(private http: HttpClient) { }

    listar(): Observable<Horario[]> {
        return this.http.get<Horario[]>(this.baseUrl);
    }

    criar(horario: Horario): Observable<Horario> {
        return this.http.post<Horario>(this.baseUrl, horario);
    }

    editar(id: number, horario: Horario): Observable<Horario> {
        return this.http.put<Horario>(`${this.baseUrl}/${id}`, horario);
    }

    deletar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    bloquear(id: number): Observable<Horario> {
        return this.http.put<Horario>(`${this.baseUrl}/${id}/bloquear`, {});
    }

    desbloquear(id: number): Observable<Horario> {
        return this.http.put<Horario>(`${this.baseUrl}/${id}/desbloquear`, {});
    }
}
