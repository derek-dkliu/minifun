export class RandomSet<K> {
  private map: Map<K, number>;
  private arr: Array<K>;

  constructor() {
    this.map = new Map<K, number>();
    this.arr = [];
  }

  public add(val: K): boolean {
    if (this.map.has(val)) {
      return false;
    }
    this.map.set(val, this.arr.length);
    this.arr.push(val);
    return true;
  }

  public remove(val: K): boolean {
    if (this.map.has(val)) {
      const index = this.map.get(val);
      const lastVal = this.arr.pop();
      if (index < this.arr.length - 1) {
        this.arr[index] = lastVal;
        this.map.set(lastVal, index);
      }
      this.map.delete(val);
      return true;
    }
    return false;
  }

  public getRandom(): K {
    const index = Math.floor(Math.random() * this.arr.length);
    return this.arr[index];
  }
}
