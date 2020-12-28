# 프로토타입(prototype)

Python, java, c++ 등 객체지향언어하면 빠질수 없는 개념인 Class는 모두 익숙할 것이다.
하지만 Javascript에서는 객체를 지향하기 위해 Class가 아닌 Prototype을 사용한다. 그래서 이번 시간에는 조금은 생소한 Prototype에 대해 알아보려 한다.

## 1. Do you know where prototype is used for?
```
function Laptop(){
  this.cpu = "i7-8565U";
  this.ram = 16;
}

let laptop1 = new Laptop();
let laptop2 = new Laptop();

console.log(laptop1.cpu); // 17-8565U
console.log(laptop1.ram); //16

console.log(laptop2.cpu); // 17-8565U
console.log(laptop2.ram); //16
```
laptop1과 laptop2는 같은 제조사에서 만들어진 동일 모델의 노트북이다. 앞으로도 고객의 수요에 따라 laptop3, laptop4 ... 수도없이
만들어질 노트북들의 정보를 효율적으로 저장하려고 한다. 이 때 위와 같이 this를 사용하여 object의 property 로 할당할 경우, cpu 와 ram은 만들어지는 laptop1, laptop2... 객체마다 하나하나 저장되게 된다. 즉 객체마다 cpu와 ram을 저장할 공간인 메모리를 할당받게 되고 생성되는 객체가 많아질수록 사용하는 메모리도 커지게 된다. 이 때 prototype을 사용해보자.
```
function Laptop(){}
Laptop.prototype.cpu = "i7-8565U";
Laptop.prototype.ram = 16;

let laptop1 = new Laptop();
let laptop2 = new Laptop();

console.log(laptop1.cpu); // 17-8565U
console.log(laptop1.ram); //16

console.log(laptop2.cpu); // 17-8565U
console.log(laptop2.ram); //16
```

