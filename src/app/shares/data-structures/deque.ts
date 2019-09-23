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

export class Deque<T> {
  private head: Node<T>;
  private tail: Node<T>;
  constructor() {
    this.head = null;
    this.tail = null;
  }

  public isEmpty(): boolean {
    return this.head === null;
  }

  public offer(val: T): Deque<T> {
    return this.addLast(val);
  }

  public poll(): T {
    return this.removeFirst();
  }

  public push(val: T): Deque<T> {
    return this.addLast(val);
  }

  public pop(): T {
    return this.removeLast();
  }

  public addLast(val: T): Deque<T> {
    const node = new Node<T>(val);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    return this;
  }

  public removeFirst(): T {
    if (this.isEmpty()) {
      return null;
    } else {
      const val = this.head.val;
      this.head = this.head.next;
      if (this.head !== null) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      return val;
    }
  }

  public addFirst(val: T): Deque<T> {
    const node = new Node<T>(val);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return this;
  }

  public removeLast(): T {
    if (this.isEmpty()) {
      return null;
    } else {
      const val = this.tail.val;
      this.tail = this.tail.prev;
      if (this.tail !== null) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
      return val;
    }
  }
}
