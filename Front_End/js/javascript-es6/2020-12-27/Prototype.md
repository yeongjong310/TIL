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

두 객체를 비교해보면 첫번째 this를 통해 프로퍼티를 설정할 경우 생성된 객체 laptop1의 property로 cpu와 ram이 등록되는 반면, 두번째 prototype 방식은 laptop1의 __proto__ 라는 property에 cpu와 ram 이 저장되었다.

## 2. how does it work?
함수는 [일급객체](https://ko.wikipedia.org/wiki/%EC%9D%BC%EA%B8%89_%EA%B0%9D%EC%B2%B4) 이기 때문에 프로터피를 만들 수 있다. 그래서 함수를 선언하면 prototype이 함수의 기본 프로퍼티로 함께 생성된다. 이 prototype 또한 하나의 객체인데, 그 쓰임은 함수(생성자)를 통해 생성된 모든 객체가 "__proto__" 라는 프로퍼티를 가지게 되면서 이 프로퍼티는 함수(생성자)의 property(객체)의 주소를 참조하게 된다. 생성되는 모든 객체가 하나의 property를 바라보고 있으니 property에 저장되는 데이터는 모든 객체에게 공유된다. 객체가 이미 생성된 이후일 지라도 해당 생성자의 prototype에 속성을 추가하면 연결된 모든 객체는 추가된 속성에 접근 할 수 있다.

예제에서는 cpu와 ram을 prototype의 property로 저장했다. 따라서 함수 생성자를 통해 생성된 객체(laptop1)의 __proto__ 는 cpu와 ram을 포함한 prototype을 참조한다.

![이후 추가](https://user-images.githubusercontent.com/39623897/103169504-87200080-487f-11eb-8552-e6db35d449df.JPG)

### 2.1. 함수 구조 살펴보기
![image](https://user-images.githubusercontent.com/39623897/108944888-fb6bfa00-769e-11eb-869b-c87cf9eb2a84.png)

위 그림을 보면 f Laptop() 함수의 속성에는 prototype과 __proto__가 있는 반면, Laptop 객체에는 오로지 __proto__만이 존재한다.
f Laptop()의 prototype은 객체의 __proto__와 연결된다. 즉 Laptop 함수도 하나의 객체이고 prototype 속성 또한 객체인데 f Laptop() 함수가 만드는 모든 객체가 이 prototype을 공유하게 된다. Laptop()함수에 있는 또 다른 __proto__는 f () 함수 객체로 부터 이 f Laptop() 함수가 생성되었다는 의미이며 f () 함수의 prototype을 가리키게 된다.

즉 __proto__는 객체가 어떤 생성자로부터 상속받은 값들이며,
prototype은 상속할 값들이다.

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
class는 표현식과 선언식으로 사용될 수 있다. 하지만 function의 선언식은 hoisting되어 선 호출, 후 선언 구조에서도 문제가 되지 않았지만
class의 표현식 선언식 모두 TDZ에 빠지게 되고 선 선언, 후 호출해야 정상적으로 실행된다.

### 5.3 class expressions(클래스 표현식)
```
let Laptop = class {} // 1 unnamed
let Desktop = class Computer {} // 2 named

let laptop1 = new Laptop();
let desktop1 = new Desktop();
let computer1 = new Computer(); // Uncaught ReferenceError: Computer is not defined

```
#### 5.3.1 named class expressions
클래스 표현식을 사용할 때 한가지 주의할 점이 있다. 1번과 같이 클래스 표현식에서 이름없는 '익명 클레스'를 사용하는 경우가 일반적이나
2번처럼 이름과 같이 사용할 수 있는데 이를 기명 클래스 표현식(Named Class Expressions)이라고 하낟. 이 경우 class와 함께 기제한 Computer를 사용해 object를 생성할 수 없고, 변수명인 Desktop을 사용해야 한다. 그렇다면 Computer는 어디서 어떻게 쓰일까? Computer는 클래스의 name 속성으로 저장된다. 

```
추후 기입 예정
```

## 6. review
비교적 최근까지 Javascript를 단순히 동적인 표현을 위한 언어로 생각했다. 오로지 기능을 구현하기 위해 Javascript를 조금씩 인터넷으로 배우게 되었는데, 기능이 어떻게 동작하는지 모를때면 시간이 없다는 핑계로 원리를 파악하지 못했던 경우가 많았따. 하지만 원리를 파악해서 기본기를 탄탄하게 다지는 것이 결과적으로 빠른 길이라는 것을 알게되고난 후로 이제는 확실하게 알고 사용하자라는 신념이 생겼다. 이번 학습에서는 Javascript의 object를 구성하는 원리와 내재한 메소드가 어떻게 동작하는지 알아보았고, 그동안 짐작으로 구현했던 나 자신을 반성하며 올바른 길로 향해가자.




