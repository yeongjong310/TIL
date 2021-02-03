# this
javascript에서 this는 복잡한 규칙에 의해 정의된다. 또한 strict mode와 non-strict mode에서 this가 의미하는 바가 달라지기 때문에
this가 어떤 의미인지 헷갈리기 쉽다. 그래서 이번 시간에는 this를 완벽하게 파헤치고 정리해 보려고 한다.

- 대부분의 경우 this는 함수가 어디서 실행되는지에 따라 결정된다. 
- 실행중에 this에 어떤 값을 할당할 수 없다.

## 1 Syntax
> this

### 1.1. value
non-strict mode에서는 실행되는 context(global, function or eval)의 property이며 this는 항상 object를 참조한다.
그리고 strict mode에서의 this는 어느 값이든 될 수 있다.

## 2. Description
### 2.1. Global context
global context에서는 this가 window를 가리킨다. window가 전역객체이기 때문이다.
```
console.log(this === window); // true

a = 37;
console.log(window.a);

this.b = "MDN";
console.log(window.b); // "MDN"
console.log(b); // "MDN"
```
**Note:** 현재 실행되고있는 어떤 context에서도 쉽게 global object에 접근하는 방법이 있다. [globalthis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 는 항상 global object를 가리킨다.

### 2.2. Function context
non-strict mode인 경우에, 함수 내부에서의 this는 함수가 어떻게 실행됐는지에 따라 바뀐다.

1. strict mode?
2. call, bind, apply에 의해 this를 특정한 객체로 지정했는가?

아래 예시는 1번과 2번 모두 해당하지 않기 때문에 this는 기본적으로 global object를 가리킨다.

```
function f1() {
return this;
}

// In a browser:
f1() === window; // true

// In Node:
f1() === globalThis; //true
```

하지만, 아래 예시처럼 strict mode이며, context가 실행될 때 this가 설정되지 않는다면 this는 `undefined` 이다.
```
function f2() {
  'use strict'; // see strict mode
  return this;
}

f2() === undefined; // true
window.f2() === undefined; // false => window object의 메소드로 실행되었다. this는 해당 object인 window를 가리킨다.
```

this를 특정한 값으로 설정하기 위해서는 call(), apply(), bind()를 사용해라.

### 2.3. Class context
class에서 this는 하나의 객체이다. this는 class로 인해 생성되는 객체 자신을 가리킨다. 또한 모든 non-static methods(static이 붙지 않은 method)는 this의 property에 추가된다. 
```
class Example {
  constructor() {
    const proto = Object.getPrototypeOf(this); // this는 각 객체를 가리키고 각 객체의 prototype은 Example의 prototype이다.
    console.log(Object.getOwnPropertyNames(proto)); 
  }
  first(){} // this의 prototype에 추가됨
  second(){} // this의 prototype에 추가됨
  static third(){} //this의 prototype에 추가되지 않음, static은 class 자신의 properties이다. => static은 나중에 다시 알아보자.
}

new Example(); // ['constructor', 'first', 'second']
```

### 2.4. Derived classes
class 생성자가 다른 생성자들로 부터 상속되었다면, this는 기본적으로 instance에 binding 되지 않는다. 
따라서 constructor 내에서 this를 사용하면 에러가 발생한다. 하지만 super()를 불러오면 부모 class의 생성자를 호출하고, this를 instance에 binding 한다. super() 는 다음 코드와 같은 효과가 있다.

> this = new Base(); // this에 Base instance를 할당하면 this가 Base instance를 가리켜야하는데, 자식 instance를 가리킨다... 따라서 이 코드는 적절한 예시가 아닌것 같다. 내가 짐작한 바로 super의 역할은 다음과 같다.

1. this가 자식 instance를 가리킨다.
2. 부모 생성자의 코드를 실행한다.

> **Warning**: super()를 호출하기 전에 this를 언급하면 에러가 발생한다.

그 이유는 생성자가 반환하는 값이 곧 instance(생성된 객체)가 되기 때문인데, 예제를 보며 살펴보자.
```
class Base {} // 기본 class는 constructor가 있으나 없으나 Base의 prototype을 참조하는 instance를 생성한다.
class Good extends Base {} // 상속된 class에서 생성자가 없는 경우는, instance가 Good property를 자동으로 참조하고 디음으로 Base도 참조한다.
class AlsoGood extends Base { // 생성자가 있고 객체를 반환하는 경우, 생성자로 부터 그 객체가 생성된다.
  contructor() {
    return {a: 5};
  }
}
class Bad extends Base { //생성자가 있다면 무조건 return하게 된다. 그런데 super를 호출하지 않으면 자식 class가 부모 class의 생성자 정보를 알 수 없기 때문에 error. => 그냥 constructor를 사용하려면 super를 무조건 쓰자!
  constructor() {}
}
new Good();
new AlsoGood();
new Bad(); // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from drived constructor
```

## 3. Examples

### 3.1. this in function contexts.
```
var obj = {a: 'Custom'};

var a = 'Global';

function whatsThis() {
  return this.a;
}

whatsThis();          // 'global' 함수 내에서 this가 정의되지 않았기 때문에, this는 global/window object를 가리키다.
whatsThis.call(obj);  // 'Custom' 함수 내의 this 가 call에 의해 obj로 설정되었기 때문에, this는 obj를 가리킨다.
whatsThis.apply(obj);  // 'Custom' 함수 내의 this 가 aplly에 의해 objs로 설정되었기 때문에, this는 obj를 가리킨다.
```
### 3.2. this and object onversion
```
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = {a: 1, b: 3};

// 첫번 째 파라미터는 객체이다. 이 객체는 function의 this가 된다.
// subsequent parameters(다음으로 오는 파라미터들)은 함수가 실행될 때 arguments(실제 값)로 입력된다.
add.call(o, 5, 7); // 16

// 첫번 째 파라미터는 객체이다. 이 객체는 function의 this가 된다.
// 두번 째 파라미터는 배열이다. 이 배열의 요소들이 arguments(실제 값)으로 입력된다.
add.apply(o, [10, 20]); // 34
```
**Note:** 
1. non-strict mode에서 call과 apply의 첫번 째 파라미터로 객체가 입력되지 않으면 자동으로 객체로 변환된다. ex) 7 or 'foo'와 같은 원시값은  연관된 생성자를 이용해 Object로 변환된다. new Number(7), new String('foo'). e.g. 
2. null과 undefined가 입력되면 this는 global/ window object를 가리킨다.

