export abstract class Maze {
  public directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  public buildBoard(row: number, col: number, entry: number[], exit: number[]): boolean[][] {
    const board = [];
    for (let i = 0; i < row; i++) {
      board[i] = [];
      for (let j = 0; j < col; j++) {
        board[i][j] = false;
      }
    }
    this.create(board, row, col);
    board[entry[0]][entry[1]] = true;
    board[exit[0]][exit[1]] = true;
    return board;
  }

  public abstract create(board: boolean[][], row: number, col: number): void;
}
