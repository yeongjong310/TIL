# ch24 클로저

## 1. 렉스컬 스코프
스코프의 실체는 실행 컨텍스트의 렉시컬 환경이라고 볼 수 있다. 이 렉시컬 환경은 자신의 "외부 렉시컬 환경에 대한 참조"를 통해 상위 렉시컬 환경과 연결된다. 이것이 바로 스코프 체인이다.

**렉시컬 환경의 "외부 렉시컬 환경에 대한 참조"에 저장할 참조값, 즉 상위 스코프에 대한 참조는 함수 정의가 평가되는 시점에 함수가 정의된 함경에 의해 결정된다. 이것이 바로 렉시컬 스코프다.**

## 2. 함수 객체의 내부 슬롯 `[[Environment]]`
함수 정의가 평가되어 함수 객체가 생성되면 객체는 내부 슬롯 \[[Environment]]에 현재 실행중인 실행컨텍스트의 환경 레코드를  가리키는 참조가 할당된다.

함수가 호출되면 함수 실행 컨텍스트가 생성되며 렉시컬 환경도 함께 생성된다. 실질적으로 렉시컬 환경 자체가 스코프라고 볼 수 있다. 그 이유는 렉시컬 환경의 구성요소중 상위 스코프를 참조하기 위해 외부 렉시컬 환경을 위한 참조가 존재하기 떄문이다.

이때 함수가 호출되어 렉시컬 환경이 만들어지는  시점에 외부렉시컬 환경을 위한 참조를 바인딩 해야 한다. 하지만 상위스코프는 정의되는 시점에 결정되기 때문에 함수 객체가 가지고 있는 \[[Environment]]를 할당해서 상위 스코프가 언제나 정의된 시점의 실행컨텐스트를 가리키도록 유지한다.

## 3. 클로저와 렉시컬 환경

## 5. 캡슐화와 정보 은닉

캡슐화는 프로퍼티와 메서드를 하나로 묶는 것을 말한다.
캡슐화는 객체의 특정 프로퍼티나 메서드를 감출 목적으로 사용하기도 하는데 이를 정보 은닉 이라고 한다.

정보 은닉은 외부로부터의 접근을 제한하여 정보를 보호하고, 객체 간의 상호 의존성, 즉 **결합도**를 낮추는 효과가 있다.
