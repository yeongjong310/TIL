# this
javascript에서 this는 생각보다 복잡한 규칙에 의해 정의된다. 각 규칙에 의해 this가 가리키는 곳은 어떻게 달라지는지 정리한다.

### 1. 함수 내부에서 사용되는 this

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

**note**: 엄격모드의 경우 함수 내부에 정의된 프로퍼티가 없다면 TypeError가 발생한다.

### 2. 메소드의 this
메소드의 this 는 부모 객체를 가리킨다.(메소드 내부에서 this를 사용하지 않았다고 가정했을 경우) 
ex) obj.printJob()에서는 .앞의 obj를 가리킨다. 즉 일반적으로 메소드는 항상 .의 앞부분 객체를 가리킨다고 생각하면 편하다.
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
**note**: 메소드를 새로운 변수에 할당하면 부모를 잃어버린다. 때문에 this는 변수를 찾기위해 외부 스코프를 찾아가다 마지막은 전역 context를 가리킨다.
```
let fn = obj.printJob;
fn(); // undefined's job is undefined
-------------------------------------------
function test() {
    this.name = "test name";
    this.job = "test job";
    let fn = obj.printJob
    fn(); // "test name's job is test job"
}
test();
-------------------------------------------
var name = "global";
var job = "gjob";
function test() {
    let fn = obj.printJob
    fn(); // "global name's job is gjob"
}
```
**note** 객체에 정의된 메소드에 콜백함수를 넘겨주는 경우, this는 전역 변수를 가리킨다.  
내 예상은 지역변수 callback에 obj.printJob이 할당되면서 obj의 메소드인 printJob에서 가리키는 this는 해제되고, 외부스코프(부모 객체)를 찾아갈 것이라 생각했는데 어떤 이유로 this 가 바로 전역 context를 가리키는지는 아직 모르겠다.
```
var name = "global";
var job = "gjob";
let outer = {
    name: "outer",
    fn:function(callback){
        callback();
    }
}
outer.fn(obj.printJob); // global's job is gjob

```
문제:
```
var obj = {
  name: "tory", 
  job: "Js master",
  printJob: function(){
    console.log(`${this.name}'s job is ${this.job}`);
  }
}
```
1번)
```
let fn = {
    name: "yeongjong",
    job: "fe developer",
    a:obj.printJob
}
```
fn.a(); 의 출력값은?

2번)
```
let fn = {
    name: "yeongjong",
    job: "fe developer",
    a: function(callback){
      callback()
    }
}
```
fn.a(obj.printJob); 의 출력 값은?

### 3. call, apply, bind로 this 넘겨주기

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
fn(); // undefined's job is undefined

let boundfn = fn.bind(obj);
bounfn(); // tory's job is Js master

function getName(callback){
  callback();
}
getName(obj.printJob.call(obj)); // "tory's job is Js master"
```
**arrow function에서는 이 메소드들을 사용하더라도 넘겨받은 this를 가키리지 않는다. ***

### 4. arrow function expressions 사용했을 때 this는?
기본적으로 this는 아무곳도 가리키지 않는다. 

**note:** 메소드로 arrow function을 사용하면 전역을 가리킨다.
```
var obj = {
  name: "tory", 
  job: "Js master",
  printJob: () => console.log(`${this.name}'s job is ${this.job}`);
  }
}
obj.printJob(); // undefined's job is undefined

```
```
var obj = {
  name: "tory", 
  job: "Js master",
  printJob: () => setTimeout(() => {
    console.log(`${this.name}'s job is ${this.job}`);
  }, 300);
  }
}
obj.printJob(); // undefined's job is undefined

```
하지만... 
**note:** 함수내부에 arrow function을 사용하면 정의된 this가 없기 때문에 상위 스코프를 따라 this를 찾아간다. 
```
var obj = {
  name: "tory", 
  job: "Js master",
  printJob: function() {
    setTimeout(() => {
      console.log(`${this.name}'s job is ${this.job}`);
    }, 300);
  }
}
obj.printJob(); // tory's job is Js master
```

### 여기까지 정리:
#### arrow function expresstion
1. 메서드에서는 function을 사용하는게 낫다. 

이유: arrow function 표현식을 사용하면 this가 객체를 가리키지 않기때문


2. 메서드 내부에서 전역함수를 사용하고 그 전역함수 내부로 콜백함수를 넘겨줄 때 콜백함수 내부에서 this가 객체를 가리키기 위해
function으로 전역함수를 감싸준다. => 이유: 정확한 이유는 모르겠으나 함수내부에서 arrow function을 사용했을 때 this가 상위 스코프를 찾아가고 결국 객체를 가리키기 때문.



### 답
문제1) yeongjong's job is fe developer
문제2) undefined's job is undefined
