import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAX_DISK_NUM } from './disk/disk-data';
import { TowersComponent } from './towers/towers.component';
import { LevelDialogComponent } from '../level-dialog/level-dialog.component';

interface Move {
  from: string;
  to: string;
}

@Component({
  selector: 'app-hanoi-tower',
  templateUrl: './hanoi-tower.component.html',
  styleUrls: ['./hanoi-tower.component.scss']
})
export class HanoiTowerComponent implements OnInit {
  maxDiskNum = MAX_DISK_NUM;
  diskNum = 1;
  labels = ['A', 'B', 'C'];
  inputMode = false;
  hintOn = false;
  moveCount: number;
  moves: Move[];
  autoRunning: boolean;

  @ViewChild(TowersComponent, {static: true})
  private towersComponent: TowersComponent;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.autoRunning = false;
    this.moveCount = 0;
    this.solveHanoiTower(this.diskNum);
  }

  addMoveCount(moved: boolean) {
    if (moved) {
      this.moveCount++;
    }
  }

  restart() {
    this.init();
    this.towersComponent.resetDisksData();
  }

  switchHint() {
    this.hintOn = this.hintOn ? false : true;
  }

  diskNumChanged(value: string) {
    this.solveHanoiTower(+value);
  }

  solveHanoiTower(n: number) {
    this.moves = [];
    const [a, b, c] = this.labels;
    this.solver(n, a, c, b);
  }

  solver(n: number, from: string, to: string, spare: string) {
    if (n === 1) {
      this.moves.push({ from, to });
    } else {
      this.solver(n - 1, from, spare, to);
      this.solver(1, from, to, spare);
      this.solver(n - 1, spare, to, from);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(LevelDialogComponent, {
      disableClose: true,
      minWidth: '300px',
      data: {
        message: 'Well Done',
        excellent: this.moves.length === this.moveCount,
        hasNextLevel: this.diskNum !== MAX_DISK_NUM,
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params.next) {
        const num = this.diskNum + 1;
        const done = num > MAX_DISK_NUM;
        this.diskNum = done ? MAX_DISK_NUM : num;
        if (!this.inputMode) {
          this.inputMode = done;
        }
      }
      this.restart();
    });
  }

  step() {
    if (!this.autoRunning) {
      const move = this.moves[this.moveCount];
      this.towersComponent.step(move.from, move.to);
    }
  }

  async run() {
    if (!this.autoRunning) {
      this.autoRunning = true;
      for (let i = 0; i < this.moves.length; i++) {
        if (i >= this.moveCount) {
          const move = this.moves[i];
          await new Promise(resolve => {
            this.towersComponent.step(move.from, move.to);
            setTimeout(() => {
              resolve(true);
            }, 1000);
          });
        }
      }
    }
  }
}
