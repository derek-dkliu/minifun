import { StateMachine } from './state-machine';
import { Move } from './move';
import { State } from './state';

export abstract class BasePlayer<S extends State> {
  protected stateMachine: StateMachine<S>;

  abstract selectMove(timeout: number): Move;

  constructor(stateMachine: StateMachine<S>) {
    this.stateMachine = stateMachine;
  }
}
