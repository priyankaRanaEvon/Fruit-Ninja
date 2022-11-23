import { Injectable } from "@angular/core";
import { Cards } from "./cards";
import { Header } from "./header";
import { Table } from "./table";
import { Router } from "@angular/router";
import { BidPanel } from "./bid-panel";
import { Chat } from "./chat";
import { ModelLocator } from "../ModelLocator/ModelLocator";
import { SocketconnectionService } from "../services/socketconnection.service";
import { WinScreen } from "./winscreen";


@Injectable()

export class GameScreen extends Phaser.Scene {
    background: any;
    players: any;
    gameComponent: any;
    socketConnection: any;
    settingGroup: any;

    api: any;
    gameBase: any;
    timerEvent:any;
    constructor(private router: Router, private socket: SocketconnectionService, public model: ModelLocator) {
        super({ key: "GameScreen" });
        console.log('the game screen');

    }

    preload() {

    //    backbround
        this.load.image("background","assets/Gameplay Screen Assets/Background_pattern.png");

        // bidPanel background
        this.load.image("bidPanelBG","assets/Bid Panel/BiddingScreenBG.png")
        this.load.image("whiteBG","assets/Bid Panel/whiteBG.png")
      
        //Table
        this.load.image('Table', 'assets/Gameplay Screen Assets/Table.png');

        //header
        this.load.image('Logout', 'assets/Gameplay Screen Assets/Button_Exit.png');
        this.load.image('Chat', 'assets/Gameplay Screen Assets/Button_Chat.png');

        // Arrows
        this.load.image("downArrow","assets/Gameplay Screen Assets/Arrows/DownArrow.png");
        this.load.image("upArrow","assets/Gameplay Screen Assets/Arrows/UpArrow.png");
        this.load.image("leftArrow","assets/Gameplay Screen Assets/Arrows/LeftArrow.png");
        this.load.image("rightArrow","assets/Gameplay Screen Assets/Arrows/RightArrow.png");

        //cards
        this.load.image('0', 'assets/Gameplay Screen Assets/Cards/Card_BackSide.png');
        this.load.image('1', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_2.png');
        this.load.image('2', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_3.png');
        this.load.image('3', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_4.png');
        this.load.image('4', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_5.png');
        this.load.image('5', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_6.png');
        this.load.image('6', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_7.png');
        this.load.image('7', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_8.png');
        this.load.image('8', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_9.png');
        this.load.image('9', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_10.png');
        this.load.image('10', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_J.png');
        this.load.image('11', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_Q.png');
        this.load.image('12', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_K.png');
        this.load.image('13', 'assets/Gameplay Screen Assets/Cards/Card_Diamond_A.png');

        this.load.image('14', 'assets/Gameplay Screen Assets/Cards/Card_Club_2.png');
        this.load.image('15', 'assets/Gameplay Screen Assets/Cards/Card_Club_3.png');
        this.load.image('16', 'assets/Gameplay Screen Assets/Cards/Card_Club_4.png');
        this.load.image('17', 'assets/Gameplay Screen Assets/Cards/Card_Club_5.png');
        this.load.image('18', 'assets/Gameplay Screen Assets/Cards/Card_Club_6.png');
        this.load.image('19', 'assets/Gameplay Screen Assets/Cards/Card_Club_7.png');
        this.load.image('20', 'assets/Gameplay Screen Assets/Cards/Card_Club_8.png');
        this.load.image('21', 'assets/Gameplay Screen Assets/Cards/Card_Club_9.png');
        this.load.image('22', 'assets/Gameplay Screen Assets/Cards/Card_Club_10.png')
        this.load.image('23', 'assets/Gameplay Screen Assets/Cards/Card_Club_J.png')
        this.load.image('24', 'assets/Gameplay Screen Assets/Cards/Card_Club_Q.png')
        this.load.image('25', 'assets/Gameplay Screen Assets/Cards/Card_Club_K.png')
        this.load.image('26', 'assets/Gameplay Screen Assets/Cards/Card_Club_A.png');

        this.load.image('27', 'assets/Gameplay Screen Assets/Cards/Card_Heart_2.png');
        this.load.image('28', 'assets/Gameplay Screen Assets/Cards/Card_Heart_3.png');
        this.load.image('29', 'assets/Gameplay Screen Assets/Cards/Card_Heart_4.png');
        this.load.image('30', 'assets/Gameplay Screen Assets/Cards/Card_Heart_5.png');
        this.load.image('31', 'assets/Gameplay Screen Assets/Cards/Card_Heart_6.png');
        this.load.image('32', 'assets/Gameplay Screen Assets/Cards/Card_Heart_7.png');
        this.load.image('33', 'assets/Gameplay Screen Assets/Cards/Card_Heart_8.png');
        this.load.image('34', 'assets/Gameplay Screen Assets/Cards/Card_Heart_9.png');
        this.load.image('35', 'assets/Gameplay Screen Assets/Cards/Card_Heart_10.png')
        this.load.image('36', 'assets/Gameplay Screen Assets/Cards/Card_Heart_J.png')
        this.load.image('37', 'assets/Gameplay Screen Assets/Cards/Card_Heart_Q.png')
        this.load.image('38', 'assets/Gameplay Screen Assets/Cards/Card_Heart_K.png')
        this.load.image('39', 'assets/Gameplay Screen Assets/Cards/Card_Heart_A.png');

        this.load.image('40', 'assets/Gameplay Screen Assets/Cards/Card_Spade_2.png');
        this.load.image('41', 'assets/Gameplay Screen Assets/Cards/Card_Spade_3.png');
        this.load.image('42', 'assets/Gameplay Screen Assets/Cards/Card_Spade_4.png');
        this.load.image('43', 'assets/Gameplay Screen Assets/Cards/Card_Spade_5.png');
        this.load.image('44', 'assets/Gameplay Screen Assets/Cards/Card_Spade_6.png');
        this.load.image('45', 'assets/Gameplay Screen Assets/Cards/Card_Spade_7.png');
        this.load.image('46', 'assets/Gameplay Screen Assets/Cards/Card_Spade_8.png');
        this.load.image('47', 'assets/Gameplay Screen Assets/Cards/Card_Spade_9.png');
        this.load.image('48', 'assets/Gameplay Screen Assets/Cards/Card_Spade_10.png')
        this.load.image('49', 'assets/Gameplay Screen Assets/Cards/Card_Spade_J.png')
        this.load.image('50', 'assets/Gameplay Screen Assets/Cards/Card_Spade_Q.png')
        this.load.image('51', 'assets/Gameplay Screen Assets/Cards/Card_Spade_K.png')
        this.load.image('52', 'assets/Gameplay Screen Assets/Cards/Card_Spade_A.png');

        //Cross Button
        this.load.image('cross', 'assets/Gameplay Screen Assets/Cross.png');
        //Send Button
        this.load.image('send', 'assets/Gameplay Screen Assets/Send.png');
        // Chat Panel
        // this.load.image('ChatPanel', 'assets/Bid Panel/Side Panel.png');
        //BId Panel Assets
        this.load.image('BidPanel', 'assets/Bid Panel/Primary_background.png');
        this.load.image('Pass', 'assets/Bid Panel/Pass.png');
        this.load.image('Redouble', 'assets/Bid Panel/Redouble.png');
        this.load.image('Double', 'assets/Bid Panel/Double.png');
        this.load.image('Pass_Inactive', 'assets/Bid Panel/Pass_Inactive.png');
        this.load.image('Redouble_Inactive', 'assets/Bid Panel/Redouble_Inactive.png');
        this.load.image('Double_Inactive', 'assets/Bid Panel/Double_Inactive.png');
        this.load.image('club1', 'assets/Bid Panel/Bid_Cell_Club_1.png');
        this.load.image('club2', 'assets/Bid Panel/Bid_Cell_Club_2.png');
        this.load.image('club3', 'assets/Bid Panel/Bid_Cell_Club_3.png');
        this.load.image('club4', 'assets/Bid Panel/Bid_Cell_Club_4.png');
        this.load.image('club5', 'assets/Bid Panel/Bid_Cell_Club_5.png');
        this.load.image('club6', 'assets/Bid Panel/Bid_Cell_Club_6.png');
        this.load.image('club7', 'assets/Bid Panel/Bid_Cell_Club_7.png');

        this.load.image('Diamond1', 'assets/Bid Panel/Bid_Cell_Diamond_1.png');
        this.load.image('Diamond2', 'assets/Bid Panel/Bid_Cell_Diamond_2.png');
        this.load.image('Diamond3', 'assets/Bid Panel/Bid_Cell_Diamond_3.png');
        this.load.image('Diamond4', 'assets/Bid Panel/Bid_Cell_Diamond_4.png');
        this.load.image('Diamond5', 'assets/Bid Panel/Bid_Cell_Diamond_5.png');
        this.load.image('Diamond6', 'assets/Bid Panel/Bid_Cell_Diamond_6.png');
        this.load.image('Diamond7', 'assets/Bid Panel/Bid_Cell_Diamond_7.png');

        this.load.image('Heart1', 'assets/Bid Panel/Bid_Cell_Heart_1.png');
        this.load.image('Heart2', 'assets/Bid Panel/Bid_Cell_Heart_2.png');
        this.load.image('Heart3', 'assets/Bid Panel/Bid_Cell_Heart_3.png');
        this.load.image('Heart4', 'assets/Bid Panel/Bid_Cell_Heart_4.png');
        this.load.image('Heart5', 'assets/Bid Panel/Bid_Cell_Heart_5.png');
        this.load.image('Heart6', 'assets/Bid Panel/Bid_Cell_Heart_6.png');
        this.load.image('Heart7', 'assets/Bid Panel/Bid_Cell_Heart_7.png');


        this.load.image('Spade1', 'assets/Bid Panel/Bid_Cell_Spade_1.png');
        this.load.image('Spade2', 'assets/Bid Panel/Bid_Cell_Spade_2.png');
        this.load.image('Spade3', 'assets/Bid Panel/Bid_Cell_Spade_3.png');
        this.load.image('Spade4', 'assets/Bid Panel/Bid_Cell_Spade_4.png');
        this.load.image('Spade5', 'assets/Bid Panel/Bid_Cell_Spade_5.png');
        this.load.image('Spade6', 'assets/Bid Panel/Bid_Cell_Spade_6.png');
        this.load.image('Spade7', 'assets/Bid Panel/Bid_Cell_Spade_7.png');

        this.load.image('NT1', 'assets/Bid Panel/Bid_Cell_NT_1.png');
        this.load.image('NT2', 'assets/Bid Panel/Bid_Cell_NT_2.png');
        this.load.image('NT3', 'assets/Bid Panel/Bid_Cell_NT_3.png');
        this.load.image('NT4', 'assets/Bid Panel/Bid_Cell_NT_4.png');
        this.load.image('NT5', 'assets/Bid Panel/Bid_Cell_NT_5.png');
        this.load.image('NT6', 'assets/Bid Panel/Bid_Cell_NT_6.png');
        this.load.image('NT7', 'assets/Bid Panel/Bid_Cell_NT_7.png');

        //Mini Suits assets       
        this.load.image('diamonds', 'assets/Gameplay Screen Assets/Diamond_Small_Stroke.png');
        this.load.image('clubs', 'assets/Gameplay Screen Assets/Club_Small_Stroke.png');
        this.load.image('hearts', 'assets/Gameplay Screen Assets/Heart_Small_Stroke.png');
        this.load.image('spades', 'assets/Gameplay Screen Assets/Spade_Small_Stroke.png');

        //Chat and Bid display assets
        this.load.image('Chat_Left', 'assets/Gameplay Screen Assets/Chat_Left.png');
        this.load.image('Chat_Right', 'assets/Gameplay Screen Assets/Chat_Right.png');
        this.load.image('Chat_Top', 'assets/Gameplay Screen Assets/Chat_Top.png');
        this.load.image('Chat_Bottom', 'assets/Gameplay Screen Assets/Chat_Bottom.png');





    }

    create() {
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateGameScreen,
            callbackScope: this,
            loop: true,
          });

        ////////Loading Phaser Screens & Game////////////
         var background=this.add.image(this.game.scale.width/2,this.game.scale.height/2,"background").setOrigin(0.5,0.5)
        background.setDisplaySize(this.game.scale.width,this.game.scale.height);
    
        console.log("game screen reload",this.game,this.scene,this.scene.scene)

        
        //Loading Table
        this.loadTable();
        //Loading Cards
        this.loadCards();
        //Loading Header
        this.loadHeader();
        //Loading BidPanel
        this.loadBidPanel();
         //Loading Chat Panel
         this.loadChatPanel();
        //Loading Winscreen
        this.loadWinScreen();
        //Loading Game
        this.initializeGame();

        
    }

    loadTable() {
        let key = "Table";
        let table = new Table(key, this.gameComponent, this.socket,this.model);
        this.scene.add(key, table, true);
    }

    loadHeader() {
        let key = "Header";
        let table = new Header(key, this.gameComponent, this.router, this.socket, this.model);
        this.scene.add(key, table, true);
    }
    loadCards() {
        let key = "Cards";
        let table = new Cards(key, this.gameComponent, this.socket, this.model);
        this.scene.add(key, table, true);
    }

    loadChatPanel() {
        let key = "ChatPanel";
        let ChatPanel = new Chat(key, this.gameComponent, this.model, this.router);
        this.scene.add(key, ChatPanel, true);
    }

    loadBidPanel() {
        let key = "BidPanel";
        let bidPanel = new BidPanel(key, this.gameComponent, this.model, this.socket);
        this.scene.add(key, bidPanel, true);
    }
    loadWinScreen() {
        let key = "WinScreen";
        let winscreen = new WinScreen(key, this.gameComponent, this.socket, this.model);
        this.scene.add(key, winscreen, true);
    }

    initializeGame() {
        this.gameComponent.startGame();
    }
    updateGameScreen() {
        if(!this.model.gameLoad && this.model.isReconnect && this.model.networkState){
            console.log("game reload",this.game,this.scene,this.scene.scene)

            // this.game.scene.remove('GameScreen');
    this.game.scene.remove('Background');
    this.game.scene.remove('Table');
    this.game.scene.remove('Cards');
    this.game.scene.remove('BidPanel');
    this.game.scene.remove('WinScreen');
    this.game.scene.remove('Header');
    // this.game.scene.remove('GameTimer');
    this.game.scene.remove('ChatPanel');
    // this.game.destroy(true);
            
            this.game.registry.destroy();
            // this.game.events.off();
            this.scene.restart();
        }
        
    }
}
