# 16. 프로퍼티 어트리뷰트
## 1. 내부 슬롯과 내부 메서드(\[[...]])
내부 슬롯과 내부 메서드는 JS 엔진의 구현 알고리즘을 설명하기 위해 ECMAScript 사양에서 사용하는 의사 프로퍼티(pseudo property), 의사 메서드(pseudo method)다.
실제로 내부 슬롯과 내부 메서드는 JS 엔진에서 구현되어 동작한다. 하지만 개발자가 직접적으로 접근할 수는 없다.
단, 일부 내부 슬롯과 내부 메서드는 간접적으로 접근할 수 있는 수단을 제공하기도 한다.

예를 들어 모든 객체는 [[Prototype]]이라는 내부 슬롯을 갖는다. 내부 슬롯은 자바스크립트 엔진의 내부 로직이기 때문에 접근할 수 없지만, `__proto__`를 통해 간접적으로 접근 할 수 있다.
```js
const obj = {};
console.log(obj.__proto__);
```

## 2. 프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체
자바스크립트 엔진은 프로퍼티를 생성할 때, 프로퍼티 `상태`를 나타내는 `프로퍼티 어트리뷰트`를 기본 값으로 자동 정의한다.
프로퍼티 상태는 프로퍼티 값(value), 값의 갱신 여부(writable), 열거 가능 여부(enumerable), 재정의 가능 여부(configurable) 4가지를 말한다.
프로퍼티 어트리뷰트는 프로퍼티 상태를 나타내는 내부 슬롯([[value]], [[writable]], [[enumerable]], [[configurable]])이다.
`getOwnPropertyDescriptor` 메서드를 사용하면 내부 슬롯들을 간접적으로 확인할 수 있다.

```js
const person = {
  lastName : 'kim'
}

console.log(Object.getOwnPropertyDescriptor(person, 'lastName'));
// {value: "kim", writable: true, enumerable: true, configurable: true}
```
> 참고: es8에 새로 도입된 Object.getOwnPropertyDescriptors 메서드는 인수로 넘겨준 객체의 모든 프로퍼티 어트리뷰트를 객체 타입으로 반환한다.

## 3. 데이터 프로퍼티와 접근자 프로퍼티

프로퍼티는 데이터 프로퍼티와 접근자 프로퍼티로 구분할 수 있다.

- 데이터 프로퍼티
  - 키와 값으로 구성된 일반적인 프로퍼티다.
- 접근자 프로퍼티
  - 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 `접근자 함수`로 구성된 프로퍼티다.

### 3.1. 데이터 프로퍼티
데이터 프로퍼티는 다음과 같은 프로퍼티 어트리뷰터를 갖는다.

|프로퍼티 어트리뷰트|프로퍼티 디스크립터 객체의 프로퍼티|설명|
|---|---|---|
|`[[[Value]]`|value| - 프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 값 <br/>- 프로퍼티 키를 통해 프로퍼티 값을 변경하면 `[[value]]`에 값을 재할당한다. <br/>이때 프로퍼티가 없으면 프로퍼티를 동적 생성하고 생성된 프로퍼티의 `[[value]]`에 값을 저장한다.
|`[[Writable]]`|writable|- 프로퍼티 값을 변경할 수 있는지 여부를 나타냄.<br/>- `[[writable]]`의 값이 `false`이면 값의 참조만 가능.
|`[[Enumerable]]`|enumerable|- 프로퍼티를 열거할 수 있는지 여부를 나타냄.<br/>- `[[enumerable]]`의 값이 `false`이면 for...in 문이나 Objects.keys 메서드로 프로퍼티를 열거할 수 없다.
|`[[Configurable]]`|configurable|- 프로퍼티를 재정의할 수 있는가 여부를 타나냄.<br/>- `[[configurable]]`의 값이 `false`이면 프로퍼티 삭제, 프로퍼티 어트리뷰트 값의 변경이 금지된다.<br/>(단, `[[Writable]]`이 true라면 `[[Value]]`의 변경과 `[[Writable]]`을 false로 변경할 수 있다.)

### 3.2. 접근자 프로퍼티

이 프로퍼티는 자체적으로 값을 가지고 있지 않는다. 단, 다른 데이터 프로퍼티의 값을 읽거나, 값을 저장할 때 사용하는 접근자 함수(accessor function)으로 구성된 프로퍼티다. 

접근자 프로퍼티는 다음과 같은 프로퍼티 어트리뷰트를 갖는다.
|프로퍼티 어트리뷰트| 프로퍼티 디스크립터 객체의 프로퍼티|설명|
|---|---|---|
|`[[Get]]`|get|접근자 프로퍼티를 통해 데이터 프로퍼티 값을 읽을 때 호출되는 `접근자 함수`. <br/>즉, 접근자 프로퍼티 키로 프로퍼티에 접근하면 프로퍼티 어트리뷰트 `[[Get]]`의 값, 즉 getter 함수가 호출되고 그 결과가 프로퍼티 값으로 반환된다.
|`[[Set]]`|set|접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 저장할 때 호출되는 `접근자 함수`.<br/>즉, 접근자 프로퍼티 키로 프로퍼티에 값을 저장하면 프로퍼티 어트리뷰트 `[[Set]]`이ㅡ 값, 즉 setter 함수가 호출되고 그 결과가 프로퍼티 값으로 저장된다.
|`[[Enumerable]]`|enumerable|데이터 프로퍼티와 같음|
|`[[Configurable]]`|Configurable|데이터 프로퍼티와 같음|

