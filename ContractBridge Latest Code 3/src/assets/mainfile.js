function sendUserData(response){
    var event = new CustomEvent("userDetails", 
        {
            detail:response,
            bubbles: true,
            cancelable: true
        }
    );    
    window.dispatchEvent(event);
  }

  
  function leaveGame(msg){
    console.log(msg);
    var event = new CustomEvent("leaveGame", 
    {
        detail:msg,
        bubbles: true,
        cancelable: true
    }
);    
window.dispatchEvent(event);
  }

