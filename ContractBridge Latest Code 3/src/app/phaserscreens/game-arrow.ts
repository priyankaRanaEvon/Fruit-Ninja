export class GameArrow extends Phaser.Scene{

    arrow:any;
    x:any; y:any; direction:any; moveX:any; moveY:any;


    constructor(handle : any,  posX:any, posY:any, arrowDirection:any,mX:any,mY:any){
        super(handle);
        this.x=posX;
        this.y=posY;
        this.direction=arrowDirection;
        this.moveX=mX;
        this.moveY=mY;
       
    }

    create(){
               { 
                console.log("GameArrow");
                this.arrow=this.add.image(this.x,this.y,this.direction).setOrigin(0.5, 1).setInteractive();
                this.arrow.setDisplaySize(((this.game.scale.width / 40) * 2), ((this.game.scale.height / 40) * 3));
}
       

        var tween = this.tweens.add({
            targets: [this.arrow],
            y: this.arrow.y+this.moveY,
            x:this.arrow.x+this.moveX,
            ease: "linear",
            alpha:0.5,
            duration: 500,
           
            yoyo: true,
            repeat: -1,
            onComplete: function () {
                tween.stop();
                
            
            }
        });

    }

}