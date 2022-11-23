import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class ModelLocator {

    public constructor() {}
    public playersInRoom:any = [];
    public teamName = "A";
    public seatOnServer:any = 0;
    public roomName: string = "";
    public userName: any;
    public userId: any;  
    public roomId:string = '';
    public userServerIndex:any = null; 
    public allPlayers:any = [];
    public gamePlayers:any = [];
    public userCoins:any = '';
    public gameRoom: any;
    public gameType='';
    public DummyPlayerIndex:any;

    public players:any = [];
    public roomCodeToJoinAndShare = 0;
    public hostPlayer:any='';
    public gamePlayer:any=[];
    static ateamHand:any=[];
    static bteamHand:any=[];
    static aNew=0;
    static aOld=0;
    static bNew=0;
    static bOld=0;
    static counter=0;
    static team='A';

    public gameOver = false;

    public showChatPanel = false;

    public joinPrivateGame = false;

    public showResult = false;

    public yourResult = {
        double: 0,
        reDouble:0,
        honour: 0,
        overTrick: 0,
        overTrickUnderLine: 0,
        rubberBonus: 0,
        slam: 0,
        totalPoints: 0,
        underTrick: 0,
        gameWon: 0
    }
    public opponentResult = {
        double: 0,
        reDouble:0,
        honour: 0,
        overTrick: 0,
        overTrickUnderLine: 0,
        rubberBonus: 0,
        slam: 0,
        totalPoints: 0,
        underTrick: 0,
        gameWon: 0
    }
    
    public areYouDummy = false;

    public youStats = "";
    public oppoStats = "";

    playerBids:any = [ {id : "1", suit: "clubs", pid: "bidClub1"},{id : "1", suit: "diamonds", pid: "bidDiamond1"},{id : "1", suit: "hearts", pid: "bidHeart1"},{id : "1", suit: "spades", pid: "bidSpade1"},{id : "1", suit: "notrump", pid: "bidNT1"},
    {id : "2", suit: "clubs", pid: "bidClub2"},{id : "2", suit: "diamonds", pid: "bidDiamond2"},{id : "2", suit: "hearts", pid: "bidHeart2"},{id : "2", suit: "spades", pid: "bidSpade2"},{id : "2", suit: "notrump", pid: "bidNT2"},
    {id : "3", suit: "clubs", pid: "bidClub3"},{id : "3", suit: "diamonds", pid: "bidDiamond3"},{id : "3", suit: "hearts", pid: "bidHeart3"},{id : "3", suit: "spades", pid: "bidSpade3"},{id : "3", suit: "notrump", pid: "bidNT3"},
    {id : "4", suit: "clubs", pid: "bidClub4"},{id : "4", suit: "diamonds", pid: "bidDiamond4"},{id : "4", suit: "hearts", pid: "bidHeart4"},{id : "4", suit: "spades", pid: "bidSpade4"},{id : "4", suit: "notrump", pid: "bidNT4"},
    {id : "5", suit: "clubs", pid: "bidClub5"},{id : "5", suit: "diamonds", pid: "bidDiamond5"},{id : "5", suit: "hearts", pid: "bidHeart5"},{id : "5", suit: "spades", pid: "bidSpade5"},{id : "5", suit: "notrump", pid: "bidNT5"},
    {id : "6", suit: "clubs", pid: "bidClub6"},{id : "6", suit: "diamonds", pid: "bidDiamond6"},{id : "6", suit: "hearts", pid: "bidHeart6"},{id : "6", suit: "spades", pid: "bidSpade6"},{id : "6", suit: "notrump", pid: "bidNT6"},
    {id : "7", suit: "clubs", pid: "bidClub7"},{id : "7", suit: "diamonds", pid: "bidDiamond7"},{id : "7", suit: "hearts", pid: "bidHeart7"},{id : "7", suit: "spades", pid: "bidSpade7"},{id : "7", suit: "notrump", pid: "bidNT7"}
];
public BidEnable: any =[];
public Bidcount:any = 0;

public showExitPopUp:boolean=false;
public isBidPanel:boolean=false;

public mycardArray:any=[];
public myCards:any=[]

public reDisrtibuteCards:boolean=false;

public playerNameData:any=[];

public playerDirection:any=[];

public handComplete:boolean=false;
public sortedArray: any = [];
public cardNewArray: any = [];

public bidWin:boolean=false;

public playerData:any;

public showTimerPopup:boolean=false;

public messagePopupVisible:boolean=false;

public message:string="";

public isTimer:boolean=false;
public wayofWin:string="";

public firstTimeBid = false;

public subscribeTimer:any;

public joinGamePlayers:any = [];

public blackBg:boolean = true;

public bidDestroy:boolean=false;

public contractOnTable:boolean=false;

public contractBidText:string=""

public contractBidSuit:any;

public leaveCount:number = 0;

public isReconnect = false;

public messageClose = false;

public cardDistibuted= false;

public isNameOntable = false;

public nameCount:number=0;

public isHost:boolean=false;

public leavePlayerName:any=[];

public roomInterval:any;

public teamMemberA:any=[];

public teamMemberB:any=[];

public checkingNetwork:boolean=false;

public loader:boolean=false;

public gameLoad:boolean=false;

public networkState:boolean=false;





    
}

