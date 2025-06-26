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

  private speed = 1;
  private timeoutIds = [];

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
    this.speed = mSpeed;
    this.stopAnimation();

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent('Reel');
      const theMask = theReel.node.getChildByName("Mask");
      theMask.height = 550;
      theReel.doSpin(0.03 * i * this.speed, this.speed);
    }
  }

  lock(): void {
    //this.button.getComponent(cc.Button).interactable = false;
  }

  stop(result: any = null): void {
    setTimeout(() => {
      var res = JSON.parse(JSON.stringify(result));
      this.startAnimation(res);
    }, 2500);

    const rngMod = Math.random() / 2;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
      const theReel = this.reels[i].getComponent('Reel');
      //this.stopReel(theReel, result, i, spinDelay * this.speed);
      setTimeout(() => {
        var res = JSON.parse(JSON.stringify(result));
        theReel.readyStop(res, i);
      }, spinDelay * 1000);
    }
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
        if (realIndex == 4) {
          that.startAnimation(res);
        }
        resolve();
      }, spinDelay * 1000 * that.speed);
    });
  }

  startAnimation(res) {
    setTimeout(() => {
      for (let i = 0; i < this.numberOfReels; i += 1) {
        const theReel = this.reels[i].getComponent('Reel');
        const theMask = theReel.node.getChildByName("Mask");
        theMask.height = 580;
      }
      this.node.dispatchEvent( new cc.Event.EventCustom('rolling-completed', true) );
      const that = this;
      const wl = res.payLines;
      const totalWin = res.totalWin;
      this.node.emit('drum-animation', { data: res});
      if (wl && wl.length > 0) {
        that.schedule(async function() {
          this.node.emit('all-win-animation', { data: res});
          //console.log("all-win-animation");
    
          if (wl.length > 1) {
            for(let i = 0; i < wl.length; i++){
              const timeoutId = setTimeout(() => {
                this.node.emit('sub-win-animation', { data: res, index: i});
                //console.log("sub-win-animation");
              }, 1200 * that.speed * (i + 1));
              that.timeoutIds.push(timeoutId);
            }
          }
        }, (wl.length + 1) * 1.2 * that.speed + 0.5, 100, 0.1);
      }
    }, 1000);
  }

  stopAnimation(): void {
    this.unscheduleAllCallbacks();
    this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeoutIds = []; // Reset the array
  }
}
