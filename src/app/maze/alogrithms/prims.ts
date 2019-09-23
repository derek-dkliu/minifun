import { Maze } from '../maze';

class Node {
  id: number;
  weight: number;
  constructor(id: number, weight: number) {
    this.id = id;
    this.weight = weight;
  }
}

export class Prims extends Maze {

  public create(board: boolean[][], row: number, col: number): void {
    row = (row - 1) / 2;
    col = (col - 1) / 2;
    const V = row * col;

    // init graph represented by adjacency list
    const graph = [];
    for (let i = 0; i < V; i++) {
      graph[i] = [];
      const r0 = Math.floor(i / col);
      const c0 = i % col;
      for (const direction of this.directions) {
        const r = r0 + direction[0];
        const c = c0 + direction[1];
        if (r >= 0 && r < row && c >= 0 && c < col) {
          graph[i].push(new Node(r * col + c, this.randomWeight(V)));
        }
      }
    }

    const parent = [];
    const key = [];
    const mstSet = [];
    for (let i = 0; i < V; i++) {
      key[i] = Number.MAX_SAFE_INTEGER;
      mstSet[i] = false;
      parent[i] = -1;
    }
    key[0] = 0;

    for (let count = 0; count < V - 1; count++) {
      const u = this.minKey(key, mstSet);
      mstSet[u] = true;
      for (const node of graph[u]) {
        if (mstSet[node.id] === false && node.weight < key[node.id]) {
          key[node.id] = node.weight;
          parent[node.id] = u;
        }
      }
    }

    for (let i = 0; i < V; i++) {
      if (parent[i] !== -1) {
        const y = Math.floor(parent[i] / col);
        const x = parent[i] % col;
        const yy = Math.floor(i / col);
        const xx = i % col;
        const dy = yy - y;
        const dx = xx - x;
        board[yy * 2 + 1][xx * 2 + 1] = true;
        board[dy + y * 2 + 1][dx + x * 2 + 1] = true;
        board[y * 2 + 1][x * 2 + 1] = true;
      }
    }
  }

  private minKey(key: number[], mstSet: boolean[]): number {
    let min = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;

    for (let i = 0; i < key.length; i++) {
      if (mstSet[i] === false && key[i] < min) {
        min = key[i];
        minIndex = i;
      }
    }
    return minIndex;
  }

  private randomWeight(V: number): number {
    return Math.floor(Math.random() * V);
  }
}
