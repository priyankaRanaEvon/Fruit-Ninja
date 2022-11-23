import { Subscription, ReplaySubject } from 'rxjs';

	export class  playersvo 
	{
		//New Variable added to use it as a DTO from connection
		public playerName:string;
  
    public constructor(name:string,id:number,userid:number,isPartner:boolean) {
			this.playerName = name;
		}
		
	}