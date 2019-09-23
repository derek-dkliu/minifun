import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GaleryComponent } from './galery/galery.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { MazeComponent } from './maze/maze.component';
import { HanoiTowerComponent } from './hanoi-tower/hanoi-tower.component';
import { TowersComponent } from './hanoi-tower/towers/towers.component';
import { DiskComponent } from './hanoi-tower/disk/disk.component';
import { LevelDialogComponent } from './level-dialog/level-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GaleryComponent,
    TicTacToeComponent,
    MazeComponent,
    HanoiTowerComponent,
    TowersComponent,
    DiskComponent,
    LevelDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LevelDialogComponent]
})
export class AppModule { }
