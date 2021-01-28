# arrow function expressions
arrow function expressions 에 대해 자세히 정리해 보자.

arrow function expression은 일반적으로 함수를 정의할 때 사용하는 function expression을 간단한 문법으로 대체한 표현식이다.

**Differences & Limitations:**
- 함수가 어디에도 바인딩되지 않았기 때문에 browser에서의 this는 Window를 가리킨다. (server side js는 아직 모르겠음)
- 따라서 super도 사용할 수 없다.(super는 상위 클래스의 생성자를 호출함)
- call, apply, bind를 사용해서 바인딩 하는 것은 적절하지 않다.
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
객체(object)를 단독으로 반환하기 위해서는 꼭 ()로 객체를 감싸주어야 한다. ** 두 줄이상의 return을 사용하면 가능 **

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
Arrow funtions는 this를 바인딩하지 않는다. 또 다른 예로, Object.defineProperty()에서도 같다.
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
this는 여전히 window를 가리키기 때문에 의도한 결과와 다른 결과를 반환할 것이다.
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
