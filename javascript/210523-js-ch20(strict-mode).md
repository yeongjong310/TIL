# ch20. strict mode

함수 내에서 키워드 없이 변수에 값을 할당한 경우, 스코프체인을 따라 식별자를 찾게된다. 이 때 식별자를 찾을 수 없는 경우 JS엔진은 암묵적으로 전역 변수를 선언하고 값을 할당한다.
이러한 현상을 `암묵적 전역`이라고 한다.
```js
function foo(){
  x = 10; 
}
console.log(x); // 10
```

개발자의 의도를 벗어나 암묵적전역과 같은 오류를 찾아내기 위해 es5부터 도입된 strict mode를 적용할 수 있다.

```js
'use strict';
function foo() {
  x = 10; // ReferenceError: x is not defined
}
foo();
```

단, **전역에 `strict mode`를 적용하는 것은 피하자.**

그 이유는, 전역에 선언했다고 해도 script 단위로 동작하기 때문에 헷갈릴 수 있다. 또한 non-strict mode로 구현된 라이브러리에서 오류가 발생할 수 있기 때문이다. 그렇기 때문에 즉시실행 함수로 스크립트 전체를 감싸서 스코프를 구분하여 사용하는 것을 권장한다.
```js
(function () {
  'use strict'l
  // do something...
}());
```

**함수 단위로  strict mode를 적용하는 것도 피하자.**

함수 단위로 strict mode를 적용할 수 있지만, 어떤 함수는 적용하고 어떤 함수는 적용하지 않는다면 혼란스러울 수 있다. 따라서 즉시 실행 함수에만 적용하는 것이 가장 깔끔하다.
```js
(function () {
  // non-strict mode
  var lеt = 10; // 에러가 발생하지 않는다.

  function foo() {
    'use strict';

    let = 20; // SyntaxError: Unexpected strict mode reserved word
  }
  foo();
}());
```

즉시실행함수를 했을 때 왜 바람직한가...?

## 5. strict mode가 발생시키는 에러

1. 선언되지 않은 변수에 할당 불가(암묵적 전역 금지)
2. 선언되지 않은 변수 참조 불가
3. 변수, 함수, 매개변수를 delete로 삭제할시 SyntaxError 발생
4. 매개변수 이름의 중복 불가
5. with문 사용시 SyntaxError

## 6. strict mode 적용에 의한 변화

1. 일반함수의 this는 전역객체가 아닌 undefined가 바인딩된다.
2. 매개변수에 값을 재할당 해도 arguments 객체에 반영되지 않는다.
