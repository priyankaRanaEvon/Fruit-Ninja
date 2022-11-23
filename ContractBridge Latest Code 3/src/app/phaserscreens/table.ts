import { GameArrow } from "./game-arrow";
import { GameTimer } from "./game-timer";
export class Table extends Phaser.Scene {

    socketScv: any;
    settingGroup: any;
    gameComp: any;
    model: any;
    apiRequest: any;
    player1Highlighter: any; player2Highlighter: any; player3Highlighter: any; player4Highlighter: any;
    dialogBox: any; timer: any; player1: any; player2: any; player3: any; player4: any; Bid: any; Suit: any; chat: any;arrow:any;
   bidSuit:any; contract:any;

   
    timerEvent:any;
    
    constructor(handle: any, gameComp: any, socket: any,model:any) {
        super(handle);
        this.gameComp = gameComp;
        this.socketScv = socket;
        this.model=model;
    }

    create() {

        var table = this.add.image(this.game.scale.width / 1.8, this.game.scale.height / 1.7, 'Table').setOrigin(0.5);
        table.setDisplaySize(((this.game.scale.width / 40) * 25), ((this.game.scale.height / 40) * 26));

        this.player1 = this.add.image(table.x, table.y + (this.game.scale.height / 10), '0').setOrigin(0.5, 1).setInteractive();
        this.player2 = this.add.image(table.x, table.y - (this.game.scale.height / 8), '0').setOrigin(0.5, 1).setInteractive();
        this.player3 = this.add.image(table.x - ((this.game.scale.width / 40) * 6), table.y - (this.game.scale.height / 60), '0').setOrigin(0.5, 1).setInteractive();
        this.player4 = this.add.image(this.game.scale.width / 1.8 + ((this.game.scale.width / 40) * 6), this.game.scale.height / 1.77 + (this.game.scale.height / 150), '0').setOrigin(0.5, 1).setInteractive();

        this.player1.visible = false;
        this.player2.visible = false;
        this.player3.visible = false;
        this.player4.visible = false;

       
        this.subscribeToServices();

        this.timerEvent = this.time.addEvent({
            delay: 100,
            callback: this.updateGameArrow,
            callbackScope: this,
            loop: true,
          });

            this.contract= this.add.text(table.x,table.y,"",{ font: '40px Conv_NetflixSansBold', color: '#FFFFFF', align: "center" }).setOrigin(0.5,0.5);
            this.contract.setFontSize((this.game.scale.width / 200) + 'ex');

            this.bidSuit=this.add.image(this.contract.x+(this.contract.width), this.game.scale.height / 1.7,this.model.contractBidSuit).setOrigin(0.5,0.5);
            this.contract.visible=false;
        this.bidSuit.visible=false;
    }


    subscribeToServices() {

        this.subscribeToMyTurn();
    }

    subscribeToPlayerLeave(){
        let temp= this.socketScv.playerLeave.subscribe((data:any)=>{
            if(data){
                this.gameComp.PlayerLeave(data);

            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToMyTurn() {
        let temp = this.socketScv.myTurn.subscribe((data: any) => {
            if (data) {
                console.log('can be used in my turn ', data);
                switch (data.seat) {
                    case '1':
                        if(this.model.isTimer){
                            this.loadTimer(this.player1, '1');
                        }
                        else if(!this.model.isTimer){
                        this.loadArrow(this.player1,"downArrow",0,10);
                        }
                        break;
                    case '2':
                        if(this.model.isTimer){
                        this.loadTimer(this.player2, '2');
                        }
                        else if(!this.model.isTimer){
                        this.loadArrow(this.player2,"upArrow",0,10);
                        }

                        break;
                    case '3':
                        if(this.model.isTimer){
                        this.loadTimer(this.player3, '3');
                        }
                        else if(!this.model.isTimer){
                        this.loadArrow(this.player3,"leftArrow",10,0);
                        }

                        break;
                    case '4':
                        if(this.model.isTimer){
                        this.loadTimer(this.player4, '4');
                        }
                        else if(!this.model.isTimer){
                        this.loadArrow(this.player4,"rightArrow",10,0);
                        }
                        break;
                }
            }
        });
        
        this.gameComp.gamePlaySubscriptions.push(temp);
    }
    
    loadTimer(player: any, num: any) {

        let key = "GameTimer";
        if (this.scene.isActive('GameTimer')){
            this.scene.remove("GameTimer");
            this.model.subscribeTimer.unsubscribe();
        }
            

           
    
        this.timer = new GameTimer(key, (this.game.scale.width / 95) * 2.5, player.x, player.y, 25000, num,this.model, this.socketScv, this.gameComp);
    this.scene.add(key, this.timer, true);
  
        

    }
    loadArrow(player:any,num:any,moveX:number,moveY:number){
        let key="GameArrow";
        if(this.scene.isActive("GameArrow"))
        {
            this.scene.remove("GameArrow");
        }
        console.log("isBidPanel===>",this.model.isBidPanel);
        // if(!this.model.isBidPanel){
        this.arrow=new GameArrow(key,player.x,player.y,num,moveX,moveY);
        this.scene.add(key,this.arrow,true);
// }

      
    }
    updateGameArrow() {
        if(this.model.isBidPanel){
            if(this.scene.isActive("GameArrow"))
            {
                this.scene.remove("GameArrow");
            }
            if(this.scene.isActive("GameTimer"))
            {
                this.scene.remove("GameTimer");
            }
        }
        if(this.model.contractOnTable){
            this.contract.text="CONTRACT : "+this.model.contractBidText
            this.contract.visible=true;
            if(this.model.contractBidSuit.length>0){
                if(this.model.contractBidSuit == 'NT'){
                    this.contract.text=this.contract.text+"NT";
                }
                else{
                    this.setSuitOnTable();
                }
            }
        }
        if(!this.model.contractOnTable){
            this.contract.visible=false;
            this.contract.text=""
            this.bidSuit.destroy();
            
        }
       
    }

    setSuitOnTable(){
        if(this.bidSuit)  {
              this.bidSuit.destroy();
          }
          this.bidSuit=this.add.image(this.contract.x+(this.contract.width/1.5), this.game.scale.height / 1.7,this.model.contractBidSuit).setOrigin(0.5,0.5);
          
         
          this.bidSuit.setDisplaySize(((this.game.scale.width / 40) * 1.2), ((this.game.scale.height / 40) * 1.8))
  
      }
}
