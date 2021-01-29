# arrow function expressions
arrow function expressions 에 대해 자세히 정리해 보자.

arrow function expression은 일반적으로 함수를 정의할 때 사용하는 function expression을 간단한 문법으로 대체한 표현식이다.

**Differences & Limitations:**
- 함수가 어디에도 바인딩되지 않았기 때문에 browser에서의 this는 Window를 가리킨다. (server side js는 아직 모르겠음)
- 따라서 super도 사용할 수 없다.(super는 상위 클래스의 생성자를 호출함)
- 함수를 특정 scope의로 지정하기 위해 call, apply, bind를 사용하는 것은 적절하지 않다.
- 생성자로 사용될 수 없다.
- yield도 사용할 수 없다.

```
const materials = ['Hydrogen', 'Helium']
console.log(materials.map(material => material.length));
// Array [8, 6]
```

## 1. Comparing traditional functions to arrow functions
일반 function 함수 구조를 arrow function 문법으로 바꿔보자.

```
// Traditional Function
function (a) {
  return a + 100;
}

// Arow Fucntion Break Down

// 1. function 키워드를 지우고 argument를 감싸는 ()와 명령문을 감싸는 {} 사이에 화살표 기호 => 를 사용한다.
(a) => {
  return a + 100;
}

// 2. 명령문을 감싸고있는 {}를 지우고 return 또한 지운다. --> {}를 지우고 실행될 명령문이 한줄인 경우 그 문장이 return 된다.
(a) => a + 100;

// 3. argument를 감싸고있는 ()를 지운다. --> argument가 1개인 경우 생략가능.
a => a + 100;
```
> 위 코드에서 보았듯이 {}, (), return은 option 이다. 때에 따라 적절히 사용할 수 있게 완전히 자신은 것으로 만들어야 한다.

예를들어, argument가 2개 이상인 경우 ()는 필수이다.
```
(a, b) => a + b + 100;
```
또한, 실행될 명령문이 두 줄 이상인 경우 {}과 return은 필수이다.
```
(a, b) => {
  let chunk = 42l
  return a + b + chunk;
}
```
마지막으로, function의 이름을 설정하기 위해서는 함수 표현식과 같이 변수에 저장한다.
```
let bob = a => a + 100;
```

## 2. Syntax
### Advanced syntax
{}가 명령문을 감싸고 있는지 아니면 객체를 반환하는 것인지 javascript 해석기는 알 수 없다. 따라서 기본적으로 {}를 명령문으로 인지하며
객체(object)를 단독으로 반환하기 위해서는 꼭 ()로 객체를 감싸주어야 한다.

```
params => ({foo: "a"});

params => {}||0;  // Unexpected token '||'  param => {}에서 {}는 명령문을 감싸는 중괄호로 인식한다. 그 후에 ||는 하나의 피연산자만을 받게된다.
params => 0||{}; // 이 경우에는 정상적으로 실행됨.
```
rest parameter를 지원한다. 상황에 따라 유동적으로 parameter의 개수를 조절할 수 있다.
```
function sum(...r) {
  return r.reduce((previous, current) => previous + current);
}
sum(1, 2, 3); // 6

let sum = (...r) => r.reduce((previous, current) => previous + current);

sum(1, 2, 3); //6

let test = (a, b, ...r) => console.log(a, b, r)

test(1, 2, 3, 4) // 1 2 Array[3,4]
```
**Note** redece는 입력받은 콜백 함수를 반복적으로 실행한다.( array에서 사용하능한 메소드 )
> arr.reduce(callback( accumulator, currentValue, [, index[, array]] )[, initialValue])

파라미터의 Default 값을 지정할 수 있다.
```
(a = 400, b = 20, c) => console.log(a, b);
```
## 3. 설명
### 3.1. arrow function을 메소드로 사용하면?
```
'use strict';

var obj = {
  i = 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log(this.i, this);
  }
}

obj.b(); // undefined, Windows {...} (or the global object)
obj.c(); // 10, Object {...}
```
Arrow funtions는 this를 바인딩하지 않는다. 따라서 **상위 Scope를 찾아가고** 여기서는 Windows를 가리킨다. 
또 다른 예로, Object.defineProperty()에서도 같은 규칙이 적용된다.
```
'use strict';

var obj = {
  a: 10
};

Object.defineProperty(obj, 'b', {
  get: () => {
    console.log(this.a, typeof this.a, this); // undefined, 'undefined', Window {...}
    return this.a + 10 // 'undefined'
  }
});
```
### 3.2. call, apply and bind는 왜 적합하지 않나?

