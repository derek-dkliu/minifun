import { RandomStack } from './random-stack';

describe('RandomStack', () => {
  let stack: RandomStack<number>;
  let nums: number[];

  beforeEach(() => {
    stack = new RandomStack<number>();
    nums = [1, 2, 3];
    for (const num of nums) {
      stack.push(num);
    }
  });

  it('should be empty', () => {
    expect(stack.isEmpty()).toBeFalsy();
    for (const num of nums) {
      stack.pop();
    }
    expect(stack.isEmpty()).toBeTruthy();
  });

  it('should push to top', () => {
    expect(stack.peek()).toBe(3);
  });

  it('should pop from top', () => {
    expect(stack.peek()).toBe(3);
    expect(stack.pop()).toBe(3);
    expect(stack.peek()).toBe(2);
  });

  it('should remove element', () => {
    expect(stack.peek()).toBe(3);
    expect(stack.remove(2)).toBeTruthy();
    expect(stack.peek()).toBe(3);
  });

  it('should return random elemtn', () => {
    expect(nums).toContain(stack.random());
  });
});
