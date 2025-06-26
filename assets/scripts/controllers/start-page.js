// Learn cc.Class:

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
        },
        balanceLabel: {
            default:null,
            type:cc.Label
        },
        progressBar: cc.ProgressBar
    },

    onLoad() {
        if (window.param && window.param == "DISCONNECT") {
            this.disconnectDlg.active = true;
        }

        this.initAudio();
        //cc.audioEngine.stopAll();
        //cc.audioEngine.resumeAll();
        this.sendGetRequest();

        this.PlayMusic("bg");
        this.leftMan.on(cc.Node.EventType.TOUCH_END, this.onClickLeftMan.bind(this));

        this.dlgOkButton.node.on('click', this.onButtonClick, this);
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
            //console.log("AudioContext initialized.");
            this.audioContext.resume().then(() => {
                //console.log("AudioContext resumed.");
            }).catch(error => {
                //console.error("Error resuming AudioContext:", error);
            });
        } else if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                //console.log("AudioContext resumed.");
            }).catch(error => {
                //console.error("Error resuming AudioContext:", error);
            });
        }
    },

    onClickLeftMan() {
        this.musicSource.stop();
        this.animation.play("left-man-click");
        this.loadingBar.active = true;
        this.PlayLoadingAnimation();
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

    // You can also clean up event listeners if necessary
    onDestroy() {
        this.node.off('mousedown', this.resumeAudioContext, this);
    },

    PlayLoadingAnimation() {
        let loadingProgressBar = this.node.getChildByName("Loading").getChildByName("LoadingProgressBar");
        let barHeader = loadingProgressBar.getChildByName("BarHeader");
        barHeader.position = new cc.Vec2(0, 0);
        barHeader.active = true;
        loadingProgressBar.getChildByName("bar").getComponent(cc.Sprite).fillRange = 0;
        this.startPreload();
    },

    startPreload() {
        const that = this;
        let loadingView = this.node.getChildByName("Loading");
        loadingView.active = false;
        cc.director.preloadScene("MainPage",
            function (completedCount, totalCount, item) {
                var progress_val = (completedCount / totalCount);
                let loadingProgressBar = that.node.getChildByName("Loading").getChildByName("LoadingProgressBar");
                loadingProgressBar.getChildByName("bar").getComponent(cc.Sprite).fillRange = progress_val;
                
            },
            function (err, assets) {
                if (err == null) {
                    that.loadingBar.active = false;
                    cc.director.loadScene('MainPage');      
                }
            }
        );
    },

    update(dt) {
        let loadingProgressBar = this.node.getChildByName("Loading").getChildByName("LoadingProgressBar");
        let barHeader = loadingProgressBar.getChildByName("BarHeader");
        var percent = loadingProgressBar.getChildByName("bar").getComponent(cc.Sprite).fillRange;
        if (barHeader.active == true) {
            barHeader.x = 1000 * percent;
        }
    },
});