![this 프로퍼티](https://user-images.githubusercontent.com/39623897/103166930-436ecc00-486a-11eb-8ba0-12557aa64e8f.JPG)

두 객체를 비교해보면 첫번째 this를 통한 프로터티를 설정할 경우 생성된 객체 laptop1의 property로 cpu와 ram이 등록되는 반면, 두번째 prototype 방식은 laptop1의 __proto__라는 property에 cpu와 ram 이 저장되었다.

## 2. how does it work?
function을 선언/할당하면 prototype이라는 객체가 항상 그 속성으로 같이 생성된다. 이 prototype에 우리는 cpu와 ram을 속성으로 저장했고, 함수 생성자를 통해 생성된 객체(laptop1)의 __proto__에는 cpu와 ram을 포함한 Object가 할당되어 있다.
즉 객체가 생성될시 그 속성인 __proto__는 생성자의 prototype과 연결되어 있다는 뜻이며 따라서 객체가 이미 생성된 이후일 지라도 해당 생성자의 prototype에 속성을 추가하면 연결된 모든 객체는 추가된 속성을 접근 할 수 있다.

![이후 추가](https://user-images.githubusercontent.com/39623897/103169504-87200080-487f-11eb-8552-e6db35d449df.JPG)

## 3. prototype chain
이렇게 __proto__ 속성을 통해 상위 prototype object와 연결되어있는 형태를 prototype chain 이라고 하며, 상위 속성을 타고가다가 결국 prototype이 null을 가지는 function Object()의 prototype object에서 끝이난다. 따라서 모든 객체는 object의 속성을 사용할 수 있다.
![image](https://user-images.githubusercontent.com/39623897/103170658-331a1980-4889-11eb-8f0f-3bc7ee6d9493.png)

## 4. class 기반 vs prototype 기반
그렇다면 class 기반과 prototype 기반의 차이는 무엇일까?
object를 만들어낸다는 관점으로 보면 차이를 발견하지 못했다. 하지만 동작방식은 다르다. class는 object를 만들어 내는 틀의 역할을 하는데, 
그 틀은 다른 class로 부터 상속 받는다. prototype은 3번에서 말한 것 처럼 prototype chain 원리에 의해 object가 __proto__를 통해 prototype object와 연결되고 prototype object의 constructor 속성을 통해 생성자 함수와 연결되는 방식으로 상속이 유지된다.

### 4-1 prototype 구조의 단점
object에서 속성에 접근하려는 시도는 속성이 발견될 때 까지 프로토타입 체인 전체를 탐색한다. 그래서 없는 속성에 접근할 때 최상위 프로토타입
까지 탐색을 하기 때문에 때로는 매우 치명적인 단점이 될 수가 있다. 따라서 property가 있는지 확인하는 hasownProperty 메소드를 통해 체인 전체를 훓지 않게 할 수 있다. 

## 5. class
ecmascript2015부터 class 문법이 새로 추가되었다. 하지만 class 또한 prototype과 별개의 독립체(entity)가 아닌 prototype을 기반으로 한 생성자 함수이다. 그렇다면 javascript class와 prototype의 무엇이 다른지 살펴보자.

### 5.1. constructor
```
class Laptop{
  constructor(){
    //object 생성 및 초기화
    this.cpu = "i7-8565U"; //property
    this.ram = 16;
  }
  changeCpu = function(cpu){ //method
      this.cpu = cpu;
    }
  changeRam(ram){ // prototype method
    this.ram = ram;
  }
}
Laptop.prototype.brand = "samsung";
```
class는 function과 마찬가지로 object를 만들고 초기화 하기위해 꼭 constructor가 필요하다. function과 다른 점은 property가 꼭 constructor 내부에서 선언되어야 한다는 점이다. 

![image](https://user-images.githubusercontent.com/39623897/103210609-7c31a280-4949-11eb-986d-943726ace988.png)

### 5.2. hoisting
class는 표현식과 선언식 둘다 사용할 수 있으나 function의 선언식은 hoisting되어 먼저 호출 후 선언해도 문제가 되지 않았지만
class의 표현식 선언식 모두 TDZ에 빠지게 되고 선 선언 그 후 호출해야 정상적으로 에러없이 동작한다.

### 5.3 class expressions(클래스 표현식)
```
let Laptop = class {} // 1 unnamed
let Desktop = class Computer {} // 2 named

let laptop1 = new Laptop();
let desktop1 = new Desktop();
let computer1 = new Computer(); // Uncaught ReferenceError: Computer is not defined

```
#### 5.3.1 named class expressions
클레스 표현식을 사용할 때 한가지 주의할 점이 있다. 1번과 같이 클래스 표현식에서 이름없는 '익명 클레스'를 사용하는 경우가 일반적이나
2번처럼 이름과 같이 사용할 수 있는데 이를 기명 클래스 표현식(Named Class Expressions)이라고 하며, 이 경우 class화 함께 기제한 이름인 Computer를 통해 object를 생성할 수 없고, 변수명인 Desktop을 사용해야 한다. Computer는 클래스의 name 속성으로 저장되게 된다. 그렇다면 Computer는 어떻게 쓰일까?

```
추후 기입 예정
```

## 6. review
기존까지 Javascript를 단순히 동적인 표현을 위한 언어로 생각했다. 주먹구구식으로 구현을 위주로 한 Javascript를 인터넷으로 배우게 되었고 그동안 시간이 없다는 핑계로 단순히 최대한 빠르게 구현하는 것에 내 생각이 멈춰있었는데 동시에 기본기를 탄탄하게 다질 필요가 있겠다는 생각이 들었다. 결론적으로 이번 학습에서는 Javascript의 object를 구성하는 원리와 내재한 메소드가 어떻게 동작하는지 알 수 있었던 계기가 되었다. 그동안 짐작으로 구현했던 나 자신을 반성하며 앞으로는 이렇게 하나하나 지식을 탐구하며 아는 것에 그치지 않고 때에 따라 정확하고 효과적으로 그 지식을 사용할 수 있는 사람이 되고자 한다. 이 길이 결국 더 빠른 길이라는 믿음과 함께 리뷰를 마친다.