```
function bar() {
  console.log(Object.prototype.toString.call(this));
}

bar.call(7) // [object Number]
bar.call('foo') // [object String]
bar.call(undefined); [object global]
```

### 3.3. The bind method
bind는 입력받은 객체를 this로 하는 새로운 function을 생성한다. 그리고 그 function은 기존의 함수를 대체한다.
bind와 (apply, call)의 차이점은 apply, call이 함수를 실행하며 this를 변경하기 때문에 일회성이지만, bind는 함수를 실행하지 않고 this가 할당된 새로운 함수를 생성하기 때문에 영구적으로 그 function을 사용할 수 있다는 것이다.

```
function f() {
  return this.a;
}

var g = f.bind({a: 'azerty'});
console.log(g()); // azerty

var h = g.bind({a: 'yoo')}; bind는 오직 한번만 적용된다.
console.log(h()); azerty

var o = {a: 37, f: f, g: g, h: h};
console.log(o.a, o.f(), o.g(), o.h()); // 37, 37, 'azerty', 'azerty'
```

### 3.4. Arrow functions
Aroow functions에서 `this`는 둘러싸고 있는 lexical context (외부 context)의 this를 유지한다. 예를들어 외부 context의 this 가 global 이라면, bind, apply 등 어떠한 규칙을 동원해 `this`를 세팅하더라고 Arrow function 내부의 `this`는  global object를 유지한다.

```
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObjec); // true;
```
bind, apply, call 을 사용해 this를 설정하면 this에 대한 설정은 무시된다. 하지만 bind, apply, call 메소드가 여전히 동작하기 때문에 첫 번째 argument만 null로 바뀌게 되며 나머지 arguments들은 그대로 함수의 parameter에 전달된다. 
```
var obj = {func: foo};
console.log(obj.func() === globalObject); // true, arrow function을 사용했기 때문에, obj.func()의 this는 obj가 아닌 global이다.

console.log(foo.call(obj) === globalObject); // true, 이하 같은 이유
```
객체의 메소드로 regular function을 생성하고, 내부에 arrow function을 사용해도 this는 여전히 lexical context의 `this`와 동일하다.



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


##### 참고
[this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
