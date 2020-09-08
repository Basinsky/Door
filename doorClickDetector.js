(function () {
    var myID;    
    var doorServerID;   
    var myName;
     
    this.preload = function (entityID) {
        myID = entityID;
        myName = Entities.getEntityProperties(myID,"name").name;        
        doorServerID = Entities.getEntityProperties(myID,"parentID").parentID;                                           
    };
        
    function click() {            
        sendToDoorServer("clicked" + myName);         
    }
    
    function sendToDoorServer(State) {           
        Entities.callEntityServerMethod(                                             
            doorServerID, 
            "moveDoor",
            [MyAvatar.sessionUUID,myID,State]            
        );
    }  
    this.startNearTrigger = click;
    this.startFarTrigger = click;
    this.clickDownOnEntity = click;
});

