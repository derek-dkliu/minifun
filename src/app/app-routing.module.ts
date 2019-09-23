import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GaleryComponent } from './galery/galery.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { MazeComponent } from './maze/maze.component';
import { HanoiTowerComponent } from './hanoi-tower/hanoi-tower.component';


const routes: Routes = [
  { path: '', component: GaleryComponent },
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  { path: 'maze', component: MazeComponent },
  { path: 'hanoi-tower', component: HanoiTowerComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
