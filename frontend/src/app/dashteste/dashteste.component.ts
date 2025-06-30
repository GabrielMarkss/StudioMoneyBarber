import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { NotificacaoService } from '../service/notificacao.service';
import { CarrosselImagem } from '../service/carrosselImagem.service';
import { Notificacao } from '../models/Notificacao.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  // -----------------------------
  // Carrossel de Imagens
  imagens: any[] = [];
  novaImagem: any = { id: null, url: '' };
  mostrarFormularioImagem = false;
  // -----------------------------

  constructor(
    public usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private carrosselImagem: CarrosselImagem
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
  }

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
          console.log('Notificação atualizada');
          this.cancelarFormulario();
          this.listarNotificacoes();
        });
    } else {
      this.notificacaoService.criar(this.nova).subscribe(() => {
        console.log('Notificação criada');
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

  // -----------------------------
  // Métodos do Carrossel de Imagens
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
  // -----------------------------
}
