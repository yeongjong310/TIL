# this
javascript를 배우기 시작하면 this가 왜 예상했던 객체를 가리키지 않는지 의문이 들 때가 다. javascript는 특정한 규칙에 의해 this를 정의하고, 따라서 객체는 하나만의 객체를 바라보지 않는다. 가령 strict mode와 non-strict mode에서 this가 의미하는 바가 달라지기 때문에
this가 어떤 의미인지 헷갈리기 쉽다. 그래서 이번 시간에는 this를 완벽하게 파헤치고 정리해 보려고 한다.

- 대부분의 경우 this는 함수가 어디서 누구에 의해 실행되는지에 따라 결정된다. 

## 1 Syntax
> this

### 1.1. value
non-strict mode에서는 실행되는 context(global, function or eval)의 property이며 **this는 항상 object를 가리킨다**.
그리고 strict mode에서의 this는 설정하기에 따라 어느 값이든 될 수 있다.

## 2. Description
### 2.1. Global context
기본적으로 global context에서는 this가 window를 가리킨다. window가 전역객체이기 때문이다.
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
non-strict mode인 경우에, 함수 내부에서 this는 함수가 어떻게 실행됐는지에 따라 달라진다.

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

하지만, 아래 예시처럼 strict mode이며, 실행되는 context에서 this가 설정되지 않는다면 this는 `undefined` 이다.
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
class에서 this는 class로 인해 생성되는 객체 자신을 가리킨다. 또한 모든 non-static methods(static이 붙지 않은 method)는 this의 prototype에 추가된다. 
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

> this = new Base(); // this에 Base instance를 할당하면 this가 Base instance를 가리켜야하는데, 자식 instance를 가리킨다... 따라서 이 코드는 적절한 예시가 아닌것 같다. super()의 역할을 다음 두 가지로 알아두면 좋겠다.

1. this가 자식 instance를 가리키게 된다.
2. 부모 생성자를 실행한다.

> **Warning**: super()를 호출하기 전에 this를 언급하면 에러가 발생한다.

그 이유는 생성자가 반환하는 값이 곧 instance(생성된 객체)가 되기 때문인데, 이 instance는 부모로 부터 상속받은 것이어야 하지만 super가 없이는 상속된 객체를 생성할 수 없다. 예제를 보며 살펴보자.
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
### 3.2. this and object conversion
```
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = {a: 1, b: 3};

// 첫번 째 파라미터는 객체이다. function 내부에서 사용되는 this가 이 객체를 가리키게 된다.
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
bind는 this가 입력받은 객체를 가리키는 새 function을 생성해서 반환한다. 즉 bind는 함수가 실행될 때, this를 특정한 객체로 지정하기 위해 사용한다.
bind와 (apply, call)의 차이점은 apply, call이 함수를 실행하며 this를 변경하기 때문에 일회성이지만, bind는 함수를 실행하지 않고 this가 할당된 새로운 함수를 생성하기 때문에 영구적으로 그 function을 사용할 수 있다는 점이다.

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

#### 3.4.1. 기본 규칙
1. `this`는 arrow functions가 정의되는 순간 정해진다. (메소드, 함수의 경우 보통 실행되는 순간 정해짐)
2. `this`는 lexical context **(외부 context)** 의 this를 유지한다. 
- lexical scope는 inner function에서는 outer function의 변수에 접근할 수 있지만, 반대는 불가능한 scope의 특징
3. 따라서 외부 context의 this 가 global 이라면, bind, apply 등 어떠한 규칙을 동원해 `this`를 세팅하더라도 Arrow function 내부의 `this`는  global object를 유지한다.

```
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject); // true;
```
bind, apply, call 을 사용해 this를 설정하면 this에 대한 설정은 무시된다. 하지만 bind, apply, call 메소드가 여전히 동작하기 때문에 첫 번째 argument만 null로 바뀌게 되며 나머지 arguments들은 그대로 함수의 parameter에 전달된다. 
```
var obj = {func: foo};
console.log(obj.func() === globalObject); // true, arrow function을 사용했기 때문에, obj.func()의 this는 obj가 아닌 global이다.

