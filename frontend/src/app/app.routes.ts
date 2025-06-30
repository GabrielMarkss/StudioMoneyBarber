import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { DashtesteComponent } from './dashteste/dashteste.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { AgendamentoComponent } from './agendamento/agendamento.component';
import { ProdutosComponent } from './produtos/produtos.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent }, // Página inicial
  { path: 'login', component: LoginComponent }, // Página de login
  { path: 'register', component: RegisterComponent }, // Página de cadastro
  { path: 'dashteste', component: DashtesteComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'agendamentos', component: AgendamentoComponent },
  { path: 'produtos', component: ProdutosComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  { path: '**', redirectTo: '' }, // Rota coringa para páginas inexistentes
];
