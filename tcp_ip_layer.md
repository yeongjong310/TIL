# TCP / IP 4 layer
네이버 FE 채용공고의 한 작성 문항에서 글로벌 서비스를 개발할 때 어떤 점을 중요하다고 생각하는지 기술하는 란이 있었다.
그 동안 글로벌한 서비스에 대해 따로 깊이 있게 생각해 보지 않았는데, 이번 기회에 글로벌 서비스를 위한 기술로 어떤 것들이 쓰이는지 찾아보며
알게된 개념중 하나인 RTT(Round Trip Time)를 개선하는 중요한 방법인 HTTP/2 를 접하게 되었다. 여기서는 HTTP/2를 알아보기 전
밑바탕이되는 TCP/IP 개념을 다시 한번 집고 넘어가려고 한다.

## 4계층
LAN은 다들 한번 들어봤을 것이다. 가정에서 보통 KT, LG, SK 등의(ISP)의 인터넷망을 결제해서 사용한다. 
이 ISP에서는 보통 한 개의 공인 IP를 제공하고 우리가 자주보는 공유기에 연결되어 여러 개의 사설 IP를 생성한다. 
PC 혹은 디바이스에 연결된 LAN 혹은 WIFI를 통해 생성된 사설 IP가 부여되어 우리는 인터넷을 사용할 수 있는 것이다.
이 IP와 관련해서 어떠한 구조로 통신하고 있는지 간략하게 정리해 보려고 한다.

4 Layer. Application Layer : http, stp, ftp ...

3 Layey. Transport Layer : TCP(데이터를 안전하게 전달하는 방법 정의)

2 Layer. Internet Layer : IP(데이터를 빠르게 전달하는 방법 정의)

1 Layer. Network Access Layer: Ethernet, Wifi, 5G...

## 5계층 => Update된 TCP/IP의 새로운 계층으로 실제로 최근에는 이 모델을 더 많이 따른 다고하여 기술.
5. Layer. Application Layer : http, stp, ftp ...
4. Layer. Transpoprt Layer : TCP
3. Layer. Network Layer : Ip
2. Layer. DataLink Layer: 같은 네트워크에 속한 여러 대의 컴퓨터(스위치로 연결된 컴퓨터들)들이 데이터를 주고 받기 위해 필요한 레이어이다.
1. Layer. Physical Layer: 전선은 아날로그 신호밖에 전송하지 못한다. 디지털신호를 만들어내는 컴퓨터를 아날로그 신호로 바꾸어 전송하고 
전달받은 아날로그 신호는 디지털 신호로 바꾸어 주는 역할을 담당하는 레이어이다.

### 4. Transport Layer:
Port를 확인해서 정확한 프로세스로 데이터를 전달한다.

#### 4.1. TCP(Transmission Control Protocol): 
TCP는 신뢰성있는 데이터를 누락없이 해당 프로세스로 보내기 위해 고안된 통신 규약이다.
왜 이러한 방법이 고안되었을까? 예를들어 발신자가 데이터를 송신하는 중 중 알 수 없는 이유로 그 데이터는 수신자에게 도착하지 않았다.
데이터 누락이 발생한 것이다. 실제로 라우터가 처리할 수 있는 한계치를 넘어갔을 경우 이러한 일이 발생 할 수 있다. 따라서 이를 해결하기 위해
TCP는 3-Way Handshake라는 절차를 통해 데이터를 주고 받게된다.
##### 4.1.1 3-Way Handshake
Client                 Server
     1.------SYN------>
      <----SYN/ACK-----2.
     3.------ACK------>
###### 4.1.1.1 flag
TCP에서 주고 받는 Segment는 TCP header와 Data로 나누어지는데 TCP header에는 송수신자의 PORT 번호와 송수신시 필요한 9가지의 플래그가 있습니다. 9가지 플래그는 각 역할이 정해져있으며 여기서는 SYN, ACK만 다루겠습니다.  
- SYN(Syncronize): 단어 뜻 그대로 Client와 Server 사이에 연결을 위한 플래그입니다.
- ACK(Acknowledgement): 정상적으로 데이터를 받았음을 알리기 위한 플래그입니다. 
##### 4.1.2 연결 과정
- 1. 위의 그림을 보면 Client가 SYN을 SERVER로 넘겨주게 되는데 Server는 이 SYN에 해당하는 데이터가 1인지 확인하여 Client가 연결을 원하는지 알아차립니다.
- 2. 위의 그림을 보면 Server는 SYN/ACK을 보내게 되는데, 그 이유는 SERVER도 SYN을 1로 설정한 TCP Header를 Client로 보내서 Server 또한 통신하고 싶다는 메세지를 보내고 이와 함께 ACK을 보내서 이전에 Client가 SERVER와 통신하고 싶다고 보낸 메세지(데이터) 또한 잘 받았다고 알리게 되는 것 입니다.  
- 3. 위의 그림을 보면 다시 CLinet가 Server에게 ACK을 보냅니다. Client가 Server의 SYN/ACK을 잘 받았다고 알리기 위해서입니다.
이 3가지 단계를 거치면 Client와 Server 사이에 연결이 수립되고, 그 이후로는 아래와 같이 Segment를 보내고 ACK을 보내기를 반복합니다.
Client                 Server
     1.----Segment---->
      <------ACK------2.
     3.----Segment---->
