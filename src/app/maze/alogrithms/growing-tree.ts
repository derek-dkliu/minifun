import { RandomStack } from '../../shares/data-structures/random-stack';
import { Maze } from '../maze';

class Cell {
  r: number;
  c: number;
  constructor(r: number, c: number) {
    this.r = r;
    this.c = c;
  }
}

export class GrowingTree extends Maze {

  public create(board: boolean[][], row: number, col: number): void {
    const first = new Cell(0, 0);
    board[first.r * 2 + 1][first.c * 2 + 1] = true;
    const active = new RandomStack<Cell>();
    active.push(first);
    while (!active.isEmpty()) {
      const cell = active.next(0.2);

      const options = [];
      for (const direction of this.directions) {
        const r = (direction[1] + cell.r) * 2 + 1;
        const c = (direction[0] + cell.c) * 2 + 1;
        if (r > 0 && r < row - 1 && c > 0 && c < col - 1 && board[r][c] === false) {
          options.push([direction[1], direction[0]]);
        }
      }

      if (options.length > 0) {
        const [dr, dc] = options[Math.floor(Math.random() * options.length)];
        const rr = cell.r + dr;
        const cc = cell.c + dc;
        active.push(new Cell(rr, cc));
        board[rr * 2 + 1][cc * 2 + 1] = true;
        board[dr + cell.r * 2 + 1][dc + cell.c * 2 + 1] = true;

      } else {
        active.remove(cell);
      }
    }
  }
}
