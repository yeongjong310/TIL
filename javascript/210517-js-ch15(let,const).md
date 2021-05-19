# ch15. let, const와 블록 레벨 스코프

## 1. var 키워드로 선언한 변수의 문제점

### 1.1. 변수 중복 선언 허용
이미 선언된 변수를 재선언했을 때 js엔진은 에러를 피하기 위해 두 가지의 경우에 따라 동작한다.

1. var 키워드로 변수 선언 및 값을 초기화하는 경우는 var 키워드를 무시하고 기존 변수에 값을 할당한다.
2. var 키워드로 변수 선언만 할 경우 변수 선언은 무시된다.

개발자가 천재가 아닌이상 상단에서 변수가 선언된지 모르고, 하단에서 다시 재선언하는 일이 발생할 수 있다. 이때 기존의 변수 값이 재할당되기 때문에 개발자의 의도와 다르게 프로그래밍 오류가 발생할 수 있다.

```js
var x = 1;
var y = 1;

var x = 100;

var y;

console.log(x);
console.log(y);
```

### 1.2. 함수 레벨 스코프
`var`키워드는 함수 레벨 스코프만을 인정한다. 따라서 함수 외의 블록문 내에서 var키워드를 통해 변수를 선언해도 전역변수가 돼버린다.

즉, 세부적으로 변수의 범위를 제한할 수 없고, 전역을 오염시킬 확률이 높다.

### 1.3. 변수 호이스팅
변수를 호이스팅하기 때문에 일반적으로 변수를 참조할 수 없는 범위인 선언부 상단에서 참조할 수 있다.

## 2. let 키워드
위 3가지 문제를 보완하기 위해서 ES6에 새롭게 추가된 변수 선언키워드 `let`이 있다.

### 2.1 변수 중복 선언 금직

변수를 중복 선언하면 SystaxError: 식별자가 이미 선언되었다는 에러 메세시를 

### 2.2. 블록 레벨 스코프

let 키워드로 선언한 변수는 모두 코드 블록을 지역 스코프로 인정하는 블록 레벨 스코프를 따른다.
```js
let foo = 1;
{
  let foo = 2;
  let bar = 3;
}
console.log(foo); //1
console.log(bar); //ReferenceError: bar is not defined
```
### 2.3. 변수 호이스팅
변수 호이스팅이 발생하지 않는 것 처럼 동작한다.
```js
console.log(foo); // RefferenceError: foo is not defined
let foo;
```

- let 키워드는 런타임 전에 변수를 선언하기만 할뿐 `undefined`로 값을 초기화 하지 않는다.
- 실제로 코드가 실행되는 런타임에 선언문을 만났을 때 `undefined`로 초기화 하기 때문에 선언문 하단에서만 변수를 참조할 수 있다.

> 참고: let 선언문에 도달해서 값을 초기화 하기까지 변수를 참조할 수 없는 구간을 TDZ(Temporal Dead Zone)라고 한다.


#### 2.3.1. let도 호이스팅을 한다는 증거.
```js
let foo = 1;

{
  console.log(foo); //ReferenceError: Cannot access 'foo' before initilization
  let foo = 2;      // 지역 변수
}
```

코드 블록 내에서 호이스팅이 발생하지 않는다면, foo에 1을 출력해야한다. 하지만 let으로 변수를 선언해도 호이스팅이 발생하기 때문에 참조에러가 발생한다. + 에러의 설명도 다르다.

### 2.4. 전역 객체와 let
```js
// 전역 변수 선언 / 초기화
var x = 1;
// 암묵적인 전역 변수 선언 / 초기화
y = 2;
// 전역 함수
function foo(){}

// 전역변수는 전역 객체 window의 프로퍼티가 된다.
console.log( window.x ) // 1
console.log( x ) // 1

// let을 전역스코프에서 선언해도 window로 접근하지 못한다.
// 전역(window)와 전역의 코드블록은 별개.
let z = 3;
console.log( window.z ) // undefined
console.log( z ) // 3
```
## 3. const 키워드
const는 상수를 선언하기 위해 사용한다. 하지만 반드시 상수만을 위해 사용하지는 않는다. const의 특징은 let키워드의 특징과 동일하고 추가적으로 const로 선언한 변수는 재할당이 불가능한 특징을 가지고 있다.

### 3.1. 선언과 초기화
const 키워드로 선언한 변수는 반드시 선언과 동시에 초기화 해야한다.
```js
const foo = 1;
```

그렇지 않으면 문법적으로 오류가 발생한다..
```js
const foo; // SyntaxError: Missing initializer in const declaration
```

### 3.2. 재할당 불가능
const 키워드는 재할당을 금지한다.

```js
{
  const lastName: 'yeongjong';
  lastName = 'Judy'; // TypeError: Assignment to constant variable
}
```
### 3.3. 상수
원시값은 재할당외에는 값을 변경할 수 있는 방법이 없다. const는 재할당이 불가능하기 때문에 상수를 표현하는데 사용하기도 한다.


#### 쓰임

```js
// 세전 가격
let preTaxPrice = 100;

// 세후 가격
let afterTaxPrice = preTaxPrice + (preTaxPrice * 0.1);

console.log(afterTaxPrice); // 110
```

위 코드에서 0.1이 어떤 의미인지 주석과 변수명을 통해 유츄해야한다. 즉 **가독성**이 좋지않다. 하지만 const 키워드로 0.1 세율이라는 것을 상수로 정의하면 식별자를 통해 세율임을 바로 알 수 있다.

```js
const TAX_RATE = 0.1;

// 세전 가격
let preTaxPrice = 100;

// 세후 가격
let afterTaxPrice = preTaxPrice + (preTaxPrice * TAX_RATE);

console.log(afterTaxPrice); // 110
```
또한 세율을 잘 변하지 않기 때문에 const 키워드로 값을 고정할 수 있다. 추후에 세율이 변경되면 상수만 변경하면 되기 깨문에 **유지보수성**이 대폭 향상된다.

일반적으로 상수의 이름은 대문자로 작성하며 단어와 단어사이는 언더스코어(`_`)로 구분하는 스네이크 케이스로 작성한다.


### 3.4. const 키워드와 객체
const는 재할당이 금지되었을 뿐이기에 객체를 할당한 경우 객체의 프로퍼티 값을 변경할 수는 있다.


## 4. var vs let vs const
1. 기본적으로 const를 사용한다.
2. 재할당이 필요하면 let을 사용한다.
3. es6를 사용하면 var 키워드를 사용하지 않는다

