export class Chat extends Phaser.Scene {
    //Primary Variable
    model: any; router: any; gameComp: any;

    //secondary Variable
    Logout: any; chat: any; chatscreen:any

    constructor(handle: any, gameComponent: any, model: any, router: any) {
        super(handle);
        this.model = model;
        this.router = router;
        this.gameComp = gameComponent;
    }

    create() {
        //Logout Button
        this.Logout = this.add.image(this.game.scale.width * 0.94, this.game.scale.height / 10, 'Logout').setOrigin(0.5).setInteractive();
        this.Logout.setDisplaySize(((this.game.scale.height / 40) * 4), ((this.game.scale.height / 40) * 4));
        let self = this;
        this.chatscreen = this.add.image(this.game.scale.width/1.3, this.game.scale.height / 1.9, 'BidPanel').setOrigin(0.5).setInteractive();
        this.chatscreen .setDisplaySize(((this.game.scale.width / 40) * 8), ((this.game.scale.height / 40) * 36.5));
        this.chatscreen.visible = false;
        this.Logout.on('pointerdown', function () {
          { self.model.showExitPopUp=true;}
            // self.gameComp.leaveGame();
        });

        //Chat Button
        this.chat = this.add.image(this.game.scale.width * 0.94, this.game.scale.height * 0.90, 'Chat').setOrigin(0.5).setInteractive();
        this.chat.setDisplaySize(((this.game.scale.height / 40) * 4), ((this.game.scale.height / 40) * 4));
        this.chat.on('pointerdown', function () {
            { self.Logout.visible = false;
            self.model.showChatPanel = true;
            self.model.showExitPopUp = false;
            self.chatscreen.visible = true;}
        });

    }

    update() {
        if (!this.model.showChatPanel  || !this.model.showResult) {
            this.Logout.visible = true;
            this.chatscreen.visible = false;
        }
        if(this.model.showResult || this.model.showChatPanel){
            this.Logout.visible = false;
            if(this.model.showChatPanel)
            this.chatscreen.visible = false;

        }
    }

}
