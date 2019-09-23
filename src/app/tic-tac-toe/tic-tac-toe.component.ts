import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Move } from 'src/app/players/move';
import { Winner, Board, PLAY_TIME } from './tic-tac-toe-rule';
import { TicTacToeMachine } from './tic-tac-toe-machine';
import { BasePlayer } from 'src/app/players/base-player';
import { MinimaxPlayer } from '../players/minimax-player';
import { MontecarloPlayer } from 'src/app/players/montecarlo-player';
import { MctsPlayer } from 'src/app/players/mcts-player';
import { MatDialog } from '@angular/material/dialog';
import { LevelDialogComponent } from '../level-dialog/level-dialog.component';

const TEST_ITERATION = 50;

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit, OnDestroy {
  public winner: string;
  public board: Board;
  public stateMachine: TicTacToeMachine;
  public computers: BasePlayer<Board>[];
  public huamRoles: string[] = [Board.firstPlay];
  public computerRoles: string[] = [Board.roleNames[1]];
  private testSubscription: Subscription;
  private loopSubscription: Subscription;
  private iterationStream = new Subject<number>();
  public debug = false;
  public testing = false;
  private startTime = 0;
  public testLoop = TEST_ITERATION;
  public report = {loop: 0, X: 0, O: 0, Tie: 0, time: 0};
  public playerChoice = ['minimax', 'minimax'];
  public playerOption = [
    { id: 'montecarolo', name: 'Monte Carlo' },
    { id: 'mcts', name: 'MCTS' },
    { id: 'minimax', name: 'Mini Max' },
  ];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.initGame();
  }

  ngOnDestroy() {
    if (this.loopSubscription) { this.loopSubscription.unsubscribe(); }
    if (this.testSubscription) { this.testSubscription.unsubscribe(); }
  }

  getRoleNames(): string[] {
    return Board.roleNames;
  }

  isRole(role: string): boolean {
    return this.huamRoles.length === 1 && this.huamRoles.includes(role);
  }

  setRole(role: string): void {
    this.huamRoles = [role];
    if (this.huamRoles.length !== 2) {
      const anotherRole = this.isRole(Board.roleNames[0]) ? Board.roleNames[1] : Board.roleNames[0];
      this.computerRoles = [anotherRole];
    }
    this.debug = false;
    this.resetGame();
  }

  set2P() {
    this.huamRoles = this.getRoleNames();
    this.computerRoles = [];
    this.debug = false;
    this.resetGame();
  }

  toggleDebug() {
    this.debug = this.debug ? false : true;
  }

  isTestMode(): boolean {
    return this.computerRoles.length === 2;
  }

  setTest() {
    this.huamRoles = [];
    this.computerRoles = this.getRoleNames();
  }

  runTest() {
    if (this.testSubscription) { this.testSubscription.unsubscribe(); }
    this.testStart();
    this.testSubscription = this.iterationStream.subscribe(
      val => this.resetGame()
    );
    this.iterationStream.next(0);
  }

  isGameOver(): boolean {
    return this.winner !== Winner.Empty;
  }

  hasWinner(): boolean {
    return this.board.getRoles().some(role => role.is(this.winner));
  }

  handleClick(index: number) {
    if (!this.isGameOver() && this.isHumanTurn()) {
      this.mark(index);
      this.runComputer();
    }
  }

  resetGame() {
    this.initGame();
  }

  private initGame() {
    this.winner = Winner.Empty;
    this.board = Board.create();

    this.computers = [];
    for (let i = 0; i < this.computerRoles.length; i++) {
      const stateMachine = new TicTacToeMachine(this.board, this.computerRoles[i]);
      switch (this.playerChoice[i]) {
        case this.playerOption[0].id:
          this.computers.push(new MontecarloPlayer<Board>(stateMachine, 1, 1000));
          break;
        case this.playerOption[1].id:
          this.computers.push(new MctsPlayer<Board>(stateMachine));
          break;
        case this.playerOption[2].id:
          this.computers.push(new MinimaxPlayer<Board>(stateMachine));
          break;
        default:
          this.computers.push(new MinimaxPlayer<Board>(stateMachine));
          break;
      }
    }

    if (!this.isHumanTurn()) {
      this.runComputer();
    }
  }

  private isHumanTurn(): boolean {
    return this.huamRoles.includes(this.board.getController().getName());
  }

  private runComputer(): void {
    if (this.isTestMode()) {
      if (this.loopSubscription) { this.loopSubscription.unsubscribe(); }

      const delay = this.debug ? 0 : 600;
      const source = interval(delay).pipe(takeWhile(() => !this.isGameOver()));
      this.loopSubscription = source.subscribe(val => {
        const turn = +val % 2;
        this.computerMove(this.computers[turn]);
      },
      err => {},
      () => {
        this.loopEnd();
      });

    } else if (this.computers.length === 1) {
      this.computerMove(this.computers[0]);
    }
  }

  private computerMove(computer: BasePlayer<Board>): void {
    if (!this.isGameOver()) {
      const timeout = Date.now() + PLAY_TIME * 1000;
      const move = computer.selectMove(timeout);
      this.mark(+move.getAction());
    }
  }

  private mark(index: number) {
    const cell = this.board.getCell(index);
    if (cell !== undefined && cell.isEmpty()) {
      this.board.mark(Move.create(index.toString()));
      this.checkWinner();
    }
  }

  private checkWinner(): void {
    this.winner = this.board.getWinner();
    if (this.isGameOver()) {
      this.openDialog();
    }
  }

  private openDialog() {
    const dialogRef = this.dialog.open(LevelDialogComponent, {
      disableClose: true,
      minWidth: '300px',
      data: {
        message: this.hasWinner() ? `${this.winner} won` : `${this.winner.toUpperCase()} !`,
        excellent: false,
        hasNextLevel: false,
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params.next) {
        // do nothing
      } else {
        this.resetGame();
      }
    });
  }

  private loopEnd(): void {
    if (this.isGameOver()) {
      this.report[this.winner] += 1;
      this.report.loop += 1;
      if (this.report.loop < this.testLoop) {
        this.iterationStream.next(this.report.loop);
      } else {
        this.testEnd();
      }
    }
  }

  private testStart(): void {
    this.testing = true;
    this.report = { loop: 0, X: 0, O: 0, Tie: 0, time: 0 };
    this.startTime = Date.now();
    if (this.debug) {
      this.testLoop = TEST_ITERATION;
    } else {
      this.testLoop = 1;
    }
  }

  private testEnd(): void {
    this.testing = false;
    const endTime = Date.now();
    const time = (endTime - this.startTime) / 1000;
    this.report.time = time;
  }
}
