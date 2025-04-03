import Aux from '../SlotEnum';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel extends cc.Component {
  @property({ type: cc.Node })
  public reelAnchor = null;

  @property({ type: cc.Enum(Aux.Direction) })
  public spinDirection = Aux.Direction.Down;

  @property({ type: [cc.Node], visible: false })
  private tiles = [];

  @property({ type: cc.Prefab })
  public _tilePrefab = null;

  @property({ type: cc.Prefab })
  get tilePrefab(): cc.Prefab {
    return this._tilePrefab;
  }

  set tilePrefab(newPrefab: cc.Prefab) {
    this._tilePrefab = newPrefab;
    this.reelAnchor.removeAllChildren();
    this.tiles = [];

    if (newPrefab !== null) {
      this.createReel();
      this.shuffle();
    }
  }

  private realResult: Array<number> = null;
  private result: any = null;
  private realIndex: number = null;

  public stopSpinning = false;
  public isStopAnimation = false;

  private tileWidth = 188;
  private speed = 1;

  createReel(): void {
    let newTile: cc.Node;
    for (let i = 0; i < 5; i += 1) {
      newTile = cc.instantiate(this.tilePrefab);
      this.reelAnchor.addChild(newTile);
      this.tiles[i] = newTile;
    }
  }

  shuffle(): void {
    for (let i = 0; i < this.tiles.length; i += 1) {
      this.tiles[i].getComponent('Tile').setRandom();
    }
  }

  readyStop(newResult: any, newRealIndex: number): void {
    this.result = newResult;
    this.realIndex = newRealIndex;
    this.realResult = this.getReal();
    this.stopSpinning = true;
  }

  changeCallback(element: cc.Node = null): void {
    const el = element;
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;
    if (el.position.y * dirModifier > 376) {
      el.position = cc.v3(0, -376 * dirModifier);

      let pop = null;
      
      if (this.realResult != null && this.realResult.length > 0) {
        pop = this.realResult.pop();
      }
      
      if (pop != null && pop >= 0) {
        el.getComponent('Tile').setTile(pop, this.realResult.length);
      } else {
        el.getComponent('Tile').setRandom();
      }
    }
  }

  animateAllWinPos(): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const tmpReal = this.getReal();
        this.reelAnchor.children.forEach((element, index) => {
          const el = element;
          el.getComponent('Tile').showGFX(false);

          const elPop = parseInt(el.getComponent('Tile').title);
          const elIndex = parseInt(el.getComponent('Tile').tileIndex);
    
          let isElementWin = false;
          const wl = this.result.wl;

          const win = this.result.w;
          
          for (let i = 0; i < wl.length; i++) {
            const payLine = wl[i].PayLine;
            if (elIndex == payLine.PositionList[this.realIndex] && tmpReal[payLine.PositionList[this.realIndex]] == elPop) {
              isElementWin = true;
            }
          }
          if (this.isStopAnimation) {
            resolve();
          } else {
            if (isElementWin) {
              if (this.realIndex == 4 && elIndex == 1) {
                el.getComponent('Tile').showGFX(true, elPop, win, true);
              } else {
                el.getComponent('Tile').showGFX(true, elPop, 0, true);
              }
            }
          }
        });    
        resolve();
      }, 0);
    });
  }

  animatePayLineWinPos(index: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const tmpReal = this.getReal();
        this.reelAnchor.children.forEach(element => {
          const el = element;
          el.getComponent('Tile').showGFX(false);
          const elPop = parseInt(el.getComponent('Tile').title);
          const elIndex = parseInt(el.getComponent('Tile').tileIndex);

          let isElementWin = false;
          const wl = this.result.wl;
          
          const payLine = wl[index].PayLine;
          const win = wl[index].WinValue;
          if (elIndex == payLine.PositionList[this.realIndex] && tmpReal[payLine.PositionList[this.realIndex]] == elPop) {
            isElementWin = true;
          }
          if (this.isStopAnimation) {
            resolve();
          } else {
            if (isElementWin) {
              if (this.realIndex == 4) {
                el.getComponent('Tile').showGFX(true, elPop, win, false);
              } else {
                el.getComponent('Tile').showGFX(true, elPop, 0, false);
              }
            }
          }
        });
        resolve();
      }, 2000 * this.speed);
    });
  }

  animateDrum(): void {
    const tmpReal = this.getReal();
    this.reelAnchor.children.forEach(element => {
      const el = element;
      el.getComponent('Tile').showGFX(false);
      const elPop = parseInt(el.getComponent('Tile').title);
      const elIndex = parseInt(el.getComponent('Tile').tileIndex);

      if (tmpReal[elIndex] == 10) {
        el.getComponent('Tile').showDrumAnimation();
      }
    });
  }

  stopAnimate(): Promise<void> {
    if (this.isStopAnimation) {
      this.reelAnchor.children.forEach(element => {
        const el = element;
        el.getComponent('Tile').showGFX(false);
      });
    } else {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          this.reelAnchor.children.forEach(element => {
            const el = element;
            el.getComponent('Tile').showGFX(false);
          });
          resolve();
        }, 2000 * this.speed);
      });
    }
  }

  async startAnimation(mSpeed: number): Promise<void> {
    this.speed = mSpeed;
    this.isStopAnimation = false;
    const that = this;
    const wl = this.result.wl;
    const w = this.result.w;
    if (w > 0) {
      this.schedule(async function() {
      
        await that.animateAllWinPos();
  
        if (wl.length > 1) {
          for(let i = 0; i < wl.length; i++){
            await that.animatePayLineWinPos(i);
          }
        }
  
        await that.stopAnimate();
      }, wl.length > 1 ? (3.5 + (wl.length) * 2) * that.speed : 3.5 * that.speed, 15, 0.1);
    } else {
      const sArr = this.result.s.split(",");
      let mIndex = 0;
      let rstArr0 = sArr.slice(3 * mIndex, 3 * mIndex + 3);
      let rstArr1 = sArr.slice(3 * mIndex, 3 * mIndex + 3);
      if (this.realIndex == 0 && rstArr0.includes("10")) {
        this.animateDrum();
      }
      if (this.realIndex == 1 && rstArr0.includes("10") && rstArr1.includes("10")) {
        this.animateDrum();
      }
    }
  }

  stopAnimation(): void {
    for(let i = 0 ; i < this.reelAnchor.children.length; i++) {
      const el = this.reelAnchor.children[i];
      el.getComponent('Tile').removeAnimation();
    }
    this.unscheduleAllCallbacks();
  }

  getReal(): Array<number> {
    const sArr = this.result.s.split(",");
    let rstArr = sArr.slice(3 * this.realIndex, 3 * this.realIndex + 3);

    return rstArr;
  }

  checkEndCallback(element: cc.Node = null): void {
    const el = element;
    if (this.stopSpinning) {
      this.getComponent(cc.AudioSource).play();
      this.doStop(el);
    } else {
      this.doSpinning(el);
    }
  }

  doSpin(windUp: number): void {
    this.isStopAnimation = true;
    this.stopAnimation();
    this.stopSpinning = false;
    this.reelAnchor.children.forEach(element => {
      const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;
      
      element.getComponent('Tile').removeAnimation();
      const delay = cc.tween(element).delay(windUp);
      const start = cc.tween(element).by(0.25, { position: cc.v2(0, this.tileWidth * dirModifier) }, { easing: 'backIn' });
      const doChange = cc.tween().call(() => this.changeCallback(element));
      const callSpinning = cc.tween(element).call(() => this.doSpinning(element, 5));
      
      element.getComponent('Tile').showGFX(false);
      delay
        .then(start)
        .then(doChange)
        .then(callSpinning)
        .start();
    });
  }

  doSpinning(element: cc.Node = null, times = 1): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween().by(0.04, { position: cc.v2(0, this.tileWidth * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const repeat = cc.tween(element).repeat(times, move.then(doChange));
    const checkEnd = cc.tween().call(() => this.checkEndCallback(element));

    repeat.then(checkEnd).start();
  }

  doStop(element: cc.Node = null): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween(element).by(0.04, { position: cc.v2(0, this.tileWidth * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const end = cc.tween().by(0.2, { position: cc.v2(0, this.tileWidth * dirModifier) }, { easing: 'bounceOut' });
    
    
    move
      .then(doChange)
      .then(move)
      .then(doChange)
      .then(end)
      .then(doChange)
      .start();
  }

  showGFX(): void{
    this.reelAnchor.children.forEach((element, index) => {
      element.getComponent('Tile').activeGFX(index);
    });
  }
}
