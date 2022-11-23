export class BidTimer extends Phaser.Scene {
 
    angle = { min: 0, max: 0}; group:any; timerShine: any; graphics: any; radialProgressBar:any;
    timerBg:any; tween: any; graphics2:any; timerAngle = {min: 0, max: 0}; showTimer = false; counter = 0; TimeInterval:any

    player1Timer:any;    player2Timer:any;    player3Timer:any;    player4Timer:any; playerNumber:any;

    radius: any; posX: any; posY: any; timerDuration: any; perSecondAngleChange: any; num:any

    model:any;card1:any;

    constructor(handle : any, rad:any, posX:any, posY:any, time:any, num:any,model:any) {
        super(handle);
        this.radius = rad;
        this.posX = posX;
        this.posY = posY;
        this.timerDuration = time;
        this.num = num;
        this.model=model;
       
        console.log("game timer constructor",);
       
      
    }

    preload() {
        // this.subscribeToClearTimer();
    }

    update() {
        
        if(this.showTimer) {
            
            this.graphics.clear();
            this.graphics.lineStyle(10, 0x04c8fb);
            this.graphics.beginPath();
            this.graphics.arc(this.posX, this.posY, this.radius, 0, Phaser.Math.DegToRad(this.timerAngle.max/2.5), true);
            this.graphics.strokePath();
            // this.player4Timer.visible = true;
            // this.player4Timer.text = (parseInt(this.player4Timer.text)-1).toString();
          
            if(this.timerAngle.max >= 900 ) { 
                this.showTimer = false;
                this.graphics.clear();
                this.scene.remove("BidTimer");
            }  
            
            let self = this;

            if((Math.floor((this.timerAngle.max ))% 36) == 0 && (this.timerAngle.max )>=36){
                console.log('the timer is>>>>>>>>>>>>>',Math.floor(this.timerAngle.max), this.num)
                if(this.model.isBidPanel)
                {self.player1Timer.visible = true;
                self.player1Timer.text = (25-(Math.floor((this.timerAngle.max ))/ 36)).toString();}
                else{
                    self.player1Timer.visible = false;
                    this.graphics.clear();
                    this.scene.remove("BidTimer");
                } 
            }
        }
        
    }


    create() {

        // this.game.scale.width/1.8,  this.game.scale.width/1.8
        var r2 = this.add.circle(this.posX, this.posY, this.radius, 0x000000);
        r2.setDepth(0);

        r2.setStrokeStyle(10, 0xFFFFFF);
        
        this.player1Timer =  this.add.text((this.game.scale.width/4.8),(this.game.scale.height / 3.6), '25', { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', }).setOrigin(0.5, 1).setInteractive();
        this.player1Timer.setFontSize((this.game.scale.width / 220) + 'ex');
        
        // }
        if(this.model.isBidPanel)
       { this.player1Timer.visible = true;
        
    }
    

        this.graphics = this.add.graphics();
        this.scene.bringToTop('Header');
        
        this.showTimer = true;

        let self = this;
        
        var tween1 = this.tweens.add({
            targets: [self.timerAngle],
            max: 900,
            ease: 'linear',
            duration: this.timerDuration-1000,
            yoyo: false,
            onComplete: function () {
                tween1.stop();
                clearTimeout(self.TimeInterval);
            
            }
        });
       
    

    }
   


 
}
