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
        const wl = res.data.payLines;
        const win = res.data.totalWin;
        for (let i = 0; i < wl.length; i++) {
          const positions = wl[i].positions;
          if (positions.length > that.col && positions[that.col] == that.row) {
            that.showGFX(true, that.symbol);
          }
        }
        if (that.row == 1 && that.col == 4) {
          if (win > 0) {
            that.showWinLabel(win, true);
          }
        }
        that.schedule(() => {
          that.showGFX(false);
        }, 1, 0, 0);
      });
      thatParent.on('sub-win-animation', (res) => {
        const wl = res.data.payLines;
        const index = res.index;
        const positions = wl[index].positions;
        const win = wl[index].winValue;
        if (positions.length > that.col && positions[that.col] == that.row) {
          that.showGFX(true, that.symbol);
        }
        if (that.row == positions[2] && that.col == 4) {
          if (win > 0) {
            that.showWinLabel(win, false);
          }
        }
        that.schedule(() => {
          that.showGFX(false);
        }, 1, 0, 0);
      });
      thatParent.on('drum-animation', (res) => {
        that.showDrumAnimation(res.data);
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
    //this.node.getComponent(cc.Sprite).spriteFrame = null;
  }

  showDrumAnimation(res) {
    if (parseInt(this.symbol) == 10) {
      const firstCol = this.getCols(0, res);
      const secondCol = this.getCols(1, res);
      const thirdCol = this.getCols(2, res);
      const fourthCol = this.getCols(3, res);
      const fifthCol = this.getCols(4, res);

      if (this.col == 0) {
        if (!firstCol.includes("10")) {
          return;
        }
      } else if (this.col == 1) {
        if (!firstCol.includes("10") || !secondCol.includes("10")) {
          return;
        }
      } else if (this.col == 2) {
        if (!firstCol.includes("10") || !secondCol.includes("10") || !thirdCol.includes("10")) {
          return;
        }
      } else {
        return;
      }

      this.node.getComponent(cc.Sprite).spriteFrame = null;
      this.animationNode.active = true;
      this.skeleton.setAnimation(0, "item_nml_11", false);
      this.node.getComponent(cc.AudioSource).play();
      const that = this;
      that.schedule(() => {
        that.node.getComponent(cc.Sprite).spriteFrame = this.textures[parseInt(this.symbol)];
        that.animationNode.active = false;
      }, 1, 0, 0);
    }
  }

  getCols(index: number, res: any) {
    const sArr = res.reel.split(",");
    const rstArr = [sArr[index], sArr[5 + index], sArr[10 + index]];
    return rstArr;
  }

  showGFX(option: boolean, index?: number){
    if(option){
      this.node.getComponent(cc.Sprite).spriteFrame = null;
      this.skeleton.setAnimation(0, `item_nml_${index}`, true);
      this.animationNode.active = true;
      this.border.active = true;
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

  removeAnimation(): void {
    this.showGFX(false);
    this.skeleton.setAnimation(0, '', true);
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[parseInt(this.symbol)];
    this.animationNode.active = false;
    this.border.active = false;
    this.winLabel.active = false;
  }
}
