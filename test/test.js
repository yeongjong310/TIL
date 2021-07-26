// const Queue = (function Queue(){
//   function Queue(array = []) {
//     if (!Array.isArray(array))
//       throw new TypeError(`${array} is not array`);
//     this.queue = array
//   }
//   Queue.prototype.enqueue = function(value) {
//     // this.queue.push(value)
//     // this.queue = [this.queue, value]
//     this.queue[this.queue.length] = value
//     return this.queue
//   }
//   Queue.prototype.dequeue = function(value) {
//     return this.queue.shift();
//   }
//   return Queue
// })();

// const queue = new Queue([1,2,3]);
// queue.enqueue(4);
// queue.dequeue();
// console.log(queue.queue);

// class Queue{
//   #queue;
//   constructor(arr = []){
//     if(!Array.isArray(arr))
//       throw new TypeError(`${arr} is not array`);
//     this.#queue = arr;
//   }

//   enqueue(v) {
//     this.#queue = this.#queue.concat(v);
//   }
//   dequeue() {
//     this.#queue.shift();
//   }
//   entries() {
//     return [...this.#queue];
//   }
// }

// const queue = new Queue([1,2,3]);
// queue.enqueue(4)
// console.log(queue.entries());

// const arr = new Array(3).fill(0);
// console.log(arr);

const arr = (length = 0) => Array.from({length}, (v, i) => i);
console.log(arr(3));