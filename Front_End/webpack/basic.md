# Webpack
Webpack에 대해 알아보자!

webpack은 모듈 번들러다.

## 1. 모듈 번들러가 왜 필요할까?

- **모듈의 탄생**: 웹 애플리케이션의 규모가 점차 커지면서 한 파일 내에 코드를 관리하는 것이 어려워졌다. 따라서 분할관리는 필수 요소가 되었는데, 기존의 script 태그의 src 어트리뷰트로 분할 파일들을 불러오는 작업은 파일별로 코드가 사용되는 시점에 따라 순서를 반드시 지켜야 했다. 또한 업데이트시 새로운 js 파일을 계속해서 head 태그에 넣다보면 head가 방대해져 유지보수 관점에서 매우 좋지 않은 결과를 초례했다.
**따라서** 모듈 시스템을 도입되었다. 모듈 시스템은 하나의 entry 파일만 head에 삽입해 놓으면 entry 파일에서 사용하는 다른 모듈을 동적으로 요청하여 사용할 수 있기 때문에 순서 문제와 head 태그가 방대해지는 문제점을 해결하였다.

- **모듈 번들러의 탄생**: 하지만 분할된 모듈 리소스를 계속 요청하는 것은 네트워크 비용을 낭비하는 일이었다. 따라서 모듈들을 하나로 파일로 그룹화하는 모듈 번들러가 탄생하게 되었다.

## 2. 모듈 번들러의 장점
1. 모듈 그룹화
2. 트리쉐이킹
3. 모듈 분할
4. loader(babel, css) 및 plugin(html-webpack-plugin)을 사용한 확장성

## 3. 실습: react용 webpack 설정하기
### 3.1. webpack 개발서버 구성하기

**Todos**
- []: 1. setup webpack basic(install, webpack.config.js)
- []: 2. css loader: Css를 분석하여 string으로 치환
- []: 3. style loader: Css loader가 처리한 결과를 html 파일의 내부 스타일 시트로 삽입
- []: 4. babel loader: Jax 문법등을 react 돔 생성 문법으로 치환
- []: 5. post css: 
- []: 6. typescript:
- []: 7. asstes:
- []: 8. svgr:
- []: 9. sass
- []: 10. 절대 경로 설정:
- []: 11. 테스트 환경
- []: 12. 플러그인


#### 3.1.1 setup webpack basic: 

**install**

```bash
npm install -D webpack webpack-cli webpack-dev-server dotenv
```

- webpack: 웹팩 번들링을 담당하는 코어
- webpack-cli: webpack4.0 버전 이상부터 cli 명령어를 사용하기 위해 설치 필요
- webpack-dev-server: disk에 번들링하는 것이 아니라 메모리상에서 즉각 webpack 번들링을 실행하여 빠르게 개발할 수 있도록 도와주는 헬퍼 역할
- dotenv: 환경변수 설정(port, API 키 ...)

**webpack.config.js**
```js
require('dotenv').config(); // 환경변수 모듈 사용 .env 파일 사용가능
const path = require('path'); // 경로 설정을 위함
const __ROOT = process.cwd(); // 루트 경로 설정 process는 node.js에서 제공한다.
const webpack = require('webpack');

module.exports = {
  target: ['web', 'es5'], // 구동 환경 지정(es 버전 혹은 브라우저 목록을 등록할 수 있다.)
  context: __ROOT, // context는 엔트리 포인트를 확인하기 위한 기본 경로를 설정한다. default는 webpack.config.js지만, 작업 디렉토리와 독립적인 설정을 위해 위와 같이 경로를 지정해주는 것을 권장한다.
  devtool: 'eval-source-map', // sourceMap 설정 및 build 성능 최적화
  devServer: serverConfig, // webpack-dev-server로 실행시 설정할 config
  entry: './src/index.js', // entry: 집입점
  mode: 'development',
  output: {
    filename: 'main.bundle.js', // output: 번들 결과
    path: path.resolve(__dirname, 'dist'),
  }
}
```

**webpack.server.config.js**
```js
const path = require('path');

module.exports = {
  // 정적 콘텐츠를 제공 할 위치를 서버에 알립니다.
  contentBase: path.join(process.cwd(), './public'),

  // 요청을 수신할 포트 번호를 설정합니다.
  port: process.env.PORT,

  // 인덱스로 설정할 파일 이름을 설정합니다.
  index: 'index.html',

  // 컴파일러 오류 또는 경고가있을 때 브라우저 화면에 오류 내용을 덮어씁니다.
  overlay: true,

  // 생성된 파일의 gzip 압축을 사용합니다.
  compress: true,

  // Hot Module Replacement 기능을 활성화 합니다.
  hot: true,

  // contentBase 옵션에서 제공하는 파일을 감시하도록 서버에 설정합니다.
  // 활성화 되면 파일 변경으로 전체 페이지 다시 로드 합니다.
  watchContentBase: true,

  // 알려진 바에 의하면 node_modules를 watchOptions 항목에서 제외하지 않을 경우
  // CPU 과부하 문제가 발생할 수 있습니다.
  // https://github.com/facebookincubator/create-react-app/issues/293
  watchOptions: {
    ignored: /node_modules/,
  },

  // Webpack Dev Server의 자체 로그는 일반적으로 유용하지 않습니다.
  // 로그를 보지 않도록 설정하거나, 너무 장황하지 않도록 'silent' 값을 설정합니다.
  clientLogLevel: 'none',

  // 터미널에 오류 정보만 간략히 표시하도록 설정합니다.
  stats: 'errors-only',

  // HTML5 History API를 사용하는 경우, index.html 페이지가 404 응답 대신 제공 되어야 합니다.
  historyApiFallback: true,

  // 실제 디스크에 파일을 쓰기합니다. (파일 생성)
  writeToDisk: true,
};
```
참고: 
- [webpack-target](https://webpack.kr/configuration/target/#root)
- [context](https://webpack.kr/configuration/entry-context/#context)
- [mode](https://webpack.kr/configuration/mode/)
- [devtool](https://webpack.kr/configuration/devtool/)
- []()

#### 3.1.2 css loader: 
#### 3.1.3 style loader: 

```bash
npm i -D style-loader css-loader
```

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/i, // $는 .css로 끝나는 파일을 검색하는 reg 
        use: ['style-loader', 'css-loader'] // 우에서 좌로 실행되기 때문에 위 순서를 반드시 지켜야 한다.
      }
    ]
  }
}
```

#### 3.1.4 babel loader: 
```bash
npm i -D @babel/core @babel/preset-env @babel/preset-react babel-loader
```
```js
module.exports = {
  ...
  module: {
    rules: [
      ...,
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // webpack 이 babel을 사용할 수 있도록 loader 셋업
          options: {
            comments: false,  // 컴파일시 주석 제거
            presets: [
              [
                '@babel/preset-env',  // babel preset 옵션 설정
                {
                  loose: true,
                  modules: 'auto',
                  targets: packageConfig.browserslist[isDevelopment],
                },
              ],
              [
                '@babel/preset-react',
                {
                  development: isDevelopment,
                },
              ],
            ]
          }
        }
      }
    ]
  }
}
```