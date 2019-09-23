class Node<T> {
  val: T;
  next: Node<T>;
  constructor(val: T) {
    this.val = val;
    this.next = null;
  }
}

export class Queue<T> {
  private head: Node<T>;
  private tail: Node<T>;
  constructor() {
    this.head = null;
    this.tail = null;
  }

  public isEmpty(): boolean {
    return this.head === null;
  }

  public add(val: T): Queue<T> {
    const node = new Node<T>(val);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    return this;
  }

  public offer(val: T): Queue<T> {
    return this.add(val);
  }

  public poll(): T {
    if (this.isEmpty()) {
      return null;
    } else {
      const val = this.head.val;
      this.head = this.head.next;
      if (this.isEmpty()) {
        this.tail = null;
      }
      return val;
    }
  }
}
