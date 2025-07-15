import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { NotificacaoService } from '../service/notificacao.service';
import { ServicoService } from '../service/servico.service';
import { HorarioService } from '../service/horario.service';

import { Notificacao } from '../models/Notificacao.model';
import { Servico } from '../models/servico.model';
import { Horario } from '../models/horario.model';

import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agendamento-felipe',
  templateUrl: './agendamento-felipe.component.html',
  styleUrls: ['./agendamento-felipe.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AgendamentoFelipeComponent implements OnInit {
  dataHoje: string = '';

  // ===== NAVBAR - notificações =====
  menuAberto = false;
  mostrarNotificacoes = false;
  mostrarFormulario = false;
  menuTimeout: any;
  notificacaoTimeout: any;
  notificacoes: Notificacao[] = [];
  nova: Notificacao = {
    titulo: '',
    descricao: '',
    imagemUrl: '',
  };
  imagemSelecionada: File | null = null;

  // ===== SERVICOS =====
  servicos: Servico[] = [];
  servicosSelecionados: number[] = [];
  barbeiros: string[] = ['João', 'Pedro', 'Lucas'];
  barbeiroSelecionado: any = null;

  // ===== CUPONS E RESUMO VALOR =====
  cuponsDisponiveis = [
    { id: 1, nome: 'Fidelidade10', desconto: 10 },
    { id: 2, nome: 'Desconto20', desconto: 20 },
  ];
  cupomSelecionadoId: string = '';
  valorTotal: number = 0.0;
  descontoAplicado: number = 0.0;
  valorFinal: number = 0.0;

  // ===== HORARIOS =====
  diasSemana = [
    { label: 'DOM', value: 'DOMINGO' },
    { label: 'SEG', value: 'SEGUNDA' },
    { label: 'TER', value: 'TERÇA' },
    { label: 'QUA', value: 'QUARTA' },
    { label: 'QUI', value: 'QUINTA' },
    { label: 'SEX', value: 'SEXTA' },
    { label: 'SAB', value: 'SABADO' },
  ];

  diaSelecionado = 'TERÇA';
  horarios: Horario[] = [];
  mostrarFormularioHorario = false;
  horarioParaEditar: Horario | null = null;

  constructor(
    public usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private servicoService: ServicoService,
    private horarioService: HorarioService,
    private fb: FormBuilder
  ) {}

  // ===== CICLO DE VIDA =====
  ngOnInit(): void {
    const data = new Date();
    const dias = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    const meses = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ];
    this.dataHoje = `${dias[data.getDay()]}, ${data.getDate()} ${
      meses[data.getMonth()]
    } ${data.getFullYear()}`;

    if (this.usuarioService.isLoggedIn()) {
      this.usuarioService.getUsuarioLogado().subscribe({
        next: (user) => (this.usuarioService.nomeUsuario = user.nome),
        error: () => (this.usuarioService.nomeUsuario = ''),
      });
    }

    this.listarNotificacoes();
    this.carregarServicos();
    this.carregarHorarios();
  }

  // ===== MENU DROPDOWN =====
  abrirMenu() {
    clearTimeout(this.menuTimeout);
    this.menuAberto = true;
  }

  fecharMenu() {
    this.menuTimeout = setTimeout(() => {
      this.menuAberto = false;
    }, 150);
  }

  // ===== NOTIFICAÇÕES =====
  abrirNotificacao() {
    clearTimeout(this.notificacaoTimeout);
    this.mostrarNotificacoes = true;
  }

  fecharNotificacao() {
    this.notificacaoTimeout = setTimeout(() => {
      this.mostrarNotificacoes = false;
    }, 150);
  }

  abrirFormularioNotificacao() {
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.nova = {
      titulo: '',
      descricao: '',
      imagemUrl: '',
    };
    this.imagemSelecionada = null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.nova.imagemUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  salvarNotificacao() {
    if (this.nova.id) {
      this.notificacaoService
        .atualizar(this.nova.id, this.nova)
        .subscribe(() => {
          this.cancelarFormulario();
          this.listarNotificacoes();
        });
    } else {
      this.notificacaoService.criar(this.nova).subscribe(() => {
        this.cancelarFormulario();
        this.listarNotificacoes();
      });
    }
  }

  listarNotificacoes() {
    this.notificacaoService.listar().subscribe((res) => {
      this.notificacoes = res;
    });
  }

  confirmarRemocao(notificacao: Notificacao) {
    const confirmar = confirm('Você deseja remover esta notificação?');
    if (!confirmar) return;

    const isAdmin = this.usuarioService.usuarioEhAdmin();
    this.notificacaoService.deletar(notificacao.id!, true, isAdmin).subscribe({
      next: () => this.listarNotificacoes(),
      error: (err) => alert(err.error || 'Erro ao remover notificação'),
    });
  }

  editarNotificacao(n: Notificacao) {
    this.nova = { ...n };
    this.mostrarFormulario = true;
  }

  // ===== SERVIÇOS =====
  carregarServicos() {
    this.servicoService.listar().subscribe((servicos) => {
      this.servicos = servicos;
    });
  }

  toggleServico(id: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;

    if (checked) {
      this.servicosSelecionados.push(id);
    } else {
      this.servicosSelecionados = this.servicosSelecionados.filter(
        (s) => s !== id
      );
    }

    this.atualizarValores();
  }

  onCupomChange() {
    this.atualizarValores();
  }

  atualizarValores() {
    this.valorTotal = this.servicos
      .filter((s) => this.servicosSelecionados.includes(s.id!))
      .reduce((total, s) => total + (s.preco || 0), 0);

    const cupom = this.cuponsDisponiveis.find(
      (c) => c.id === Number(this.cupomSelecionadoId)
    );
    this.descontoAplicado = cupom
      ? (this.valorTotal * cupom.desconto) / 100
      : 0;
    this.valorFinal = this.valorTotal - this.descontoAplicado;
  }

  confirmarAgendamento() {
    const agendamento = {
      servicosSelecionados: this.servicosSelecionados,
      barbeiro: this.barbeiroSelecionado,
      cupomId: this.cupomSelecionadoId,
      valorTotal: this.valorTotal,
      desconto: this.descontoAplicado,
      valorFinal: this.valorFinal,
    };

    console.log('Agendamento confirmado:', agendamento);
    alert('Agendamento confirmado com sucesso!');
  }

  // ===== HORÁRIOS =====
  selecionarDia(dia: string): void {
    this.diaSelecionado = dia;
    this.carregarHorarios();
  }

  carregarHorarios(): void {
    this.horarioService.getPorDia(this.diaSelecionado).subscribe((data) => {
      this.horarios = data;
    });
  }

  abrirFormularioCriarHorario() {
    this.horarioParaEditar = null;
    this.mostrarFormularioHorario = true;
  }

  editarHorario(horario: Horario) {
    this.horarioParaEditar = { ...horario };
    this.mostrarFormularioHorario = true;
  }

  confirmarRemoverHorario(horario: Horario) {
    const confirmar = confirm(`Deseja remover o horário ${horario.horario}?`);
    if (confirmar) {
      this.horarioService.remover(horario.id!).subscribe(() => {
        this.carregarHorarios();
      });
    }
  }

  toggleBloquearHorario(horario: Horario) {
    const acao = horario.bloqueado ? 'desbloquear' : 'bloquear';
    const confirmar = confirm(`Deseja ${acao} o horário ${horario.horario}?`);
    if (!confirmar) return;

    this.horarioService
      .atualizar(horario.id!, { ...horario, bloqueado: !horario.bloqueado })
      .subscribe(() => {
        this.carregarHorarios();
      });
  }

  bloquearDiaSelecionado(): void {
    const confirmar = confirm(
      `Deseja bloquear o dia ${this.diaSelecionado} inteiro?`
    );
    if (!confirmar) return;

    this.horarioService.bloquearDia(this.diaSelecionado).subscribe(
      () => {
        alert(`Dia ${this.diaSelecionado} bloqueado com sucesso.`);
        this.carregarHorarios();
      },
      (error) => {
        alert('Erro ao bloquear o dia.');
      }
    );
  }

  removerHorario(horario: Horario): void {
    const confirmar = confirm(`Deseja remover o horário ${horario.horario}?`);
    if (!confirmar) return;

    this.horarioService.remover(horario.id!).subscribe(
      () => {
        this.carregarHorarios();
      },
      (error) => {
        alert('Erro ao remover o horário.');
      }
    );
  }

  bloquearHorario(horario: Horario): void {
    const acao = horario.bloqueado ? 'desbloquear' : 'bloquear';
    const confirmar = confirm(`Deseja ${acao} o horário ${horario.horario}?`);
    if (!confirmar) return;

    this.horarioService
      .atualizar(horario.id!, { ...horario, bloqueado: !horario.bloqueado })
      .subscribe(
        () => {
          this.carregarHorarios();
        },
        (error) => {
          alert(`Erro ao ${acao} o horário.`);
        }
      );
  }

  // ===== GETTERS FILTRADOS PARA HTML =====
  get horariosManha(): Horario[] {
    return this.horarios.filter((h) => h.horario < '12:00');
  }

  get horariosTarde(): Horario[] {
    return this.horarios.filter(
      (h) => h.horario >= '12:00' && h.horario < '18:00'
    );
  }

  get horariosNoite(): Horario[] {
    return this.horarios.filter((h) => h.horario >= '18:00');
  }
}
