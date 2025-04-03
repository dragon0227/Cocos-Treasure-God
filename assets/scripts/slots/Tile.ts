const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  @property({ type: [cc.SpriteFrame], visible: true })
  private textures = [];

  private animationItems = [];

  private animationBorder = null;

  private winLabel = null;

  public title = null;

  public tileIndex = -1;

  private addAniItems = [];

  async onLoad(): Promise<void> {
    await this.loadWinLabel();
    await this.loadTextures();
    for (let i = 0; i < 12; i++) {
      let itemName = '';
      if (i >= 10) {
        itemName = `item_${i}`;
      } else {
        itemName = `item_0${i}`
      }
      await this.loadAnimationItem(itemName);
    }
    await this.loadAnimationBorder();
  }

  async resetInEditor(): Promise<void> {
    await this.loadTextures();
    for (let i = 0; i < 12; i++) {
      let itemName = '';
      if (i >= 10) {
        itemName = `item_${i}`;
      } else {
        itemName = `item_0${i}`
      }
      await this.loadAnimationItem(itemName);
    }
    await this.loadAnimationBorder();
    this.setRandom();
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

  async loadAnimationItem(itemName: string): Promise<boolean> {
    const self = this;
    return new Promise<boolean>(resolve => {
      cc.loader.loadRes(itemName, cc.Prefab, function afterLoad(err, loadedItem) {
        if (self.animationItems) {
          self.animationItems.push(cc.instantiate(loadedItem));
        }
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

  setTile(index: number, mIndex: number): void {
    this.title = index;
    this.tileIndex = mIndex;
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[index];
  }

  setRandom(): void {
    const randomIndex = Math.floor(Math.random() * this.textures.length);
    this.setTile(randomIndex, -1);
  }

  showDrumAnimation() {
    this.node.getComponent(cc.Sprite).spriteFrame = null;
    if (!this.addAniItems.includes(parseInt(this.title))) {
      this.addAniItems.push(11);
      this.node.addChild(this.animationItems[11]);
      this.animationItems[11].setPosition(0, 0);
      if (this.addAniItems.length == 1) {
        this.node.addChild(this.animationBorder);
        this.animationBorder.setPosition(0, 0);
      }
      this.node.addChild(this.winLabel);
      this.winLabel.setPosition(-370, 0);
    }
    this.animationItems[11].active = true;
    const skeleton = this.animationItems[11].getComponent(sp.Skeleton);
    skeleton.setAnimation(0, "item_nml_11", false);
    skeleton.getComponent(cc.AudioSource).play();
  }

  showGFX(option: boolean, index?: number, win?: number, isTotalWin?: boolean){
    if(option){
      this.node.getComponent(cc.Sprite).spriteFrame = null;
      if (!this.addAniItems.includes(index)) {
        this.addAniItems.push(index);
        this.node.addChild(this.animationItems[index]);
        this.animationItems[index].setPosition(0, 0);
        if (this.addAniItems.length == 1) {
          this.node.addChild(this.animationBorder);
          this.animationBorder.setPosition(0, 0);
        }
        this.node.addChild(this.winLabel);
        this.winLabel.setPosition(-370, 0);
      }
      this.animationItems[index].active = option;
      this.animationBorder.active = option;
      if (win > 0) {
        this.winLabel.active = option;
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
    else{
      this.node.getComponent(cc.Sprite).spriteFrame = this.textures[parseInt(this.title)];
      for (let i = 0 ; i < 12; i ++) {
        //this.animationItems[i].parent = null;
        this.animationItems[i].active = option;
      }
      if (this.animationBorder) {
        this.animationBorder.active = option;
        this.winLabel.active = option;
      }
    }
  }

  removeAnimation(): void{
    this.addAniItems = [];
    this.node.removeAllChildren();
  }

  activeGFX(index: number): void{
    this.animationItems[index].active = true;
    this.animationBorder.active = true;
  }
}
