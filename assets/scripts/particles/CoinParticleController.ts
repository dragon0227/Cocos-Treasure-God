cc.Class({
    extends: cc.Component,
  
    properties: {
      coinPrefab: cc.Prefab, 
      emissionRate: 800, 
      emissionDuration: 5
    },
  
    onLoad() {
      this.emitCoin();
        this.startAnimate();
    },

    startAnimate(): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(() => {
              this.schedule(this.emitCoin, 1 / this.emissionRate, this.emissionRate * this.emissionDuration);
              resolve();
            }, 800);
        });
    },
  
    emitCoin() {
      const coin = cc.instantiate(this.coinPrefab);
      this.node.addChild(coin);
  
      // 파티클의 초기 위치와 속도 설정
      coin.setPosition(this.getRandomPosition());
      const velocity = this.getRandomVelocity();

      // 아래로 떨어지는 애니메이션
      cc.tween(coin)
      .to(1, { position: cc.v3(velocity.x, 450, velocity.y) }, { easing: 'smooth' })
      .to(1, { position: cc.v3(velocity.x + velocity.x * 0.7, -200, velocity.y) }, { easing: 'smooth' })
      .call(() => {
          coin.destroy(); // 애니메이션 완료 후 파티클 제거
      })
      .start();

      // coin.runAction(cc.sequence(
      //   cc.moveBy(1, velocity).easing(cc.easeOut(2.0)),
      //   cc.callFunc(() => coin.destroy())
      // ));
    },
  
    getRandomPosition() {
      // 파티클의 초기 위치를 랜덤하게 설정하는 로직
      return cc.v2(0, 0); // 예시로 중심에서 방출
    },
  
    getRandomVelocity() {
      // 파티클의 초기 속도를 랜덤하게 설정하는 로직
      //const angle = (Math.random() * 90) * (Math.PI / 180); // 0~90도 랜덤
      const minAngle = 315; // 최소 각도
      const maxAngle = 45;  // 최대 각도

      // 315도에서 45도까지의 랜덤 각도 생성
      const angle = Math.random() * (maxAngle + 360 - minAngle) + minAngle;

      // 각도를 0도에서 360도 사이로 조정
      const adjustedAngle = angle % 360;

      const radians = adjustedAngle * (Math.PI / 180); // 라디안으로 변환
      const speed = 900; // 예시 속도
      return cc.v2(Math.cos(angle) * (speed * 0.4), Math.sin(angle) * speed);
    },
  });
  