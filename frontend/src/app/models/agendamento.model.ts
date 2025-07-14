// models/agendamento.model.ts
export interface Agendamento {
  clienteNome: string;
  servicos: number[]; // IDs dos serviços selecionados
  dataHora: string;   // Data e hora do agendamento
}
