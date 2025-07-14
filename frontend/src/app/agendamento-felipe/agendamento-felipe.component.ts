import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { NotificacaoService } from '../service/notificacao.service';
import { ServicoService } from '../service/servico.service';
import { HorarioService } from '../service/horario.service';

import { Notificacao } from '../models/Notificacao.model';
import { Servico } from '../models/servico.model';
import { Horario } from '../models/horario.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-galeria',
  templateUrl: './agendamento-felipe.component.html',
  styleUrls: ['./agendamento-felipe.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AgendamentoFelipeComponent implements OnInit {
  menuAberto = false;
  mostrarNotificacoes = false;
  mostrarFormulario = false;
  menuTimeout: any;
  notificacaoTimeout: any;
  dataHoje: string = '';

  notificacoes: Notificacao[] = [];
  nova: Notificacao = {
    titulo: '',
    descricao: '',
    imagemUrl: '',
  };
  imagemSelecionada: File | null = null;

  // ===== Agendamento =====
  servicos: Servico[] = [];
  servicosSelecionados: number[] = [];
  barbeiros: string[] = ['João', 'Pedro', 'Lucas'];
  barbeiroSelecionado: any = null;

  cuponsDisponiveis = [
    { id: 1, nome: 'Fidelidade10', desconto: 10 },
    { id: 2, nome: 'Desconto20', desconto: 20 }
  ];
  cupomSelecionadoId: string = '';

  valorTotal: number = 0.00;
  descontoAplicado: number = 0.00;
  valorFinal: number = 0.00;

  agendamentoForm!: FormGroup;

  // ===== Horários =====
  horarios: Horario[] = [];
  novoHorario: Horario = { hora: '', bloqueado: false };
  editandoHorario: Horario | null = null;

  constructor(
    public usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private servicoService: ServicoService,
    private horarioService: HorarioService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const data = new Date();
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    this.dataHoje = `${dias[data.getDay()]}, ${data.getDate()} ${meses[data.getMonth()]} ${data.getFullYear()}`;

    if (this.usuarioService.isLoggedIn()) {
      this.usuarioService.getUsuarioLogado().subscribe({
        next: (user) => (this.usuarioService.nomeUsuario = user.nome),
        error: () => (this.usuarioService.nomeUsuario = ''),
      });
    }

    this.listarNotificacoes();
    this.carregarServicos();
    this.carregarHorarios();

    this.agendamentoForm = this.fb.group({});
  }

  // ===== Notificações =====
  abrirMenu() {
    clearTimeout(this.menuTimeout);
    this.menuAberto = true;
  }

  fecharMenu() {
    this.menuTimeout = setTimeout(() => {
      this.menuAberto = false;
    }, 150);
  }

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

  // ===== Serviços =====
  carregarServicos() {
    this.servicoService.listar().subscribe(servicos => {
      this.servicos = servicos;
    });
  }

  toggleServico(id: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;

    if (checked) {
      this.servicosSelecionados.push(id);
    } else {
      this.servicosSelecionados = this.servicosSelecionados.filter(s => s !== id);
    }

    this.atualizarValores();
  }

  onCupomChange() {
    this.atualizarValores();
  }

  atualizarValores() {
    this.valorTotal = this.servicos
      .filter(s => this.servicosSelecionados.includes(s.id!))
      .reduce((total, s) => total + (s.preco || 0), 0);

    const cupom = this.cuponsDisponiveis.find(c => c.id === Number(this.cupomSelecionadoId));
    this.descontoAplicado = cupom ? (this.valorTotal * cupom.desconto) / 100 : 0;
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

  // ===== Horários =====
  carregarHorarios() {
    this.horarioService.listar().subscribe(data => this.horarios = data);
  }

  salvarHorario() {
    if (this.editandoHorario) {
      this.horarioService.editar(this.editandoHorario.id!, this.novoHorario).subscribe(() => {
        this.resetarFormularioHorario();
        this.carregarHorarios();
      });
    } else {
      this.horarioService.criar(this.novoHorario).subscribe(() => {
        this.resetarFormularioHorario();
        this.carregarHorarios();
      });
    }
  }

  editarHorario(h: Horario) {
    this.editandoHorario = h;
    this.novoHorario = { ...h };
  }

  deletarHorario(id: number) {
    if (confirm('Deseja remover este horário?')) {
      this.horarioService.deletar(id).subscribe(() => this.carregarHorarios());
    }
  }

  alternarBloqueioHorario(horario: Horario) {
    const acao = horario.bloqueado ? this.horarioService.desbloquear : this.horarioService.bloquear;
    acao.call(this.horarioService, horario.id!).subscribe(() => this.carregarHorarios());
  }

  resetarFormularioHorario() {
    this.novoHorario = { hora: '', bloqueado: false };
    this.editandoHorario = null;
  }
}
