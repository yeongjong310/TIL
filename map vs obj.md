javascript는 연관배열 형태의 자료구조를 2가지 지원한다.
그것이 바로 map과 object인데 이 둘의 차이점은 무엇이고 언제 적절히 구분해 사용하면 좋을지 학습하고 기술하기 위한 문서이다.

# 1. 차이점

|     | Map | Obj |
|-----|-----|-----|
| Elementt order | preserved | Not preserved |
| key type | everything | limited(integer, string, symbols) |

![image](https://user-images.githubusercontent.com/39623897/105967488-3ba08280-60c9-11eb-9fcd-e80ede7ac7a8.png)

- 1. key type이 여러개 혼용된 경우 삽입된 순서가 유지되지 않았다. (숫자 우선)
- 2. Map의 경우 모든 데이터 타입을 key로 사용할 수 있지만 object의 경우 숫자, 문자, 심볼만 가능하다.

# 2. 사용방법

## 2.1. create 생성하기.
## 2.1.1 object
- 1. direct literal
```
var obj = {}; //Empty object
var obj = {id: 1, name: "Test object"}
```

- 2. constructor
```
var obj = new Object();//Empty object
var obj = new Object; //same result
var obj = new Object({id:1, name: "Test object"}); // object가 생성되었음을 명시적으로 나타낼 수 있음.
```

- 3. Object.prototype.create
```
var = obj = Object.create(null); //Empty Object
```
**note:** Object의 create를 사용하는 경우 파라미터로 객체를 넘겨주면 그 객체를 상속함.

```
var Vehicle = {
  type: "General",
  display: function() {console.log(this.type);}
}

var Car = Object.create(Vehicle);
Car.type = "Car";
Car.display(); // Vehicle의 display를 상속받아 "Car"를 출력함.
```
일반적으로, Array같은 자료구조에서 생성자 `new`를 사용하여 새로운 객체를 생성하는 것이 literal 방식보다 느리다.
Console.time으로 확인해 보았으나 매번 실행시간이 조금씩 다른 관계로 정확한 측정은 하지 못했다.

### 2.1.2. Map([iterable])

맵은 오직 한가지의 방법으로만 생성할 수 있다.

```
var map = new Map(); // Empty Map
var map = new Map([[1,2], [2,3]]); // map = {1=>2, 2=>3}
```

## 2.2. Accessing element 요소에 접근하기
### 2.2.1. object
```
obj.id //1
obj['id'] //1
```
### 2.2.2. map
```
map.get(1)
```

- map, object 모두 key를 알고 있어야 value를 알 수 있다.

## 2.3. key가 있는지 확인하는 방법
### 2.3.1. object
- 1.check if property is undefined 
```
var isExist = obj.id === undefined // true => obj에 id라는 속성이 없다.
```
- 2. key in obj
```
var obj = {"id": "tory"};
isExist = 'id' in obj; // true
``` 
### 2.3.2. map
```
map.has(1);
```

## 2.3. Adding new element 새로운 값 추가하기.
### 2.3.1. map
```
map.set('id':5); // {"id" => 5}
```

### 2.3.2. object
```
obj['id'] = 5; // {id: 5}
```

## 2.4.Removing/Deleting an element
### 2.4.1. object
- 1. delete 키워드 사용
```
delete obj.id;
```
delete의 경우 obj에 있는 property를 완전히 삭제한다. 그리고 true/false를 반환하는데 non-configurable property의 경우 false를 반환하며 삭제되지 않는다.
```
var obj = Object.freeze({name: 'Elsa', score: 157});
delete obj.name // false
```

- 2. undefined 할당.
```
obj.id = undefined
```

- undefined를 할당하는 경우 key는 여전히 남아있다.
```
var obj = {id:5, name: 'tory'}
obj.id = undefined
for ( key in obj ) {
  console.log(key)
}}
// id
// name
```

### 2.4.2. map

- 1. delete(key)
```
var isDeleteSucceeded = map.delete(1);
console.log(isDeleteSucceeded) // false; => 엘리먼트가 없으면 false 있으면 true를 반환하며 삭제
```
- 2. clear();
```
map.clear(); // {} => 전체 엘리먼트를 지움
```

## 2.4. Getting the size 크기 구하기
### 2.4.1. object
```
Object.keys(obj).length); //2
```
### 2.4.2. map
```
map.size; //2
```

# 3. Iterating
## 3.1. Map
Map은 iterable 하다. 아래를 통해 확인가능.
```
console.log(type of obj[Symbol.iterator]); // undefined
console.log(type of map[Symbol.iterator]); // function
```
즉 map 은 for... of를 통해 각 엘리먼트에 접근할 수 있다.
```
for (const item of map) {
  console.log(item);
  //Array[2,3]
  //Array[4,5]
}

for (const [key,value] of map) {
  console.log(`key: ${key}, value: ${value}`);
  //key: 2, value: 3
  //key: 4, value: 5
}
```
또는 forEach()도 사용할 수 있다.:
```
map.forEach((value,key) => console.log(`key: ${key}, value: ${value}`));
//key: 2, value: 3
//key: 4, value: 5

## 3.2. Object
Object의 경우 for 문을 통해 key만 반환한다.
for (var key in obj) {
  console.log(`key: ${key}, value: ${obj[key]}`);
  //key: id, value: 1
  //key: name, value: test
}
또는 Object.keys(obj) 방법으로 keys를 반환하고 Array의 forEach로 각 key에 접근 할 수 있다.
```
Object.keys(obj).forEach((key) => console.log(`key: ${key}, value: ${obj[key]}`));
//key: id, value: 1
// key: name, value: test

## Map, Object를 언제 사용해야 할까?

1. 간단한 객체를 생성할 때는 Object => Object가 Map보다 빠르다.
2. 각 객체별로 개별적인 함수 혹은 속성이 필요할 때도 Object
3. 다양한 연산(adding, remving 등)이 다소 필요할 때 => Map 코드가 간결해진다.
4. 삽인된 순서를 유지해야 할 때 => Map 
5. 다수의 데이터 => Map

### 느낀점
개인적으로 map을 사용해보면서 반복문이 필요할 때 상당히 편리하다는 것을 느꼈다.(메소드를 사용한 접근도 상당히 편리함)
코드가 간결해지고 추후에 다시 코드를 보게되었을 때 이점이 많을 듯 하다.
그 이외 장점은 차차 사용해 보면서 정리해보겠다.

