(function () {
    var myID;
    var myName;
    var myPos;
    var STEP = 1;
    var MAX_OPEN_DEGREES = 90; 
    var startRot;       
    var doorRotationQuat;    
    var state = "closed";  
    var LOCATION_ROOT_URL = Script.resolvePath(".");
    var doorSound = SoundCache.getSound(LOCATION_ROOT_URL + "502460__121269i9__doorclosing-mixdown.mp3");    

    this.remotelyCallable = [
        "moveDoor"                    
    ]; 

    this.preload = function (entityID) {
        myID = entityID;
        myName = Entities.getEntityProperties(myID,"name").name; 
        myPos = Entities.getEntityProperties(myID,"position").position; 
        startRot = Entities.getEntityProperties(myID,"rotation").rotation;  
        startEuler = Quat.safeEulerAngles(startRot);
    };
    
    this.moveDoor = function (id,param) {
        myName = Entities.getEntityProperties(myID,"name").name;   
        print ("myName" + myName);        
               
        var doorClicked = param[2];
        var myRot = Entities.getEntityProperties(myID,"rotation").rotation;  
        var myRotEuler = Quat.safeEulerAngles(myRot);  
        print("state before " + state + "myRotEulery" + myRotEuler.y);       
        switch (true) {                   
            case doorClicked === "clickedDoorInside" && state === "closed":
                Audio.playSound(doorSound, {position: myPos,volume: 0.5});
                state = "outsideOpen";
                for (var j = 0; j <= MAX_OPEN_DEGREES; j = j + STEP) { 
                    doorRotationQuat = Quat.fromPitchYawRollDegrees(0, myRotEuler.y - j, 0 );
                    Entities.editEntity(myID,{rotation: doorRotationQuat});
                }
                print("state after " + state + "myRotEulery" + myRotEuler.y);                 
                break;

            case doorClicked === "clickedDoorOutside" && state === "closed":
                Audio.playSound(doorSound, {position: myPos,volume: 0.5});
                state = "insideOpen";
                for (var k = 0; k <= MAX_OPEN_DEGREES; k = k + STEP) { 
                    doorRotationQuat = Quat.fromPitchYawRollDegrees(0, myRotEuler.y + k, 0 );
                    Entities.editEntity(myID,{rotation: doorRotationQuat});                     
                }
                print("state after " + state + "myRotEulery" + myRotEuler.y);               
                break;

            case doorClicked === "clickedDoorOutside" && state === "outsideOpen":
                Audio.playSound(doorSound, {position: myPos,volume: 0.5});
                state = "closed";
                for (var l = 0; l <= MAX_OPEN_DEGREES; l = l + STEP) { 
                    doorRotationQuat = Quat.fromPitchYawRollDegrees(0, myRotEuler.y + l, 0 );
                    Entities.editEntity(myID,{rotation: doorRotationQuat});
                }
                print("state after " + state + "myRotEulery" + myRotEuler.y);                 
                break;

            case doorClicked === "clickedDoorInside" && state === "insideOpen":
                Audio.playSound(doorSound, {position: myPos,volume: 0.5});
                state = "closed";
                for (var m = 0; m <= MAX_OPEN_DEGREES; m = m + STEP) { 
                    doorRotationQuat = Quat.fromPitchYawRollDegrees(0, myRotEuler.y - m, 0 );
                    Entities.editEntity(myID,{rotation: doorRotationQuat});
                }
                print("state after " + state + "myRotEulery" + myRotEuler.y);                 
                break;
        }
    };
});

