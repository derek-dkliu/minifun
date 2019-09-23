export class Utils {
  static shuffle(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const index = Math.floor(Math.random() * (i + 1));
      const move = arr[i];
      arr[i] = arr[index];
      arr[index] = move;
    }
    return arr;
  }
}
