# ch2. Into Javascript.

## 1. values & types
자바스크립트는 7가지의 타입이있다.-
- string
- number
- boolean
- null
- undefined
- object
- symbol
```
var a;
typeof a;           // "undefiend"

a = "hello world"
typeof a;           // "string"

a = 42;
typeof a;           // "number

a = true;
typeof a;           // "boolean"

a = null;
typeof a;           // "object" -- long-standing bug

a = undefined       
typeof a;           // "undefined"

a = { b: "c" };
typeof a;           // "object"

a = Symbol();       // as of ES6
typeof a;           // "symbol"
```
**Warnng**: `typeof null`은 Js에서는 오래된 버그중 하나이다. null은 '값이 없다'를 명시하기 위해 쓰에는 데이터 타입이다.
하지만 타입을 체크해보면 `object`를 출려한다. 이는 Js의 오래된 버그로 이 버그를 수정하면 기존의 코드에서 오류가 날 수 있기 때문에 Js에서는 이 버그를 수정하지 않고 있다. 따라서 null을 체크하기 위해서는 `a === null`처럼 두 값과 타입을 비교하는 연산자를 써야한다.

또한 `undefined`는 변수가 사용할 메모리는 확보했지만, 아직 이 변수에 값이 할당되지 않았음을 의미한다. 즉 이 변수의 쓰임이 정의되지 않은 상태를 뜻하는데, `undefiend`를 변수에 할당하는 방법이 몇 가지 있다. 위의 `a = undefined`를 보면 `var a;`와 같은 undefined 상태가 된다. 이 외에도 void 연산자를 사용한 function은 undefiend를 리턴한다. 

### 1.1. objects
여러 개의 값을 담을 수 있는 자료형.
```
var obj = {
  
}
```
### 1.2. Built-In Type Methods

### 1.3. Comparing Values

## 2. Variables

### 2.1. Function Scopes

## 3. Conditionals

## 4. Strict Mode

## 5. Functions As Values

### 5.1. Immediately Invoked Function Expressions (IIFEs)

### 5.2. Closure

## 6. This Identifier

## 7. Prototypes

## 8. Old & new

## 8.1. PolyFilling

## 8.2. TransPiling

## 9. Non-JavaScript
