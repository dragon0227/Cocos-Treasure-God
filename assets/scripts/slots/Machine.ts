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
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i + 1;
      const theReel = this.reels[i].getComponent('Reel');
      this.stopReel(theReel, result, i, spinDelay);
    }
  }

  private stopReel(theReel: any, result: any, index: number, spinDelay: number): void {
    if(result){
      var res = JSON.parse(JSON.stringify(result));
      var realIndex = index;
    }
    else{
      res = null;
    }
    const that = this;
    this.schedule(() => {
      theReel.readyStop(res, realIndex);
      if (realIndex == 4) {
        that.startAnimation(res);
      }
    }, 0.1 * spinDelay * that.speed, 0, 0);
  }

  startAnimation(res) {
    this.node.dispatchEvent( new cc.Event.EventCustom('rolling-completed', true) );
      const that = this;
      const wl = res.payLines;
      const totalWin = res.totalWin;
      
      this.schedule(() => {
        this.node.emit('drum-animation', { data: res});
      }, 0.5, 0, 0);
      if (wl && wl.length > 0) {
        that.schedule(() => {
          for (let i = 0; i < this.numberOfReels; i += 1) {
            const theReel = this.reels[i].getComponent('Reel');
            const theMask = theReel.node.getChildByName("Mask");
            theMask.height = 580;
          }
          that.schedule(async function() {
            this.node.emit('all-win-animation', { data: res});
      
            if (wl.length > 1) {
              for(let i = 0; i < wl.length; i++){
                const timeoutId = setTimeout(() => {
                  that.node.emit('sub-win-animation', { data: res, index: i});
                }, 1200 * (i + 1));
                that.timeoutIds.push(timeoutId);
              }
            }
          }, (wl.length + 1) * 1.2 + 0.5, 100, 0.1);
        }, 0.5, 0, 0)
      }
  }

  stopAnimation(): void {
    this.unscheduleAllCallbacks();
    this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeoutIds = []; // Reset the array
  }
}
