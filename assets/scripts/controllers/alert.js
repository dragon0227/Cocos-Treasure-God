// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: 100, // Speed at which the node moves to the left
        alertView: {
            default:null,
            type: cc.Animation
        },
        soundView: {
            default:null,
            type: cc.Node
        },
        bgView: {
            default:null,
            type: cc.Node
        },
        borderParticleView: {
            default:null,
            type: cc.Node
        },
        bottomParticleView: {
            default:null,
            type: cc.Node
        },
        topParticleView: {
            default:null,
            type: cc.Node
        },
    },

    onLoad() {
        this.nodeWidth = this.node.width * this.node.scaleX; // Account for scaling
        this.screenLeft = 0; // Left boundary of the screen
        this.showAlert();
    },

    update(dt) {
        // Move the node to the left
        this.node.x -= this.moveSpeed * dt;

        // Calculate the node's right boundary
        let nodeRightBoundary = this.node.x + (this.nodeWidth * (1 - this.node.anchorX));

        // Check if the node is completely off-screen to the left
        if (nodeRightBoundary < this.screenLeft) {
            this.onNodeOffScreen();
        }
    },

    onNodeOffScreen() {
        // Trigger your event or callback here
        cc.log('Alert notice has moved off-screen to the left.');
        // Optionally, you can disable the update function to stop further checks
        this.enabled = false;
        this.borderParticleView.active = false;
        this.alertView.play('alert-remove');
    },

    showAlert() {
        const interval = setInterval(() => {
            if (!this.node) {
                clearInterval(interval);
                return;
            }
            this.node.x = 0;
            this.enabled = true;
            this.soundView.opacity = 255;
            this.bgView.x = 0;
            this.bgView.opacity = 180;
            this.borderParticleView.active = true;
            this.bottomParticleView.active = true;
            this.topParticleView.active = true;
        }, 40 * 1000);
    }
});
