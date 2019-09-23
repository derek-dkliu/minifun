import { Role } from './role';
import { Move } from './move';

export abstract class State {
  constructor(protected roles: Role[], protected controller: Role, protected round: number) {}

  abstract clone(): State;

  abstract getRepresentation(): string;

  abstract getLegalMoves(role: Role): Move[];

  abstract getWinner(): string;

  abstract updateController(): void;

  abstract hash(): string;

  abstract getHeuristic(role: Role): number;

  isController(role: Role): boolean {
    return this.getController().equals(role);
  }

  getControllerIndex(): number {
    return this.roles.findIndex(role => this.controller.equals(role));
  }

  getController(): Role {
    return this.controller;
  }

  getRole(index: number): Role {
    return this.roles[index];
  }

  getRoles(): Role[] {
    return this.roles;
  }

  getRound(): number {
    return this.round;
  }

  nextRound(): void {
    this.round++;
  }
}
