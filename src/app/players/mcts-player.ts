import { Move } from './move';
import { State } from './state';
import { BasePlayer } from './base-player';
import { MctsNode } from './mcts-node';

export class MctsPlayer<S extends State> extends BasePlayer<S> {
  private nodes = new Map<string, MctsNode<S>>();

  selectMove(timeout: number): Move {
    const currentState = this.stateMachine.getCurrentState();
    const role = this.stateMachine.getRole();

    const legalMoves = this.stateMachine.getLegalMoves(currentState, role);
    let selection = legalMoves[0];
    if (legalMoves.length > 1) {
      const root = this.makeNode(currentState);

      let playout = 0;
      while (Date.now() < timeout) {
        playout++;
        let goals = [];
        let node = this.select(root);

        if (this.stateMachine.isTerminal(node.getState())) {
          goals = this.stateMachine.getGoals(node.getState());
        } else {
          node = this.expand(node);
          goals = this.simulate(node.getState());
        }

        this.backpropagate(node, goals);
      }
      selection = this.bestMove(root);
      console.log('Playout:', playout);
      this.showStats(currentState);
    }

    return selection;
  }

  showStats(state: S): void {
    const node = this.nodes.get(state.hash());
    const stats = {
      visits: node.getVisits(),
      utility: node.getUtility(),
      children: []
    };
    for (const child of node.getChildren()) {
      stats.children.push({
        move: child.getMove().getAction(),
        visits: child.getVisits(),
        utility: child.getUtility()
      });
    }
    console.log(stats);
  }

  bestMove(node: MctsNode<S>, policy = 'robust'): Move {
    // If there is any unexpanded child node, further performance improvement required
    if (!node.isFullyExpanded()) {
      throw new Error('Not enough information!');
    }

    let selection = null;
    let maxScore = Number.MIN_SAFE_INTEGER;
    for (const child of node.getChildren()) {
      const score = child.getScore(policy);
      if (score > maxScore) {
        maxScore = score;
        selection = child.getMove();
      }
    }
    return selection;
  }

  select(node: MctsNode<S>): MctsNode<S> {
    while (!node.isLeaf() && node.isFullyExpanded()) {
      let result = null;
      let score = Number.MIN_SAFE_INTEGER;
      for (const child of node.getChildren()) {
        const newScore = child.getUCB1();
        if (newScore > score) {
          score = newScore;
          result = child;
        }
      }
      node = result;
    }
    return node;
  }

  expand(node: MctsNode<S>): MctsNode<S> {
    const moves = node.getUnexpandedMoveRandomly();
    const newState = this.stateMachine.getNextState(node.getState(), moves);
    const newNode = this.makeNode(newState, moves, node);
    node.addChild(newNode);
    return newNode;
  }

  simulate(state: S): number[] {
    if (this.stateMachine.isTerminal(state)) {
      return this.stateMachine.getGoals(state);
    }
    const newState = this.stateMachine.getRandomNextState(state);
    return this.simulate(newState);
  }

  // simulate(node: MctsNode<S>, stateMachine: StateMachine<S>): void {
  //   let state = node.getState();
  //   while (!stateMachine.isTerminal(state)) {
  //     state = stateMachine.getRandomNextState(state);
  //   }
  //   const goals = stateMachine.getGoals(state);
  //   while (!node.isRoot()) {
  //     node.updateVisits();
  //     node.updateUtility(goals);
  //     node = node.getParent();
  //   }
  // }

  backpropagate(node: MctsNode<S>, goals: number[]) {
    node.updateVisits();
    node.updateUtility(goals);
    if (!node.isRoot()) {
      this.backpropagate(node.getParent(), goals);
    }
  }

  makeNode(state: S, moves: Move[] = null, parent: MctsNode<S> = null): MctsNode<S> {
    if (this.nodes.has(state.hash()) && moves === null && parent === null) {
      return this.nodes.get(state.hash());
    } else {
      const legalJointMoves = this.stateMachine.getLegalJointMoves(state);
      const node = new MctsNode<S>(state, moves, parent, legalJointMoves);
      this.nodes.set(state.hash(), node);
      return node;
    }
  }
}
