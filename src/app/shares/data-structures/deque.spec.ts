import { Deque } from './deque';
import { forEach } from '@angular/router/src/utils/collection';

describe('Deque', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  it('should be empty', () => {
    expect(deque.isEmpty()).toBeTruthy();
  });

  it('should add to the first place', () => {
    deque.addFirst(3);
    deque.addFirst(2);
    deque.addFirst(1);
    expect(deque.removeFirst()).toBe(1);
    expect(deque.removeLast()).toBe(3);
  });

  it('should add to the last palce', () => {
    deque.addLast(1);
    deque.addLast(2);
    deque.addLast(3);
    expect(deque.removeFirst()).toBe(1);
    expect(deque.removeLast()).toBe(3);
  });
});
