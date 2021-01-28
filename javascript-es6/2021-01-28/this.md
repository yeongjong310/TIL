# this
javascript에서 this는 생각보다 복잡한 규칙에 의해 정의된다. 각 규칙에 의해 this에 할당되는 함수, 객체가 어떻게 달라지는지 정리한다.

1. 함수 내부에서 사용되는 this

함수 내부에서 사용되는 this는 기본적으로 함수 자신을 가리킨다. 하지만 내부에 호출하는 프로퍼티가 없다면 외부 Scope를 찾아간다.
```
var bar = "outer"
function foo() {
  this.bar = "inner";
  console.log( this.bar );  // "inner"
}
```
```
var bar = "outer"
function foo() {
  console.log( this.bar );  // "outer"
}
```

**note** 엄격모드의 경우 함수 내부에 정의된 프로퍼티가 없다면 TypeError가 발생한다.

2. 메소드의 this는 부모 객체를 가리킨다. ex obj.printJob()에서는 .앞의 obj를 가리킨다. 즉 메소드는 항상 .의 앞부분 객체를 가리킨다고 생각하면된다.
```
var obj = {
  name: "tory", 
  job: "Js master",
  printJob: function(){
    console.log(`${this.name}'s job is ${this.job}`);
  }
}
obj.printJob() // tory's job is Js master
```
**note: 메소드를 새로운 변수에 할당하면 부모를 잃어버리기 때문에 this는 외부함수 혹은 전역을 가리킨다.
```
let fn = obj.printJob;
fn(); // 's job is undefined
```
따라서 메소드를 콜백함수로 넘겨주는 경우에도, 매개변수(지역변수)에 메소드가 할당되기 때문에 this는 전역을 가리킨다. 주의해야 한다.
```
function getName(callback){
  callback();
}
getName(obj.printJob); // 's job is undefined
```

3. call, apply, bind로 this 넘겨주기

call, apply, bind로 객체 혹은 this를 넘겨주면 함수 내부에서 this는 넘겨받은 객체를 가리킨다.
```
var obj = {
  name: "tory", 
  job: "Js master",
  printJob: function(){
    console.log(`${this.name}'s job is ${this.job}`);
  }
}
let fn = obj.printJob;
fn(); // 's job is undefined

let boundfn = fn.bind(obj);
bounfn(); // tory's job is Js master

function getName(callback){
  callback();
}
getName(obj.printJob.call(obj)); // "tory's job is Js master"
```
**arrow function에서는 이 메소드들을 사용하더라도 넘겨받은 this를 가키리지 않는다. **
4. 
