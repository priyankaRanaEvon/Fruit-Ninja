
import { ModelLocator } from "../ModelLocator/ModelLocator";
export class Header extends Phaser.Scene {
    //Primary Variables
    socketScv: any; gameComp: any; model: any; router: any;

    //Secondary Variables
    NSTotalBid: any; WETotalBid: any; NSTotalBidWon: any; WETotalBidWon: any;
    turnHand = 0; ContractText: any; NSText: any; WEText: any;
    contractTextValue: any; contractSuitType: any; contractTeam: any; graphics: any;

    constructor(handle: any, gameComp: any, router: any, socket: any, model: any) {
        super(handle);
        this.gameComp = gameComp;
        this.router = router;
        this.socketScv = socket;
        this.model = model;
    }

    create() {
        //Graphics
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.fillRoundedRect((this.game.scale.width / 40) * 10.6, (this.game.scale.height / 40) * 3, (this.game.scale.width / 6), (this.game.scale.height / 16), 10);
        this.graphics.fillRoundedRect((this.game.scale.width / 40) * 18, (this.game.scale.height / 40) * 3, (this.game.scale.width / 9.5), (this.game.scale.height / 16), 10);
        this.graphics.fillRoundedRect((this.game.scale.width / 40) * 22.8, (this.game.scale.height / 40) * 3, (this.game.scale.width / 9.5), (this.game.scale.height / 16), 10);


        //Static Assets
        this.ContractText = this.add.text((this.game.scale.width / 40) * 11, (this.game.scale.height / 40) * 4.2, "Contract : ", { font: '40px Conv_NetflixSansBold', color: '#000000',fontFamily: 'Conv_NetflixSansBold' }).setOrigin(0, 0.5);
        this.ContractText.setFontSize((this.game.scale.width / 300) + 'ex');
      
        this.NSText = this.add.text((this.game.scale.width / 40) * 18.4, (this.game.scale.height / 40) * 4.2, "WE: ", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.NSText.setFontSize((this.game.scale.width / 300) + 'ex');
        this.WEText = this.add.text((this.game.scale.width / 40) * 23.2, (this.game.scale.height / 40) * 4.2, "NS: ", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.WEText.setFontSize((this.game.scale.width / 300) + 'ex');
        
        //Dynamic Assets
        this.NSTotalBid = this.add.text((this.game.scale.width / 40) * 20.5, (this.game.scale.height / 40) * 4.2, "", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.NSTotalBid.setFontSize((this.game.scale.width / 300) + 'ex');
        this.WETotalBid = this.add.text((this.game.scale.width / 40) * 25.3, (this.game.scale.height / 40) * 4.2, "", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.WETotalBid.setFontSize((this.game.scale.width / 300) + 'ex');
        this.WETotalBidWon = this.add.text((this.game.scale.width / 40) * 24.8, (this.game.scale.height / 40) * 4.2, "", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.WETotalBidWon.setFontSize((this.game.scale.width / 300) + 'ex');
        this.NSTotalBidWon = this.add.text((this.game.scale.width / 40) * 20, (this.game.scale.height / 40) * 4.2, "", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.NSTotalBidWon.setFontSize((this.game.scale.width / 300) + 'ex');
        this.contractTextValue = this.add.text((this.game.scale.width / 40) * 14.2, (this.game.scale.height / 40) * 4.2, "5", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.contractTextValue.setFontSize((this.game.scale.width / 300) + 'ex');
        this.contractSuitType = this.add.image((this.game.scale.width / 40) * 15.2, (this.game.scale.height / 40) * 4.2, 'hearts').setOrigin(0.5).setInteractive();
        this.contractTeam = this.add.text((this.game.scale.width / 40) * 15.8, (this.game.scale.height / 40) * 4.2, "(W)", { font: '40px Conv_NetflixSansBold', color: '#000000', }).setOrigin(0, 0.5);
        this.contractTeam.setFontSize((this.game.scale.width / 300) + 'ex');

        //Visiblity of assets
        this.WETotalBid.visible = false;
        this.NSTotalBidWon.visible = false;
        this.WETotalBidWon.visible = false;
        this.NSTotalBid.visible = false;
        this.contractSuitType.visible = false;
        this.contractTextValue.visible = false;
        this.contractTeam.visible = false;

        //Service Subsrcibe
        this.subscribeToServices();
    }

    subscribeToServices() {
        //Updates the points per hand
        this.subscribeToPointsUpdate();

        //Show and hide Bids
        this.subscribeToBidShowHide();

        //To get player who won the bid
        this.subscribeToBidWon();
    }
    
    subscribeToBidShowHide() {
        let temp;
        temp = this.socketScv.bidOptions.subscribe((data: any) => {
            if (data) {
                this.graphics.visible = false;
                this.ContractText.visible = false;
                this.NSText.visible = false;
                this.WEText.visible = false;

                
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);

        temp = this.socketScv.hideBidOptions.subscribe((data: any) => {
            if (this.model.bidWin) {
                this.graphics.visible = true;
                this.ContractText.visible = true;
                this.NSText.visible = true;
                this.WEText.visible = true;
                
            }
        });
        // this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToPointsUpdate() {

        let temp = this.socketScv.pointsUpdate.subscribe((data: any) => {
            if (data) {
                console.log("teamName",this.model.teamName);
                ModelLocator.counter++;

                if (ModelLocator.counter > 12) {
                    ModelLocator.bteamHand = [];
                    ModelLocator.ateamHand = [];
                    ModelLocator.counter = 0;
                    ModelLocator.aNew = 0;
                    ModelLocator.aOld = 0;
                    ModelLocator.bNew = 0;
                    ModelLocator.bOld = 0;
                    this.turnHand = 0;
                    if (this.model.teamName == "A") {
                        this.NSTotalBidWon.text = 0;
                        this.WETotalBidWon.text = 0;
                    }
                    else if (this.model.teamName == "B") {
                        console.log("round score ", data)
                        this.NSTotalBidWon.text = 0;
                        this.WETotalBidWon.text = 0;
                    }
                    this.WETotalBid.visible = false;
                    this.NSTotalBidWon.visible = false;
                    this.WETotalBidWon.visible = false;
                    this.NSTotalBid.visible = false;
                    this.contractSuitType.visible = false;
                    this.contractTextValue.visible = false;
                    this.contractTeam.visible = false;
                }
                else {
                    console.log(data, "datascore enter")
                    if (this.model.teamName == "A") {
                        ModelLocator.team = "A";
                        ModelLocator.aNew = data.points.A;
                        ModelLocator.bNew = data.points.B;
                        if (ModelLocator.aNew - ModelLocator.aOld !== 0) {
                            ModelLocator.ateamHand.push(ModelLocator.counter);
                        }
                        else if (ModelLocator.bNew - ModelLocator.bOld !== 0) {
                            ModelLocator.bteamHand.push(ModelLocator.counter);
                        }
                        ModelLocator.aOld = data.points.A;
                        ModelLocator.bOld = data.points.B;
                    }
                    else if (this.model.teamName == "B") {
                        ModelLocator.team = "B";
                        ModelLocator.aNew = data.points.A;
                        ModelLocator.bNew = data.points.B;

                        if (ModelLocator.aNew - ModelLocator.aOld !== 0) {
                            ModelLocator.ateamHand.push(ModelLocator.counter);
                        }
                        else if (ModelLocator.bNew - ModelLocator.bOld !== 0) {
                            ModelLocator.bteamHand.push(ModelLocator.counter);
                        }
                        ModelLocator.aOld = data.points.A;
                        ModelLocator.bOld = data.points.B;
                    }

                    console.log(ModelLocator.ateamHand, ModelLocator.bteamHand, "ateamhead")
                    if (this.model.teamName == "A") {
                        this.NSTotalBidWon.text = data.points.A;
                        this.WETotalBidWon.text = data.points.B;
                    }
                    else if (this.model.teamName == "B") {
                        console.log("round score ", data)
                        this.NSTotalBidWon.text = data.points.A;
                        this.WETotalBidWon.text = data.points.B;
                    }

                    console.log('the team points are', ModelLocator.aNew,
                        ModelLocator.bNew);
                    this.turnHand++;
                }

            }

            else {
                ModelLocator.bteamHand = [];
                ModelLocator.ateamHand = [];
                ModelLocator.counter = 0;
                ModelLocator.aNew = 0;
                ModelLocator.aOld = 0;
                ModelLocator.bNew = 0;
                ModelLocator.bOld = 0;
            }

        });
        this.gameComp.gamePlaySubscriptions.push(temp);

    }

    subscribeToBidWon() {

        let temp = this.socketScv.bidWinner.subscribe((data: any) => {

            if (data) {

                console.log("playerData===>",this.model.playerData);
                this.model.bidWinner = data.dbId;

               

                this.graphics.visible = true;
                this.ContractText.visible = true;
                this.NSText.visible = true;
                this.WEText.visible = true;
                this.ContractText.text="Contract :"
                this.NSText.text="WE:";
                this.WEText.text="NS:";

                this.contractSuitType.visible = true;
                this.contractTextValue.visible = true;
                this.contractTeam.visible = true;
                this.contractTextValue.text = data.bid.toString();

                this.model.contractBidText = data.bid.toString();

                this.contractTeam.text="("+data.direction.slice(0,1)+")";

                if(data.direction=="East" || data.direction=="West"){

                    this.NSTotalBid.text = '  ['  + (6 + data.bid).toString()+"]";
                    this.NSTotalBidWon.text = '0';
                    this.WETotalBidWon.text = '0';
                    // this.NSText.text="NS";
                    // this.WEText.text="WE";
                    this.WETotalBid.visible = false;
                    this.NSTotalBidWon.visible = true;
                    this.WETotalBidWon.visible = true;
                    this.NSTotalBid.visible = true;
                    

                }
                else if(data.direction=="North" || data.direction=="South"){

                    this.WETotalBid.text = '  [' + (6 + data.bid).toString()+"]";
                    
                    this.WETotalBidWon.text = '0';
                    this.NSTotalBidWon.text = '0';
                    // this.NSText.text="WE";
                    // this.WEText.text="NS";
                    this.NSTotalBid.visible = false;
                    this.WETotalBid.visible = true;
                    this.NSTotalBidWon.visible = true;
                    this.WETotalBidWon.visible = true;

                }
                switch (data.type) {
                    case 'diamonds':
                        this.contractSuitType.destroy();

                        this.model.contractBidSuit="diamonds"

                        this.contractSuitType = this.add.image((this.game.scale.width / 40) * 15.2, (this.game.scale.height / 40) * 4.2, 'diamonds').setOrigin(0.5).setInteractive();

                        break;

                    case 'clubs':

                        this.model.contractBidSuit="clubs"

                        this.contractSuitType.destroy();
                        this.contractSuitType = this.add.image((this.game.scale.width / 40) * 15.2, (this.game.scale.height / 40) * 4.2, 'clubs').setOrigin(0.5).setInteractive();

                        break;

                    case 'hearts':

                        this.model.contractBidSuit="hearts"


                        this.contractSuitType.destroy();
                        this.contractSuitType = this.add.image((this.game.scale.width / 40) * 15.2, (this.game.scale.height / 40) * 4.2, 'hearts').setOrigin(0.5).setInteractive();

                        break;

                    case 'spades':

                        this.model.contractBidSuit="spades"


                        this.contractSuitType.destroy();
                        this.contractSuitType = this.add.image((this.game.scale.width / 40) * 15.2, (this.game.scale.height / 40) * 4.2, 'spades').setOrigin(0.5).setInteractive();

                        break;

                    case 'notrump':
                        this.model.contractBidSuit="NT"
                        
                        this.contractSuitType.destroy();
                        this.contractTextValue.text =  this.contractTextValue.text + 'NT';
                }

            }

        });
        this.gameComp.gamePlaySubscriptions.push(temp);

    }

}
