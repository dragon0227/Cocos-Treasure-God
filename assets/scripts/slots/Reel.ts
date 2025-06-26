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

  private speed = 1;

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

  public stopSpinning = true;

  private tileWidth = 188;
  private updateCnt = 0;

  update(): void{
    // if (this.stopSpinning == false) {
    //   this.updateCnt++;
    //   console.log(">>>>>>> updated:" + this.updateCnt);
    // }
  }

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
      if (this.realIndex == 0) {
        console.log(">> pop:" + pop);
      }
      if (pop != null && pop >= 0) {
        el.getComponent('Tile').setTile(pop, this.realIndex, this.realResult.length);
      } else {
        el.getComponent('Tile').setRandom();
      }
    }
  }

  getReal(): Array<number> {
    if (this.result) {
      const sArr = this.result.reel.split(",");
      const rstArr = [sArr[this.realIndex], sArr[5 + this.realIndex], sArr[10 + this.realIndex]];
      return rstArr;
    } else {
      return null;
    }
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

  doSpin(windUp: number, mSpeed: number): void {
    this.speed = mSpeed;
    this.stopSpinning = false;
    this.result = null;
    this.realResult = null;
    this.reelAnchor.children.forEach((element, index) => {
      const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;
      element.getComponent('Tile').removeAnimation();
      element.getComponent('Tile').row = -1;
      element.getComponent('Tile').col = -1;
      const delay = cc.tween(element).delay(windUp);
      const start = cc.tween(element).by(0.25 * this.speed, { position: cc.v2(0, this.tileWidth * dirModifier) }, { easing: 'backIn' });
      const doChange = cc.tween().call(() => this.changeCallback(element));
      const callSpinning = cc.tween(element).call(() => this.doSpinning(element, 1));
      
      delay
        .then(start)
        .then(doChange)
        .then(callSpinning)
        .start();
    });
  }

  doSpinning(element: cc.Node = null, times = 1): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween().by(0.04 * this.speed, { position: cc.v2(0, this.tileWidth * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const repeat = cc.tween(element).repeat(times, move.then(doChange));
    const checkEnd = cc.tween().call(() => this.checkEndCallback(element));

    repeat.then(checkEnd).start();
  }

  doStop(element: cc.Node = null): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween(element).by(0.04 * this.speed, { position: cc.v2(0, this.tileWidth * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const end = cc.tween().by(0.2 * this.speed, { position: cc.v2(0, this.tileWidth * dirModifier) }, { easing: 'bounceOut' });
    
    move
      .then(doChange)
      .then(move)
      .then(doChange)
      .then(end)
      .then(doChange)
      .start();
  }
}
