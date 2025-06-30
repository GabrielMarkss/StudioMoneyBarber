import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Notificacao {
  id?: number;
  titulo: string;
  descricao: string;
  dataCriacao?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private apiUrl = 'http://localhost:8080/api/notificacoes';

  constructor(private http: HttpClient) {}

  criar(notificacao: Notificacao) {
    return this.http.post<Notificacao>(this.apiUrl, notificacao);
  }

  listar() {
    return this.http.get<Notificacao[]>(this.apiUrl);
  }

  atualizar(id: number, notificacao: Notificacao) {
    return this.http.put<Notificacao>(`${this.apiUrl}/${id}`, notificacao, {
      headers: { 'X-USER-ROLE': 'ADMIN' },
    });
  }

  deletar(id: number, confirmar = false, isAdmin = false) {
    const options: any = {
      params: {},
      headers: { 'X-USER-ROLE': isAdmin ? 'ADMIN' : 'USER' },
    };

    if (isAdmin) {
      options.params.confirmar = true;
    }

    return this.http.delete(`${this.apiUrl}/${id}`, options);
  }
}