console.log(foo.call(obj) === globalObject); // true, 이하 같은 이유
```
#### 3.4.2. method로 사용된 arrow function은 global
arrow function에서 this는 현재 실행되는 context의 한단계 외부 context의 this를 따른다. 여기서는 외부 context가 ojb다. 즉 obj의 this는 global/window 이기 때문에, arrow function의 this도 global을 가리킨다. 
```
var obj = {
  th: this,
  bar: () => this
}
console.log(obj.th === globalThis); true
console.log(obj.bar() === globalThis); // true
```
#### 3.4.3. arrow function을 method로 사용하더라도 this가 객체를 가리키는 방법
일반 function으로 arrow function을 감싸면, function이 obj의 method가 된다. 아래 코드가 function으로 arrow function을 감싼 예시이다.
1. obj.bar()를 실행하면 function 내부에서 arrow function이 정의된다.
2. 이 때 arrow function의 외부 context는 unnamed function(bar)이 되고 method로 실행되었기 때문에 this는 obj를 가리킨다. 즉 bar가 실행되는 시점에서 function 내부의 this는 obj이기 때문에 arrow function의 this도 obj가 된다. 
```
var obj = {
  bar: function() {
    var x = (() => this);
    return x;
  }
};
var fn = obj.bar(); // bar이 실행되면 arrow function이 선언및 할당된다. arrow function이 정의되는 순간 this는 외곽 context인 obj를 가리키게 된다.
console.log(fn() === ojb); // true

var fn2 = obj.bar; // 한 가지 더, bar를 global 변수에 저장해서 실행하는 경우는 더이상 object의 메소드가 아니다. 따라서 function 내부의 this도 window를 가리키고 fn2가 실행되는 순간 arrow function의 this도 window가 된다.
console.log(f2()() == window); // true

fn2.call(obj)() === obj; // true

fn2().call(obj) === window ; //true

```

#### 3.4.4. arrow function의 특징을 살려서 DOM-level methods와 사용하면 Good.
```
var obj = {
  count : 10,
  plusOneLater : function() {
    setTimeout(function() {
      this.count ++;
      console.log(this.count);
    }, 300);
  }
}
obj.plusOneLater(); // NaN => Dom level method에서 window는 Dom document를 포함하고 있다. dom level method도 window의 method이며 method 안에서의 this는 window를 가리킨다. 일반함수는 실행시점에 this를 binding 하기 때문에 별다른 조치를 취하지 않는 경우 모든 callback은 전역을 가리킨다.
```
해결방안! arrow function을 사용하자. => 정의되는 시점 binding
```
var obj = {
  count : 10,
  plusOneLater : function() {
    setTimeout(() => {
      this.count ++;
      console.log(this.count);
    })
  }
}
obj.plusOneLater(); // 11;
```
이전에 살펴본 것 과 같이, arrow function을 regular function으로 둘러싸면 this는 object를 가리킨다.
1. obj.plusOneLater(); method가 실행되는 순간 function 내부에서 사용되는 this는 obj를 가리킨다.
2. setTimeout이 실행되기 전 argument로서 () => {} arrow function이 이미 정의된다.
3. 정의되는 순간? arrow function의 this는 고정된다. => obj를 가리킨다.
4. setTimeout 내부에서 this가 실행되더라도 arrow function의 this는 변화 x.

### 3.5. As an object method
함수가 object의 method로 **실행될 때**, `this`는 이 method를 호출하는 object로 설정된다.
```
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};

console.log(o.f()); // 37
```
function이 어디서, 어떻게 정의됐는지와 상관없이 메소드로 실행되면 항상 이 규칙이 적용된다. 
```
var o = {prop: 37};

function independent() {
  return this.prop;
}

o.f = independent;

console.log(o.f()); // 37
```
그리고, 이 규칙은 겹겹이 쌓인 객체에서 단계를 거쳐 호출하더라도 `this`는 마지막에 그 method를 호출하는 객체를 가리.
```
o.b = {g: independent, prop: 42};
console.log(o.b.g()); // 42
```

#### 3.5.1. `this` on the object's prototype chain
prototype에도 이 규칙이 적용된다.
```
var o = {
  f: function() {
    return this.a + this.b
  }
};
var p = Object.create(o);
p.a = 1;
p.b = 4;

console.log(p.f()); //5
```
p는 f를 o로 부터 상속 받았다. 그리고 p에서 f 메소드를 호출할 때 o에서 찾게된다. 그렇더라고 p.f 즉 p를 통해 f를 호출하고 있기 때문에
this는 p를 가리킨다.

#### 3.5.2. this whit a getter or setter
마찬가지로 setter와 getter에서 this를 사용한다면 `this`는 그 getter와 setter를 부르는 object를 가리킨다.
```
function sum() {
  return this.a + this.b + this.c;
}

var o = {
  a: 1,
  b: 2,
  c: 3,
  get average() {
    return (this.a + this.b + this.c) / 3;
  }
};

Object.defineProperty(o, 'sum', {
  get: sum, emuerable: true, configuarable: true});
  
