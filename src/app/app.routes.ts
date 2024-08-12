import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/main-board/main-board.component').then(m => m.MainBoardComponent),
  }
];
