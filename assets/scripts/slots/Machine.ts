import Aux from '../SlotEnum';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
  @property(cc.Prefab)
  public _reelPrefab = null;

  @property({ type: cc.Prefab })
  get reelPrefab(): cc.Prefab {
    return this._reelPrefab;
  }

  set reelPrefab(newPrefab: cc.Prefab) {
    this._reelPrefab = newPrefab;
    this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })
  public _numberOfReels = 3;

  @property({ type: cc.Integer, range: [3, 6], slide: true })
  get numberOfReels(): number {
    return this._numberOfReels;
  }

  set numberOfReels(newNumber: number) {
    this._numberOfReels = newNumber;

    if (this.reelPrefab !== null) {
      this.createMachine();
    }
  }

  private reels = [];

  public spinning = false;
  private speed = 1;

  createMachine(): void {
    this.node.destroyAllChildren();
    this.reels = [];

    let newReel: cc.Node;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      newReel = cc.instantiate(this.reelPrefab);
      this.node.addChild(newReel);
      this.reels[i] = newReel;

      const reelScript = newReel.getComponent('Reel');
      reelScript.shuffle();
      reelScript.reelAnchor.getComponent(cc.Layout).enabled = false;
    }

    this.node.getComponent(cc.Widget).updateAlignment();
  }

  spin(mSpeed: number): void {
    this.spinning = true;
    this.speed = mSpeed;

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent('Reel');
      const theMask = theReel.node.getChildByName("Mask");
      theMask.height = 550;
      theReel.doSpin(0.03 * i);
    }
  }

  lock(): void {
    //this.button.getComponent(cc.Button).interactable = false;
  }

  stopWinAnimation(): void {
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent('Reel');
      theReel.isStopAnimation = true;
      theReel.stopAnimate();
    }
  }

  stop(result: any = null): void {
    const rngMod = Math.random() / 2;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
      const theReel = this.reels[i].getComponent('Reel');
      if (i == 4) {
        const that = this;
        this.stopReel(theReel, result, i, spinDelay).then(res => {
          setTimeout(() => {
            that.node.dispatchEvent( new cc.Event.EventCustom('rolling-completed', true) );
            that.spinning = false;
            that.showGFX();
      
            for (let i = 0; i < that.numberOfReels; i += 1) {
              const theReel = that.reels[i].getComponent('Reel');
              const theMask = theReel.node.getChildByName("Mask");
              theMask.height = 580;
              theReel.startAnimation(that.speed);
            }
          }, 600);
        });
      } else {
        this.stopReel(theReel, result, i, spinDelay);
      }
    }
    const that = this;
    // setTimeout(() => {
    //   this.node.dispatchEvent( new cc.Event.EventCustom('rolling-completed', true) );
    //   this.spinning = false;
    //   this.showGFX();

    //   for (let i = 0; i < this.numberOfReels; i += 1) {
    //     const theReel = this.reels[i].getComponent('Reel');
    //     theReel.startAnimation(this.speed);
    //   }
    // }, 5 * 500 * that.speed);
  }

  private stopReel(theReel: any, result: any, index: number, spinDelay: number): Promise<void> {
    if(result){
      var res = JSON.parse(JSON.stringify(result));
      var realIndex = index;
    }
    else{
      res = null;
    }
    const that = this;
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        theReel.readyStop(res, realIndex);
        resolve();
      }, spinDelay * 500 * that.speed);
    });
    
  }

  showGFX(): void{
    for (let i = 0; i < this.numberOfReels; i += 1) {
      this.reels[i].getComponent('Reel').showGFX();
    }
  }
}
