const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  @property({ type: [cc.SpriteFrame], visible: true })
  private textures = [];
  public symbol = null;

  public row = -1;
  public col = -1;

  private addAniItems = [];

  private animationNode = null;
  private skeleton = null;
  private border = null;
  private winLabel = null;

  async onLoad(): Promise<void> {
    await this.loadWinLabel();
    await this.loadTextures();
    await this.loadAnimationBorder();

    if (this.node) {
      this.border = this.node.getChildByName("Border");
      this.winLabel = this.node.getChildByName("WinLabel");
      this.animationNode = this.node.getChildByName("Animation");
      this.skeleton = this.animationNode.getComponent(sp.Skeleton);

      const that = this;
      const thatParent = this.node.parent.parent.parent.parent;
      thatParent.on('all-win-animation', (res) => {
        const wl = res.data.wl;
        const win = res.data.w;
        for (let i = 0; i < wl.length; i++) {
          const payLine = wl[i].PayLine;
          if (payLine.PositionList[that.col] == that.row) {
            that.showGFX(true, that.symbol, 0, true);
          }
        }
        if (that.row == 1 && that.col == 4) {
          if (win > 0) {
            that.showWinLabel(win, true);
          }
        }
        setTimeout(() => {
          that.showGFX(false);
        }, 1000);
      });
      thatParent.on('sub-win-animation', (res) => {
        const wl = res.data.wl;
        const index = res.index;
        const payLine = wl[index].PayLine;
        const win = wl[index].WinValue;
        if (payLine.PositionList[that.col] == that.row) {
          if (that.col == 4 && payLine.PositionList[2] == that.row) {
            that.showGFX(true, that.symbol, win, false);
          } else {
            that.showGFX(true, that.symbol, 0, false);
          }
        }
        setTimeout(() => {
          that.showGFX(false);
        }, 1000);
      });
    }
  }

  async loadWinLabel(): Promise<boolean> {
    const self = this;
    return new Promise<boolean>(resolve => {
      cc.loader.loadRes('win_label', cc.Prefab, function afterLoad(err, loadedItem) {
        self.winLabel = cc.instantiate(loadedItem);
        resolve(true);
      });
    });
  }

  async loadTextures(): Promise<boolean> {
    const self = this;
    return new Promise<boolean>(resolve => {
      cc.loader.loadResDir('gfx/Square', cc.SpriteFrame, function afterLoad(err, loadedTextures) {
        self.textures = loadedTextures;
        resolve(true);
      });
    });
  }

  async loadAnimationBorder(): Promise<boolean> {
    const self = this;
    return new Promise<boolean>(resolve => {
      cc.loader.loadRes("item_border", cc.Prefab, function afterLoad(err, loadedItem) {
        self.animationBorder = cc.instantiate(loadedItem);
        resolve(true);
      });
    });
  }

  setTile(symbol: number, col: number, row: number): void {
    this.symbol = symbol;
    this.row = row;
    this.col = col;
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[symbol];
  }

  setRandom(): void {
    const randomIndex = Math.floor(Math.random() * this.textures.length);
    this.setTile(randomIndex, -1, -1);
  }

  showDrumAnimation() {
    this.node.getComponent(cc.Sprite).spriteFrame = null;
    this.animationNode.active = true;
    this.skeleton.setAnimation(0, "item_nml_11", false);
    this.node.getComponent(cc.AudioSource).play();
    const that = this;
    setTimeout(() => {
      that.node.getComponent(cc.Sprite).spriteFrame = this.textures[parseInt(this.symbol)];
      that.animationNode.active = false;
    }, 1000);
  }

  showGFX(option: boolean, index?: number, win?: number, isTotalWin?: boolean){
    if(option){
      this.node.getComponent(cc.Sprite).spriteFrame = null;
      this.skeleton.setAnimation(0, `item_nml_${index}`, true);
      this.animationNode.active = true;
      this.border.active = true;
      this.showWinLabel(win, isTotalWin);
    }
    else{
      this.node.getComponent(cc.Sprite).spriteFrame = this.textures[parseInt(this.symbol)];
      this.animationNode.active = false;
      this.border.active = false;
      this.winLabel.active = false;
    }
  }
  showWinLabel(win?: number, isTotalWin?: boolean) {
    if (win > 0) {
      this.winLabel.active = true;
      const labelComponent = this.winLabel.getComponent(cc.Label);
      labelComponent.string = win.toFixed(2);
      if (isTotalWin) {
        labelComponent.fontSize = 100;
        labelComponent.lineHeight = 100;
      } else {
        labelComponent.fontSize = 60; 
        labelComponent.lineHeight = 60;
      }
    }
  }

  removeAnimation(): void{
    this.showGFX(false);
    this.skeleton.setAnimation(0, '', true);
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[parseInt(this.symbol)];
    this.animationNode.active = false;
    this.border.active = false;
    this.winLabel.active = false;
  }
}
