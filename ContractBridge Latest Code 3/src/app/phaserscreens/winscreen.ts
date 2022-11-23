export class WinScreen extends Phaser.Scene {

    //Primary Variables
    gameComp: any; socketScv: any; model: any;

    constructor(handle: any, gameComp: any, socketScv: any, model: any) {
        super(handle);
        this.gameComp = gameComp;
        this.socketScv = socketScv;
        this.model = model;
    }

    preload() {

    }

    create() {
        console.log("win screen reached")
        this.subscribeToServices();
    }

    subscribeToServices() {
        //Get Round Over Details
        this.subscribeToRoundOver();
        //Get Game Over Details
        this.subscribeToGameOver();
    }

    subscribeToRoundOver() {
        let temp = this.socketScv.roundWin.subscribe((data: any) => {
            console.log('here is the details rounnd over', data);

            if (data) {
                this.model.areYouDummy = false;
                this.model.showResult = true;
                if (this.model.teamName == "A") {
                    this.model.yourResult.double = data.A.double;
                    this.model.yourResult.honour = data.A.honour;
                    this.model.yourResult.overTrick = data.A.overTrick;
                    this.model.yourResult.overTrickUnderLine = data.A.overTrickUnderLine;
                    this.model.yourResult.rubberBonus = data.A.rubberBonus;
                    this.model.yourResult.slam = data.A.slam;
                    this.model.yourResult.totalPoints = data.A.totalPoints;
                    this.model.yourResult.underTrick = data.A.underTrick;
                    this.model.yourResult.gameWon = data.A.gameWon;
                    this.model.yourResult.reDouble=data.A.redouble
                    this.model.teamMemberA=data.memberTeamA;

                    this.model.opponentResult.double = data.B.double;
                    this.model.opponentResult.honour = data.B.honour;
                    this.model.opponentResult.overTrick = data.B.overTrick;
                    this.model.opponentResult.overTrickUnderLine = data.B.overTrickUnderLine;
                    this.model.opponentResult.rubberBonus = data.B.rubberBonus;
                    this.model.opponentResult.slam = data.B.slam;
                    this.model.opponentResult.totalPoints = data.B.totalPoints;
                    this.model.opponentResult.underTrick = data.B.underTrick;
                    this.model.opponentResult.gameWon = data.B.gameWon;
                    this.model.opponentResult.reDouble=data.B.redouble
                    this.model.teamMemberB=data.memberTeamB;


                }
                else if (this.model.teamName == "B") {

                    this.model.yourResult.double = data.B.double;
                    this.model.yourResult.honour = data.B.honour;
                    this.model.yourResult.overTrick = data.B.overTrick;
                    this.model.yourResult.overTrickUnderLine = data.B.overTrickUnderLine;
                    this.model.yourResult.rubberBonus = data.B.rubberBonus;
                    this.model.yourResult.slam = data.B.slam;
                    this.model.yourResult.totalPoints = data.B.totalPoints;
                    this.model.yourResult.underTrick = data.B.underTrick;
                    this.model.yourResult.gameWon = data.B.gameWon;
                    this.model.yourResult.reDouble=data.B.redouble
                    this.model.teamMemberA=data.memberTeamB;



                    this.model.opponentResult.double = data.A.double;
                    this.model.opponentResult.honour = data.A.honour;
                    this.model.opponentResult.overTrick = data.A.overTrick;
                    this.model.opponentResult.overTrickUnderLine = data.A.overTrickUnderLine;
                    this.model.opponentResult.rubberBonus = data.A.rubberBonus;
                    this.model.opponentResult.slam = data.A.slam;
                    this.model.opponentResult.totalPoints = data.A.totalPoints;
                    this.model.opponentResult.underTrick = data.A.underTrick;
                    this.model.opponentResult.gameWon = data.A.gameWon;
                    this.model.opponentResult.reDouble=data.A.redouble
                    this.model.teamMemberB=data.memberTeamA;
                    
                }
            }

        });

        this.gameComp.gamePlaySubscriptions.push(temp);

    }

    subscribeToGameOver() {
        let temp = this.socketScv.gameWin.subscribe((data: any) => {
            console.log('here is the details game over', data);
            if (data) {
                this.model.gameOver = true;
                this.model.areYouDummy = false;
                this.model.showResult = true;

                if (this.model.teamName == "A") {
                    this.model.yourResult.double = data.A.double;
                    this.model.yourResult.honour = data.A.honour;
                    this.model.yourResult.overTrick = data.A.overTrick;
                    this.model.yourResult.overTrickUnderLine = data.A.overTrickUnderLine;
                    this.model.yourResult.rubberBonus = data.A.rubberBonus;
                    this.model.yourResult.slam = data.A.slam;
                    this.model.yourResult.totalPoints = data.A.totalPoints;
                    this.model.yourResult.underTrick = data.A.underTrick;
                    this.model.yourResult.gameWon = data.A.gameWon;
                    this.model.yourResult.reDouble=data.A.redouble

                    this.model.teamMemberA=data.memberTeamA;


                    this.model.opponentResult.double = data.B.double;
                    this.model.opponentResult.honour = data.B.honour;
                    this.model.opponentResult.overTrick = data.B.overTrick;
                    this.model.opponentResult.overTrickUnderLine = data.B.overTrickUnderLine;
                    this.model.opponentResult.rubberBonus = data.B.rubberBonus;
                    this.model.opponentResult.slam = data.B.slam;
                    this.model.opponentResult.totalPoints = data.B.totalPoints;
                    this.model.opponentResult.underTrick = data.B.underTrick;
                    this.model.opponentResult.gameWon = data.B.gameWon;
                    this.model.opponentResult.reDouble=data.B.redouble
                    this.model.teamMemberB=data.memberTeamB;



                    if(this.model.teamName ==  data.team){
                        this.model.youStats = "(Winner)";
                        this.model.oppoStats = "(Loser)";
                    }
                    else{
                        this.model.youStats = "(Loser)";
                        this.model.oppoStats = "(Winner)";
                    }

                    if(data.wayofWin == "walkOver"){
                        this.model.wayofWin = "walkOver"
                    }

                }
                else if (this.model.teamName == "B") {

                    this.model.yourResult.double = data.B.double;
                    this.model.yourResult.honour = data.B.honour;
                    this.model.yourResult.overTrick = data.B.overTrick;
                    this.model.yourResult.overTrickUnderLine = data.B.overTrickUnderLine;
                    this.model.yourResult.rubberBonus = data.B.rubberBonus;
                    this.model.yourResult.slam = data.B.slam;
                    this.model.yourResult.totalPoints = data.B.totalPoints;
                    this.model.yourResult.underTrick = data.B.underTrick;
                    this.model.yourResult.gameWon = data.B.gameWon;
                    this.model.yourResult.reDouble=data.B.redouble
                    this.model.teamMemberA=data.memberTeamB;



                    this.model.opponentResult.double = data.A.double;
                    this.model.opponentResult.honour = data.A.honour;
                    this.model.opponentResult.overTrick = data.A.overTrick;
                    this.model.opponentResult.overTrickUnderLine = data.A.overTrickUnderLine;
                    this.model.opponentResult.rubberBonus = data.A.rubberBonus;
                    this.model.opponentResult.slam = data.A.slam;
                    this.model.opponentResult.totalPoints = data.A.totalPoints;
                    this.model.opponentResult.underTrick = data.A.underTrick;
                    this.model.opponentResult.gameWon = data.A.gameWon;
                    this.model.opponentResult.reDouble=data.A.redouble
                    this.model.teamMemberB=data.memberTeamA;


                    if(this.model.teamName ==  data.team){
                        this.model.youStats = "(Winner)";
                        this.model.oppoStats = "(Loser)";
                    }
                    else{
                        this.model.youStats = "(Loser)";
                        this.model.oppoStats = "(Winner)";
                    }
                    if(data.wayofWin == "walkOver"){
                        this.model.wayofWin = "walkOver"
                    }
                }
                

              
            }

        });
        this.gameComp.gamePlaySubscriptions.push(temp);

    }


  
}