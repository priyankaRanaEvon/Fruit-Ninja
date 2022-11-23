import { BidTimer } from "./bid-Timer";
import { GameTimer } from "./game-timer";

export class BidPanel extends Phaser.Scene {

    gameComp: any; panel: any; socketScv: any; model: any; graphics: any; bidText: any; bidPass: any; bidRedouble: any;
    bidDouble: any; bidRedoubleInactive: any; bidDoubleInactive: any; isBidDouble: any; isBidReDouble: any;

    bidClub1: any; bidClub2: any; bidClub3: any; bidClub4: any; bidClub5: any; bidClub6: any; bidClub7: any;
    bidDiamond1: any; bidDiamond2: any; bidDiamond3: any; bidDiamond4: any; bidDiamond5: any; bidDiamond6: any; bidDiamond7: any
    bidHeart1: any; bidHeart2: any; bidHeart3: any; bidHeart4: any; bidHeart5: any; bidHeart6: any; bidHeart7: any;
    bidSpade1: any; bidSpade2: any; bidSpade3: any; bidSpade4: any; bidSpade5: any; bidSpade6: any; bidSpade7: any;
    bidNT1: any; bidNT2: any; bidNT3: any; bidNT4: any; bidNT5: any; bidNT6: any; bidNT7: any; background: any; player1Timer: any
    whiteBG: any; west: any; north: any; east: any; westTxt: any; northTxt: any; eastTxt: any; BidSeat: any; bidSuit2: any; bidSuit3: any; bidSuit4: any;

    timer: any; timer1: any; timer2: any; timer3: any; timer4: any;
    num: any = 1;
    card1: any; cardArray: any;

    waitText1: any; timerEvent: any; playerNotJoinText: any;

    constructor(handle: any, gameComp: any, model: any, socket: any) {
        super(handle);
        this.gameComp = gameComp;
        this.socketScv = socket;
        this.model = model;
    }


    create() {
        this.createBidPanel();
        this.subscribeToServices();
    }


    createBidPanel() {



        // this.background=this.add.image(400,300,"bidPanelBG").setScale(window.innerWidth,window.innerHeight);




        this.panel = this.add.image(this.game.scale.width / 1.8, this.game.scale.height / 2.57, 'BidPanel').setOrigin(0.5);
        this.panel.setDisplaySize(((this.game.scale.width / 40) * 25), ((this.game.scale.height / 40) * 24.5));

        this.whiteBG = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 3.75, this.panel.y + (this.panel.displayHeight / 3.25), 'whiteBG').setOrigin(0.5);
        this.whiteBG.setDisplaySize(((this.game.scale.width / 40) * 4.3), ((this.game.scale.height / 40) * 4.5));

        this.west = this.add.text(this.whiteBG.x - (this.whiteBG.displayWidth / 10) * 3.7, this.whiteBG.y - (this.whiteBG / 3), "West", { font: '14px Conv_NetflixSansBold', color: '#444444', }).setOrigin(0, 0.5);
        this.west.setFontSize((this.game.scale.width / 500) + 'ex');

        this.north = this.add.text(this.panel.x - (this.panel.displayWidth / 10) * 3.7, this.panel.y + (this.panel.displayHeight / 10), "N", { font: '14px Conv_NetflixSansBold', color: '#444444', }).setOrigin(0, 0.5);
        this.north.setFontSize((this.game.scale.width / 500) + 'ex');

        this.east = this.add.text(this.panel.x - (this.panel.displayWidth / 10) * 3.7, this.panel.y + (this.panel.displayHeight / 8), "E", { font: '14px Conv_NetflixSansBold', color: '#444444', }).setOrigin(0, 0.5);
        this.east.setFontSize((this.game.scale.width / 500) + 'ex');


