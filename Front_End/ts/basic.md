# TypeScript
TypeScript에 대해 알아보자!

TypeScript는 공식 페이지에서 javascript의 superset이라고 소개한다. 공식문서에 따르면 TypeScript 2.1 부터 --target ESNext를 지원하니, 웬만한 js 문법은 전부 사용할 수 있고 컴파일을 통해 타입체크도 할 수 있으니 superset이라고 부를 수 있겠다.

> 참고: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#support-for---target-es2016---target-es2017-and---target-esnext

## 1. typescript 설치하기
```cmd
npm i typescript -g
```
테스트를 위해 typesciprt를 글로벌로 설치해주자.

## 2. cli를 통해 ts -> js 컴파일하기
tsc라는 명령어를 통해 ts를 js로 컴파일 할 수 있다.
```cmd
tsc hello.js
```

### 2.1. 옵션
> --target: 컴파일할 es 버전을 지정한다.
```cmd
tsc hello.js --target: es5
```

```ts
// ts
let num = 1;
```

```js
// js
var num = 1;
```
es5는 let 키워드를 지원하지 않기 때문에 var로 컴파일 되었다.


> --lib: ts는 기본적으로 라이브러리 시스템을 사용한다. -lib 옵션을 통해 사용할 라이브러리를 지정할 수 있으며, type 정보 혹은 어떤 es 버전과 함수등을 지원할 것인지 명시할 수 있다.

> 참고: https://www.typescriptlang.org/tsconfig/#lib

```cmd
tsc hello.ts --lib es6,dom // es6 문법과 dom(브랑우저) 문법 사용
```

```ts
// ts
console.log(add(1, 2)); // --lib에 dom을 명시했기 때문에 console을 사용할 수 있다.
```

```js
// js
console.log(returnValue);
```

> --module: 모듈타입을 설정한다.

```cmd
tsc hello.ts --module commonjs
```

```ts
// hello.ts
import add from './util.js';
```

```js
// hello.js
"use strict";
exports.__esModule = true;
var util_js_1 = require("./util.js"); // commonjs 문법 적용
console.log(util_js_1["default"](1, 2));
```
## 3. config 파일 설정
매번 cli에서 옵션을 주지않고 config 파일을 만들어 설정할 수 있다.
```json
// tsconfig.json(루트경로에 작성하기)
{
  "include": [
    "src/**/*.ts" // src 아래의 모든 ts 확장자를 컴파일한다.
  ],
  "exclude": [
    "node_modules" // 제외 폴더
  ],
  "compileOptions": {
    "module": "commonJs", // es6 등의 모듈 방식 설정
    "rootDir": "src", // 컴파일 할 root 경로 설정
    "outDir": "dist", // 컴파일 될 경로 설정 
    "target": "es6", // 컴파일될 es 버전 설정
    "sourceMap": true, // 브라우저에서 ts로 디버깅하기 위한 소스맵 설정
    "noImplicitAny": true, // 암묵적으로 any 타입을 설정한 경우 오류
    "removeComments": true, // 주석 지우기
  }
}
```

## 4. 타입
### 4.1. annotation

변수명: 타입

```js
// number type
function add(a: number, b: number) {
  return a + 1;
}
```

> 참고: 매개변수의 경우 타입을 지정하지 않거나, 변수를 할당없이 선언만 한 경우 암묵적으로 any 타입이 지정된다.


```js
// string type
let test: string = 'My name is tory';
```

```js
// boolean
let test: boolean = true;
```

```js
// undefined
let test: undefined = undefined;
```

```js
// null
let test: null = null;
```

```js
// symbol
let test: symbol = Symbol('test');
```

```js
// object
let test1: object = {};
test = { key: value };

let test2: object = {
  a: 1,
  b: 2,
};

test2 = {}; // 객체
test2 = [1, 2]; // 배열도 객체이기 때문에 할당 가능
```

### 4.2. 추론
```js
let c = 100;
c = '113' // error => 변수 c에 타입을 지정하지 않았지만, ts는 c에 숫자가 할당되었음을 추론하고 c number외 값이 할당되면 에러를 일으킨다.
```



