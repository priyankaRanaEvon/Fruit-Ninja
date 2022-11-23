
export class GameTimer extends Phaser.Scene {

    angle = { min: 0, max: 0 }; group: any; timerShine: any; graphics: any; radialProgressBar: any;
    timerBg: any; tween: any; graphics2: any; timerAngle = { min: 0, max: 0 }; showTimer = false; counter = 0; TimeInterval: any

    player1Timer: any; player2Timer: any; player3Timer: any; player4Timer: any; playerNumber: any;

    radius: any; posX: any; posY: any; timerDuration: any; perSecondAngleChange: any; num: any

    model: any; socketsvc: any; gameComp: any; current:any; previous:any;

    constructor(handle: any, rad: any, posX: any, posY: any, time: any, num: any, model: any, socketsvc: any, gameComp: any) {
        super(handle);
        this.radius = rad;
        this.posX = posX;
        this.posY = posY;
        this.timerDuration = time;
        this.num = num;
        this.model = model
        console.log("game timer constructor",);
        this.socketsvc = socketsvc;
        this.gameComp = gameComp;


    }

    create() {
        var r2 = this.add.circle(this.posX, this.posY, this.radius, 0x000000);
        r2.setDepth(0);
        this.previous = 0;
        this.current = 30;

        r2.setStrokeStyle(10, 0xFFFFFF);
        this.graphics = this.add.graphics();
        this.subscriberTimerServices()


    }

    subscriberTimerServices() {
        let self = this;
        let temp = this.socketsvc.gameTimer.subscribe((data: any) => {
            // console.log('here is data values<<<<<<<<<<<<<<<', data);
            if (data) {
                this.current = data; //30
                if(this.previous != this.current){ 
                    // console.log('The value of the subscribed timer is',this.previous,this.current);
                    this.previous = this.current; //30
               

                switch (this.num) {
                    case '1':
                        if(this.player1Timer){
                            this.player1Timer.destroy();
                        }
                        this.player1Timer = this.add.text(this.game.scale.width / 1.8, this.game.scale.height / 1.64 + (this.game.scale.height / 10), ' ', { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', }).setOrigin(0.5, 1);
                        this.player1Timer.setFontSize((this.game.scale.width / 220) + 'ex');
                        this.graphics.clear();
                        this.graphics.lineStyle(10, 0x04c8fb);
                        this.graphics.beginPath();
                        this.graphics.arc(this.posX, this.posY, this.radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad((360 - ((data) * 12))), true);
                        this.graphics.strokePath();
                        
                        try {
                            self.player1Timer.text = (data.toString());
                        }
                        catch (e) {
                            console.log(e);
                        }

                        break;
                    case '2':
                        if(this.player2Timer){
                            this.player2Timer.destroy();
                        }
                        this.player2Timer = this.add.text(this.game.scale.width / 1.8, this.game.scale.height / 1.7 - (this.game.scale.height / 10), '', { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', }).setOrigin(0.5, 1);
                        this.player2Timer.setFontSize((this.game.scale.width / 220) + 'ex');
                        this.graphics.clear();
                        this.graphics.lineStyle(10, 0x04c8fb);
                        this.graphics.beginPath();
                        this.graphics.arc(this.posX, this.posY, this.radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad((360 - ((data) * 12))), true);
                        this.graphics.strokePath();
                        try {
                            this.player2Timer.text = (data.toString());
                        }
                        catch (e) {
                            console.log(e);
                        }

                        break;
                    case '3':
                        if(this.player3Timer){
                            this.player3Timer.destroy();
                        }
                        this.player3Timer = this.add.text(this.game.scale.width / 1.8 - ((this.game.scale.width / 40) * 6), this.game.scale.height / 1.7 + (this.game.scale.height / 150), '', { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', }).setOrigin(0.5, 1);
                        this.player3Timer.setFontSize((this.game.scale.width / 220) + 'ex');
                        this.graphics.clear();
                        this.graphics.lineStyle(10, 0x04c8fb);
                        this.graphics.beginPath();
                        this.graphics.arc(this.posX, this.posY, this.radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad((360 - ((data) * 12))), true);
                        this.graphics.strokePath();
                        try {
                            this.player3Timer.text = (data.toString());
                        }
                        catch (e) {
                            console.log(e);
                        }

                        break;
                    case '4':
                        if(this.player4Timer){
                            this.player4Timer.destroy();
                        }
                        this.player4Timer = this.add.text(this.game.scale.width / 1.8 + ((this.game.scale.width / 40) * 6), this.game.scale.height / 1.7 + (this.game.scale.height / 150), '', { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', }).setOrigin(0.5, 1);
                        this.player4Timer.setFontSize((this.game.scale.width / 220) + 'ex');
                        this.graphics.clear();
                        this.graphics.lineStyle(10, 0x04c8fb);
                        this.graphics.beginPath();
                        this.graphics.arc(this.posX, this.posY, this.radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad((360 - ((data) * 12))), true);

                        this.graphics.strokePath();
                        try {
                            this.player4Timer.text = (data.toString());
                        }
                        catch (e) {
                            console.log(e);
                        }
                }
            }
                      
        }
        }
        );
       
        this.model.subscribeTimer = temp;
        
    }
}

