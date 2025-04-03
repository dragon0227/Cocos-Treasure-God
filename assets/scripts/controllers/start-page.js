// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var Sound=require('audio-sound');

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
        leftMan:{
            default:null,
            type:cc.Node
        },
        loadingBar:{
            default:null,
            type:cc.Node
        },
        animation:{
            default:null,
            type:cc.Animation
        },
        disconnectDlg: {
            default:  null,
            type: cc.Node
        },
        dlgOkButton: {
            default: null,
            type: cc.Button
        }
    },

    onLoad() {
        if (window.param && window.param == "DISCONNECT") {
            this.disconnectDlg.active = true;
        }

        this.initAudio();
        //cc.audioEngine.stopAll();
        //cc.audioEngine.resumeAll();

        this.PlayMusic("bg");
        this.leftMan.on(cc.Node.EventType.TOUCH_END, this.onClickLeftMan.bind(this));

        this.dlgOkButton.node.on('click', this.onButtonClick, this);
    },

    onButtonClick() {
        this.disconnectDlg.active = false;
    },

    initAudio() {
        // Check if AudioContext is supported
        if (!window.AudioContext) {
            console.error("AudioContext not supported.");
            return;
        }

        // Create or resume the audio context
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioContext initialized.");
        } else if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log("AudioContext resumed.");
            }).catch(error => {
                console.error("Error resuming AudioContext:", error);
            });
        }
    },

    onClickLeftMan() {
        //this.PlaySFX("spin");
        //cc.audioEngine.stopAll();
        this.musicSource.stop();
        this.animation.play("left-man-click");
        this.loadingBar.active = true;

        setTimeout(() => {
            cc.director.loadScene('MainPage');      
            this.loadingBar.active = false;
        }, 1000);
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
    },
});