        this.waitText1 = this.add.text(this.game.scale.width / 1.8, (this.game.scale.height / 1.7 - (this.game.scale.height / 8)), "BIDDING IN \n PROGRESS", { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', align: "center" }).setOrigin(0.5, 0);
        this.waitText1.setFontSize((this.game.scale.width / 180) + 'ex');
        //this.waittext2=this.add.text(this.game.scale.width / 1.8, this.game.scale.height / 1.7,"Please wait for your turn",{ font: '40px Conv_NetflixSansRegular', color: '#FFFFFF', }).setOrigin(0.5,0);
        //this.waittext2.setFontSize((this.game.scale.width / 220) + 'ex');

        this.playerNotJoinText = this.add.text(this.game.scale.width / 1.8, (this.game.scale.height / 1.7 - (this.game.scale.height / 6)), "", { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', align: "center" }).setOrigin(0.5, 0);
        this.playerNotJoinText.setFontSize((this.game.scale.width / 250) + 'ex');


        this.bidText = this.add.text((this.game.scale.width / 3.9), (this.game.scale.height / 8), "", { font: '40px Conv_NetflixSansBold', color: '#FFFFFF', }).setOrigin(0, 0.5);
        this.bidText.setFontSize((this.game.scale.width / 220) + 'ex');

        this.bidPass = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 3.7, this.panel.y - (this.panel.displayHeight / 4), 'Pass').setOrigin(0.5).setInteractive().on('pointerdown', () => this.bidSelected(0, 'pass'));
        this.bidPass.setDisplaySize(((this.panel.displayWidth / 6.5)), ((this.panel.displayHeight / 7.5)));

        this.bidDouble = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 3.7, this.panel.y - (this.panel.displayHeight / 11), 'Double').setOrigin(0.5).setInteractive().on('pointerdown', () => this.bidSelected(0, 'double'));
        this.bidDouble.setDisplaySize(((this.panel.displayWidth / 6.5)), ((this.panel.displayHeight / 7.5)));

        this.bidRedouble = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 3.7, this.panel.y + (this.panel.displayHeight / 14), 'Redouble').setOrigin(0.5).setInteractive().on('pointerdown', () => this.bidSelected(0, 'redouble'));
        this.bidRedouble.setDisplaySize(((this.panel.displayWidth / 6.5)), ((this.panel.displayHeight / 7.5)));

        this.bidDoubleInactive = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 3.7, this.panel.y - (this.panel.displayHeight / 11), 'Double_Inactive').setOrigin(0.5);
        this.bidDoubleInactive.setDisplaySize(((this.panel.displayWidth / 6.5)), ((this.panel.displayHeight / 7.5)));

