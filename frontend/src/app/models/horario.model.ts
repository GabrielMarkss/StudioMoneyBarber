export interface Horario {
  id?: number;
  diaSemana: string; // Ex: "TERÇA", "QUARTA"
  horario: string; // Ex: "08:00"
  disponivel: boolean;
  bloqueado: boolean;
  motivoBloqueio?: string;
  clienteNome?: string;
}
