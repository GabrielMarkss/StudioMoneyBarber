import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { NotificacaoService } from '../service/notificacao.service';
import { CarrosselImagem } from '../service/carrosselImagem.service';
import { ServicoService } from '../service/servico.service';
import { CardService } from '../service/card.service';

import { Notificacao } from '../models/Notificacao.model';
import { Servico } from '../models/servico.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Card } from '../models/card-servico.model';

@Component({
  selector: 'app-dashteste',
  templateUrl: './dashteste.component.html',
  styleUrls: ['./dashteste.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class DashtesteComponent implements OnInit {
  menuAberto = false;
  mostrarNotificacoes = false;
  mostrarFormulario = false;
  mostrarFormularioServico = false;
  mostrarFormularioImagem = false;

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

  imagens: any[] = [];
  novaImagem: any = { id: null, url: '' };

  servicos: Servico[] = [];
  servicosPaginados: Servico[] = [];
  novoServico: Servico = { nome: '', preco: 0 };

  itensPorPagina = 8;
  paginaAtual = 1;
  totalPaginas = 1;
  paginas: number[] = [];

  // Cards
  cards: Card[] = [];
  novoCardDescricao = '';
  novoCardImagem: File | null = null;
  cardEditando: Card | null = null;
  mostrarFormularioCard = false;
  cardsVisiveis: Card[] = [];
  proximoIndexCard = 0;
  intervaloCarrossel: any;

  constructor(
    public usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private carrosselImagem: CarrosselImagem,
    private servicoService: ServicoService,
    private cardService: CardService
  ) {}

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
    this.listarImagens();
    this.listarServicos();
    this.listarCards();
  }

  abrirMenu() {
    clearTimeout(this.menuTimeout);
    this.menuAberto = true;
  }

  fecharMenu() {
    this.menuTimeout = setTimeout(() => {
      this.menuAberto = false;
    }, 200);
  }

  // --------------------- SERVIÇOS ---------------------
  listarServicos() {
    this.servicoService.listar().subscribe((res) => {
      this.servicos = res;
      this.totalPaginas = Math.ceil(this.servicos.length / this.itensPorPagina);
      this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
      this.irParaPagina(1);
    });
  }

  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
    const inicio = (pagina - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.servicosPaginados = this.servicos.slice(inicio, fim);
  }

  abrirFormulario(servico?: Servico) {
    if (servico) {
      this.novoServico = { ...servico };
      this.mostrarFormularioServico = true;
    } else {
      if (this.mostrarFormularioServico && !this.novoServico.id) {
        this.mostrarFormularioServico = false;
        this.novoServico = { nome: '', preco: 0 };
      } else {
        this.novoServico = { nome: '', preco: 0 };
        this.mostrarFormularioServico = true;
      }
    }
  }

  cancelarFormularioServico() {
    this.mostrarFormularioServico = false;
    this.novoServico = { nome: '', preco: 0 };
  }

  salvarServico() {
    if (this.novoServico.id) {
      this.servicoService
        .atualizar(this.novoServico.id, this.novoServico)
        .subscribe(() => {
          this.cancelarFormularioServico();
          this.listarServicos();
        });
    } else {
      this.servicoService.adicionar(this.novoServico).subscribe(() => {
        this.cancelarFormularioServico();
        this.listarServicos();
      });
    }
  }

  deletarServico(id: number) {
    const confirmar = confirm('Você deseja remover este serviço?');
    if (!confirmar) return;
    this.servicoService.deletar(id).subscribe(() => {
      this.listarServicos();
    });
  }

  // --------------------- NOTIFICAÇÕES ---------------------
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

  // --------------------- IMAGENS ---------------------
  abrirFormularioImagem() {
    this.novaImagem = { id: null, url: '' };
    this.mostrarFormularioImagem = true;
  }

  cancelarFormularioImagem() {
    this.mostrarFormularioImagem = false;
    this.novaImagem = { id: null, url: '' };
  }

  onFileChangeImagem(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.novaImagem.url = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  salvarImagem() {
    if (this.novaImagem.id) {
      this.carrosselImagem.atualizarImagem(this.novaImagem).subscribe(() => {
        this.listarImagens();
        this.cancelarFormularioImagem();
      });
    } else {
      this.carrosselImagem.criarImagem(this.novaImagem).subscribe(() => {
        this.listarImagens();
        this.cancelarFormularioImagem();
      });
    }
  }

  editarImagem(imagem: any) {
    this.novaImagem = { ...imagem };
    this.mostrarFormularioImagem = true;
  }

  listarImagens() {
    this.carrosselImagem.listarImagens().subscribe((res) => {
      this.imagens = res;
    });
  }

  // Cards
  listarCards() {
    this.cardService.listar().subscribe((res) => {
      this.cards = res.map((c) => ({
        ...c,
        imagemPath: 'http://localhost:8080' + c.imagemPath,
      }));

      // Pega os primeiros 5
      this.cardsVisiveis = this.cards.slice(0, 5);

      // O próximo a entrar na fila será o 7º card (índice 5)
      this.proximoIndexCard = 5 % this.cards.length;

      // Inicia carrossel
      this.iniciarCarrossel();
    });
  }

  iniciarCarrossel() {
    if (this.intervaloCarrossel) {
      clearInterval(this.intervaloCarrossel);
    }

    this.intervaloCarrossel = setInterval(() => {
      if (this.cards.length <= 5) {
        // Se tiver 5 ou menos, não precisa rotacionar
        return;
      }

      // Remove o primeiro
      this.cardsVisiveis.shift();

      // Adiciona o próximo na fila
      this.cardsVisiveis.push(this.cards[this.proximoIndexCard]);

      // Avança índice e faz loop se passar do final
      this.proximoIndexCard = (this.proximoIndexCard + 1) % this.cards.length;
    }, 8000);
  }

  ngOnDestroy() {
    if (this.intervaloCarrossel) {
      clearInterval(this.intervaloCarrossel);
    }
  }

  abrirFormularioCard(card?: Card) {
    if (card) {
      this.cardEditando = { ...card };
    } else {
      this.cardEditando = null;
      this.novoCardDescricao = '';
      this.novoCardImagem = null;
    }
    this.mostrarFormularioCard = true;
  }

  cancelarFormularioCard() {
    this.mostrarFormularioCard = false;
    this.novoCardDescricao = '';
    this.novoCardImagem = null;
    this.cardEditando = null;
  }

  onFileChangeCard(event: any) {
    this.novoCardImagem = event.target.files[0];
  }

  salvarCard() {
    if (this.cardEditando) {
      this.cardService
        .atualizar(
          this.cardEditando.id!,
          this.novoCardDescricao,
          this.novoCardImagem!
        )
        .subscribe(() => {
          this.listarCards();
          this.cancelarFormularioCard();
        });
    } else {
      this.cardService
        .criar(this.novoCardDescricao, this.novoCardImagem!)
        .subscribe(() => {
          this.listarCards();
          this.cancelarFormularioCard();
        });
    }
  }

  deletarCard(id: number) {
    if (confirm('Deseja remover este card?')) {
      this.cardService.deletar(id).subscribe(() => this.listarCards());
    }
  }
}
