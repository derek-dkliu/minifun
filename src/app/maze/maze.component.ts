import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MazeFactory, MAZE_OPTIIONS } from './maze-factory';
import { MatDialog } from '@angular/material/dialog';
import { LevelDialogComponent } from '../level-dialog/level-dialog.component';

interface Player {
  row: number;
  col: number;
  radius: number;
  color: string;
}

const PATH_ROW = 10;
const PATH_COL = 10;
const PATH_WIDTH = 15;
const WALL_WIDTH = 5;
const PATH_COLOR = 'black';
const WALL_COLOR = 'darkcyan';
const HINT_COLOR = 'lightyellow';
const PLAYER_COLOR = 'red';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss']
})
export class MazeComponent implements OnInit {
  private pathRow = PATH_ROW;           // Number paths fitted horisontally
  private pathCol = PATH_COL;           // Number paths fitted vertically
  private pathWidth = PATH_WIDTH;
  private wallWidth = WALL_WIDTH;
  private pathColor = PATH_COLOR;
  private wallColor = WALL_COLOR;
  private playerColor = PLAYER_COLOR;
  private hintColor = HINT_COLOR;
  private hintOn = false;
  private row: number;
  private col: number;
  private board: boolean[][];
  private solution: boolean[][];
  private entry: number[];
  private exit: number[];
  private player: Player;
  private key = { ArrowLeft: false, ArrowRight: false, ArrowDown: false, ArrowUp: false };
  private requestID: number;
  public isGameOver = false;
  public level = 1;
  public maxLevel = 10;
  public mazeChoice = 0;
  public mazeOptions = MAZE_OPTIIONS;

  @ViewChild('canvas', { static: true })
  private canvasRef: ElementRef;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.setupGame();
  }

  restart() {
    this.setupGame();
  }

  nextLevel() {
    this.level++;
    this.setupGame();
  }

  levelChanged(value: string) {
    this.level = +value;
    this.setupGame();
  }

  alogChanged(value: string) {
    this.mazeChoice = +value;
    this.setupGame();
  }

  private setupGame() {
    // init game state
    this.isGameOver = false;

    // init maze
    this.initMaze();

    // init player
    this.player = {
      row: this.entry[0],
      col: this.entry[1],
      radius: this.pathWidth * .4,
      color: this.playerColor
    };

    // draw board and player
    // this.update();
    this.doDraw();
  }

  private initMaze() {
    this.pathRow = PATH_ROW + (this.level - 1) * 5;
    this.pathCol = PATH_COL + (this.level - 1) * 5;

    // init board map
    this.row = this.pathRow * 2 + 1;
    this.col = this.pathCol * 2 + 1;
    this.entry = [0, 1];
    this.exit = [this.row - 1, this.col - 2];

    const mazeBuilder = MazeFactory.build(this.mazeChoice);
    this.board = mazeBuilder.buildBoard(this.row, this.col, this.entry, this.exit);

    // solve
    this.solve();
  }

  private update(): void {
    this.doMove();
    if (!this.isGameOver) {
      this.requestID = requestAnimationFrame(() => this.update());
    }
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private doDraw(): void {
    this.canvas.width = this.pathCol * (this.pathWidth + this.wallWidth) + this.wallWidth;
    this.canvas.height = this.pathRow * (this.pathWidth + this.wallWidth) + this.wallWidth;

    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.wallColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw maze path
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.board[i][j]) {
          if (this.hintOn && this.solution[i][j]) {
            ctx.fillStyle = this.hintColor;
          } else {
            ctx.fillStyle = this.pathColor;
          }
          const y = Math.floor(i / 2) * this.pathWidth + Math.ceil(i / 2) * this.wallWidth;
          const x = Math.floor(j / 2) * this.pathWidth + Math.ceil(j / 2) * this.wallWidth;
          const h = i % 2 === 1 ? this.pathWidth : this.wallWidth;
          const w = j % 2 === 1 ? this.pathWidth : this.wallWidth;
          ctx.fillRect(x, y, w, h);
        }
      }
    }

    // draw player
    const cy = this.player.row * (this.pathWidth + this.wallWidth) / 2 + this.wallWidth / 2;
    const cx = this.player.col * (this.pathWidth + this.wallWidth) / 2 + this.wallWidth / 2;
    ctx.fillStyle = this.player.color;
    ctx.arc(cx, cy, this.player.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  private doMove(): boolean {
    if (this.player.row === this.exit[0] && this.player.col === this.exit[1]) {
      cancelAnimationFrame(this.requestID);
      this.isGameOver = true;
      this.openDialog();
      return false;
    }

    if (this.key.ArrowLeft) {
      if (this.canMove(this.player.row, this.player.col - 1)) {
        this.player.col -= 1;
      }
    } else if (this.key.ArrowRight) {
      if (this.canMove(this.player.row, this.player.col + 1)) {
        this.player.col += 1;
      }
    } else if (this.key.ArrowDown) {
      if (this.canMove(this.player.row + 1, this.player.col)) {
        this.player.row += 1;
      }
    } else if (this.key.ArrowUp) {
      if (this.canMove(this.player.row - 1, this.player.col)) {
        this.player.row -= 1;
      }
    }

    this.doDraw();
    return true;
  }

  private canMove(r: number, c: number): boolean {
    r = Math.round(r);
    c = Math.round(c);
    return r >= 0 && r < this.row && c >= 0 && c <= this.col && this.board[r][c];
  }

  private openDialog() {
    const dialogRef = this.dialog.open(LevelDialogComponent, {
      disableClose: true,
      minWidth: '300px',
      data: {
        message: 'Well Done',
        excellent: true,
        hasNextLevel: this.level !== this.maxLevel,
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params.next) {
        this.nextLevel();
      } else {
        this.restart();
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isGameOver) {
      if (event.key === 'ArrowRight') {
        this.nextLevel();
      } else if (event.key === 'ArrowLeft') {
        this.restart();
      }

    } else if (event.key === 'Enter') {
      this.hintOn = !this.hintOn;
      this.doDraw();

    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
               event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (event.ctrlKey) {
        this.key[event.key] = true;
      } else {
        this.key[event.key] = true;
        this.doMove();
        this.key[event.key] = false;
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    event.preventDefault();
    this.key[event.key] = false;
  }

  private solve(): void {
    this.solution = [];
    for (let i = 0; i < this.row; i++) {
      this.solution[i] = [];
      for (let j = 0; j < this.col; j++) {
        this.solution[i][j] = false;
      }
    }
    this.dfs(this.entry[0], this.entry[1]);
  }

  private dfs(i: number, j: number): boolean {
    if (i < 0 || i >= this.row || j < 0 || j >= this.col || !this.board[i][j] || this.solution[i][j]) {
      return false;
    }

    this.solution[i][j] = true;

    if (i === this.exit[0] && j === this.exit[1]) {
      return true;
    }

    if (this.dfs(i + 1, j) ||
        this.dfs(i - 1, j) ||
        this.dfs(i, j + 1) ||
        this.dfs(i, j - 1) ) {
      return true;
    }
    this.solution[i][j] = false;
    return false;
  }
}