        this.bidRedoubleInactive = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 3.7, this.panel.y + (this.panel.displayHeight / 14), 'Redouble_Inactive').setOrigin(0.5);
        this.bidRedoubleInactive.setDisplaySize(((this.panel.displayWidth / 6.5)), ((this.panel.displayHeight / 7.5)));

        this.bidClub1 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 1.8, this.panel.y - (this.panel.displayHeight / 2.6), 'club1').setOrigin(0.5);
        this.bidClub1.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidClub1.setInteractive().on('pointerdown', () => this.bidSelected(1, 'clubs'));

        this.bidClub2 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 0.8, this.panel.y - (this.panel.displayHeight / 2.6), 'club2').setOrigin(0.5);
        this.bidClub2.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidClub2.setInteractive().on('pointerdown', () => this.bidSelected(2, 'clubs'));

        this.bidClub3 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * (-0.2), this.panel.y - (this.panel.displayHeight / 2.6), 'club3').setOrigin(0.5);
        this.bidClub3.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidClub3.setInteractive().on('pointerdown', () => this.bidSelected(3, 'clubs'));

        this.bidClub4 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 1.2, this.panel.y - (this.panel.displayHeight / 2.6), 'club4').setOrigin(0.5);
        this.bidClub4.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidClub4.setInteractive().on('pointerdown', () => this.bidSelected(4, 'clubs'));

        this.bidClub5 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 2.2, this.panel.y - (this.panel.displayHeight / 2.6), 'club5').setOrigin(0.5);
        this.bidClub5.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidClub5.setInteractive().on('pointerdown', () => this.bidSelected(5, 'clubs'));

        this.bidClub6 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 3.2, this.panel.y - (this.panel.displayHeight / 2.6), 'club6').setOrigin(0.5);
        this.bidClub6.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidClub6.setInteractive().on('pointerdown', () => this.bidSelected(6, 'clubs'));

        this.bidClub7 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 4.2, this.panel.y - (this.panel.displayHeight / 2.6), 'club7').setOrigin(0.5);
        this.bidClub7.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidClub7.setInteractive().on('pointerdown', () => this.bidSelected(7, 'clubs'));

        this.bidDiamond1 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 1.8, this.panel.y - (this.panel.displayHeight / 5.2), 'Diamond1').setOrigin(0.5);
        this.bidDiamond1.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidDiamond1.setInteractive().on('pointerdown', () => this.bidSelected(1, 'diamonds'));

        this.bidDiamond2 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 0.8, this.panel.y - (this.panel.displayHeight / 5.2), 'Diamond2').setOrigin(0.5);
        this.bidDiamond2.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.bidDiamond2.setInteractive().on('pointerdown', () => this.bidSelected(2, 'diamonds'));

        this.bidDiamond3 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * (-0.2), this.panel.y - (this.panel.displayHeight / 5.2), 'Diamond3').setOrigin(0.5);
        this.bidDiamond3.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidDiamond4 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 1.2, this.panel.y - (this.panel.displayHeight / 5.2), 'Diamond4').setOrigin(0.5);
        this.bidDiamond4.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidDiamond5 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 2.2, this.panel.y - (this.panel.displayHeight / 5.2), 'Diamond5').setOrigin(0.5);
        this.bidDiamond5.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));


        this.bidDiamond6 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 3.2, this.panel.y - (this.panel.displayHeight / 5.2), 'Diamond6').setOrigin(0.5);
        this.bidDiamond6.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidDiamond7 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 4.2, this.panel.y - (this.panel.displayHeight / 5.2), 'Diamond7').setOrigin(0.5);
        this.bidDiamond7.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidDiamond3.setInteractive().on('pointerdown', () => this.bidSelected(3, 'diamonds'));
        this.bidDiamond4.setInteractive().on('pointerdown', () => this.bidSelected(4, 'diamonds'));
        this.bidDiamond5.setInteractive().on('pointerdown', () => this.bidSelected(5, 'diamonds'));
        this.bidDiamond6.setInteractive().on('pointerdown', () => this.bidSelected(6, 'diamonds'));
        this.bidDiamond7.setInteractive().on('pointerdown', () => this.bidSelected(7, 'diamonds'));

        this.bidHeart1 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 1.8, this.panel.y, 'Heart1').setOrigin(0.5);
        this.bidHeart1.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidHeart2 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 0.8, this.panel.y, 'Heart2').setOrigin(0.5);
        this.bidHeart2.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidHeart3 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * (-0.2), this.panel.y, 'Heart3').setOrigin(0.5);
        this.bidHeart3.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidHeart4 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 1.2, this.panel.y, 'Heart4').setOrigin(0.5);
        this.bidHeart4.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidHeart5 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 2.2, this.panel.y, 'Heart5').setOrigin(0.5);
        this.bidHeart5.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidHeart6 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 3.2, this.panel.y, 'Heart6').setOrigin(0.5);
        this.bidHeart6.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidHeart7 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 4.2, this.panel.y, 'Heart7').setOrigin(0.5);
        this.bidHeart7.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidHeart1.setInteractive().on('pointerdown', () => this.bidSelected(1, 'hearts'));
        this.bidHeart2.setInteractive().on('pointerdown', () => this.bidSelected(2, 'hearts'));
        this.bidHeart3.setInteractive().on('pointerdown', () => this.bidSelected(3, 'hearts'));
        this.bidHeart4.setInteractive().on('pointerdown', () => this.bidSelected(4, 'hearts'));
        this.bidHeart5.setInteractive().on('pointerdown', () => this.bidSelected(5, 'hearts'));
        this.bidHeart6.setInteractive().on('pointerdown', () => this.bidSelected(6, 'hearts'));
        this.bidHeart7.setInteractive().on('pointerdown', () => this.bidSelected(7, 'hearts'));

        this.bidSpade1 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 1.8, this.panel.y + (this.panel.displayHeight / 5.2), 'Spade1').setOrigin(0.5);
        this.bidSpade1.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidSpade2 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 0.8, this.panel.y + (this.panel.displayHeight / 5.2), 'Spade2').setOrigin(0.5);
        this.bidSpade2.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidSpade3 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * (-0.2), this.panel.y + (this.panel.displayHeight / 5.2), 'Spade3').setOrigin(0.5);
        this.bidSpade3.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidSpade4 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 1.2, this.panel.y + (this.panel.displayHeight / 5.2), 'Spade4').setOrigin(0.5);
        this.bidSpade4.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidSpade5 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 2.2, this.panel.y + (this.panel.displayHeight / 5.2), 'Spade5').setOrigin(0.5);
        this.bidSpade5.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidSpade6 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 3.2, this.panel.y + (this.panel.displayHeight / 5.2), 'Spade6').setOrigin(0.5);
        this.bidSpade6.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidSpade7 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 4.2, this.panel.y + (this.panel.displayHeight / 5.2), 'Spade7').setOrigin(0.5);
        this.bidSpade7.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidSpade1.setInteractive().on('pointerdown', () => this.bidSelected(1, 'spades'));
        this.bidSpade2.setInteractive().on('pointerdown', () => this.bidSelected(2, 'spades'));
        this.bidSpade3.setInteractive().on('pointerdown', () => this.bidSelected(3, 'spades'));
        this.bidSpade4.setInteractive().on('pointerdown', () => this.bidSelected(4, 'spades'));
        this.bidSpade5.setInteractive().on('pointerdown', () => this.bidSelected(5, 'spades'));
        this.bidSpade6.setInteractive().on('pointerdown', () => this.bidSelected(6, 'spades'));
        this.bidSpade7.setInteractive().on('pointerdown', () => this.bidSelected(7, 'spades'));

        this.bidNT1 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 1.8, this.panel.y + (this.panel.displayHeight / 2.6), 'NT1').setOrigin(0.5);
        this.bidNT1.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidNT2 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * 0.8, this.panel.y + (this.panel.displayHeight / 2.6), 'NT2').setOrigin(0.5);
        this.bidNT2.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidNT3 = this.add.image(this.panel.x - (this.panel.displayWidth / 10) * (-0.2), this.panel.y + (this.panel.displayHeight / 2.6), 'NT3').setOrigin(0.5);
        this.bidNT3.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidNT4 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 1.2, this.panel.y + (this.panel.displayHeight / 2.6), 'NT4').setOrigin(0.5);
        this.bidNT4.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidNT5 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 2.2, this.panel.y + (this.panel.displayHeight / 2.6), 'NT5').setOrigin(0.5);
        this.bidNT5.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));


        this.bidNT6 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 3.2, this.panel.y + (this.panel.displayHeight / 2.6), 'NT6').setOrigin(0.5);
        this.bidNT6.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));

        this.bidNT7 = this.add.image(this.panel.x + (this.panel.displayWidth / 10) * 4.2, this.panel.y + (this.panel.displayHeight / 2.6), 'NT7').setOrigin(0.5);
        this.bidNT7.setDisplaySize(((this.panel.displayWidth / 11)), (this.panel.displayHeight / 6));
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(3, 0x666666, 1);
        this.graphics.lineBetween((this.game.scale.width / 2.55), this.game.scale.height / 12, (this.game.scale.width / 2.55), (this.game.scale.height) / 1.44);

        this.bidNT1.setInteractive().on('pointerdown', () => this.bidSelected(1, 'notrump'));
        this.bidNT2.setInteractive().on('pointerdown', () => this.bidSelected(2, 'notrump'));
        this.bidNT3.setInteractive().on('pointerdown', () => this.bidSelected(3, 'notrump'));
        this.bidNT4.setInteractive().on('pointerdown', () => this.bidSelected(4, 'notrump'));
        this.bidNT5.setInteractive().on('pointerdown', () => this.bidSelected(5, 'notrump'));
        this.bidNT6.setInteractive().on('pointerdown', () => this.bidSelected(6, 'notrump'));
        this.bidNT7.setInteractive().on('pointerdown', () => this.bidSelected(7, 'notrump'));

        this.model.BidEnable.push(this.bidClub1);
        this.model.BidEnable.push(this.bidDiamond1);
        this.model.BidEnable.push(this.bidHeart1);
        this.model.BidEnable.push(this.bidSpade1);
        this.model.BidEnable.push(this.bidNT1);
        this.model.BidEnable.push(this.bidClub2);
        this.model.BidEnable.push(this.bidDiamond2);
        this.model.BidEnable.push(this.bidHeart2);
        this.model.BidEnable.push(this.bidSpade2);
        this.model.BidEnable.push(this.bidNT2);
        this.model.BidEnable.push(this.bidClub3);
        this.model.BidEnable.push(this.bidDiamond3);
        this.model.BidEnable.push(this.bidHeart3);
        this.model.BidEnable.push(this.bidSpade3);
        this.model.BidEnable.push(this.bidNT3);
        this.model.BidEnable.push(this.bidClub4);
        this.model.BidEnable.push(this.bidDiamond4);
        this.model.BidEnable.push(this.bidHeart4);
        this.model.BidEnable.push(this.bidSpade4);
        this.model.BidEnable.push(this.bidNT4);
        this.model.BidEnable.push(this.bidClub5);
        this.model.BidEnable.push(this.bidDiamond5);
        this.model.BidEnable.push(this.bidHeart5);
        this.model.BidEnable.push(this.bidSpade5);
        this.model.BidEnable.push(this.bidNT5);
        this.model.BidEnable.push(this.bidClub6);
        this.model.BidEnable.push(this.bidDiamond6);
        this.model.BidEnable.push(this.bidHeart6);
        this.model.BidEnable.push(this.bidSpade6);
        this.model.BidEnable.push(this.bidNT6);
        this.model.BidEnable.push(this.bidClub7);
        this.model.BidEnable.push(this.bidDiamond7);
        this.model.BidEnable.push(this.bidHeart7);
        this.model.BidEnable.push(this.bidSpade7);
        this.model.BidEnable.push(this.bidNT7);

        this.bidClub1.visible = false;
        this.bidClub2.visible = false;
        this.bidClub3.visible = false;
        this.bidClub4.visible = false;
        this.bidClub5.visible = false;
        this.bidClub6.visible = false;
        this.bidClub7.visible = false;
        this.bidDiamond1.visible = false;
        this.bidDiamond2.visible = false;
        this.bidDiamond3.visible = false;
        this.bidDiamond4.visible = false;
        this.bidDiamond5.visible = false;
        this.bidDiamond6.visible = false;
        this.bidDiamond7.visible = false
        this.bidHeart1.visible = false;
        this.bidHeart2.visible = false;
        this.bidHeart3.visible = false;
        this.bidHeart4.visible = false;
        this.bidHeart5.visible = false;
        this.bidHeart6.visible = false;
        this.bidHeart7.visible = false;
        this.bidSpade1.visible = false;
        this.bidSpade2.visible = false;
        this.bidSpade3.visible = false;
        this.bidSpade4.visible = false;
        this.bidSpade5.visible = false;
        this.bidSpade6.visible = false;
        this.bidSpade7.visible = false;
        this.bidNT1.visible = false;
        this.bidNT2.visible = false;
        this.bidNT3.visible = false;
        this.bidNT4.visible = false;
        this.bidNT5.visible = false;
        this.bidNT6.visible = false;
        this.bidNT7.visible = false;
        this.bidText.visible = false;
        this.bidPass.visible = false;
        this.bidRedouble.visible = false;
        this.bidDouble.visible = false;
        this.panel.visible = false;
        this.graphics.visible = false;
        this.bidDoubleInactive.visible = false;
        this.bidRedoubleInactive.visible = false;
        // this.background.visible=false;
        this.model.isBidPanel = false;
        this.whiteBG.visible = false;
        this.west.visible = false;
        this.north.visible = false;
        this.east.visible = false;
        // this.timer.visible=false;
        this.num = 0;
        this.waitText1.visible = false;
        //this.waittext2.visible=false;
    }

    subscribeToNameDirection() {
        //updated code
        let temp = this.socketScv.nameDirection.subscribe((data: any) => {
            if (data) {
                console.log('subscribed to Name and direction', data);
               try{ this.placeDirection(data);
            }catch{}
            }
        }
        );
        this.gameComp.gamePlaySubscriptions.push(temp);
    }


    subscribeToServices() {
        //Get the Bid value



        // this.subscribeToMyTurn();

        // show cards on bid panel

        // this.showCardOnBidPanel();
        //updated code
        this.subscribeToNameDirection();
        this.subscribeToBid();
        //done update

        this.timerEvent = this.time.addEvent({
            delay: 10,
            callback: this.updateBidPanel,
            callbackScope: this,
            loop: true,
        });


        let temp;
        //updated code
        temp = this.socketScv.bidOptions.subscribe((data: any) => {
            if (data) {
                console.log("bet data received ", data);
                this.model.isBidPanel = true;
                this.showBidPanel();
            }
        });


        this.gameComp.gamePlaySubscriptions.push(temp);

        temp = this.socketScv.hideBidOptions.subscribe((data: any) => {
            if (data) {
                console.log("bet data received ", data);
                // this.model.isBidPanel = false;
                this.waitText1.text="BIDDING IN \n PROGRESS"
                this.waitText1.visible = true;
                this.hideBidPanel();
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);

        //updated code
        temp = this.socketScv.playerJoinGame.subscribe((data: any) => {
            if (data) {
                this.playerNotJoinText.text = data;
                if (this.model.allPlayers.length == 4) {
                    this.model.bidWait = false;
                    this.playerNotJoinText.destroy();
                }
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);

        temp = this.socketScv.bidWinner.subscribe((data: any) => {
            if (data) {
                this.waitText1.visible = false;
                this.model.contractOnTable=true;

                //this.waittext2.visible=false;[]

            }
        })
        this.gameComp.gamePlaySubscriptions.push(temp);


        //updated code
        temp = this.socketScv.getDouble.subscribe((data: any) => {
            if (data != null) {
                this.isBidDouble = data;
                if (this.model.isBidPanel) {
                    if (data) {
                        console.log('the double is active');
                        this.bidDouble.visible = true;
                        this.bidDoubleInactive.visible = false;
                    }
                    else {
                        console.log('the double is Inactive');
                        this.bidDouble.visible = false;
                        this.bidDoubleInactive.visible = true;
                    }
                }
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
        //updated code
        temp = this.socketScv.getReDouble.subscribe((data: any) => {
            if (data != null) {
                this.isBidReDouble = data;
                if (this.model.isBidPanel) {
                    if (data) {
                        console.log('the double is active');
                        this.bidRedouble.visible = true;
                        this.bidRedoubleInactive.visible = false;
                    }
                    else {
                        console.log('the double is Inactive');
                        this.bidRedouble.visible = false;
                        this.bidRedoubleInactive.visible = true;
                    }
                }
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);



      
        temp = this.socketScv.setBid.subscribe((data: any) => {
            if (data) {
                console.log('subscribed to bid', data);

            }
        });
    }

    placeDirection(data: any) {
        for (var j = 0; j < this.model.allPlayers.length; j++) {
            if (this.model.allPlayers[j].index == data.index) {
                this.BidSeat = this.model.allPlayers[j].seat;
                break;
            }
        }
        let direction;
        {
            switch (this.BidSeat) {
                case "2":
                    direction = data.direction.toString();
                    console.log("direction on bid panel-->", direction);
                    if (this.north) {
                        this.north.destroy();
                    }
                    this.north = this.add.text((this.whiteBG.x - (this.whiteBG.displayWidth / 10) * 4.2), (this.whiteBG.y - (this.whiteBG.displayHeight / 4)), direction + ":", { font: '14px Conv_NetflixSansBold', color: '#444444', }).setOrigin(0, 0.5);
                    this.north.setFontSize((this.game.scale.width / 500) + 'ex');
                    if(!this.model.isBidPanel)
                    this.north.visible = false;
                    break;
                case "3":
                    direction = data.direction.toString();
                    console.log("direction on bid panel-->", direction);
                    if (this.east) {
                        this.east.destroy();
                    }

                    this.east = this.add.text(this.whiteBG.x - (this.whiteBG.displayWidth / 10) * 4.2, (this.whiteBG.y - (this.whiteBG.displayHeight / 30)), direction + ":", { font: '14px Conv_NetflixSansBold', color: '#444444', }).setOrigin(0, 0.5);
                    this.east.setFontSize((this.game.scale.width / 500) + 'ex');
                    if(!this.model.isBidPanel)
                    this.east.visible = false;

                    break;
                case "4":
                    direction = data.direction.toString();
                    console.log("direction on bid panel-->", direction);
                    if (this.west) {
                        this.west.destroy();
                    }
                    this.west = this.add.text(this.whiteBG.x - (this.whiteBG.displayWidth / 10) * 4.2, (this.whiteBG.y + (this.whiteBG.displayHeight / 4.7)), direction + ":", { font: '14px Conv_NetflixSansBold', color: '#444444', }).setOrigin(0, 0.5);
                    this.west.setFontSize((this.game.scale.width / 500) + 'ex');
                    if(!this.model.isBidPanel)
                    this.west.visible = false;

                    break;


            }
        }
}

    placeBidOnBidPanel(data: any) {
        for (var j = 0; j < this.model.allPlayers.length; j++) {
            if (this.model.allPlayers[j].index == data.index) {
                this.BidSeat = this.model.allPlayers[j].seat;
                break;
            }
        }
        switch (this.BidSeat) {
            

            // North or top player
            case '2':


                if (this.northTxt) {

                    this.northTxt.destroy();
                    if (this.bidSuit2) this.bidSuit2.destroy();
                }
                if (data.bid > 0) {
                    if (data.type == 'notrump')
                        this.northTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 4)), data.bid.toString() + "NT", { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    else {
                        this.bidSuit2 = this.add.image((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 1.5), (this.whiteBG.y - (this.whiteBG.displayHeight / 4)), data.type).setOrigin(0.5).setInteractive();
                        this.northTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 4)), data.bid.toString(), { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    }
                    this.northTxt.setFontSize((this.game.scale.width / 550) + 'ex');
                }
                else {
                    switch (data.type) {
                        case "pass":
                            this.northTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 4)), 'Pass', { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.northTxt.setFontSize((this.game.scale.width / 550) + 'ex');
                            break;
                        case "double":
                            this.northTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 4)), "Double", { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5); this.northTxt.setFontSize((this.game.scale.width / 280) + 'ex');
                            this.northTxt.setFontSize((this.game.scale.width / 550) + 'ex');
                            break;
                        case "redouble":
                            this.northTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 4)), "ReDouble", { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.northTxt.setFontSize((this.game.scale.width / 580) + 'ex');
                    }
                }
                break;
            // left or East
            case '3':
                if (this.eastTxt) {

                    this.eastTxt.destroy();
                    if (this.bidSuit3) this.bidSuit3.destroy();
                }


                if (data.bid > 0) {
                    if (data.type == 'notrump')
                        this.eastTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 30)), data.bid.toString() + "NT", { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    else {
                        this.bidSuit3 = this.add.image((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 1.5), (this.whiteBG.y - (this.whiteBG.displayHeight / 30)), data.type).setOrigin(0.5).setInteractive();
                        this.eastTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 30)), data.bid.toString(), { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    }
                    this.eastTxt.setFontSize((this.game.scale.width / 550) + 'ex');
                }
                else {
                    switch (data.type) {
                        case "pass":
                            this.eastTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 30)), 'Pass', { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.eastTxt.setFontSize((this.game.scale.width / 550) + 'ex');
                            break;
                        case "double":
                            this.eastTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 30)), 'Double', { font: '142x Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.eastTxt.setFontSize((this.game.scale.width / 550) + 'ex');

                            break;
                        case "redouble":
                            this.eastTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y - (this.whiteBG.displayHeight / 30)), 'ReDouble', { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.eastTxt.setFontSize((this.game.scale.width / 580) + 'ex');
                    }
                }

                break;

            // west or right player
            case '4':
                if (this.westTxt) {

                    this.westTxt.destroy();
                    if (this.bidSuit4) this.bidSuit4.destroy();
                }

                if (data.bid > 0) {
                    if (data.type == 'notrump')
                        this.westTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y + (this.whiteBG.displayHeight / 4.7)), data.bid.toString() + "NT", { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    else {
                        this.bidSuit4 = this.add.image((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 1.5), (this.whiteBG.y + (this.whiteBG.displayHeight / 4.7)), data.type).setOrigin(0.5).setInteractive();
                        this.westTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y + (this.whiteBG.displayHeight / 4.7)), data.bid.toString(), { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    }

                    this.westTxt.setFontSize((this.game.scale.width / 550) + 'ex');
                }
                else {
                    switch (data.type) {
                        case "pass":
                            this.westTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y + (this.whiteBG.displayHeight / 4.7)), 'Pass', { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.westTxt.setFontSize((this.game.scale.width / 550) + 'ex');
                            break;
                        case "double":
                            this.westTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y + (this.whiteBG.displayHeight / 4.7)), 'Double', { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.westTxt.setFontSize((this.game.scale.width / 550) + 'ex');

                            break;
                        case "redouble":
                            this.westTxt = this.add.text((this.whiteBG.x + (this.whiteBG.displayWidth / 10) * 0.01), (this.whiteBG.y + (this.whiteBG.displayHeight / 4.7)), 'ReDouble', { font: '12px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.westTxt.setFontSize((this.game.scale.width / 580) + 'ex');
                    }

                }
                break;

        }

    }



    subscribeToBid() {
        let temp = this.socketScv.setBid.subscribe((data: any) => {
            if (data) {
                console.log('subscribed to bid', data);
                this.placeBidOnBidPanel(data);
               

            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }


    showBidPanel() {
        this.bidText.text=" BID NOW";
        this.bidClub1.visible = true;
        this.bidClub2.visible = true;
        this.bidClub3.visible = true;
        this.bidClub4.visible = true;
        this.bidClub5.visible = true;
        this.bidClub6.visible = true;
        this.bidClub7.visible = true;
        this.bidDiamond1.visible = true;
        this.bidDiamond2.visible = true;
        this.bidDiamond3.visible = true;
        this.bidDiamond4.visible = true;
        this.bidDiamond5.visible = true;
        this.bidDiamond6.visible = true;
        this.bidDiamond7.visible = true
        this.bidHeart1.visible = true;
        this.bidHeart2.visible = true;
        this.bidHeart3.visible = true;
        this.bidHeart4.visible = true;
        this.bidHeart5.visible = true;
        this.bidHeart6.visible = true;
        this.bidHeart7.visible = true;
        this.bidSpade1.visible = true;
        this.bidSpade2.visible = true;
        this.bidSpade3.visible = true;
        this.bidSpade4.visible = true;
        this.bidSpade5.visible = true;
        this.bidSpade6.visible = true;
        this.bidSpade7.visible = true;
        this.bidNT1.visible = true;
        this.bidNT2.visible = true;
        this.bidNT3.visible = true;
        this.bidNT4.visible = true;
        this.bidNT5.visible = true;
        this.bidNT6.visible = true;
        this.bidNT7.visible = true;
        this.bidText.visible = true;
        this.bidPass.visible = true;
        this.whiteBG.visible = true;
        
        this.west.visible = true;
        this.north.visible = true;
        this.east.visible = true;
        console.log('direction on bid panel-->', this.north, this.east, this.west);
        this.waitText1.visible = false;

        if (this.north) {
            this.north.visible = true;
        }
        if (this.east) {
            this.east.visible = true;
        }
        if (this.west) {
            this.west.visible = true;
        }


        if (this.northTxt) {

            this.northTxt.visible = true;
            if (this.bidSuit2) this.bidSuit2.visible = true;
        }
        if (this.eastTxt) {

            this.eastTxt.visible = true;
            if (this.bidSuit3) this.bidSuit3.visible = true;
        }
        if (this.westTxt) {

            this.westTxt.visible = true;
            if (this.bidSuit4) this.bidSuit4.visible = true;
        }
        console.log('double is active inside show bid panel', this.isBidDouble);

        if (this.isBidDouble) {

            this.bidDouble.visible = true;
            this.bidDoubleInactive.visible = false;
        }
        else {
            this.bidDoubleInactive.visible = true;
            this.bidDouble.visible = false;
        }

        if (this.isBidReDouble) {
            this.bidRedouble.visible = true;
            this.bidRedoubleInactive.visible = false;
        }
        else {
            this.bidRedoubleInactive.visible = true;
            this.bidRedouble.visible = false;
        }

        this.panel.visible = true;
        this.graphics.visible = true;
    }

    hideBidPanel() {

        this.bidClub1.visible = false;
        this.bidClub2.visible = false;
        this.bidClub3.visible = false;
        this.bidClub4.visible = false;
        this.bidClub5.visible = false;
        this.bidClub6.visible = false;
        this.bidClub7.visible = false;
        this.bidDiamond1.visible = false;
        this.bidDiamond2.visible = false;
        this.bidDiamond3.visible = false;
        this.bidDiamond4.visible = false;
        this.bidDiamond5.visible = false;
        this.bidDiamond6.visible = false;
        this.bidDiamond7.visible = false
        this.bidHeart1.visible = false;
        this.bidHeart2.visible = false;
        this.bidHeart3.visible = false;
        this.bidHeart4.visible = false;
        this.bidHeart5.visible = false;
        this.bidHeart6.visible = false;
        this.bidHeart7.visible = false;
        this.bidSpade1.visible = false;
        this.bidSpade2.visible = false;
        this.bidSpade3.visible = false;
        this.bidSpade4.visible = false;
        this.bidSpade5.visible = false;
        this.bidSpade6.visible = false;
        this.bidSpade7.visible = false;
        this.bidNT1.visible = false;
        this.bidNT2.visible = false;
        this.bidNT3.visible = false;
        this.bidNT4.visible = false;
        this.bidNT5.visible = false;
        this.bidNT6.visible = false;
        this.bidNT7.visible = false;
        this.bidText.visible = false;
        this.bidPass.visible = false;
        this.bidRedouble.visible = false;
        this.bidDouble.visible = false;
        this.panel.visible = false;
        this.graphics.visible = false;
        this.bidDoubleInactive.visible = false;
        this.bidRedoubleInactive.visible = false;
        this.model.isBidPanel = false;
        this.whiteBG.visible = false;
        this.west.visible = false;
        this.north.visible = false;
        this.east.visible = false;

        this.waitText1.visible = true;

        
        if (this.northTxt) {

            this.northTxt.visible = false;
            if (this.bidSuit2) this.bidSuit2.visible = false;
        }
        if (this.eastTxt) {

            this.eastTxt.visible = false;
            if (this.bidSuit3) this.bidSuit3.visible = false;
        }
        if (this.westTxt) {

            this.westTxt.visible = false;
            if (this.bidSuit4) this.bidSuit4.visible = false;
        }


    }

    bidSelected(BidType: any, BidSuit: any) {
        if(this.model.messagePopupVisible || this.model.showResult || this.model.showExitPopUp||this.model.showChatPanel){
            console.log("Player is offline!!!!")


        }
        else{
            this.gameComp.sendSelectedBidToServer(BidType, BidSuit);
            this.hideBidPanel();

        }
       
    }

    updateBidPanel() {
        if (this.model.bidWin) {
            this.waitText1.visible = false;
            
        }
        if (this.model.reDisrtibuteCards || this.model.bidWin) {
            if (this.northTxt) {

                this.northTxt.destroy();
                if (this.bidSuit2) this.bidSuit2.destroy();
            }
            if (this.eastTxt) {

                this.eastTxt.destroy();
                if (this.bidSuit3) this.bidSuit3.destroy();
            }
            if (this.westTxt) {

                this.westTxt.destroy();
                if (this.bidSuit4) this.bidSuit4.destroy();

            }

            if (this.model.reDisrtibuteCards) { this.model.reDisrtibuteCards = false; }

        }

    }

}