console.log(o.average, o.sum); // 2, 6
```

### 3.6 As a constructor
function이 생성자로 사용될 때, function 내부의 this는 생성될 object를 가리킨다.

**note:** 생성자의 역할중 하나는 생성될 object를 반환하는 것이다. 따라서 아래처럼 다른 object를 반환하면 그 object를 생성한다.
```
생성자는 다음과 같이 동작한다.
// this에 의해 설계된 property를 생성한다. ex) this.fum = "nom";
// function 이 반환하는 object가 있다면 그 object가 new expression에 의해 생성되는 object가 된다.
// 따라서 Myconstructor의 prototype과 연결된 __proto__(function의 prototype을 가리킴 => 모든 function은 prototype을 가지고있다)를 속성으로 가지는 object가 생성된다. ex ){ fum = "nom", __proto__: Object }
// new 생성자를 사용하면 이 생성자로부터 상속된 object를 반환한다.

function Myconstructor() {
  this.a = 37;
}

var o = new Myconstructor();
console.log(o.a); // 37

function C2() {
  this.a = 37;
  return {a: 38};
}

o = new C2();
console.log(o.a); //38
```
- 요약: function이 반환하는 값이 new expression의 객체로 생성된다. 
- new 생성자를 사용하면 return 문이 없어도 this로 설계한 object가 생성되며 자동으로 반환된다.
- 하지만, 함수 끝에 return으로 어떤 값을 반환하면 위의 과정이 무시되며, 반환된 값은 object로 변환되어 그 object가 생성된다.

### 3.7. As a Dom Event handler
function이 Dom의 event handler로 사용되면, `this`는 해당 listener가 배치된 element를 가리킨다.( 어떠 브라우저는 addEventLister()외에 추가된 listener에서는 이 규칙을 적용하지 않는다. )
```
//when called as a listener, turns the related element blue
function bluify(e) {
  // Always true
  console.log(this === e.currentTarget); // event handler가 부착된 element
  //true when currentTarget and target are the same object
  console.log(this === e.target); // clicked 된 element
  this.style.backgroundColor = '#A5D9F3';
}

// Get a list of every element in the document
var elements = document.getElementByTagName('*');

// Add bluify as a click listener so when the element is clicked on, it turn blue
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', bluify, false);
}
```
### 3.8. In an inline event handler
function이 html 코드 내 element의 event handler로 작성된 경우에도 역시 this는 listenr가 배치된 Dom element를 가리킨다. 
```
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>
```
하지만 outer function에서만 this는 element를 가리키고, innner function의 경우에는 global/window를 가리킨다.
### 3.9. this in classes
regular function의 경우에 한해, this는 this를 호출하는 object에 따라 달라진다.
이 규칙을 override 하기위해 사용할 수 있다.
```
class Car {
  constructor() {
    // Bind sayBye but not sayHi to show the difference
    this.sayBye = this.sayBye.bind(this); // sayBye의 경우 this로 bind 되기 때문에 이후에 car가 생성되면 this는 무조건 생성된 처음 객체를 바라본다.
  }
  sayHi() {
    console.log(`Hello from ${this.name}`);
  }
  sayBye() {
    console.log(`Bye from ${this.name}`);
  }
  get name() {
    return 'Ferrari';
  }
}

class Bird {
  get name() {
    return 'Tweety';
  }
}

const car = new Car(); // 원본 객체
const bird = new Bird(); // 메소드가 복사될 객체

//  method를 불러오는 object에 따라 'this'가 바뀜.
car.sayHi(); // Hello from Ferrari
bird.sayHi = car.sayHi;
bird.sayHi(); // Hello from Tweety

// bound된 method는 'this'가 고정됨.
bird.sayBye = car.sayBye;
bird.sayBye(); // Bye from Ferrari.
```
### 3.10. callback

**note** 객체에 정의된 메소드에 콜백함수를 넘겨주는 경우, this는 전역 변수를 가리킨다. outer의 fn이 실행되면, callback에 obj.prinJob이 할당될 것이다. 이후 callback() 함수가 실행된다. 즉 callback()은 객체를 통해 불려지는 것이 아니라, 그 함수 자체로 실행되기 때문에 this는 global을 가리킨다.
```
var obj = {
  name: "tory", 
  job: "Js master",
  printJob: function(){
    console.log(`${this.name}'s job is ${this.job}`);
  }
}

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
해결방법 1. call함수를 함께 callback으로 넣어주면, this는 입력된 obj를 가리키며 실행된다.
```
var name = "global";
var job = "gjob";
let outer = {
    name: "outer",
    fn:function(callback){
        callback();
    }
}
outer.fn(obj.printJob.call(obj)); // "tory's job is Js master"
```
해결방법 2. obj가 method를 불러오도록 function으로 감싸준다.
```
outer.fn(function() {
  obj.printJob();
})
```


## 4. 문제 풀어보기.
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



### 답
문제1) yeongjong's job is fe developer
문제2) undefined's job is undefined


##### 참고
[this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
