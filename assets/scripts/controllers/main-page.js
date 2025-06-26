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
        that.CurrPage = 1;

        this.PlayMusic("bg");

        document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));

        this.sendGetRequest();
        //this.connectWebSocket();

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
        //init bet info label
        this.betInfoLabel.string=this.betArray[0];

        this.spinButton.node.on('reel-spin', function (event) {
        
            if (event.isOn){
                //play the game
                that.schedule(() => {
                    that.spin();
                    that.PlaySFX("spin");
                }, 0.1, 0, 0);
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
            that.updateBalance();
            if (that.result && that.result.totalWin > 0){
                that.startNormalWinAnimation();
                that.PlaySFX("win");
                that.PlaySFX("csd_laughing");
                //that.startBigWinAnimation();
            } else {
                that.startBetFailedAnimation();
            }
            
            if (that.isFreeSpin) {
                console.log(">>>>>>>>>>>>>>> freeLimit:" + that.freeLimit + " totalSpin" + that.result.totalSpin);
                if (that.freeLimit == 0) {
                    that.stopFreeAnimation();
                } else if (that.freeLimit == that.result.totalSpin) {
                    that.unschedule(that.autoSpin);
                    that.startFreeWinAnimation().then(res => {
                        that.schedule(that.freeSpin, 1, 0, 0);
                    });
                } else {
                    that.schedule(that.freeSpin, 1, 0, 0);
                }
            } else if (that.isAutoSpin) {
                that.schedule(that.autoSpin, 1, 0, 0);
            } else {
                that.schedule(that.resetSpinButton, 0.3, 0, 0);
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
            that.CurrPage = 0;
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
    resetSpinButton: function() {
        this.spinButton.reset();
        this.setButtonsLocked(false);
        this.unschedule(this.resetSpinButton);
    },
    setButtonsLocked:function(isLocked){
        this.spinButton.onLocked(isLocked);
        this.betDecreaseButton.onLocked(isLocked);
        this.betIncreaseButton.onLocked(isLocked);
    },
    autoSpin: function() {
        const that = this;
        if (!document.hidden) {
            if (that.autoLimit > 0) {
                that.autoLimit--;
                const labelComponent = that.limitLabel.getComponent(cc.Label);
                labelComponent.string = that.autoLimit;
                that.spin();
            } else {
                that.autoLimit = 0;
                that.isAutoSpin=false; 
                that.autoComboButton.onVirtualLocked(false);
                that.limitLabel.active = false;
                that.noLimitLabel.active = true;
                that.setButtonsLocked(false);
                that.unschedule(that.autoSpin);
            }
        }
        
    },
    freeSpin: function() {
        const that = this;
        if (!document.hidden) {
            if (that.freeLimit > 0) {
                that.freeLimitLabel.string = that.freeLimit;
                that.spin();
            } else {
                that.unschedule(that.freeSpin);
            }
        }
    },
    spin:function(){
        if (this.balance===0){
            return;
        }
        this.setButtonsLocked(true);
        //this.PlaySFX("reelRoll")
        this.machine.getComponent('Machine').spin(this.speed);
        this.sendMessage();
    },
    updateBalance:function(){
        if (this.result) {
            this.betResultLabel.string= this.result.totalWin.toFixed(2).toString();
            this.balanceLabel.string = this.result.balance.toFixed(2).toString();
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

    sendGetRequest() {
        const urlParams = new URLSearchParams(window.location.search);
        const mgckey = urlParams.get('mgckey');
        const url = `https://${window.location.host}/getBalance?token=${mgckey}`;
        //const url = `https://localhost:7142/getBalance?token=AUTHTOKEN@d6e905c89a714d2d9f5b713aa9697241~stylename@chainfunz_chainfunz~SESSION@98c8567f-e2e4-4ec3-9c99-72c520f1ecd0`;

        cc.loader.load({ url: url, type: 'json' }, (err, response) => {
            if (err) {
                console.error('Error:', err);
            } else {
                const res = response;
                console.log("==========");
                console.log(res.balance);
                this.balanceLabel.string = res.balance.toFixed(2).toString();
            }
        });
    },

    startNormalWinAnimation: function() {
        this.rightMan.setAnimation(0, "caishen_02", false);
        const that = this;
        this.schedule(() => {
            that.rightMan.setAnimation(0, "caishen_01", true);
        }, that.speed, 0, 0);
    },

    startBetFailedAnimation: function() {
        this.rightMan.setAnimation(0, "caishen_05", false);
        const that = this;
        this.schedule(() => {
            this.rightMan.setAnimation(0, "caishen_01", true);
        }, that.speed, 0, 0);
    },
    startBigWinAnimation: function() {
        const that = this;
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
            that.schedule(() => {
                currentValue += increment;
                if (currentValue >= endValue) {
                    currentValue = endValue;
                    that.unscheduleAllCallbacks();
                    that.schedule(() => {
                        that.bigWinView.active = false;
                        that.rightMan.setAnimation(0, "caishen_01", true);
                        resolve();
                    }, 1.5, 0, 0); 
                }
                that.bigWinLabel.string = currentValue.toFixed(2);
              }, 0.03, 10000, 0);
        })
    },
    stopFreeAnimation: function() {
        const that = this;
        this.isFreeSpin = false;
        this.PlaySFX("mf_final");
        this.startBigWinAnimation().then(res => {
            that.musicSource.stop();
            that.PlayMusic("bg");
            that.updateSpriteFrame(that.mainBackground, that.mainBackgroundTexture._texture);
            that.updateSpriteFrame(that.slotBackground, that.slotBackgroundTexture._texture);
            that.updateSpriteFrame(that.slotBorder, that.slotBorderTexture._texture);
            that.helpButton.reset();
            if (that.soundButton.isOn) {
                that.updateSpriteFrame(that.soundButtonSprite, that.normalSoundOffTexture._texture);
            } else {
                that.soundButton.reset();
            }
            that.freeLimitView.active = false;
            that.rightMan.setAnimation(0, "caishen_01", true);
            if (this.isAutoSpin) {
                that.enableMouseEvents();
                that.schedule(() => {
                    that.autoSpin();
                  }, 0.8, 0, 0);
            } else {
                that.setButtonsLocked(false);
                that.enableMouseEvents();
            }
        });
    },
    startFreeWinAnimation: function() {
        return new Promise(resolve1 => {
            this.freeWinView.active = true;
            this.rightMan.setAnimation(0, "caishen_03", true);
            this.PlaySFX("fs_confirm");
    
            this.disableMouseEvents();
    
            const that = this;
            this.schedule(() => {
                that.freeWinView.active = false;
                that.slotView.active = false;
                that.rightMan.setAnimation(0, "caishen_04", false);
                that.PlaySFX("mf_man");
                new Promise(resolve => {
                    that.schedule(() => {
                        //that.freeSun.active = true;
                        that.schedule(() => {
                            resolve();
                          }, 1, 0, 0);
                      }, 2, 0, 0);
                }).then(() => {
                    that.musicSource.stop();
                    that.PlayMusic("csd-free-bgm");
                    that.changeFreeView();
                    that.rightMan.setAnimation(0, "caishen_01", true);

                    resolve1();
                });
              }, 5, 0, 0);
        })
    },
    changeFreeView() {
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
            //console.log("not found")
        }else{
            this.musicSource.clip = s.clip
            this.musicSource.play();
        }
    },

    PlaySFX:function(name){
        let s = this.sfxSound.find(s => s.n === name)
        if(s == null){
            //console.log("not found")
        }else{
            this.sfxSource.clip = s.clip
            this.sfxSource.play();
        }
    },

    connectWebSocket() {
        const urlParams = new URLSearchParams(window.location.search);
        const mgckey = urlParams.get('mgckey');
        const url = `wss://${window.location.host}/slot?token=${mgckey}&game=treasureGod`;
        // const mgckey = "AUTHTOKEN@d6e905c89a714d2d9f5b713aa9697241~stylename@chainfunz_chainfunz~SESSION@98c8567f-e2e4-4ec3-9c99-72c520f1ecd0";
        // const url = `wss://localhost:7142/slot?token=${mgckey}&game=treasureGod`;
        // const url = `wss://tg.aaplaysgames.com/slot?token=${mgckey}&game=treasureGod`;
        this.socket = new WebSocket(url);
        const that = this;

        this.socket.onopen = () => {
            cc.log('WebSocket connection opened');
            // Send a message when the connection is open
            setTimeout(() => {
                that.setButtonsLocked(true);
                //that.machine.getComponent('Machine').spin(that.speed);
                that.socket.send(JSON.stringify({ action: 'init' }));
            }, 100);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // const data = {
            //     "nextAction": "spin",
            //     "reel": "3,1,5,7,8,5,0,1,6,2,7,8,3,0,7",
            //     "totalWin": 1,
            //     "win": 1,
            //     "payLines": [
            //         {
            //         "symbol": 3,
            //         "winValue": 0.4,
            //         "positions": [
            //             0,
            //             1,
            //             2,
            //             2
            //         ]
            //         },
            //         {
            //         "symbol": 5,
            //         "winValue": 0.6,
            //         "positions": [
            //             1,
            //             1,
            //             0,
            //             2
            //         ]
            //         }
            //     ],
            //     "balance": 678466.59,
            //     "index": 0
            //     }
            //cc.log('Message from server:', data);
            // Handle incoming messages
            if (data.reel) {
                that.receiveMessage(data);
            }
        };

        this.socket.onclose = () => {
            if (that.CurrPage == 1) {
                cc.log('WebSocket connection closed');
                window.param = "DISCONNECT";
                cc.director.loadScene('StartPage');
            }
        };

        this.socket.onerror = (error) => {
            cc.error('WebSocket error:', error);
        };
    },

    receiveMessage(data) {
        if (data.nextAction == "collect") {
            this.schedule(() => {
                this.socket.send(JSON.stringify({ action: 'collect'}));
            },  0.1, 0, 0); 
        }
        if (data.remainSpin && data.remainSpin >= 0) {
            this.freeLimit = data.remainSpin;
            this.isFreeSpin = true;
            // if (this.freeLimitView.active == false) {
            //     this.changeFreeView();
            // }
        } else {
            this.freeLimit = 0;
        }
        this.result = data;
        const that = this;
        this.schedule(() => {
            that.machine.getComponent('Machine').stop(data);
        },  this.speed == 1 ? 0.5: 0.1, 0, 0); 
    },

    sendMessage() {
        this.result = null;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: 'spin', bet: this.betArray[this.currBetIndex]}));
        } else {
            cc.warn('WebSocket is not open. Cannot send message.');
        }
    },

    onVisibilityChange() {
        if (document.hidden) {
            //this.onHide();
        } else {
            //this.onShow();
        }
    },

    onDestroy() {
        document.removeEventListener('visibilitychange', this.onVisibilityChange.bind(this));
        if (this.socket) {
            this.socket.close();
        }
    }
});
