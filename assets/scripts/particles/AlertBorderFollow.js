// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bottomParticle: cc.Node,
        topParticle: cc.Node,
        radius: 100,           // Radius of the circular path
        speed: 50,    // Speed of the rotation
    },

    onLoad() {
        this.bottomX = -400;
        this.topX = 435.138;
    },

    start() {
        this.bottomX = -400;
        this.topX = 435.138;
    },

    update(dt) {
        if (this.bottomX < 480) {
            this.bottomX += 5;
            this.bottomParticle.position = cc.v2(this.bottomX, -25); // Set new position
        } else {
            this.bottomParticle.active  = false;
            this.topParticle.active  = false;
            this.bottomX = -400;
            this.topX = 435.138;
        }
        if (this.topX > -400) {
            this.topX -= 5;
            this.topParticle.position = cc.v2(this.topX, 25); // Set new position
        } else {
            this.bottomParticle.active  = false;
            this.topParticle.active  = false;
            this.bottomX = -400;
            this.topX = 435.138;
        }
    },
});
