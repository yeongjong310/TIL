# ch31. RegExp(정규표현식)

## 1. 정규표현식이란?
문자열을 대상으로 특정 패턴과 일치하는 문자열을 검색하거나 추출 또는 치환할 수 있는 기능을 말한다.

##### 예시
```js
// 정규표현식을 적용할 문자열
const tel = '010-1234-567팔';

// 정규표현식 패턴 정의
const regExp = /^d{3}-\d{4}-\d{4}$/;

// tel이 정규표현식 패턴에 부합하는지 확인.
regExp.test(tel); // false
```
---

## 2. 정규표현식의 생성
정규표현식 리터럴은 **패턴**과 **플래그**로 구성된다.

##### 예시
```js
const target = 'Is this all there is?';

// is라는 패턴과 i라는 플래그(대소문자 구별 x)
const regExp = /is/i;
regExp.test(target); // true
```

## 3. RegExp 메서드

### 3.1. RegExp.prototype.exec

exec 메서드는 인수로 전달받은 문자열에 대해 정규 표현식의 패턴을 검색하여 매칭 결과를 배열로 반환난다. 매칭 결과가 없는 경우 null을 반환한다.

```js
const target = 'Is there all there is?';
const regExp = /is/i;

regExp.exec(target); //["is", index: 5, input: "Is this all there is?", groups: undefined]
```

exec 메서드는 g프래그를 지정해도 첫 번째 매칭 경과만 반환한다.

### 3.2. RegExp.prototype.test

패턴을 검색해서 매칭된 결과를 불리언 값으로 반환한다.

```js
const target = 'Is there all there is?';
const regExp = /is/;

regExp.test(target); //true
```

### 3.3. String.prototype.match
RegExp.prototype.exec 와 같은 결과를 반환한다. 하지만 g 플래그를 사용하면 문자열 전체에서 패턴을 검색하여 배열로 반환한다.

```js
const target = 'Is this all there is';
const regExp = /is/g;

target.match(regExp); // [is, is]
```

## 4. 플래그
|플래그|의미|설명|
|---|---|---|
|i|ignore-case|대소문자를 구별하지 않고 패턴을 검색|
|g|global|대상 문자열 내에서 패턴과 일치하는 모든 문자열을 전역 검색한다.|
|m|multi line| 문자열의 행이 바뀌더라도 패턴 검색을 계속한다.|

## 5. 패턴
패턴은 / 으로 열고 닫는다. 패턴은 / 사이에 문자로 표현되며, 특별한 의미를 가진 메터문자또는 기호로도 표현할 수 있다.

### 5.1. 문자열 검색
위에서 살펴본 test, match 등의 메서드를 호출하여 문자열 내에 패턴과 매치되는지 확인할 수 있다.

### 5.2. 임의의 문자열 검색
```js
const target = 'Is this all there is?';

// 임의의 3자리 문자열을 대소문자를 구별하여 전역 검색한다.
const regExp = /.../g;

target.match(regExp); // ["Is ", "thi", "s a", "ll ", "the", "re ", "is?"]
```
### 5.3. 반복 검색
- `{m,n}`은 앞선 패턴이 최소 m번, 최대 n번 반복되는 문자열을 의미한다. 컴마 뒤에 공백이 있으면 정상 동작하지 않으므로 주의한다.

```js
const target = 'A AA B BB Aa Bb AAA';

// A가 최소 1번, 최대 2번 반복되는 문자열을 전역 검샘한다.
const regExp = /A{1,2}/g;

target.match(regExp);
```

- `{n}`은 n번 반복되는 문자열을 의미한다.
- `{n,}`은 최소 n번 반복되는 문자열을 의미한다.
- +는 `{1,}`과 같은 의미를 가진다. 즉, 최소 1번 반복되는 문자열을 의미한다. ex) `A, AA, AAA ...`

- ?는 앞선 패턴이 최대 한번(0번 포함) 까지 반복되는 문자열을 의미한다. 즉 `{0, 1}`과 같다.

### 5.4. OR검색
|는 or의 의미를 갖는다. `/A|B/`는 `A` 도는 `B`를 의미한다.
```js
const target = 'A AA B BB Aa Bb';

// 'A' 또는 'B'를 전역 검색한다.

const regExp = /A|B/g;

target.match(regExp); //["A", "A", "A", "B", "B", "B", "A", "B"]
```
분해되지 않은 단어 레벨로 검색하기 위해서는 + 를 같이 사용한다.

```js
const target = 'A AA B BB Aa Bb';

// 'A' 또는 'B'를 전역 검색한다.

const regExp = /A+|B+/g;

target.match(regExp); //["A", "AA", "B", "BB", "A", "B"]
```

`[]` 내에 문자를 삽입하면  OR로 동작한다. 더 편리하게 사용할 수 있다. 즉, 위 예제 
`const regExp = /A+|B+/g;`는 
`const regExp = /[AB]+/g;`와 같다.
- 문자열 범위를 지정하려면 [A-Z] 처럼 `-`를 사용하면 된다.
- 숫자 범위를 지정하려면 [0-9] 처럼 표기할 수 있다.
- `\d`는 숫자를 의미한다. 반대로 `\D`는 숫자가 아닌 문자를 의미한다. 즉 `\d`는 [0-9]와 같다.
- `\w`는 알파벳, 숫자, 언더스코어를 의미한다. 반대로 `\W`는 알파벳, 숫자, 언더스코어가 아닌 문자를 의미한다.

### 5.5. Not 검색
`[...]` 내의 `^`는 not을 의미한다. 예를 들어 `[^0-9]`는 숫자를 제외한 문자를 의미한다. 따라서 `\D`와 의미가 같다. `[^A-Za-z0-9_]`와 `\W`는 같의 의미다.

### 5.6. 시작 위치로 검색
`[...]` 밖의 ^은 문자열의 시작을 의미한다. 
```js
const target = 'https://yeongjong310.github.io/`;

// https로 시작하는지 검사한다.
const regExp = /^https/;

regExp.test(target); // true
```

### 5.7. 마지막 위치로 검색
$는 문자열의 마지막을 의미한다.
```js
const target = 'https://yeongjong310.github.io/`;

// com으로 끝나는지 검사한다.
const regExp = /com$/;

regExp.test(target); // true
```

## 6. 자주 사용하는 정규표현식
기입예정
