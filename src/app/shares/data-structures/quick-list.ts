import { Queue } from './queue';

class Node<T> {
  val: T;
  next: Node<T>;
  prev: Node<T>;
  constructor(val: T) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

export class QuickList<T> {
  private head: Node<T>;
  private tail: Node<T>;
  private map: Map<T, Queue<Node<T>>>;

  constructor() {
    this.head = null;
    this.tail = null;
    this.map = new Map<T, Queue<Node<T>>>();
  }

  public isEmpty(): boolean {
    return this.head === null;
  }

  public add(val: T): void {
    const node = new Node<T>(val);

    if (this.isEmpty()) {
      this.head = node;
      this.tail = this.head;
      this.map.set(val, new Queue<Node<T>>().add(node));
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;

      if (this.map.has(val)) {
        const queue = this.map.get(val);
        queue.add(node);
      } else {
        this.map.set(val, new Queue<Node<T>>().add(node));
      }
    }
  }

  public remove(val: T): boolean {
    if (this.isEmpty()) {
      return false;
    } else {
      if (this.map.has(val)) {
        const queue = this.map.get(val);
        const node = queue.poll();
        if (node.prev !== null) {
          node.prev.next = node.next;
        } else {
          this.head = node.next;
        }
        if (node.next !== null) {
          node.next.prev = node.prev;
        } else {
          this.tail = node.prev;
        }

        if (queue.isEmpty()) {
          this.map.delete(val);
        }
        return true;
      }
      return false;
    }
  }

  public toString(): string {
    const tmp = [];
    let curr = this.head;
    while (curr !== null) {
      tmp.push(curr.val);
      curr = curr.next;
    }
    return tmp.join(',');
  }
}
