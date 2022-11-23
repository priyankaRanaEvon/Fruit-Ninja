//react Event
declare function sendUserDirection(element: any): any;
export class Cards extends Phaser.Scene {
    //Primary variable
    gameComp: any; socketScv: any; model: any;

    //Secondary variable
    card1: any; myPlayingTurn: boolean = true; dragObj: any;
    selectedCardOriginalPos: any; tablePosition: any;
    player1Card: any; player2Card: any; player3Card: any; player4Card: any; dummyseat: any;
    handCount = 0; dummyTurn: boolean = true; roundCounter: number = 1; cardNo = 0;
    bidBox1: any; bidSuit1: any; bidNum1: any; BidSeat: any; bidBox2: any
    bidSuit2: any; bidNum2: any; bidBox3: any; bidSuit3: any;
    bidNum3: any; bidBox4: any; bidSuit4: any; bidNum4: any;
    chatBox1: any; chatBox2: any; chatBox3: any; chatBox4: any;
    chat1: any; chat2: any; chat3: any; chat4: any;
    cardsArray: any = []; myCards: any = []; dummyPlayerCards: any = []; dummyPlayerCard: any = [];
    player2: any = []; player3: any = []; player4: any = []; playerDirection: any = { id: 1, direction: 'none' };

    name1: any; name2: any; name3: any; name4: any;
    dummyCardId: any = [];
    sortedCard: any = [];
    dummy1: any; dummy2: any; dummy3: any; dummy4: any;
    playDummy: any;


    constructor(handle: any, gameComp: any, socket: any, model: any) {
        super(handle);
        this.gameComp = gameComp;
        this.socketScv = socket;
        this.model = model;
    }


    create() {
        //Table Position
        this.tablePosition = { x: this.game.scale.width / 1.8, y: this.game.scale.height / 1.7 };
        this.playDummy = this.add.text(this.game.scale.width / 1.8, (this.game.scale.height / 1.5 - (this.game.scale.height / 8)), "Please Play Dummy’s Card", { font: '40px Conv_NetflixSansBold', color: '#FF0000', align: "center" }).setOrigin(0.5, 0);
        this.playDummy.setFontSize((this.game.scale.width / 250) + 'ex');
        this.playDummy.visible = false;

        this.subscribeToServices();
    }

    subscribeToServices() {
        //Get the Bid value
        this.subscribeToBid();
        //Get new card of player
        this.subscribeToNewCard();
        //Get card status active or not
        this.subscribeToCardStatusUpdate();
        //Get Dummy Player cards
        this.subscribeToDummyPlayerCard();
        //Get my turn to play
        this.subscribeToMyTurnToPlay();
        //subscribe to card played by other player
        this.subscribeToPlayedCard();
        //subsccribe to hand won by player
        this.subscribeToHandWin();
        //redistribute cards
        this.reDisrtibuteCards();
        //chat with player
        this.subscribeToChat();

        this.subscribeToNameDirection()


    }


