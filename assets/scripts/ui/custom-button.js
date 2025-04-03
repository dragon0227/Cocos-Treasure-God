//defines a class to implement an On/Off button
cc.Class({
    extends: cc.Component,

    properties: {
        //PUBLIC PROPERTIES
        ///gets/sets the event name that will be raised wneh the button is touched
        mouseDownName:{
            default:"on-off-mousedown"
        },
        //gets/sets the sprite button
        sprite:{
            default:null,
            type:cc.Sprite
        },
        //gets/sets the texture url for the on status
        spriteTextureNormal:{
            default: null,
            type: cc.SpriteFrame
        },
        spriteTexturePressed:{
            default: null,
            type: cc.SpriteFrame
        },
        spriteTextureLocked:{
            default: null,
            type: cc.SpriteFrame
        },
        //gets/sets the on status
        isOn:{
            default:false
        },
        isLocked:{
            default:false,
            visible:false
        }
    },

    onLoad: function () {
        var that=this;
        //sets the texture for on/off
        // this.spriteTextureUp=this.sprite._spriteFrame._texture;
        // this.spriteTextureDown = this.spriteTextureDown._texture; //cc.textureCache.addImage(this.spriteTextureDownUrl);
        this.spriteTextureNormal = this.spriteTextureNormal._texture;
        this.spriteTexturePressed = this.spriteTexturePressed._texture;
        this.spriteTextureLocked = this.spriteTextureLocked._texture;
        
        //defines and sets the touch function callbacks
        function onTouchDown(event) {
            if (that.isLocked){
                return;
            }
            that.updateSpriteFrame(that.sprite, that.spriteTexturePressed);
        }
        function onTouchUp(event) {
            that.onClicked();
        }
        function onTouchCancel(event) {
            if (that.isLocked){
                return;
            }
            that.updateSpriteFrame(that.sprite, that.spriteTextureNormal);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchCancel, this.node);
    },
    onClicked:function(){
        if (this.isLocked){
            return;
        }
        
        this.updateSpriteFrame(this.sprite, this.spriteTextureNormal);

        //emits the event
        this.node.emit(this.mouseDownName, {
          isOn: true
        });
    },

    onLocked: function(isLocked) {
        this.isLocked = isLocked;
        if (isLocked) {
            this.updateSpriteFrame(this.sprite, this.spriteTextureLocked);;
        } else {
            this.updateSpriteFrame(this.sprite, this.spriteTextureNormal);;
        }
    },

    onVirtualLocked: function(isLocked) {
        if (isLocked) {
            this.updateSpriteFrame(this.sprite, this.spriteTextureLocked);;
        } else {
            this.updateSpriteFrame(this.sprite, this.spriteTextureNormal);;
        }
    },

    reset:function(){
        //resets the button with the off status
        this.isOn=false;
        this.isLocked=false;
        this.updateSpriteFrame(this.sprite, this.spriteTextureNormal);
    },
    updateSpriteFrame:function(sprite,texture){
        //updates the texture for the on/off status

        //updates the sprite texture
        if (!sprite || !texture){
            return;
        }
        var w=sprite.node.width,
            h=sprite.node.height,
            frame = new cc.SpriteFrame(texture,cc.rect(0,0,texture.width,texture.height));

        frame.width = w;
        frame.height = h;
        sprite.spriteFrame = frame;
    },

});
