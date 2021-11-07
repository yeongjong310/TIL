# React: testing-library(RTL)

## RTL?
create react app을 통해 react 환경을 구성하면, react 컴포넌트를 unit 테스트 할 수 있는 도구를 기본으로 제공한다. react testing-library가 바로 그 도구이며, 사용자 관점에서 특정 상황에 컴포넌트가 제대로 렌더링 되었는지 테스트 할 수 있다.

## 사용 가이드
1. 테스트할 컴포넌트 정의(Banner.js)
```js
import './Banner.css';

export default function Banner() {
  return (
    <img src='' alt=''/>
  )
}
```

2. 테스트 파일 작성(Banner.test.js) - 기본 문법은 jest와 동일
```js
import { render, screen } from '@testing-library/react'
import Banner from './Banner';

describe('banner test', () => {
  const { container, getByText } = render(<Banner />)
})
```

3. render 함수에 대해 알아보자.

- `render` 함수는 리엑트 컴포넌트를 인수로 받아 `document.body` 의 자식으로 `div` container를 삽입한다.

- `render` 함수는 하나의 객체를 반환하며, 그 객체는 container와 container 내부를 탐색할 수 있는 query 메서드를 가지고 있다.

```js
describe('banner test', () => {
  const { container, getByText } = render(<Banner />)
  const img = container.querySelector('figure');
  test(
})
```