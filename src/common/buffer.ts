export class RingBuffer<T> {
  private buf: (T | undefined)[];
  private head = 0;
  private size = 0;
  readonly capacity: number;

  constructor(capacity: number) {
    this.buf = new Array<T | undefined>(capacity);
    this.capacity = capacity;
  }

  push(item: T) {
    this.buf[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this.size < this.capacity) {
      this.size++;
    }
  }

  toArray(): T[] {
    const copied = new Array<T>(this.size);
    const start = (this.head - this.size + this.capacity) % this.capacity;
    for (let i = 0; i < this.size; i++) {
      copied[i] = this.buf[(start + i) % this.capacity]!;
    }
    return copied;
  }

  latest(size: number): T[] {
    const count = Math.min(size, this.size);
    const copied = new Array<T>(count);
    const start = (this.head - count + this.capacity) % this.capacity;
    for (let i = 0; i < count; i++) {
      copied[i] = this.buf[(start + i) % this.capacity]!;
    }
    return copied;
  }

  get length() {
    return this.size;
  }
}
