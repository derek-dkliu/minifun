import { Move } from './move';
import { State } from './state';

export class MctsNode<S extends State> {
  private state: S;
  private moves: Move[];
  private parent: MctsNode<S>;
  private children: MctsNode<S>[];
  private unexpandedMoves: Move[][];
  private utility: number;
  private visits: number;

  constructor(state: S, moves: Move[], parent: MctsNode<S>, unexpandedMoves: Move[][]) {
    this.state = state;
    this.moves = moves;
    this.parent = parent;
    this.unexpandedMoves = unexpandedMoves;
    this.utility = 0;
    this.visits = 0;
    this.children = [];
  }

  isRoot(): boolean {
    return this.parent == null;
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  isFullyExpanded(): boolean {
    return this.unexpandedMoves.length === 0;
  }

  getUnexpandedMoveRandomly(): Move[] {
    const index = Math.floor(Math.random() * this.unexpandedMoves.length);
    return this.unexpandedMoves.splice(index, 1)[0];
  }

  addChild(child: MctsNode<S>): void {
    this.children.push(child);
  }

  updateVisits(): void {
    this.visits++;
  }

  updateUtility(goals: number[]): void {
    const max = Math.max(...goals);
    for (let i = 0; i < goals.length; i++) {
      if (goals[i] === max) {
        if (!this.isRoot() && i === this.parent.getState().getControllerIndex()) {
          this.utility += goals[i];
          break;
        }
      }
    }
  }

  getMove(): Move {
    const index = this.parent.getState().getControllerIndex();
    return this.moves[index];
  }

  getState(): S {
    return this.state;
  }

  getScore(policy = 'robust'): number {
    if (policy === 'robust') {    // Most visited (robust child)
      return this.visits;
    } else {                      // Highest winrate (max child)
      return this.utility / this.visits;
    }
  }

  getVisits(): number {
    return this.visits;
  }

  getUtility(): number {
    return this.utility;
  }

  getParent(): MctsNode<S> {
    return this.parent;
  }

  getChildren(): MctsNode<S>[] {
    return this.children;
  }

  getUCB1(): number {
    return this.utility / this.visits + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
  }
}
