export class Move {
  constructor(private action: string) {}

  static create(action: string): Move {
    return new Move(action);
  }

  static noop(): Move {
    return new Move('noop');
  }

  getAction(): string {
    return this.action;
  }

  actionable(): boolean {
    return this.getAction() !== 'noop';
  }
}
