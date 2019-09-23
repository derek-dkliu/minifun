import { Role } from './role';
import { Move } from './move';
import { State } from './state';

export abstract class StateMachine<S extends State> {
  protected state: S;
  protected role: Role;

  constructor(state: S, role: string) {
    this.state = state;
    this.role = Role.create(role);
  }

  abstract getLegalMoves(state: S, role: Role): Move[];

  abstract getNextState(state: S, moves: Move[]): S;

  abstract isTerminal(state: S): boolean;

  abstract getGoal(state: S, role: Role): number;

  abstract getRoles(): Role[];

  getRole(): Role {
    return this.role;
  }

  getCurrentState(): S {
    return this.state;
  }

  getGoals(state: S): number[] {
    const goals = [];
    for (const role of this.getRoles()) {
      goals.push(this.getGoal(state, role));
    }
    return goals;
  }

  getRandomNextState(state: S): S {
    const randomJointMove: Move[] = this.getRandomJointMove(state);
    return this.getNextState(state, randomJointMove);
  }

  getRandomMove(state: S, role: Role): Move {
    const legals: Move[] = this.getLegalMoves(state, role);
    const rand = Math.floor(Math.random() * legals.length);
    return legals[rand];
  }

  getRandomJointMove(state: S): Move[] {
    const randomJointMove: Move[] = [];
    for (const role of this.getRoles()) {
      randomJointMove.push(this.getRandomMove(state, role));
    }

    return randomJointMove;
  }

  getLegalJointMoves(state: S): Move[][] {
    const legals: Move[][] = [];
    for (const role of this.getRoles()) {
      legals.push(this.getLegalMoves(state, role));
    }

    const crossProduct: Move[][] = [];
    this.crossProductLegalMoves(legals, crossProduct, []);
    return crossProduct;
  }

  getLegalJointMovesByRoleMove(state: S, role: Role, move: Move): Move[][] {
    const legals: Move[][] = [];
    for (const r of this.getRoles()) {
      if (r.equals(role)) {
        const m: Move[] = [];
        m.push(move);
        legals.push(m);
      } else {
        legals.push(this.getLegalMoves(state, r));
      }
    }

    const crossProduct: Move[][] = [];
    this.crossProductLegalMoves(legals, crossProduct, []);
    return crossProduct;
  }

  private crossProductLegalMoves(legals: Move[][], crossProduct: Move[][], partial: Move[]): void {
    if (partial.length === legals.length) {
      crossProduct.push(partial.slice());
    } else {
      for (const move of legals[partial.length]) {
        partial.push(move);
        this.crossProductLegalMoves(legals, crossProduct, partial);
        partial.pop();
      }
    }
  }
}
