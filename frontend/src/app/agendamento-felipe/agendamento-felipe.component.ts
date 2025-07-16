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
import { HorarioFormatPipe } from '../pipe/horario-format.pipe';

@Component({
  selector: 'app-agendamento-felipe',
  templateUrl: './agendamento-felipe.component.html',
  styleUrls: ['./agendamento-felipe.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HorarioFormatPipe, ReactiveFormsModule],
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
  mostrarModalAcao = false;
  horarioSelecionado: Horario | null = null;
  modoRemocao: boolean = false;
  hoverHorarioId: number | null | undefined = null;


  constructor(
    public usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private servicoService: ServicoService,
    private horarioService: HorarioService,
    private fb: FormBuilder
  ) { }

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
    this.dataHoje = `${dias[data.getDay()]}, ${data.getDate()} ${meses[data.getMonth()]
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
    this.horarioParaEditar = {
      id: undefined,
      diaSemana: this.diaSelecionado,
      horario: '',
      disponivel: true,
      bloqueado: false,
    };
    this.mostrarFormularioHorario = true;
  }

  editarHorario(horario: Horario) {
    this.horarioParaEditar = { ...horario };
    this.mostrarFormularioHorario = true;
  }

  cancelarEdicaoHorario() {
    this.horarioParaEditar = null;
    this.mostrarFormularioHorario = false;
  }

  salvarHorario() {
    if (!this.horarioParaEditar?.horario) return;

    const horario = {
      ...this.horarioParaEditar,
      diaSemana: this.diaSelecionado,
    };

    this.horarioService.criarOuAtualizar(horario).subscribe(() => {
      this.carregarHorarios();
      this.cancelarEdicaoHorario();
      console.log('Enviando horário:', horario);
    });
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

  toggleBloquearDiaSelecionado(): void {
    const algumBloqueado = this.horarios.some(h => h.bloqueado);
    const acao = algumBloqueado ? 'desbloquear' : 'bloquear';

    const confirmar = confirm(`Deseja ${acao} todos os horários do dia ${this.diaSelecionado}?`);
    if (!confirmar) return;

    this.horarioService.bloquearDia(this.diaSelecionado, !algumBloqueado).subscribe(() => {
      alert(`Dia ${this.diaSelecionado} ${acao}ado com sucesso.`);
      this.carregarHorarios();
    });
  }

  confirmarRemoverHorario(horario: Horario) {
    const confirmar = confirm(`Deseja remover o horário ${horario.horario}?`);
    if (confirmar) {
      this.horarioService.remover(horario.id!).subscribe(() => {
        this.carregarHorarios();
      });
    }
  }
  removerHorario(horario: Horario) {
    const confirmar = confirm(`Deseja remover o horário ${horario.horario}?`);
    if (confirmar) {
      this.horarioService.remover(horario.id!).subscribe(() => {
        this.carregarHorarios();
      });
    }
  }

  bloquearHorario(horario: Horario): void {
    const acao = horario.bloqueado ? 'desbloquear' : 'bloquear';
    const confirmar = confirm(`Deseja ${acao} o horário ${horario.horario}?`);
    if (!confirmar) return;

    this.horarioService
      .atualizar(horario.id!, { ...horario, bloqueado: !horario.bloqueado })
      .subscribe(() => {
        this.carregarHorarios();
        this.fecharModalAcao();
      });
  }

  isHorarioPassado(horario: string): boolean {
    const agora = new Date();
    const [hh, mm] = horario.split(':').map(Number);
    const horarioComparar = new Date();
    horarioComparar.setHours(hh, mm, 0, 0);
    return horarioComparar < agora;
  }

  abrirAcaoHorario(horario: Horario): void {
    const acao = confirm(`Deseja EDITAR (OK) ou BLOQUEAR/DESBLOQUEAR (Cancelar) o horário ${horario.horario}?`);
    if (acao) {
      this.editarHorario(horario);
    } else {
      this.bloquearHorario(horario);
    }
  }

  horarioJaPassou(hora: string): boolean {
    const agora = new Date();
    const [hh, mm] = hora.split(':').map(Number);
    const horarioData = new Date();
    horarioData.setHours(hh, mm, 0, 0);

    return horarioData.getTime() < agora.getTime();
  }

  formatarHorario(horario: string): string {
    return horario.slice(0, 5); // 'HH:mm'
  }

  horarioEhPassado(h: Horario): boolean {
    const agora = new Date();
    const diaAtual = agora.getDay(); // 0 (domingo) até 6 (sábado)

    const diaHorario = this.diasSemana.findIndex(d => d.value === h.diaSemana);
    if (diaHorario !== diaAtual) return false;

    const [hh, mm] = h.horario.split(':').map(Number);
    const horarioData = new Date();
    horarioData.setHours(hh, mm, 0, 0);

    return horarioData < agora;
  }


  fecharModalAcao(): void {
    this.horarioSelecionado = null;
    this.mostrarModalAcao = false;
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
