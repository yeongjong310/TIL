# 프로토타입(prototype)

Python, java, c++ 등 객체지향언어하면 빠질수 없는 개념인 Class는 모두 익숙할 것이다.
하지만 Javascript에서는 객체를 지향하기 위해 Class가 아닌 Prototype을 사용한다. 그래서 이번 시간에는 조금은 생소한 Prototype에 대해 알아보려 한다.

## Do you know where prototype is used for?
```
function Laptop(){
  this.cpu = "i7-8565U";
  this.ram = 16;
}

let laptop1 = new Laptop();
let laptop2 = new Laptop();

console.log(laptop1.cpu); // 17-8565U
console.log(laptop1.ram); //16

console.log(laptop2.cpu); // 17-8565U
console.log(laptop2.ram); //16
```

laptop1과 laptop2는 같은 제조사에서 만들어진 동일 모델의 노트북이다. 앞으로도 고객의 수요에 따라 laptop3, laptop4 ... 수도없이
만들어질 노트북들의 정보를 효율적으로 저장하려고 한다. 이 때 위와 같이 this를 사용하여 객체의 프로퍼티로 할당할 경우, cpu 와 ram은 만들어지는 laptop1, laptop2... 객체마다 하나하나 저장되게 된다. 즉 객체마다 cpu와 ram을 저장할 공간인 메모리를 할당받게 되고 생성되는 객체가 많아질수록 사용하는 메모리도 커지게 된다. 이 때 prototype을 사용해보자.


```
function Laptop(){}
Laptop.prototype.cpu = "i7-8565U";
Laptop.prototype.ram = 16;

let laptop1 = new Laptop();
let laptop2 = new Laptop();

console.log(laptop1.cpu); // 17-8565U
console.log(laptop1.ram); //16

console.log(laptop2.cpu); // 17-8565U
console.log(laptop2.ram); //16
```
Laptop.prototype이라는 객체(object)에 property(cpu,ram)을 저장하고 
