# ASCII(American Standard Code for Information Interchange)

정보를 교환하기 위해서 기계적인 신호(비트)를 문자로, 문자는 기계적 신호로 변환한다. 이떄 사용하는 기준중 하나가 ASCII 코드다.

# 유니코드
전세계의 모든 문자를 표현하기 위해 설계된 표준.
유니코드는 특정한 값이고, 이 값의 범위가 상당히 넓다보니 그 값으로 인코딩하는 방식인 UTF(Unicode Transformation Format)을 사용하게 되었다. 보통 8bit로 인코딩하는 방식은 UTF-8을 사용하는 것이 흔하다.

## Byte

- 1960년대 초반에는 1byte가 6bit였다고 한다.
- 초창기 컴퓨터는 레지스터 공간이 6bit였기 때문인데, 6bit라는 의미는 cpu가 한번에 처리할 수 있는 단위가 6bit까지 라는 것이기 때문에 이때 당시 표현가능한 문자의 범위가 6bit 까지라고 가정하면 어차피 읽을 수 있는 최대의 범위가 레지스터 크기이기 때문에 1byte를 레지스터의 크기로 설정하는 것이 당연할 법 하다.
- 이말은 즉, 문자 하나를 송신하기 위해 필요한 최대 bit가 당시 6bit기 때문에 6bit를 Byte라고 했다.
- 이와 동시에 parity 코드라는 것을 사용해서 송신시 오류를 검출하기 위해 7bit를 사용했다.
- 1963년대 텔레콤 산업이 부흥했고, 이때는 6bit보다 더 많은 문자를 표현하고 싶었고, ASCII 코드라는 문자열 변환 표준이 등장한다.
- ASCII 코드는 7bits 만큼의 문자를 표현할 수 있고, 여기에 parity 코드를 더해서 8bit를 사용하는 컴퓨터가 흔해졌다.

- ISO/IEC 2372-1:1993 에 의해 사실상 8비트로 표준화 되었다. The modern de facto standard of eight bits, as documented in ISO/IEC 2382-1:1993