    subscribeToBid() {
        let temp = this.socketScv.setBid.subscribe((data: any) => {

            if (data) {
                console.log('subscribed to bid', data);
                this.ModificationBid(data.bid, data.type);
                this.placeBidOnTheTable(data);
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToNameDirection() {

        let temp = this.socketScv.nameDirection.subscribe((data: any) => {
            if (data) {
                this.playerDirection.id = data.dbId;
                this.playerDirection.direction = data.direction;
                //react Event
                // sendUserDirection(this.playerDirection);
                console.log('subscribed to Name and direction', this.playerDirection);
                // this.placeNameAndDirection(data);
                // console.log('subscribed to Name and direction', this.playerDirection);
                if (this.model.nameCount < 4) {
                    
                    this.placeNameAndDirection(data);
                   
                    console.log("player name on table");
                    this.model.nameCount++;
                }
                // this.model.playerData.push(data);

            }
        }
        );
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToNewCard() {
        let temp = this.socketScv.newCard.subscribe((data: any) => {
            if (data) {
                if (this.cardsArray.length < 13) {
                    this.myCards.push(data);
                    // console.log("card received ", data, this.myCards.length, this.roundCounter);

                    this.model.myCards.push(data);
                    // if(this.roundCounter >= 2) {
                   this.showMyCards();
                  
                  
                    // }
                    // this.socketScv.newCard.next();
                }
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToCardStatusUpdate() {
        let temp = this.socketScv.updateCardStatus.subscribe((data: any) => {
            if (data) {

                if (this.model.userServerIndex == data.index && !this.model.areYouDummy) {
                    for (let card of this.cardsArray) {
                        if (card.id == data.id) {
                            card.isActive = data.isActive;
                        }
                        if (!card.isActive) {
                            card.setTint(0xA9A9A9);
                        }
                        else {
                            card.clearTint();
                        }
                    }
                }
                else {
                    for (let card of this.dummyPlayerCards) {
                        if (card.id == data.id) {
                            card.isActive = data.isActive;
                        }
                        if (!card.isActive) {
                            card.setTint(0xA9A9A9);
                        }
                        else {
                            card.clearTint();
                        }
                    }
                }
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToDummyPlayerCard() {
        let temp = this.socketScv.getDummyPlayerCard.subscribe((data: any) => {
            if (data) {
                this.dummyPlayerCard = data.cards;
                for (var i = 0; i < this.dummyPlayerCard.length; i++) {
                    this.dummyCardId.push(data.cards[i].id);
                }
                this.sortedCard = this.dummyCardId.sort((a: number, b: number) => b - a);
                // console.log('this are the dummy cards', this.dummyPlayerCard, this.sortedCard, data.cards);
                for (var i = 0; i < this.sortedCard.length; i++) {
                    // this.dummyPlayerCard[i].isActive = data.cards[i].id.isActive;
                    this.dummyPlayerCard[i].id = this.sortedCard[i];
                }

                // console.log('here is sorted idsss', this.sortedCard);

                for (var j = 0; j < this.model.allPlayers.length; j++) {
                    if (this.model.allPlayers[j].index == data.index) {
                        this.dummyseat = this.model.allPlayers[j].seat;
                    }
                }
                switch (this.dummyseat) {

                    case "1":
                        // this.name1.text=this.name1.text + " (Dummy)";
                        // this.name1.addColor("#ff0000",12);
                        this.dummy1 = this.add.text(this.name1.x + (this.name1.width / 10), this.name1.y + (this.name1.height), "(Dummy)", { font: '40px Conv_NetflixSansBold', color: '#ff0000', }).setOrigin(0, 0.5);
                        this.dummy1.setFontSize((this.game.scale.width / 450) + 'ex');

                        // this.dummy1.visible=true;
                        break;
                    case '2':
                        // this.name2.text=this.name2.text + " (Dummy)";
                        // this.dummy2.visible=true;
                        this.dummy2 = this.add.text(this.name2.x + (this.name2.width / 10), this.name2.y + (this.name2.height), "(Dummy)", { font: '40px Conv_NetflixSansBold', color: '#ff0000', }).setOrigin(0, 0.5);
                        this.dummy2.setFontSize((this.game.scale.width / 450) + 'ex');
                        for (var i = 0; i < data.cards.length; i++) {
                            this.player2[i].destroy();
                            this.player2[i] = this.add.image((this.game.scale.width / 40) * (15 + (1.2 * (i))), (this.game.scale.height / 40) * 11, this.dummyPlayerCard[i].id).setOrigin(0.5).setInteractive();
                            this.player2[i].setDisplaySize(((this.game.scale.width / 40) * 4) * 0.9, (this.game.scale.height / 40) * 7.5);
                            this.player2[i].selected = false;
                            this.player2[i].isActive = data.cards[i].id.isActive;
                            this.player2[i].id = this.dummyPlayerCard[i].id;
                            this.dummyPlayerCards[i] = (this.player2[i]);
                            this.player2[i].setTint(0xA9A9A9);
                        }

                        break;
                    case '3':
                        // this.name3.text=this.name3.text + " (Dummy)";
                        // this.dummy3.visible=true;
                        this.dummy3 = this.add.text(this.name3.x - (this.name3.height), this.name3.y + (this.name3.width / 10), "(Dummy)", { font: '40px Conv_NetflixSansBold', color: '#ff0000', }).setOrigin(0, 0.5).setAngle(90);
                        this.dummy3.setFontSize((this.game.scale.width / 450) + 'ex');

                        for (var i = 0; i < data.cards.length; i++) {
                            this.player3[i].destroy();
                            this.player3[i] = this.add.image((this.game.scale.width / 40) * 10, (this.game.scale.height / 40) * (15.5 + (1.6 * (i - 1))), this.dummyPlayerCard[i].id).setOrigin(0.5).setInteractive();
                            this.player3[i].setDisplaySize(((this.game.scale.width / 40) * 4) * 0.9, (this.game.scale.height / 40) * 7.5);
                            this.player3[i].rotation = 1.57;
                            this.player3[i].selected = false;
                            this.player3[i].isActive = data.cards[i].id.isActive;
                            this.player3[i].id = this.dummyPlayerCard[i].id;
                            this.dummyPlayerCards[i] = (this.player3[i]);
                            this.player3[i].setTint(0xA9A9A9);
                        }

                        break;
                    case '4':
                        // this.name4.text=this.name4.text + " (Dummy)";
                        // this.dummy4.visible=true
                        this.dummy4 = this.add.text(this.name4.x + (this.name4.height), this.name4.y + (this.name4.width / 10), "(Dummy)", { font: '40px Conv_NetflixSansBold', color: '#ff0000', }).setOrigin(0, 0.5).setAngle(90);;
                        this.dummy4.setFontSize((this.game.scale.width / 450) + 'ex');

                        for (var i = 0; i < data.cards.length; i++) {
                            this.player4[i].destroy();
                            this.player4[i] = this.add.image((this.game.scale.width / 40) * 35, (this.game.scale.height / 40) * (14 + (1.6 * (i))), this.dummyPlayerCard[i].id).setOrigin(0.5).setInteractive();
                            this.player4[i].setDisplaySize(((this.game.scale.width / 40) * 4) * 0.9, (this.game.scale.height / 40) * 7.5);
                            this.player4[i].rotation = 1.57;
                            this.player4[i].selected = false;
                            this.player4[i].isActive = data.cards[i].id.isActive;
                            this.player4[i].id = this.dummyPlayerCard[i].id;
                            this.dummyPlayerCards[i] = this.player4[i];
                            this.player4[i].setTint(0xA9A9A9);
                        }
                        break;

                }
                try {
                    this.bidBox1.destroy();
                    this.bidNum1.destroy();
                    if (this.bidSuit1) this.bidSuit1.destroy();
                    this.bidBox2.destroy();
                    this.bidNum2.destroy();
                    if (this.bidSuit2) this.bidSuit2.destroy();
                    this.bidBox3.destroy();
                    this.bidNum3.destroy();
                    if (this.bidSuit3) this.bidSuit3.destroy();
                    this.bidBox4.destroy();
                    this.bidNum4.destroy();
                    if (this.bidSuit4) this.bidSuit4.destroy();
                }
                catch (e) {
                    console.log('error are', e);
                }
                // console.log("Setting Interaction and Alpha");
                for (var i = 0; i < this.model.Bidcount; i++) {
                    // console.log('here is the active bids', this.model.BidEnable[i], i);
                    try {
                        this.model.BidEnable[i].setInteractive();
                        this.model.BidEnable[i].alpha = 1;
                    }
                    catch (e) {
                        console.log('set interactive error', e);
                    }
                }
                this.model.Bidcount = 0;
            }

        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToMyTurnToPlay() {
        let temp = this.socketScv.myPlayingTurn.subscribe((data: any) => {
            if (data >= 0) {
                console.log("it's my turn", data, data == this.model.userServerIndex)
                if (data == this.model.userServerIndex || data == this.model.userServerIndex + 2 ||
                    data == this.model.userServerIndex - 2) {
                    if ((data == this.model.userServerIndex)) {
                        this.myPlayingTurn = true;
                        this.dummyTurn = false;
                        this.playDummy.visible = false;

                    }

                    else {
                        if (this.model.bidWinner == this.model.userId) {
                            this.playDummy.text = "Play Dummy’s Card";
                            this.playDummy.visible = true;
                        }
                        this.dummyTurn = true;
                        this.myPlayingTurn = false;
                    }
                }
                else {
                    this.playDummy.visible = false;
                    this.dummyTurn = false;
                }
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToPlayedCard() {
        let temp = this.socketScv.playedCard.subscribe((data: any) => {
            if (data) {
                console.log("card played received in phaser ", data, data.card.card, data.card.suit);

                if (this.model.handComplete) {
                    this.playHandWinAnimation(data.seat);
                    this.model.handComplete = false;
                    setTimeout(() => {
                        this.destroyCurrentPlayingCards();
                        this.placeCardOnTheTable(data);
                        this.removeCardFromDeckIfExists(data);
                    }, 300)

                }
                else {
                    this.placeCardOnTheTable(data);
                    this.removeCardFromDeckIfExists(data);

                }

            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToHandWin() {
        let temp = this.socketScv.handWin.subscribe((data: any) => {
            if (data) {
                console.log('hand win received ', data)
                this.model.handComplete = true;
                // this.playHandWinAnimation(data.seat);
                this.socketScv.handWin.next();
                this.handCount++;
                this.myPlayingTurn = true;
                this.dummyTurn = true;
                if (this.handCount > 12) {
                    this.handCount = 0;
                    this.model.cardDistibuted = false;
                    this.player2 = [];
                    this.player3 = [];
                    this.player4 = [];
                    this.dummyPlayerCard = [];
                    this.playHandWinAnimation(data.seat);
                    this.dummyCardId = [];
                    this.sortedCard = [];
                    this.model.areYouDummy = false;
                    this.model.bidWin = false;
                    // this.model.blackBg = true;
                    this.model.bidDestroy = true;
                    if (this.dummy1) {
                        this.dummy1.destroy();
                    }
                    if (this.dummy2) {
                        this.dummy2.destroy();
                    }
                    if (this.dummy3) {
                        this.dummy3.destroy();
                    }
                    if (this.dummy4) {
                        this.dummy4.destroy();
                    }
                    if (this.scene.isActive('GameTimer')) {
                        this.scene.remove("GameTimer");
                        this.model.subscribeTimer.unsubscribe();
                    }
                    if (this.scene.isActive("GameArrow")) {
                        this.scene.remove("GameArrow");
                    }

                }
            }

        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }


    reDisrtibuteCards() {
        let temp = this.socketScv.reDisrtibute.subscribe((data: any) => {
            if (data) {
                console.log('card received redistributed>>>>>>>>>>>>>>>>');
                for (var i = 0; i < 13; i++) {
                    this.player2[i].destroy();
                    this.player3[i].destroy();
                    this.player4[i].destroy();
                    this.cardsArray[i].destroy();
                }
                this.player2 = [];
                this.player3 = [];
                this.player4 = [];
                this.cardsArray = [];
                this.myCards = [];
                this.model.reDisrtibuteCards = true;
                if (this.bidBox1) {
                    this.bidBox1.destroy();
                    this.bidNum1.destroy();
                    if (this.bidSuit1) this.bidSuit1.destroy();
                }
                if (this.bidBox2) {
                    this.bidBox2.destroy();
                    this.bidNum2.destroy();
                    if (this.bidSuit2) this.bidSuit2.destroy();
                }
                if (this.bidBox3) {
                    this.bidBox3.destroy();
                    this.bidNum3.destroy();
                    if (this.bidSuit3) this.bidSuit3.destroy();
                }
                if (this.bidBox4) {
                    this.bidBox4.destroy();
                    this.bidNum4.destroy();
                    if (this.bidSuit4) this.bidSuit4.destroy();
                }
            }
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    subscribeToChat() {
        let temp = this.socketScv.setMessage.subscribe((data: any) => {
            if (data)
                this.chatWithPlayer(data);
        });
        this.gameComp.gamePlaySubscriptions.push(temp);
    }

    placeNameAndDirection(data: any) {

        for (var j = 0; j < this.model.allPlayers.length; j++) {
            if (this.model.allPlayers[j].index == data.index) {
                this.BidSeat = this.model.allPlayers[j].seat;
                break;
            }
        }
        let direction, userName, temp;
        switch (this.BidSeat) {
            case "1":


                direction = data.direction.toString();
                userName = data.userName.toString();
                
                if (userName.length > 13) {
                    userName = userName.slice(0, 10) + "...";
                }
                this.name1 = this.add.text(this.tablePosition.x *1.095, this.tablePosition.y + (this.game.scale.height / 7.5), userName + "(" + direction.slice(0, 1) + ")", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                console.log("NameOfPlayer", this.model.playerNameData.length);
                this.name1.setFontSize((this.game.scale.width / 450) + 'ex');
                break
            case "2":

                direction = data.direction.toString();
                userName = data.userName.toString();
                
                if (userName.length > 13) {
                    userName = userName.slice(0, 10) + "...";
                }
                this.name2 = this.add.text(this.tablePosition.x * 0.75, this.tablePosition.y - (this.game.scale.height / 5.5), userName + "(" + direction.slice(0, 1) + ")", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                console.log("NameOfPlayer", this.model.playerNameData.length);
                this.name2.setFontSize((this.game.scale.width / 450) + 'ex');
                break
            case "3":

                direction = data.direction.toString();
                userName = data.userName.toString();
                // temp={"3":direction};
                //  this.model.playerDirection.push(temp);
                if (userName.length > 13) {
                    userName = userName.slice(0, 10) + "...";
                }
                this.name3 = this.add.text(this.tablePosition.x - ((this.game.scale.width / 40) * 9), this.tablePosition.y - (this.game.scale.height / 15), userName + "(" + direction.slice(0, 1) + ")", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5).setAngle(90);
                console.log("NameOfPlayer", this.model.playerNameData.length);
                this.name3.setFontSize((this.game.scale.width / 450) + 'ex');
                break;

            case "4":
                direction = data.direction.toString();
                userName = data.userName.toString();
                // temp={"4":direction};
                //  this.model.playerDirection.push(temp);
                if (userName.length > 13) {
                    userName = userName.slice(0, 10) + "...";
                }
                this.name4 = this.add.text(this.tablePosition.x + ((this.game.scale.width / 40) * 9), this.tablePosition.y - (this.game.scale.height / 15), userName + "(" + direction.slice(0, 1) + ")", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5).setAngle(90);
                console.log("NameOfPlayer", this.model.playerNameData.length);
                this.name4.setFontSize((this.game.scale.width / 450) + 'ex');
                break;

        }

    }

    placeBidOnTheTable(data: any) {
        for (var j = 0; j < this.model.allPlayers.length; j++) {
            if (this.model.allPlayers[j].index == data.index) {
                this.BidSeat = this.model.allPlayers[j].seat;
                break;
            }
        }
        switch (this.BidSeat) {
            case '1':
                if (this.bidBox1) {
                    this.bidBox1.destroy();
                    this.bidNum1.destroy();
                    if (this.bidSuit1) this.bidSuit1.destroy();
                }

                this.bidBox1 = this.add.image(this.tablePosition.x, this.tablePosition.y + (this.game.scale.height / 3), 'Chat_Top').setOrigin(0.5, 1);
                this.bidBox1.setDisplaySize(((this.game.scale.width / 40) * 3.8) * 1, (this.game.scale.height / 40) * 3.5);
                if (data.bid > 0) {
                    if (data.type == 'notrump')
                        this.bidNum1 = this.add.text(this.tablePosition.x * 0.97, this.tablePosition.y + (this.game.scale.height / 3.4), data.bid.toString() + "NT", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    else {
                        this.bidSuit1 = this.add.image(this.tablePosition.x * 1.01, this.tablePosition.y + (this.game.scale.height / 3.4), data.type).setOrigin(0.5);
                        this.bidNum1 = this.add.text(this.tablePosition.x * 0.97, this.tablePosition.y + (this.game.scale.height / 3.4), data.bid.toString(), { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    }
                    this.bidNum1.setFontSize((this.game.scale.width / 250) + 'ex');
                }
                else {
                    switch (data.type) {
                        case "pass":
                            this.bidNum1 = this.add.text(this.tablePosition.x * 0.96, this.tablePosition.y + (this.game.scale.height / 3.4), 'Pass', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum1.setFontSize((this.game.scale.width / 250) + 'ex');
                            break;
                        case "double":
                            this.bidNum1 = this.add.text(this.tablePosition.x * 0.95, this.tablePosition.y + (this.game.scale.height / 3.4), 'Double', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum1.setFontSize((this.game.scale.width / 280) + 'ex');

                            break;
                        case "redouble":
                            this.bidNum1 = this.add.text(this.tablePosition.x * 0.93, this.tablePosition.y + (this.game.scale.height / 3.4), 'ReDouble', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum1.setFontSize((this.game.scale.width / 300) + 'ex');
                    }

                }

                break;
            case '2':
                if (this.bidBox2) {
                    this.bidBox2.destroy();
                    this.bidNum2.destroy();
                    if (this.bidSuit2) this.bidSuit2.destroy();
                }

                this.bidBox2 = this.add.image(this.tablePosition.x, this.tablePosition.y - (this.game.scale.height / 4), 'Chat_Top').setOrigin(0.5, 1).setInteractive();

                this.bidBox2.setDisplaySize(((this.game.scale.width / 40) * 3.8) * 1, (this.game.scale.height / 40) * 3.5);
                if (data.bid > 0) {
                    if (data.type == 'notrump')
                        this.bidNum2 = this.add.text(this.tablePosition.x * 0.97, this.tablePosition.y - (this.game.scale.height / 3.5), data.bid.toString() + "NT", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    else {
                        this.bidSuit2 = this.add.image(this.tablePosition.x * 1.01, this.tablePosition.y - (this.game.scale.height / 3.5), data.type).setOrigin(0.5).setInteractive();
                        this.bidNum2 = this.add.text(this.tablePosition.x * 0.97, this.tablePosition.y - (this.game.scale.height / 3.5), data.bid.toString(), { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    }
                    this.bidNum2.setFontSize((this.game.scale.width / 250) + 'ex');
                }
                else {
                    switch (data.type) {
                        case "pass":
                            this.bidNum2 = this.add.text(this.tablePosition.x * 0.96, this.tablePosition.y - (this.game.scale.height / 3.5), 'Pass', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum2.setFontSize((this.game.scale.width / 250) + 'ex');
                            break;
                        case "double":
                            this.bidNum2 = this.add.text(this.tablePosition.x * 0.95, this.tablePosition.y - (this.game.scale.height / 3.5), "Double", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5); this.bidNum2.setFontSize((this.game.scale.width / 280) + 'ex');

                            break;
                        case "redouble":
                            this.bidNum2 = this.add.text(this.tablePosition.x * 0.93, this.tablePosition.y - (this.game.scale.height / 3.5), "ReDouble", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum2.setFontSize((this.game.scale.width / 300) + 'ex');
                    }
                }
                break;

            case '3':
                if (this.bidBox3) {
                    this.bidBox3.destroy();
                    this.bidNum3.destroy();
                    if (this.bidSuit3) this.bidSuit3.destroy();
                }

                this.bidBox3 = this.add.image(this.tablePosition.x - ((this.game.scale.width / 40) * 11.65), this.tablePosition.y + (this.game.scale.height / 40) * 1.75, 'Chat_Top').setOrigin(0.5, 1).setInteractive();

                this.bidBox3.setDisplaySize(((this.game.scale.width / 40) * 3.8) * 1, (this.game.scale.height / 40) * 3.5);
                if (data.bid > 0) {
                    if (data.type == 'notrump')
                        this.bidNum3 = this.add.text(this.tablePosition.x - ((this.game.scale.width / 40) * 12.5), this.tablePosition.y, data.bid.toString() + "NT", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    else {
                        this.bidSuit3 = this.add.image(this.tablePosition.x - ((this.game.scale.width / 40) * 11.5), this.tablePosition.y, data.type).setOrigin(0.5).setInteractive();
                        this.bidNum3 = this.add.text(this.tablePosition.x - ((this.game.scale.width / 40) * 12.5), this.tablePosition.y, data.bid.toString(), { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    }
                    this.bidNum3.setFontSize((this.game.scale.width / 250) + 'ex');
                }
                else {
                    switch (data.type) {
                        case "pass":
                            this.bidNum3 = this.add.text(this.tablePosition.x - ((this.game.scale.width / 40) * 12.5), this.tablePosition.y, 'Pass', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum3.setFontSize((this.game.scale.width / 250) + 'ex');
                            break;
                        case "double":
                            this.bidNum3 = this.add.text(this.tablePosition.x - ((this.game.scale.width / 40) * 13), this.tablePosition.y, 'Double', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum3.setFontSize((this.game.scale.width / 280) + 'ex');

                            break;
                        case "redouble":
                            this.bidNum3 = this.add.text(this.tablePosition.x - ((this.game.scale.width / 40) * 13.2), this.tablePosition.y, 'ReDouble', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum3.setFontSize((this.game.scale.width / 300) + 'ex');
                    }
                }

                break;
            case '4':
                if (this.bidBox4) {
                    this.bidBox4.destroy();
                    this.bidNum4.destroy();
                    if (this.bidSuit4) this.bidSuit4.destroy();
                }
                this.bidBox4 = this.add.image(this.tablePosition.x + ((this.game.scale.width / 40) * 12.25), this.tablePosition.y + (this.game.scale.height / 40) * 1.8, 'Chat_Top').setOrigin(0.5, 1).setInteractive();

                this.bidBox4.setDisplaySize(((this.game.scale.width / 40) * 3.8) * 1, (this.game.scale.height / 40) * 3.5);

                if (data.bid > 0) {
                    if (data.type == 'notrump')
                        this.bidNum4 = this.add.text(this.tablePosition.x + ((this.game.scale.width / 40) * 11.5), this.tablePosition.y, data.bid.toString() + "NT", { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    else {
                        this.bidSuit4 = this.add.image(this.tablePosition.x + ((this.game.scale.width / 40) * 12.5), this.tablePosition.y, data.type).setOrigin(0.5).setInteractive();
                        this.bidNum4 = this.add.text(this.tablePosition.x + ((this.game.scale.width / 40) * 11.5), this.tablePosition.y, data.bid.toString(), { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                    }

                    this.bidNum4.setFontSize((this.game.scale.width / 250) + 'ex');
                }
                else {
                    switch (data.type) {
                        case "pass":
                            this.bidNum4 = this.add.text(this.tablePosition.x + ((this.game.scale.width / 40) * 11.5), this.tablePosition.y, 'Pass', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum4.setFontSize((this.game.scale.width / 250) + 'ex');
                            break;
                        case "double":
                            this.bidNum4 = this.add.text(this.tablePosition.x + ((this.game.scale.width / 40) * 11), this.tablePosition.y, 'Double', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum4.setFontSize((this.game.scale.width / 280) + 'ex');

                            break;
                        case "redouble":
                            this.bidNum4 = this.add.text(this.tablePosition.x + ((this.game.scale.width / 40) * 10.8), this.tablePosition.y, 'ReDouble', { font: '40px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                            this.bidNum4.setFontSize((this.game.scale.width / 300) + 'ex');
                    }

                }
                break;

        }

    }



    placeCardOnTheTable(data: any) {
        console.log('card on the table is', data.card.card, data.card.suit);
        this.model.contractOnTable = false;
        switch (data.seat) {
            case '1':
                if (this.player1Card) {
                    this.player1Card.destroy();
                }
                this.player1Card = this.add.image(this.tablePosition.x, this.tablePosition.y + (this.game.scale.height / 5), data.card.id).setOrigin(0.5, 1).setInteractive();
                this.player1Card.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.8, (this.game.scale.height / 40) * 7);
                break;
            case '2':
                if (this.player2Card) {
                    this.player2Card.destroy();
                }
                this.player2Card = this.add.image(this.tablePosition.x, this.tablePosition.y - (this.game.scale.height / 40) * 2, data.card.id).setOrigin(0.5, 1).setInteractive();
                this.player2Card.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.8, (this.game.scale.height / 40) * 7);
                if (this.dummyseat == '2') {
                    for (var i = 0; i < this.dummyPlayerCard.length; i++) {
                        if (this.dummyPlayerCard[i].id == data.card.id) {
                            this.player2[i].destroy();
                            break;
                        }
                    }
                }
                else {
                    this.player2[this.handCount].destroy();
                }

                break;
            case '3':
                if (this.player3Card) {
                    this.player3Card.destroy();
                }
                this.player3Card = this.add.image(this.tablePosition.x - ((this.game.scale.width / 40) * 7), this.tablePosition.y + (this.game.scale.height / 40) * 2, data.card.id).setOrigin(0.5, 1).setInteractive();
                this.player3Card.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.8, (this.game.scale.height / 40) * 7);
                if (this.dummyseat == '3') {
                    for (var i = 0; i < this.dummyPlayerCard.length; i++) {
                        if (this.dummyPlayerCard[i].id == data.card.id) {
                            this.player3[i].destroy();
                            break;
                        }
                    }
                }
                else {
                    this.player3[this.handCount].destroy();
                }

                break;
            case '4':
                if (this.player4Card) {
                    this.player4Card.destroy();
                }
                this.player4Card = this.add.image(this.tablePosition.x + ((this.game.scale.width / 40) * 7), this.tablePosition.y + (this.game.scale.height / 40) * 2, data.card.id).setOrigin(0.5, 1).setInteractive();
                this.player4Card.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.8, (this.game.scale.height / 40) * 7);

                if (this.dummyseat == '4') {
                    for (var i = 0; i < this.dummyPlayerCard.length; i++) {
                        if (this.dummyPlayerCard[i].id == data.card.id) {
                            this.player4[i].destroy();
                            break;
                        }
                    }
                }
                else {
                    this.player4[this.handCount].destroy();
                }
                break;

        }
    }
    removeCardFromDeckIfExists(cardData: any) {
        for (let card of this.cardsArray) {
            if (card.id == cardData.card.id) {
                // let tempCard = card;
                this.cardsArray.splice(this.cardsArray.indexOf(card), 1);
                // tempCard.destroy();
                // tempCard = null;
                card.destroy();

            }
        }
    }

    playHandWinAnimation(seat: any) {

        let targetPositions = [{ x: this.tablePosition.x, y: this.tablePosition.y + (this.game.scale.height / 2.5) },
        { x: this.tablePosition.x, y: this.tablePosition.y - (this.game.scale.height / 40) * 9 },
        { x: this.tablePosition.x - ((this.game.scale.width / 40) * 12), y: this.tablePosition.y + (this.game.scale.height / 40) * 2 },
        { x: this.tablePosition.x + ((this.game.scale.width / 40) * 12.5), y: this.tablePosition.y + (this.game.scale.height / 40) * 2 }];

        let self = this;
        let card1Tween = self.tweens.add({
            targets: [self.player1Card],
            x: targetPositions[parseInt(seat) - 1].x,
            y: targetPositions[parseInt(seat) - 1].y,
            scale: 0,
            ease: 'linear',
            duration: 300,
            yoyo: false,
            onComplete(cardTween) {
                cardTween.stop();
            }
        });

        let card2Tween = self.tweens.add({
            targets: [self.player2Card],
            x: targetPositions[parseInt(seat) - 1].x,
            y: targetPositions[parseInt(seat) - 1].y,
            scale: 0,
            ease: 'linear',
            duration: 300,
            yoyo: false,
            onComplete(cardTween) {
                cardTween.stop();
            }
        });

        let card3Tween = self.tweens.add({
            targets: [self.player3Card],
            x: targetPositions[parseInt(seat) - 1].x,
            y: targetPositions[parseInt(seat) - 1].y,
            scale: 0,
            ease: 'linear',
            duration: 300,
            yoyo: false,
            onComplete(cardTween) {
                cardTween.stop();
            }
        });

        let card4Tween = self.tweens.add({
            targets: [self.player4Card],
            x: targetPositions[parseInt(seat) - 1].x,
            y: targetPositions[parseInt(seat) - 1].y,
            scale: 0,
            ease: 'linear',
            duration: 300,
            yoyo: false,
            onComplete(cardTween) {
                cardTween.stop();
                // self.destroyCurrentPlayingCards();
            }
        });


    }

    destroyCurrentPlayingCards() {
        if (this.player1Card)
            this.player1Card.destroy();
        if (this.player2Card)
            this.player2Card.destroy();
        if (this.player3Card)
            this.player3Card.destroy();
        if (this.player4Card)
            this.player4Card.destroy();
    }

    showMyCards() {
        for (var j = 1; j <= this.myCards.length; j++) {
            this.card1 = this.add.image((this.game.scale.width / 40) * (15 + (1.2 * (j - 1))), (this.game.scale.height / 40) * 35, this.myCards[j - 1].id).setOrigin(0.5).setInteractive();
            this.card1.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.9, (this.game.scale.height / 40) * 7.5);

            this.card1.selected = false;
            this.card1.isActive = this.myCards[j - 1].isActive;
            this.card1.id = this.myCards[j - 1].id;
            this.cardsArray.push(this.card1);
            this.model.mycardArray.push(this.card1);


        }
        this.input.on('pointerdown', this.startDrag, this);
        this.myCards = [];
        this.rearrangeRemainingCards(1000);

        if (this.cardNo < 1) {
            this.creatOtherPlayerCards();
        }
        if (this.cardNo < 12) {
            this.cardNo++;
        }
        else {
            this.cardNo = 0;
        }

        // console.log("showing cards after listening to event emitter",  this.cardsArray);
    }

    creatOtherPlayerCards() {
        console.log('player cards are created');

        for (var j = 0; j < 13; j++) {
            // console.log(((this.game.scale.width / 40) * 4) * 1, (this.game.scale.height / 40) * 8);
            var card2 = this.add.image((this.game.scale.width / 40) * (15 + (1.2 * (j))), (this.game.scale.height / 40) * 11, '0').setOrigin(0.5).setInteractive();
            card2.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.9, (this.game.scale.height / 40) * 7.5);
            this.player2.push(card2);
        }

        for (var j = 0; j < 13; j++) {
            // console.log(((this.game.scale.width / 40) * 4) * 1, (this.game.scale.height / 40) * 8);
            var card3 = this.add.image((this.game.scale.width / 40) * 10.5, (this.game.scale.height / 40) * (15.5 + (1.6 * (j - 1))), '0').setOrigin(0.5).setInteractive();
            card3.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.9, (this.game.scale.height / 40) * 7.5);
            card3.rotation = 1.57;
            this.player3.push(card3);

        }

        for (var j = 0; j < 13; j++) {
            // console.log(((this.game.scale.width / 40) * 4) * 1, (this.game.scale.height / 40) * 8);
            var card4 = this.add.image((this.game.scale.width / 40) * 34.5, (this.game.scale.height / 40) * (14 + (1.6 * (j))), '0').setOrigin(0.5).setInteractive();
            card4.setDisplaySize(((this.game.scale.width / 40) * 4) * 0.9, (this.game.scale.height / 40) * 7.5);
            card4.rotation = 1.57;
            this.player4.push(card4);
        }

    }
    startDrag(pointer: any, targets: any) {
        if ((this.cardsArray.includes(targets[0]) || this.dummyPlayerCards.includes(targets[0])) && (this.myPlayingTurn || this.dummyTurn) && (!this.model.areYouDummy)) {
            this.input.off('pointerdown', this.startDrag, this);
            this.dragObj = targets[0];
            this.input.on('pointerup', this.stopDrag, this);
        }
        else if ((this.cardsArray.includes(targets[0]) || this.dummyPlayerCards.includes(targets[0])) && (this.myPlayingTurn || this.dummyTurn) && (this.model.areYouDummy)) {
            this.model.message = "You Can't Play Your Turn as you are Dummy Player.";
            this.model.messagePopupVisible = true;
            setTimeout(() => {
                this.model.messagePopupVisible = false;
            }, 3000);

        }
    }

    doDrag(pointer: any) {

    }

    stopDrag() {
        // console.log('the function called is do stop drag pointer', this.myPlayingTurn, this.dummyTurn);
        this.input.on('pointerdown', this.startDrag, this);
        this.input.off('pointerup', this.stopDrag, this);

        if (this.dragObj) {
            this.dragObj.alpha = 1;
            let myself = this;
            if (myself.myPlayingTurn || myself.dummyTurn) {
                // console.log('Dummy player check', myself.dragObj.isActive);
                if (myself.dragObj.isActive) {
                    if (myself.myPlayingTurn) {
                        // console.log('Dummy player is not selected');
                        myself.gameComp.sendSelectedCard(myself.dragObj.id, myself.model.userServerIndex);
                        myself.myPlayingTurn = false;
                        for (let card of myself.cardsArray) {
                            card.setFrame(0);
                        }
                    }
                    else {
                        // console.log('Dummy player is selected',  myself.dragObj.isActive);
                        myself.gameComp.sendSelectedCard(myself.dragObj.id, myself.model.DummyPlayerIndex);
                        for (let card of myself.cardsArray) {
                            card.setFrame(0);
                        }
                    }

                }
                else {
                    // console.log('the function called is do stop drag pointer else case main');
                }

                myself.dragObj = null;
            }
            else {
                // console.log('the function called is do stop drag pointer else case main');
                if (myself.selectedCardOriginalPos) {
                    myself.dragObj = null;
                }
            }
        }
    }

    rearrangeRemainingCards(duration: any) {

        // console.log("rearranging cards ", this.cardsArray.length)
        let targetX = 0;

        if (this.cardsArray.length > 1) {
            this.cardsArray.forEach((cardInstance: any) => {
                let index = this.cardsArray.indexOf(cardInstance);

                // console.log("updating position ", index)
                // targetX = index * ((((this.game.scale.width/2-((this.game.scale.width/40) * 36)) +((this.game.scale.width/40) * 30)) - this.cardsArray[0].displayWidth) / (this.cardsArray.length - 1));
                // targetX = ((this.game.scale.width/2-((this.game.scale.width/40) * 36/2))+((this.game.scale.width/40) * 6)) + (index * (((this.game.scale.width/40) * 30)/(this.cardsArray.length)));
                targetX = ((this.game.scale.width / 40) * (15 + (1.2 * ((index + 1) - 1))));

                let self = this;
                let tempTween = self.tweens.add({
                    targets: [cardInstance],
                    x: targetX,
                    ease: 'Back.easeOut',
                    duration: duration,
                    yoyo: false,
                    onComplete: function () {
                        tempTween.stop();
                        // console.log("complete 1");
                    }
                });
            });
        }
    }

    disableCards(id: string, trumps: string) {
        console.log('Face : ', id, ' and Trumps : ', trumps);
    }
    ModificationBid(id: string, suit: string) {
        const bidarray = this.model.playerBids;
        // console.log("Modification Msg : ", id, suit);
        // 2 Diamonds
        if (suit != 'pass' && suit != 'double' && suit != 'redouble') {
            for (var i = 0; i < this.model.playerBids.length; i++) {
                if (bidarray[i].id != id || bidarray[i].suit != suit) {
                    //  1 club, 1 Diamonds, 1 Hearts -> 
                    // console.log("BidArray Id : ", bidarray[i].id);
                    // console.log("BidArray Suit : ", bidarray[i].suit);
                    //   this.model.BidEnable.push(bidarray[i].pid);
                    this.model.BidEnable[i].disableInteractive();
                    this.model.BidEnable[i].alpha = 0.5;
                    this.model.Bidcount++;
                } else {
                    // console.log("Inside Else Condition");
                    this.model.BidEnable[i].disableInteractive();
                    this.model.BidEnable[i].alpha = 0.5;
                    this.model.Bidcount++;
                    //   this.model.BidEnable.push(bidarray[i].pid);
                    break;
                }
            }
        }
        // console.log('BidEnable : ', this.model.BidEnable);
        // console.log('BidEnable Length : ', this.model.BidEnable.length);
    }




    // Chat with Player
    chatWithPlayer(data: any) {
        // console.log("chatWithPlayerCalled", data.msg);
        


        for (var j = 0; j < this.model.allPlayers.length; j++) {
            if (this.model.allPlayers[j].index == data.msg.playerIndex) {
                this.BidSeat = this.model.allPlayers[j].seat;
                console.log("bidSeat==>", this.BidSeat);
                break;
            }

        }

        let boxSize = 1;
        let messageLength = data.msg.text.length
        console.log("message======>", messageLength);

      
        switch (this.BidSeat) {
            case '1':
                if (this.chatBox1) {
                    this.chatBox1.destroy();
                    this.chat1.destroy();
                    // if (this.bidSuit1) this.bidSuit1.destroy();
                }

                this.chatBox(this.tablePosition.x, this.tablePosition.y + (this.game.scale.height / 5), data.msg.text, 1);


                // this.chatBox1 = this.add.image(this.tablePosition.x, this.tablePosition.y + (this.game.scale.height / 5), 'Chat_Bottom').setOrigin(0.5, 1);
                // this.chatBox1.setDisplaySize(((this.game.scale.width / 40) * 5.5) * (messageLength/10)*0.8, (this.game.scale.height / 40) * 3.3);

                // this.chat1 = this.add.text(this.tablePosition.x -(messageLength*4.5), this.tablePosition.y + (this.game.scale.height / 7), data.msg.text, { font: '30px Conv_NetflixSansBold', color: '#00000', align: 'center', }).setOrigin(0, 0.5);
                // this.chat1.setFontSize((this.game.scale.width / 500) + 'ex');
                break;

            case '2':
                if (this.chatBox2) {
                    this.chatBox2.destroy();
                    this.chat2.destroy();

                }
                this.chatBox(this.tablePosition.x, this.tablePosition.y - (this.game.scale.height/2.5), data.msg.text, 2);


                // this.chatBox2 = this.add.image(this.tablePosition.x, this.tablePosition.y - (this.game.scale.height / 10), 'Chat_Top').setOrigin(0.5, 1).setInteractive();

                // this.chatBox2.setDisplaySize(((this.game.scale.width / 40) * 5.5) * (messageLength / 10) * 0.8, (this.game.scale.height / 40) * 3.3);
                // {

                //     this.chat2 = this.add.text(this.tablePosition.x - (messageLength * 5), this.tablePosition.y - (this.game.scale.height / 7.2), data.msg.text, { font: '30px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.5);
                //     this.chat2.setFontSize((this.game.scale.width / 500) + 'ex');
                // }


                break;
            case '3':
                if (this.chatBox3) {
                    this.chatBox3.destroy();
                    this.chat3.destroy();
                }
                this.chatBox(this.tablePosition.x - ((this.game.scale.width / 40) *13.5), this.tablePosition.y- (this.game.scale.height/10)  , data.msg.text, 3);
                

                // this.chatBox3 = this.add.image(this.tablePosition.x - ((this.game.scale.width / 40) * 10), this.tablePosition.y + (this.game.scale.height / 40) * 2, 'Chat_Left').setOrigin(0, 1).setInteractive();

                // this.chatBox3.setDisplaySize(((this.game.scale.width / 40) * 6) * (messageLength / 10) * 0.75, (this.game.scale.height / 40) * 3.3);
                // {
                //     this.chat3 = this.add.text(this.chatBox3.x + (messageLength * 4), this.tablePosition.y, data.msg.text, { font: '30px Conv_NetflixSansBold', color: '#00000', }).setOrigin(0, 0.4);
                //     this.chat3.setFontSize((this.game.scale.width / 500) + 'ex');
                // }

                break;
            case '4':
                if (this.chatBox4) {
                    this.chatBox4.destroy();
                    this.chat4.destroy();
                    // if (this.bidSuit4) this.bidSuit4.destroy();
                }
                this.chatBox(this.tablePosition.x + ((this.game.scale.width / 40) * 10.3), this.tablePosition.y - (this.game.scale.height / 10) , data.msg.text, 4);


                // this.chatBox4 = this.add.image(this.tablePosition.x + ((this.game.scale.width / 40) * 9), this.tablePosition.y + (this.game.scale.height / 40) * 2, 'Chat_Right').setOrigin(1, 1).setInteractive();

                // this.chatBox4.setDisplaySize(((this.game.scale.width / 40) * 6) * (messageLength / 10) * 0.7, (this.game.scale.height / 40) * 3.3);
                // {
                //     this.chat4 = this.add.text(this.chatBox4.x - (messageLength * 15), this.tablePosition.y, data.msg.text, { font: '30px Conv_NetflixSansBold', color: '#00000', align: 'right' }).setOrigin(0, 0.5);
                //     this.chat4.setFontSize((this.game.scale.width / 500) + 'ex');
                // }
                // this.tablePosition.x + (((this.game.scale.width / 40) *8)/(messageLength/5.5))
                break;

        }
        if (this.chatBox1) {
            setTimeout(()=>{
                this.chatBox1.destroy();
                    this.chat1.destroy();
            },10000)
        }
        if (this.chatBox2) {
            setTimeout(()=>{
                this.chatBox2.destroy();
                    this.chat2.destroy();
            },20000)
        }
        if (this.chatBox3) {
            setTimeout(()=>{
                this.chatBox3.destroy();
                    this.chat3.destroy();
            },20000)
        }
        if (this.chatBox4) {
            setTimeout(()=>{ 
                this.chatBox4.destroy();
                    this.chat4.destroy();
            },20000)
        }


        // setTimeout(() => {
        //     try {
        //         if (this.chatBox1) {
        //             this.chatBox1.destroy();
        //             this.chat1.destroy();
        //         }

        //         if (this.chatBox2) {
        //             this.chatBox2.destroy();
        //             this.chat2.destroy();
        //         }

        //         if (this.chatBox3) {
        //             this.chatBox3.destroy();
        //             this.chat3.destroy();
        //         }

        //         if (this.chatBox4) {
        //             this.chatBox4.destroy();
        //             this.chat4.destroy();
        //         }
        //     }
        //     catch (e) {
        //         console.log(e);
        //     }

        // }, 5000);

    }
    chatBox(x: any, y: any, message: any, playerNum: any) {

        var bubbleWidth = message.length * 3;
        var bubbleHeight = message.length * 2;

        if (message.length < 15) {
           
            bubbleHeight = 60;
            bubbleWidth = 120
            console.log("H&W",window.innerHeight,window.innerWidth,this.game.scale.width)
            if(window.innerWidth <=800){
                console.log("less then 800")
                if(message.length < 8)
           {
            bubbleWidth = 180
            bubbleHeight = 60;
           }
           else{
            bubbleWidth = 155
            bubbleHeight = 110;
           }

                
            }
           

        }
        else if (message.length < 30) {
            bubbleHeight = 90;
            bubbleWidth = 200
            if(window.innerWidth <=800){
                bubbleWidth =220
                bubbleHeight = 150;

            }
        }
        else if (message.length < 60) {
            bubbleHeight = this.game.scale.height / 9.5;
            bubbleWidth = this.game.scale.width / 8;
        }
        else if (message.length < 90) {
            bubbleHeight = this.game.scale.height / 8.5;
            bubbleWidth = this.game.scale.width / 7;
        }
        else if (message.length < 130) {
            bubbleHeight = this.game.scale.height / 8;
            bubbleWidth = this.game.scale.width / 6;
        }
        else if (message.length < 150) {
            bubbleHeight = this.game.scale.height / 7.5;
            bubbleWidth = this.game.scale.width / 5.5;
        }
        else {
            bubbleHeight = this.game.scale.height / 6.2;
            bubbleWidth = this.game.scale.width / 5.5;
        }

        var bubblePadding = 10;
        var arrowHeight = bubbleHeight / 5;
        //  Calculate arrow coordinates
        var point1X = Math.floor(bubbleWidth / 7);
        var point1Y = bubbleHeight;
        var point2X = Math.floor((bubbleWidth / 7) * 2);
        var point2Y = bubbleHeight;
        var point3X = Math.floor(bubbleWidth / 7);
        var point3Y = Math.floor(bubbleHeight + arrowHeight);
        var b;

       
        switch (playerNum) {

            case 1:
                this.chatBox1 = this.add.graphics({ x: x, y: y*0.95 });

                //  Bubble shadow
                this.chatBox1.fillStyle(0x222222, 0.5);
                this.chatBox1.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

                //  Bubble color
                this.chatBox1.fillStyle(0xffffff, 1);

                //  Bubble outline line style
                this.chatBox1.lineStyle(10, 0x57e0fd, 1);

                //  Bubble shape and outline
                this.chatBox1.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);
                this.chatBox1.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);



               

                //  Bubble arrow fill
                this.chatBox1.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
                this.chatBox1.lineStyle(2, 0x57e0fd, 1);
                this.chatBox1.lineBetween(point2X, point2Y, point3X, point3Y);
                this.chatBox1.lineBetween(point1X, point1Y, point3X, point3Y);

                this.chat1 = this.add.text(0, 0, message, { fontFamily: 'Conv_NetflixSansBold', color: '#000000', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });


                // useAdvancedWrap: true,
                b = this.chat1.getBounds();

                this.chat1.setPosition(this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)) * 0.99);
                if(message.length<15){
                    this.chat1.setPosition((this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)) * 0.985)
                    if(window.innerWidth <=800 && message.length<8){
                    this.chat1.setPosition((this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2))*0.99, (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)) * 0.985)
                    }
                    else if(window.innerWidth <=800 && message.length<15){
                    this.chat1.setPosition((this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2))*0.985, (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)) * 0.985)

                    }
                    
                }
                else if(message.length<30){
                    this.chat1.setPosition(this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)) * 0.97)
                    if(window.innerWidth <=800 ){
                        this.chat1.setPosition((this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)) * 0.985)
    
                        }
                }
                if (message.length > 150) {
                    this.chat1.setFontSize((this.game.scale.width / 650) + 'ex');
                    this.chat1.setPosition(this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)));
                    if(window.innerWidth <=700 ){
                        this.chat1.setPosition((this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2))*1.05 )
    
                        }
                    else if(window.innerWidth <=800 ){
                        this.chat1.setPosition((this.chatBox1.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox1.y + (bubbleHeight / 2) - (b.height / 2)) * 0.93)
    
                        }
                    

                }
                else if (message.length > 100) {
                    this.chat1.setFontSize((this.game.scale.width / 600) + 'ex');


                }

                else {
                    this.chat1.setFontSize((this.game.scale.width / 500) + 'ex');

                }
                break

            case 2:
                this.chatBox2 = this.add.graphics({ x: x, y: y });

                //  Bubble shadow
                this.chatBox2.fillStyle(0x222222, 0.5);
                this.chatBox2.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

                //  Bubble color
                this.chatBox2.fillStyle(0xffffff, 1);

                //  Bubble outline line style
                this.chatBox2.lineStyle(10, 0x57e0fd, 1);

                //  Bubble shape and outline
                this.chatBox2.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);
                this.chatBox2.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);



               
                //  Bubble arrow fill
                this.chatBox2.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
                this.chatBox2.lineStyle(2, 0x57e0fd, 1);
                this.chatBox2.lineBetween(point2X, point2Y, point3X, point3Y);
                this.chatBox2.lineBetween(point1X, point1Y, point3X, point3Y);

                this.chat2 = this.add.text(0, 0, message, { fontFamily: 'Conv_NetflixSansBold', color: '#000000', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

                b = this.chat2.getBounds();

                this.chat2.setPosition(this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) * 0.985);
                if(message.length<15){
                    this.chat2.setPosition(this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) * 0.96)
                    if(window.innerWidth <=800 && message.length<8){
                    this.chat2.setPosition(this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2)*0.99, (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) * 0.96)
                        
                    }
                   else if(window.innerWidth <=800 && message.length<15){
                        this.chat2.setPosition((this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2))*0.985, (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) * 0.945)
    
                        }
                }
                else if(message.length<30){
                    this.chat2.setPosition(this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) * 0.95)
                    if(window.innerWidth <=800 ){
                        this.chat2.setPosition((this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) * 0.91)
    
                        }
                }
                if (message.length > 150) {
                    this.chat2.setFontSize((this.game.scale.width / 650) + 'ex');
                    if(window.innerWidth <=700 ){
                        this.chat2.setPosition((this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) *1.15)
    
                        }
                    else if(window.innerWidth <=800 ){
                        this.chat2.setPosition((this.chatBox2.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox2.y + (bubbleHeight / 2) - (b.height / 2)) * 0.87)
    
                        }

                }
                else if (message.length > 100) {
                    this.chat2.setFontSize((this.game.scale.width / 600) + 'ex');

                }

                else {
                    this.chat2.setFontSize((this.game.scale.width / 500) + 'ex');

                }
                
                break
            case 3:
                point1X = Math.floor(bubbleWidth / 10);
                point2X = Math.floor((bubbleWidth / 7) * 1.5);
                this.chatBox3 = this.add.graphics({ x: x, y: y });

                //  Bubble shadow
                this.chatBox3.fillStyle(0x222222, 0.5);
                this.chatBox3.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

                //  Bubble color
                this.chatBox3.fillStyle(0xffffff, 1);

                //  Bubble outline line style
                this.chatBox3.lineStyle(10, 0x57e0fd, 1);

                //  Bubble shape and outline
                this.chatBox3.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);
                this.chatBox3.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);

                //  Bubble arrow fill
                this.chatBox3.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
                this.chatBox3.lineStyle(2, 0x57e0fd, 1);
                this.chatBox3.lineBetween(point2X, point2Y, point3X, point3Y);
                this.chatBox3.lineBetween(point1X, point1Y, point3X, point3Y);

                this.chat3 = this.add.text(0, 0, message, { fontFamily: 'Conv_NetflixSansBold', color: '#000000', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

                b = this.chat3.getBounds();

                this.chat3.setPosition(this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)) * 0.99);
                this.chatBox3.setDepth(4);
                this.chat3.setDepth(5);
                if(message.length<15){
                    this.chat3.setPosition(this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)) * 0.978)
                    if(window.innerWidth <=800 ){
                        this.chat3.setPosition((this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2))*0.99, (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)) * 0.97)
    
                        }
                }
                else if(message.length<30){
                    this.chat3.setPosition(this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)) * 0.963)
                    if(window.innerWidth <=800 ){
                        this.chat3.setPosition((this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)) * 0.96)
    
                        }

                }
                if (message.length > 150) {
                    this.chat3.setFontSize((this.game.scale.width / 650) + 'ex');
                this.chat3.setPosition(this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)));
                if(window.innerWidth <=700 ){
                    this.chat3.setPosition((this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)) *1.07)

                    }  
                else if(window.innerWidth <=800 ){
                    this.chat3.setPosition((this.chatBox3.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox3.y + (bubbleHeight / 2) - (b.height / 2)) *0.92)

                    }  

                }
                else if (message.length > 100) {
                    this.chat3.setFontSize((this.game.scale.width / 600) + 'ex');

                }

                else {
                    this.chat3.setFontSize((this.game.scale.width / 500) + 'ex');

                }
                break

            case 4:
                point1X = Math.floor(bubbleWidth / 10);
                point2X = Math.floor((bubbleWidth / 7) * 1.5);
                this.chatBox4 = this.add.graphics({ x: x, y: y });

                //  Bubble shadow
                this.chatBox4.fillStyle(0x222222, 0.5);
                this.chatBox4.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

                //  Bubble color
                this.chatBox4.fillStyle(0xffffff, 1);

                //  Bubble outline line style
                this.chatBox4.lineStyle(10, 0x57e0fd, 1);

                //  Bubble shape and outline
                this.chatBox4.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);
                this.chatBox4.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);



               

                //  Bubble arrow fill
                this.chatBox4.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
                this.chatBox4.lineStyle(2, 0x57e0fd, 1);
                this.chatBox4.lineBetween(point2X, point2Y, point3X, point3Y);
                this.chatBox4.lineBetween(point1X, point1Y, point3X, point3Y);

                this.chat4 = this.add.text(0, 0, message, { fontFamily: 'Conv_NetflixSansBold', color: '#000000', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

                b = this.chat4.getBounds();

                this.chat4.setPosition(this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2)) * 0.99);

                this.chatBox4.setDepth(4);
                this.chat4.setDepth(5);
                if(message.length<15){
                   
                    this.chat4.setPosition(this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2)) * 0.978)
                    if(window.innerWidth <=800 ){
                        this.chat4.setPosition((this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2))*0.99, (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2) )* 0.97)
    
                        }
                }
                else if(message.length<30){
                    this.chat4.setPosition(this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2)) * 0.968)
                    if(window.innerWidth <=800 ){
                        this.chat4.setPosition((this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2)) * 0.96)
    
                        }
                }
                if (message.length > 150) {
                    this.chat4.setFontSize((this.game.scale.width / 650) + 'ex');
                    this.chat4.setPosition(this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2), (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2)));
                    if(window.innerWidth <=700 ){
                        this.chat4.setPosition((this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2) )* 1.07)
    
                        }
                    else if(window.innerWidth <=800 ){
                        this.chat4.setPosition((this.chatBox4.x + (bubbleWidth / 2) - (b.width / 2)), (this.chatBox4.y + (bubbleHeight / 2) - (b.height / 2) )* 0.92)
    
                        }

                }
                else if (message.length > 100) {
                    this.chat4.setFontSize((this.game.scale.width / 600) + 'ex');

                }

                else {
                    this.chat4.setFontSize((this.game.scale.width / 500) + 'ex');

                }
                break

        }
    }
}
