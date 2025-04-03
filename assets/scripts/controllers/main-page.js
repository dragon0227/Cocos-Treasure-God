// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var OnOffButton=require('on-off-button');
var Sound=require('audio-sound');
var SpinButton=require('spin-button');
var CustomButton=require('custom-button');
var UserDefault=require('user-default');
var PayTableTags=require('paytable-tags');

cc.Class({
    extends: cc.Component,

    properties: {
        musicSound:[Sound],
        sfxSound:[Sound],
        musicSource:{
            default:null,
            type:cc.AudioSource
        },
        sfxSource:{
            default:null,
            type:cc.AudioSource
        },
        betArray: {
            default: [],
            type: Array,
            visible:false,
        },
        currBetIndex: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        betDecreaseButton:{
            default:null,
            type:CustomButton
        },
        betIncreaseButton:{
            default:null,
            type:CustomButton
        },
        spinButton:{
            default:null,
            type:SpinButton
        },
        speedButton:{
            default:null,
            type:OnOffButton
        },
        autoComboButton:{
            default:null,
            type:CustomButton
        },
        autoComboButton1:{
            default:null,
            type:CustomButton
        },
        autoComboButton2:{
            default:null,
            type:CustomButton
        },
        autoComboButton3:{
            default:null,
            type:CustomButton
        },
        autoComboButton4:{
            default:null,
            type:CustomButton
        },
        betResultLabel:{
            default:null,
            type:cc.Label
        },
        betInfoLabel:{
            default:null,
            type:cc.Label
        },
        balanceLabel: {
            default:null,
            type:cc.Label
        },
        backButton:{
            default:null,
            type:CustomButton
        },
        helpButton:{
            default:null,
            type:CustomButton
        },
        soundButton: {
            default:null,
            type:OnOffButton
        },
        dlgBackButton:{
            default:null,
            type:CustomButton
        },
        betResultValue: {
            default:0,
            type:cc.Float,
            visible: false
        },
        balance: {
            default: 10000,
            type: cc.Float,
            visible: false
        },
        isRollingCompleted:{
            default:true,
            visible:false
        },
        totalBetValue:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        currentBetValue:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        currentPayTableTag:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        isAutoSpin:{
            default:false,
            visible:false
        },
        isFreeSpin: {
            default: false,
            visible: false
        },
        helpDlg: {
            default:null,
            type: cc.Node
        },
        autoSpinTimer:{
            default:null,
            visible:false
        },
        comboBtn: {
            default:null,
            type: cc.Animation
        },
        transitionAnimation: {
            default:null,
            type: cc.Animation
        },
        transitionNode: {
            default:null,
            type: cc.Node
        },
        machine: {
            default:null,
            type: cc.Node
        },
        result:{
            default:null,
            visible:false
        },
        autoLimit: {
            default: 0,
            visible: false
        },
        limitLabel: {
            default:null,
            type: cc.Node
        },
        noLimitLabel: {
            default:null,
            type: cc.Node
        },
        speed: {
            default: 1,
            type:cc.Float,
            visible: false
        },
        rightMan: {
            default: null,
            type: sp.Skeleton,
            visible: true
        },
        bigWinView: {
            default: null,
            type: cc.Node
        },
        bigWinLabel: {
            default: null,
            type: cc.Label
        },
        freeWinView: {
            default: null,
            type: cc.Node
        },
        freeLimitView: {
            default: null,
            type: cc.Node
        },
        freeLimitLabel: {
            default: null,
            type: cc.Label
        },
        freeCountLabel: {
            default: null,
            type: cc.Label
        },
        freeLimit: {
            default: 3,
            type: cc.Integer,
            visible: false
        },
        freeSun: {
            default: null,
            type: cc.Node
        },
        slotView: {
            default: null,
            type: cc.Node
        },
        mainBackground: {
            default: null,
            type: cc.Sprite
        },
        slotBackground: {
            default: null,
            type: cc.Sprite
        },
        helpButtonSprite: {
            default: null,
            type: cc.Sprite
        },
        soundButtonSprite: {
            default: null,
            type: cc.Sprite
        },
        slotBorder: {
            default: null,
            type: cc.Sprite
        },
        freeMainBackgroundTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        freeSlotBackgroundTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        freeSlotBorderTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        normalHelpTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        normalSoundOnTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        normalSoundOffTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        freeHelpTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        freeSoundOnTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        freeSoundOffTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        mainBackgroundTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        slotBackgroundTexture: {
            default: null,
            type: cc.SpriteFrame
        },
        slotBorderTexture: {
            default: null,
            type: cc.SpriteFrame
        }
    },
    statics: {
        shared: null,
        data: {}, // This will hold your shared data
    },
    start() {
        this.machine.getComponent('Machine').createMachine();
        this.isFreeSpin = false;
    },
    onLoad () {
        var that = this;

        this.PlayMusic("bg");

        if (this.transitionNode) {
            //this.transitionNode.opacity = 0; // Start fully transparent
            this.transitionNode.active = true;
            this.transitionToScene();
        }

        // Register the click event listener
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);

        this.betArray = [
            0.5,
            1.0,
            2.0,
            3.0,
            4.0,
            5.0,
            6.0,
            7.0,
            8.0,
            9.0,
            10.0,
            20.0,
            30.0,
            40.0,
            50.0,
            60.0,
            70.0,
            80.0,
            90.0,
            100.0,
            500.0,
            1000.0,
            1500.0,
            2000.0,
            3000.0
        ];
        this.currBetIndex = 0;

        //sets the available credit.
        this.betResultLabel.string=this.betResultValue;
        this.balanceLabel.string = this.balance;
        //init bet info label
        this.betInfoLabel.string=this.betArray[0];

        this.spinButton.node.on('reel-spin', function (event) {
        
            if (event.isOn){
                //play the game
                that.spin();
                that.PlaySFX("spin");
            }
        });
        //implements the auto-spin button on/off event
        this.speedButton.node.on('on-off-mousedown', function (event) {
            //play the game as single spin or auto-spin
            that.PlaySFX("spin");
            if (that.speed == 1) {
                that.speed = 0.5;
            } else {
                that.speed = 1;
            }
        });

        this.betIncreaseButton.node.on('increase', function (event) {
            that.PlaySFX("spin");
            if (event.isOn){
                //set bet value
                if (that.currBetIndex < 24) {
                    that.currBetIndex++;
                } else {
                    that.currBetIndex = 0;
                }
                that.currentBetValue=that.betArray[that.currBetIndex];
                that.betInfoLabel.string=that.currentBetValue.toString();
            }
        });

        this.betDecreaseButton.node.on('decrease', function (event) {
            that.PlaySFX("spin");
            if (event.isOn){
                //set bet value
                if (that.currBetIndex > 0) {
                    that.currBetIndex--;
                } else {
                    that.currBetIndex = 24;
                }
                that.currentBetValue=that.betArray[that.currBetIndex];
                that.betInfoLabel.string=that.currentBetValue.toString();
            }
        });

        //implements the rolling completed event of the rell.js class
        this.node.on('rolling-completed', function (event) {
            if (that.result && that.result.w > 0){
                that.startNormalWinAnimation();
                that.PlaySFX("win");
                that.PlaySFX("csd_laughing");
                //that.startBigWinAnimation();
            } else {
                that.startBetFailedAnimation();
            }
            if (that.isFreeSpin) {
                if (that.freeLimit == 0) {
                    that.stopFreeAnimation();
                } else if (that.freeLimit == 3) {
                    
                    that.startFreeWinAnimation().then(res => {
                        //LOST update credit
                        that.updateBalance(that.balance-that.currentBetValue);
                        that.freeSpin();
                    });
                } else {
                    that.updateBalance(that.balance-that.currentBetValue);
                    that.freeSpin();
                }
            } else {
                //LOST update credit
                that.updateBalance(that.balance-that.currentBetValue);
                            
                if (!that.isAutoSpin){
                    //spin completed
                    that.isRollingCompleted=true;
                    that.spinButton.reset();
                }else{
                    that.autoSpinTimer=setTimeout(function(){
                        //auto-spin completed...will restart
                        if (that.autoLimit > 0) {
                            that.autoLimit--;
                            const labelComponent = that.limitLabel.getComponent(cc.Label);
                            labelComponent.string = that.autoLimit;
                            that.spin();
                        } else {
                            that.autoLimit = 0;
                            that.isAutoSpin=false; 
                            that.autoComboButton.onVirtualLocked(false);
                        }
                    }, 1000 * that.speed);  
                }
                if (that.isRollingCompleted){
                    //unlocks all buttons
                    that.setButtonsLocked(false);
                    //update user default current credit
                    //UserDefault.instance.setCurrentCredit(that.currentCredit);
                }
            }
        });

        this.dlgBackButton.node.on('dlg-close', function (event) {
            that.helpDlg.active = false;
            that.PlaySFX("spin");
        });

        this.autoComboButton.node.on('on-off-mousedown', function (event) {
            that.PlaySFX("spin");
            if (that.comboBtn.node.y == 0) {
                if (that.limitLabel.active) {
                    that.limitLabel.active = false;
                    that.noLimitLabel.active = true;
                    if (that.isAutoSpin) {
                        that.autoLimit = 0;
                        that.isAutoSpin=false; 
                        that.autoComboButton.onVirtualLocked(false);
                        clearTimeout(that.autoSpinTimer);
                        that.PlaySFX("spin");
                    }
                } else {
                    if (that.isAutoSpin) {
                        that.autoLimit = 0;
                        that.isAutoSpin=false; 
                        that.autoComboButton.onVirtualLocked(false);
                        clearTimeout(that.autoSpinTimer);
                        that.PlaySFX("spin");
                    } else {
                        that.comboBtn.play('combo-animation-up');
                    }
                }
            } else {
                that.comboBtn.play('combo-animation-down');
            }
        });

        this.autoComboButton1.node.on('on-off-mousedown', function (event) {
            that.PlaySFX("spin");
            that.autoLimit = 20;
            const labelComponent = that.limitLabel.getComponent(cc.Label);
            labelComponent.string = that.autoLimit;
            that.isAutoSpin=true; 
            that.autoComboButton.onVirtualLocked(true);
            that.limitLabel.active = true;
            that.noLimitLabel.active = false;
            if (event.isOn){
                that.spin();
                that.PlaySFX("spin");
            }
        });
        this.autoComboButton2.node.on('on-off-mousedown', function (event) {
            that.PlaySFX("spin");
            that.autoLimit = 50;
            const labelComponent = that.limitLabel.getComponent(cc.Label);
            labelComponent.string = that.autoLimit;
            that.isAutoSpin=true; 
            that.autoComboButton.onVirtualLocked(true);
            that.limitLabel.active = true;
            that.noLimitLabel.active = false;
            if (event.isOn){
                that.spin();
                that.PlaySFX("spin");
            }
        });
        this.autoComboButton3.node.on('on-off-mousedown', function (event) {
            that.PlaySFX("spin");
            that.autoLimit = 100;
            const labelComponent = that.limitLabel.getComponent(cc.Label);
            labelComponent.string = that.autoLimit;
            that.isAutoSpin=true; 
            that.autoComboButton.onVirtualLocked(true);
            that.limitLabel.active = true;
            that.noLimitLabel.active = false;
            if (event.isOn){
                that.spin();
                that.PlaySFX("spin");
            }
        });
        this.autoComboButton4.node.on('on-off-mousedown', function (event) {
            that.PlaySFX("spin");
            that.autoLimit = 10000;
            that.isAutoSpin=true; 
            that.autoComboButton.onVirtualLocked(true);
            that.limitLabel.active = false;
            that.noLimitLabel.active = true;
            if (event.isOn){
                that.spin();
                that.PlaySFX("spin");
            }
        });

        this.backButton.node.on('on-off-mousedown', function (event) {
            window.param = "DISCONNECT";
            cc.director.loadScene('StartPage');
        });

        this.helpButton.node.on('on-help', function (event) {
            that.PlaySFX("spin");
            that.helpDlg.active = true;
        });
        this.soundButton.node.on('on-off-mousedown', function (event) {
            if (event.isOn){
                that.musicSource.stop();
                
            } else {
                that.PlayMusic("bg");
                that.PlaySFX("spin");
            }
        });
    },
    // Define the callback function for the click event
    onClick(event) {
        if (this.comboBtn.node.y > 0) {
            this.comboBtn.play('combo-animation-down');
        }
    },
    setButtonsLocked:function(isLocked){
        this.spinButton.onLocked(isLocked);
        this.betDecreaseButton.onLocked(isLocked);
        this.betIncreaseButton.onLocked(isLocked);
    },
    freeSpin: function() {
        const that = this;
        this.autoSpinTimer=setTimeout(function(){
            //auto-spin completed...will restart
            if (that.freeLimit > 0) {
                that.freeLimit--;
                that.freeLimitLabel.string = that.freeLimit;
                that.spin();
            }
        }, 1000 * this.speed);
    },
    spin:function(){
        if (this.balance===0){
            return;
        }
        
        if (this.isRollingCompleted){
            if (!this.isAutoSpin && !this.isFreeSpin){
                this.isRollingCompleted=false;
            }
            this.setButtonsLocked(true);
            //this.PlaySFX("reelRoll")
            this.machine.getComponent('Machine').spin(this.speed);
            this.requestResult();
        }
    },
    updateBalance:function(value){
        this.balance=value;
        this.betResultLabel.string= Math.round(this.result.w.toString(), 2);
        this.balanceLabel.string = Math.round(this.balance.toString(), 2);
        if (parseInt(this.balance)<=0){
            this.PlaySFX('gameOver');
           // AudioManager.instance.playGameOver();
            //TODO reset credit automatically
            this.updateBalance(100);
        }
    },

    transitionToScene: function(sceneName) {
        if (this.transitionNode) {
            this.transitionAnimation.play("main-page-load");
            // Fade to opaque over 5 seconds with easing
            let fadeAction = cc.fadeTo(2, 0).easing(cc.easeCubicActionIn());
            this.transitionNode.runAction(fadeAction);
        }
    },

    requestResult: function() {
        this.result = null;
    
        const url = "http://localhost:12002/e/e/spin";
        const params = new URLSearchParams();
        params.append('api_name', 'spin');
        params.append('token', 'e36f0b7216dbf047a8f61329');
        params.append('game_code', 'doghouse');
        params.append('c', 'pZqXk5tM');
        // this.sendPostRequest(url, params).then(res => {
        //     this.result = res;
        //     this.machine.getComponent('Machine').stop(this.result);
        // });
        setTimeout(() => {
            const tmpRes = '{"na":"s","balance":1000128.08,"sh":5,"sver":3,"fs":0,"fi":0,"wm":1,"s":"10,3,9,7,1,9,9,2,7,9,7,9,4,8,9","ws":"","w":100,"tw":0,"l":20,"wl":[{"SymbolIndex":9,"WinValue":0.6000000000000001,"Count":3,"PayLine":{"Name":"Line12","PositionList":[2,2,2,2,2]}},{"SymbolIndex":9,"WinValue":0.6000000000000001,"Count":3,"PayLine":{"Name":"Line13","PositionList":[0,0,0,0,0]}},{"SymbolIndex":3,"WinValue":6.000000000000001,"Count":3,"PayLine":{"Name":"Line1","PositionList":[1,1,1,1,1]}}],"bebet":0.2,"gv":1,"sv":0,"svs":[]}';
            const res = JSON.parse(tmpRes);
            this.result = res;
            this.machine.getComponent('Machine').stop(this.result);
        }, 1000 * this.speed);
    },

    sendPostRequest: function(url, params) {
        return new Promise(resolve => {
          setTimeout(() => {
            // Function implementation as shown above
            fetch(url, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              },
              body: params.toString()
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Server Response:", data);
                const parseData = JSON.parse(data.returnData);
                resolve(parseData.returnData);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                resolve(null);
            });
          }, 1000 * this.speed);
        });
    },

    startNormalWinAnimation: function() {
        this.rightMan.setAnimation(0, "caishen_02", false);

        setTimeout(() => {
            this.rightMan.setAnimation(0, "caishen_01", true);
        }, 1000 * this.speed);
    },

    startBetFailedAnimation: function() {
        this.rightMan.setAnimation(0, "caishen_05", false);

        setTimeout(() => {
            this.rightMan.setAnimation(0, "caishen_01", true);
        }, 1000 * this.speed);
    },
    startBigWinAnimation: function() {
        return new Promise(resolve => {
            this.bigWinView.active = true;
            this.rightMan.setAnimation(0, "caishen_02", true);
            let startValue = 0.01;
            const endValue = 10.99;
            const duration = 3000; // Duration in milliseconds (3 seconds)
            const stepTime = 30; // Interval in milliseconds
            const steps = duration / stepTime;
            const increment = (endValue - startValue) / steps;
            let currentValue = startValue;
            const interval = setInterval(() => {
                currentValue += increment;
                if (currentValue >= endValue) {
                    currentValue = endValue;
                    clearInterval(interval);
                    setTimeout(() => {
                        this.bigWinView.active = false;
                        this.rightMan.setAnimation(0, "caishen_01", true);
                        resolve();
                    }, 1500);
                }
                this.bigWinLabel.string = currentValue.toFixed(2);
            }, stepTime);
        })
    },
    stopFreeAnimation: function() {
        setTimeout(() => {
            this.machine.getComponent('Machine').stopWinAnimation();
        }, 1000);
        this.PlaySFX("mf_final");
        this.startBigWinAnimation().then(res => {
            this.musicSource.stop();
            this.PlayMusic("bg");
            this.updateSpriteFrame(this.mainBackground, this.mainBackgroundTexture._texture);
            this.updateSpriteFrame(this.slotBackground, this.slotBackgroundTexture._texture);
            this.updateSpriteFrame(this.slotBorder, this.slotBorderTexture._texture);
            this.helpButton.reset();
            if (this.soundButton.isOn) {
                this.updateSpriteFrame(this.soundButtonSprite, this.normalSoundOffTexture._texture);
            } else {
                this.soundButton.reset();
            }
            this.freeLimitView.active = false;
            this.rightMan.setAnimation(0, "caishen_01", true);
            this.setButtonsLocked(false);
            this.enableMouseEvents();
        });
    },
    startFreeWinAnimation: function() {
        return new Promise(resolve1 => {
            this.freeWinView.active = true;
            this.rightMan.setAnimation(0, "caishen_03", true);
            this.PlaySFX("fs_confirm");
    
            this.disableMouseEvents();
    
            setTimeout(() => {
                this.freeWinView.active = false;
                this.slotView.active = false;
                this.rightMan.setAnimation(0, "caishen_04", false);
                this.PlaySFX("mf_man");
                new Promise(resolve => {
                    setTimeout(() => {
                        this.freeSun.active = true;
                        setTimeout(() => {
                            resolve();
                        }, 1000);
                    }, 2000);
                }).then(() => {
                    this.musicSource.stop();
                    this.PlayMusic("csd-free-bgm");
                    this.freeSun.active = false;
                    this.slotView.active = true;
                    this.updateSpriteFrame(this.mainBackground, this.freeMainBackgroundTexture._texture);
                    this.updateSpriteFrame(this.slotBackground, this.freeSlotBackgroundTexture._texture);
                    this.updateSpriteFrame(this.slotBorder, this.freeSlotBorderTexture._texture);
                    this.updateSpriteFrame(this.helpButtonSprite, this.freeHelpTexture._texture);
                    if (this.soundButton.isOn) {
                        this.updateSpriteFrame(this.soundButtonSprite, this.freeSoundOffTexture._texture);
                    } else {
                        this.updateSpriteFrame(this.soundButtonSprite, this.freeSoundOnTexture._texture);
                    }
                    this.freeLimitView.active = true;
                    this.freeLimitLabel.string = this.freeLimit.toString();
                    this.rightMan.setAnimation(0, "caishen_01", true);

                    resolve1();
                });
            }, 5000)
        })
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

    disableMouseEvents() {
        const canvas = cc.find("Canvas");
        if (!canvas.getComponent(cc.BlockInputEvents)) {
            canvas.addComponent(cc.BlockInputEvents);
            canvas.pauseSystemEvents(true);
        }
    },


    enableMouseEvents() {
        const canvas = cc.find("Canvas");
        const blockInput = canvas.getComponent(cc.BlockInputEvents);
        if (blockInput) {
            canvas.resumeSystemEvents(true);
            canvas.removeComponent(cc.BlockInputEvents);
        }
    },

    
    PlayMusic:function(name){
        let s = this.musicSound.find(s => s.n === name)
        if(s == null){
            console.log("not found")
        }else{
            this.musicSource.clip = s.clip
            this.musicSource.play();
        }
    },

    PlaySFX:function(name){
        let s = this.sfxSound.find(s => s.n === name)
        if(s == null){
            console.log("not found")
        }else{
            this.sfxSource.clip = s.clip
            this.sfxSource.play();
        }
    }
});
