import { Move } from './move';
import { Role } from './role';
import { State } from './state';
import { BasePlayer } from './base-player';
import { StateMachine } from './state-machine';


export class MontecarloPlayer<S extends State> extends BasePlayer<S> {
  private depth: number;
  private probe: number;

  constructor(stateMachine: StateMachine<S>, depth: number, probe: number) {
    super(stateMachine);
    this.depth = depth;
    this.probe = probe;
  }

  public selectMove(timeout: number): Move {
    const legalMoves = this.stateMachine.getLegalMoves(this.stateMachine.getCurrentState(), this.stateMachine.getRole());
    let selection = legalMoves[0];
    if (legalMoves.length > 1) {
      let score = Number.MIN_SAFE_INTEGER;
      for (const move of legalMoves) {
        const result = this.miniScore(this.stateMachine.getCurrentState(), move, this.stateMachine.getRole(),
                                      0, Number.MIN_SAFE_INTEGER , Number.MAX_SAFE_INTEGER);
        if (result > score) {
          score = result;
          selection = move;
        }
      }
    }
    return selection;
  }

  private miniScore(state: S, move: Move, role: Role, level: number, alpha: number, beta: number): number {
    const jointMoves = this.stateMachine.getLegalJointMovesByRoleMove(state, role, move);
    for (const moves of jointMoves) {
      const nextState = this.stateMachine.getNextState(state, moves);
      const result = this.maxScore(nextState, role, level + 1, alpha, beta);
      beta = Math.min(beta, result);
      if (beta <= alpha) { return alpha; }
    }
    return beta;
  }

  private maxScore(state: S, role: Role, level: number, alpha: number, beta: number): number {
    if (this.stateMachine.isTerminal(state)) {
      return this.stateMachine.getGoal(state, role);
    }

    if (level > this.depth) {
      return this.monteCarlo(state, role, this.probe);
    }

    const legalMoves = this.stateMachine.getLegalMoves(state, role);
    for (const move of legalMoves) {
      const result = this.miniScore(state, move, role, level, alpha, beta);
      alpha = Math.max(alpha, result);
      if (alpha >= beta) { return beta; }
    }
    return alpha;
  }

  private monteCarlo(state: S, role: Role, probe: number): number {
    let total = 0;
    for (let i = 0; i < probe; i++) {
      total += this.depthCharge(state, role);
    }
    return total / probe;
  }

  private depthCharge(state: S, role: Role): number {
    if (this.stateMachine.isTerminal(state)) {
      return this.stateMachine.getGoal(state, role);
    }

    const randomJointMoves = this.stateMachine.getRandomJointMove(state);
    const nextState = this.stateMachine.getNextState(state, randomJointMoves);
    return this.depthCharge(nextState, role);
  }
}


