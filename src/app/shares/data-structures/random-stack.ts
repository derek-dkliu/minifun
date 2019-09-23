import { Deque } from './deque';

class Node<T> {
  index: number;
  val: T;
  next: Node<T>;
  prev: Node<T>;
  constructor(val: T, index: number) {
    this.index = index;
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

export class RandomStack<T> {
  private head: Node<T>;
  private tail: Node<T>;
  private map: Map<T, Deque<Node<T>>>;
  private arr: Array<Node<T>>;

  constructor() {
    this.head = null;
    this.tail = null;
    this.map = new Map<T, Deque<Node<T>>>();
    this.arr = [];
  }

  public isEmpty(): boolean {
    return this.head === null;
  }

  public push(val: T): void {
    const node = new Node<T>(val, this.arr.length);

    if (this.isEmpty()) {
      this.head = node;
      this.tail = this.head;
      this.map.set(val, new Deque<Node<T>>().push(node));
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;

      if (this.map.has(val)) {
        const deque = this.map.get(val);
        deque.push(node);
      } else {
        this.map.set(val, new Deque<Node<T>>().push(node));
      }
    }
    this.arr.push(node);
  }

  public remove(val: T): boolean {
    if (this.isEmpty()) {
      return false;
    } else {
      if (this.map.has(val)) {
        const deque = this.map.get(val);
        const node = deque.poll();
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

        if (deque.isEmpty()) {
          this.map.delete(val);
        }

        const lastNode = this.arr.pop();
        if (node.index < lastNode.index) {
          lastNode.index = node.index;
          this.arr[node.index] = lastNode;
        }

        return true;
      }
      return false;
    }
  }

  public pop(): T {
    if (this.isEmpty()) {
      return null;
    } else {
      const val = this.arr.pop().val;
      const deque = this.map.get(val);
      const node = deque.pop();
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

      if (deque.isEmpty()) {
        this.map.delete(val);
      }
      return node.val;
    }
  }

  public peek(): T {
    if (this.isEmpty()) {
      return null;
    }
    return this.tail.val;
  }

  public random(): T {
    if (this.isEmpty()) {
      return null;
    }
    const index = Math.floor(Math.random() * this.arr.length);
    return this.arr[index].val;
  }

  public next(prop: number): T {
    if (Math.random() <= prop) {
      return this.random();
    } else {
      return this.peek();
    }
  }
}