`call`, `apply` and `bind` 는 다른 scope의 프로퍼티(변수)에 접근하기 위한 메소드들이다. call의 파라미터로 다른 객체를 넘겨주어도
this는 여전히 아무것도 가리키지 않고, 상위 Scope를 가리키기 때문에 의도한 결과와 다른 결과를 반환할 것이다.
```
var obj = {
  num: 100
}

window.num = 2020;

var add = (a, b, c) => this.num + a + b + c;

console.log(add.call(obj, 1, 2, 3)) // result 2026

var add = function(a, b, c) {
  return this.num +a + b + c;
}

console.log(add.call(obj, 1, 2, 3)) // result 106
```
위와 같이 arrow function expression으로 정의한 add 함수를 obj의 메소드처럼 사용하기 위해 add.call(obj)를 사용하면, add의 this는 여전히 obj를 가리키지 않기 때문에 잘못된 사용이다.

### 3.3 call, apply, bind를 사용할 곳은?(arrow expression을 초점으로)
콜백함수로 넘어간 함수에서 this는 전역 context를 가리킨다. 이때 전역이 아닌 특정 객체를 bind해서 넘겨주면 해당 객체를 가리키게 된다.
```
var obj = {
    count : 10,
    doSomethingLater : function (){
        setTimeout(function(){ 
            this.count++;
            console.log(this.count);
        }.bind(this), 300);
    }
}
obj.doSomethingLater(); // 11
```
arrow expression을 사용하면 bion로 묶는 연산이 필요없다. 그 이유는 arrow expression을 일반 regular function expression으로 감싸면 arrow expression 내에서 사용하는 this가 상위 스코프를 타고 객체를 가리키기 때문이다. => 정확한 원리 파악 필요

```
var obj = {
    count : 10,
    doSomethingLater : function (){
        setTimeout(()=>{ 
            this.count++;
            console.log(this.count);
        }, 300);
    }
}
obj.doSomethingLater(); // 11
```
### 3.4. No binding of arguments
arrows functions는 arguments Object를 가지고 있지 않다. 무쓴 뜻인지 아래 예제를 통해 살펴보자.

** note: ** 일반 함수 선언의 경우 argument는 arguments Object에 할당되고, index로 접근할 수 있다.
```
fucntion foo(n) {
  return arguments[0];
}
foo(3); // 3;
```
** note: ** arrow functions은 arguments가 없기 때문에 가장 가까운 arguments를 참조한다.
```
fucntion foo(n) {
  var f = () => arguments[0] + n;
  return f();
}
foo(3); // 3 + 3 = 6; => foo의 arguments 참조
```
```
var arguments = [2, 3];
var foo = n => arguments[0] + n;
foo(3); // 3 + 2 = 5; => 전역 arguments 참조
```
** note: ** 따라서 rest parameters를 사용해서 arguments Object를 대체한다.
```
var f = (...args) => args[0] + 10;
foo(1); // 11
```

### 3.5 생성자 함수로 사용할 수 없다.
```
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```
### 3.6. prototype을 가지고 있지 않다.
```
var Foo = () => {};
console.log(Foo.prototype); undefined
```
### 3.7 yield 키워드
generator는 next 함수를 통해 다음 yeild로 넘어 갈 수 있다. yield는 generator 함수가 중간 멈추는 지점으로 사용된다.
하지만 arrow function에서는 yield를 사용할 수 없다.
**note: generator를 사용하기 위해서는 함수를 꼭 변수에 담아 주어야 다음 지점으로 넘어 갈 수 있다.**
#### 3.7.1 syntax
```
function* gen() {
  yield 1;
  yiled 2;
  yiled 3;
}

var gen = gen();

gen.next(); // {value: 1, done: false}
gen.next(); // {value: 2, done: false}
gen.next(); // {value: 3, done: false}
gen.next(); // {value: undefined, done: true}
```

### 3.8 Line breaks
arrow function을 사용할 때 주의할 것은 파라미터와 화살표 기호(=>) 사이에 줄 바꿈이 안된 다는 점이다.
```
var foo = (a, b, c)
  => 1;
  // SyntaxError: unexpected expression, got '=>'
```
하지만 화살표 기호(=>) 다음으로 줄 바꿈은 가능하다.
```
var foo = (a, b, c) => 
  1;
  
var foo = (a, b, c) => (
  1;
)
var foo = (a, b, c) => {
  return 1;
}
```

### 3.9 Example
```
let empty = () => {};

(() => 'fooba')();

var simple = a => a > 15 ? 15: a;

let max = (a, b) => a > b ? a : b;

var arr = [5, 6, 7, 8, 9, 4];

const reducer = (accumulator, currentValue) => accumulator + currentValue;

var sum = arr.reduce(reducer); // 39

const evenFilterFunc = value => value % 2 === 0

var even = arr.filter(evenFilterFunc) // [6, 8, 4]

const MakeDoubleFunc = value => value * 2

var double = arr.map(MakeDoubleFunc); // [10, 12, 14, 16, 18, 8]
```