##### 4.1.3 TCP의 장점 정리
1. 신뢰성 및 흐름제어(Flow Control)
2. 혼잡제어(Congestion Control)
##### 4.1.3 TCP의 문제점
TCP는 데이터의 신뢰성을 보장하지만 수신속도가 떨어지는 단점이 있고, 경우에 따라 조금 손상된 데이터가 전송되어도 상관없는 동영상 스트리밍같은
데이터 송수신 과정에서는 TCP를 이용하면 조금 비효율적일 수 있습니다. 그래서 그 대안으로 UDP를 사용한다.

#### 4.2. UDP

### 예제(네이버에서 아이디를 입력하고 로그인 버튼을 클릭했을 때, PC[client]와 SERVER의 데이터 송수신 과정[웹 페이지 전송등])

#### 용어정리
##### 데이터 단위(PDU[Protocol Data Unit])
- data: 4 Layer Apllication Layer 에서 http 프로토콜에 의해 http 헤더와 바디 형태로 데이터가 만들어진다. 헤더에는 GET/POST 메소드와 URL 등의 메타정보가 담겨 있다.
- segment: 3 Layer Transport Layer 에서 TCP 프로토콜에 의해 4Layer에서 만들어진 데이터 앞에 TCP 헤더가 붙는다. TCP 헤더에는 클라이언트와 서버의
port 넘버가 담겨있다. 이렇게 만들어진 데이터를 "Segment" 라고 한다.
- Packet: 2 Layer Internet Layer 에서 IP 프로토콜에 의해 Segment 앞에 IP 헤더가 붙는다. IP 헤더에는 클라이언트와 서버의 IP 주소가 담겨있다.
이렇게 만들어진 데이터를 "Packet"이라고 한다.
- Frame: 1 Layer Network Access Layer 에서 Segment 앞에 클라이언트와 서버의 MAC주소(Ethernet 헤더)가 붙고, 이렇게 만들어진 데이터를 "Frame"이라고 한다.

##### 네트워크 용어
- WAN: 국가 이상의 넓은 지역을 지원하는 네트워크 구조. 둘 이상의 LAN이 넓은 지역에 걸쳐 연결되어 있는 네트워크를 말한다.
- LAN: 비교적으로 가까운 거리에 위치한 소수의 장치들을 서로 연결한 네트워크로, 일반적으로 하나의 사무실 또는 몇 개의 건물을 연결한 네트워크를 말한다. 
- 라우터: LAN과 LAN , WAN과 WAN, WAN과 LAN을 연결해주는 장치이면서 데이터가 이 LAN과 WAN을 통해 최적의 경로를 설정하고 목적지에 도달하게 도와주는 장치.
- MAC address: 하드웨어가 가지고있는 물리적인 주소.
#### 데이터 전송 과정
1. 네트워크 카드에 연결된 LAN선을 통해 Frame은 종단 라우터(edge router: 라우터의 가장자리)로 이동한다.(공유기 등의 과정은 생략)
2. 종단 라우터는 Frame의 가장 앞단인 Ethernet 헤더를 벗겨 Packet 데이터로 만들고, Packet의 Ip 헤더 부분에 담겨있는 서버(송신자)의 Ip 주소를 확인한다.
Ip 주소를 통해 가장 최적의 경로를 확인하고 그 방향에 위치한 코어 라우터(core router: 라우터의 핵심-고성능,신뢰성 요구)로 Frame을 전송한다.
3. 이렇게 라우터를 타고가다 서버에 연결된 종단 라우터(최종 라우터)에 도착하면 이 라우터는 2번과 같은 과정을 통해 IP를 확인한 후,
목적지인 Server의 mac address 를 확인하여 해당 Server로 진입한다. 
4. Server에서는 Segment의 TCP헤더에 저장된 Port 번호를 확인하여 이 데이터가 80번 포트라면 http 요청이라는 것을 확인한다.
5. 80번 포트를 사용하고있는 프로세스(웹 프레임워크)에서 data를 확인하고 메타데이터에서는 어떤 메소드와 어떤 주소로 데이터를 요청했는지 
확인하고 이에 맞는 코드를 실행한다.
6. 실행된 결과(데이터)를 다시 Frame화 한 후 앞 과정을 거처 Client에게 응답한다.


## 참고자료
[TCP/IP 원리](https://www.youtube.com/watch?v=W9uosPORF8Y&t=479s)

[네트워크 계층으로 알아보는 인터넷의 원리](https://www.youtube.com/watch?v=6jo2OYPK7k0&t=294s)

[TCP/IP 4계층](https://ryusae.tistory.com/4)

[네트워크 상식 정리](https://blog.naver.com/park30420/221973149468)

[TCP](https://namu.wiki/w/TCP)



