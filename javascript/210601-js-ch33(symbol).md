# ch33. 심벌
##  1. 심벌이란?

심벌은 es6에서 새롭게 추가된 원시 타입의 값이다.

심벌 값은 다른 값과 절대 중복되지 않는 유일한 값이다.

따라서, 주로 이름의 출돌 위험이 없는 유일한 프로퍼티 키를 만들기 위해 사용한다.

## 2. 심벌 값 생성하기

### 2.1. Symbol 함수
다른 원시값인 문자열, 숫자, 불리언은 리터럴, 빌트인 함수, 또 형변환에 의해 평가되어 값을 생성할 수 있다. 하지만 **Symbol은 반드시 Symbol 함수를 호출해야만 값을 생성할 수 있다.**

이때 생성된 심벌 값은 외부로 노출되지 않기 때문에 실제로 확인할 방법은 없다. 하지만, 다른 값과 **절대 중복되지 않는 유일무이한 값이라는 것을 기억하자.**

```js
const mySymbol = Symbol();
console.log(mySymbol); // Symbol
```

**String, Number, Boolean 생성자 함수와는 달리 Symbol은 생성자 함수가 아니다.** 즉 객체를 생성하는 것이 아니라, **원시값**을 생성한다는 것에 유념하자.
```js
new Symbol(); // TypeError: symbol is not a constructor
```

### 2.2. Symbol.for / Symbol.keyFor 메서드

Symbol.for 메서드는 전역 심벌 레지스트리에 전달받은 문자열을 키로 사용하여 심벌 값을 저장할 수 있다. 즉, 심벌 값을 관리하기 용이하다.

- 검색에 성공하면 심벌 값을 반환한다.
- 검색에 실패하면 새로운 심벌 값을 생성한다.

Symbol.keyFor 메서드는 전역 심벌 레지스트리에 저장된 심벌 값의 키를 추출할 수 있다.

```js
const s1 = Symbor.for('mySymbol');
Symbol.keyFor(s1); // mySymbol

const s2 = Symbor('mySymbol');
Symbol.keyFor(s2); // undefined

console.log(s1 === s2) // false
```

## 3. 심벌과 상수
특수한 의미를 가지는 상수를 정의하려고 한다. 예를들어 각 방향을 나타내는 프로퍼티를 숫자 1,2,3,4 로 구분했다.

```js
const Direction = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};
if(nextDirection === Direction.UP){
  // do Something
}
const double = 2
if(nextDirection === double){
  // do Something
}
```

위의 방향은 프로퍼티 키인 `UP`에 의미가 있고, 숫자는 단지 방향을 구분하기 위해 사용됐을 뿐이다. 하지만 `nextDirection === Direction.Up`은 `nextDirection === double`과 동일하다. 그 외에도 `1,2,3,4`로 평가되는 모든 표현식이 좌항에 올 수 있다.

조금 더 엄격하게 `nextDirection === Direction.Up`만을 사용하도록 규제하고 싶다면, 심볼을 활용해 보자.

```js
const Direction = {
  UP: Symbol('up'),
  DOWN: Symbol('down'),
  LEFT: Symbol('left'),
  RIGHT: Symbol('right')
}

const myDirection = Direction.UP;

if (myDirection === Direction.UP) {
  // Do Something
}
```

> 참고: enum
enum은 명명된 숫자 상수(named  numeric constant)의 집합으로 열거형(enumerated type)이라고 부른다. Js에서는 enum을 지원하지 않기 때문에, Object.freeze 메서드와 심벌값을 사용하면 enum을 흉내낼 수 있다.

## 4. 심벌과 프로퍼티 키
심벌이 가장 자주 쓰이는 곳은, 프로퍼티 키로 심벌을 사용하여, 다른 프로퍼티 키와 충돌하는 확률을 제거 하는 것이다.

심벌을 프로퍼티 키로 사용하려면 `[]` 내에 표기해야 한다.

## 5. 심벌과 프로퍼티 은닉
심벌로 생성한 프로퍼티키는 for...in 문이나, Object.keys, Object.getOwnPropertyNamse 메서드로 찾을 수 없다. **프로퍼티를 외부에 노출하고 싶지 않을 때 은닉을 목적으로 사용할 수 있다.**

```js
const obj = {
  [Symbol('mySymbol')]: 1
}

for (const key in obj) {
  console.log(key); // 아무것도 출력되지 않는다.
}
```

심벌값으로 생성한 프로퍼티 키를 찾을 수 있는 방법은, ES6에 추가된 Object.getOwnPropertySymbols 메서드를 사용하는 것이다.

```js
console.log(obj.getOwnPropertySymbols(obj));
```

## 6. 심벌과 표준 빌트인 객체 확장

표준 빌트인 객체에 사용자 정의 메서드를 직접 추가하는 것은 권장하지 않는다. 사용자가 정의한 메서드와 동일한 이름의 메서드가 미래에 Ecmascript의 표준이 되면 문제가 될 수 있기 때문이다.

심벌을 프로퍼티 키로 사용하면 문제가 해결된다.

## 7. Well-known Symbol
자바스크립트가 기본 제공하는 빌트인 심벌 값을 well-known Symbol 이라고 한다.

대표적으로 Symbol.iterator가 있다.

Symbol.iterator는 for...of 문으로 순회 가능한 객체(이터러블)인지를 확인하기 위해 사용된다.

이터러블은 Symbol.iterator라는 메서드를 가지고 있고, 메서드를 호출했을 때 이터레이터를 반환하도록 ECMAScript 사양에 규정되어 있다. 이것을 이터레이터 프로토콜이라 한다.

```js
const iterable = {
  [Symbol.iterator]() {
    let cur = 1;
    const max = 5;
    return {
      next() {
        return { value: cur++,
        done: cur > max + 1 };
      }
    };
  }
};

for (const num of iterable) {
  console.log(num);
}
```

+ Symbol.iterator는 기존 프로퍼티 키 혹은 미래에 추가될 프로퍼티 키와 절대 중복되지 않는다. 심벌은 중복되지 않는 상수 값을 생성하는 것은 물론 기존에 작성된 코드에 영향을 주지 않고 새로운 프로퍼티를 추가하기 위해, 즉 하위 호환성을 위해 도입되었다.