```js
const person = {
  lastName: "kim",
  firstName: "yeongjong",

  // getter 함수
  get fullName(){
    return `${this.lastName} ${this.firstName}`
  },
  // setter 함수
  set fullName(name){
    [this.firstName, this.lastName] = name.split(' ');
  }
}

console.log(person.fullName);
person.fullName = "juhae kim";
console.log(person.fullName);
console.log(Object.getOwnPropertyDescriptor(person, "fullName"));
```

동작 과정

1. 프로퍼티 키가 유효한지 확인한다.
2. 프로토타입 체인에서 프로퍼티를 검색한다. person 객체에 fullName 프로퍼티가 존재한다.
3. 검색된 fullName 프로퍼티가 데이터 프로퍼티인지 접근자 프로퍼티인지 확인한다.
4. 접근자 프로퍼티 fullName의 프로퍼티 어트리뷰트 `[[Get]]` 값, 즉 getter 함수를 호출하여 그 결과를 반환한다. 프로퍼티 fullName의 프로퍼티 어트리뷰트 [[Get]]의 값은 Object.getOwnPropertyDescriptor 메서드가 반환하는 프로퍼티 디스크립터 객체의 get 프로퍼티 값과 같다.

## 4. 프로퍼티 정의
Object.defineProperty 메서드를 사용하면 프로퍼티 어트리뷰트를 정의할 수 있다.(default: false)

### 4.1. 데이터 프로퍼티 정의
```js
const person = {};

Object.defineProperty(person, 'firstName', {
  value: 'yeongjong',
  writable: true,
  enumerable: true,
  configurable: true
});
Object.defineProperty(person, 'lastName', {
  value: 'kim'
});

console.log(Object.getOwnPropertyDescriptors(person));
console.log(Object.keys(person)); // firstName
person.lastName = 'lee';
console.log(person.lastName) // lee
```

### 5.1. 접근자 프로퍼티 정의

- Object.defineProperty
```js
const person = {};
Object.defineProperty(person, 'fullName',{
  get() {
    return `${this.firstName} ${this.lastName}`
  },
  set(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },
  enumerable: true,
  configurable: true
})
```

- Object.defineProperty
```js
Object.defineProperties(person, {
  // 데이터 프로퍼티 정의
  firstName: {
    value: 'Ungmo',
    writable: true,
    enumerable: true,
    configurable: true
  },
  lastName: {
    value: 'Lee',
    writable: true,
    enumerable: true,
    configurable: true
  },
  // 접근자 프로퍼티 정의
  fullName: {
    // getter 함수
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    // setter 함수
    set(name) {
      [this.firstName, this.lastName] = name.split(' ');
    },
    enumerable: true,
    configurable: true
  }
});
```

## 5. 객체 변경 방지
객체는 변경 가능한 값이다. 재할당 없이 프로퍼티 접근 연산자를 사용하거나, Object.defineProperty 또는 Object.definePropeties로 직접 변경할 수 있다. 

객체의 변경을 방지하는 메서드를 제공한다.

|구분|메서드|프로퍼티 추가|프로퍼티 삭제| 프로퍼티 값 읽기| 프로퍼티 값 쓰기| 프로퍼티 어트리뷰트 재정의|
|---|---|---|---|---|---|---|
|객체 확장 금지| Object.preventExtensions|X|O|O|O|O|
|객체 밀봉(프로퍼티 값 쓰기, 읽기 가능)|Object.seal|X|X|O|O|X|
|객체 동결(프로퍼티 읽기 외 불가능)|Object|X|X|O|X|X|

### 5.1. 객체 확장 금지(새 프로퍼티 동적 추가 불가능)
```js
const person = {};
Object.preventExtensions(person);
person.name = "yeongjong kim";
console.log(person) // {}
```

### 5.2. 객체 밀봉(프로퍼티 값 쓰기, 읽기 가능)
```js
const person = {name: 'lee'};
Object.seal(person)
Object.getOwnPropertyDescriptor(person, "name");
/*
{
  name: {value: "lee", writable: true, enumerable: true, configurable: false},
}
*/
// 프로퍼티 어트리뷰트 재정의 금지
Object.defineProperty(person,"name",{
  configurable: true
})
// TypeError: Cannot redefine property: name

// 프로퍼티 추가 금지
person.age = 29;
console.log(person); // {name: 'lee'}

// 프로퍼티 삭제 금지
delete person.name
console.log(person); // {name: 'lee'}

// 프로퍼티 값 갱신은 가능
person.name = 'Kim';
console.log(person); // {name: "Kim"}
```

### 5.3. 객체 동결(읽기만 가능)
Object.freeze를 사용하면 객체의 프로퍼티를 참조해서 읽기만 가능하다.