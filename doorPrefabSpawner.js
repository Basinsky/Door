var localRot;
var LOCATION_ROOT_URL = Script.resolvePath(".");
var myHipPosition = MyAvatar.getHeight()/2;
var doorURL = Window.prompt("Door URL:","");
var pivotSide = Window.prompt("Pivot side (L/R)","L");
var side = 1;
var TIME_OUT_MS = 1000;

if (pivotSide === "L" || pivotSide === "l") {
    side = 1;
}
if (pivotSide === "R" || pivotSide === "r") {
    side = -1;
}

var doorID = Entities.addEntity({
    type: "Model",        
    name: "Door",
    modelURL: doorURL,      
    position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 0, z: -2 })),
    rotation: MyAvatar.orientation,     
    visible: true,
    alpha: 1,
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

Script.setTimeout(function () {

    print("Wait a moment");

    var doorDimension = Entities.getEntityProperties(doorID,"dimensions").dimensions;

    var doorPivotID = Entities.addEntity({
        type: "Shape",
        shape: "Cylinder",    
        name: "doorPivot" + pivotSide,
        parentID: doorID,       
        localPosition: { x: -doorDimension.x * side / 2, y: 0, z: 0},               
        visible: true,
        alpha: 1, 
        collisionless: true,
        serverScripts: LOCATION_ROOT_URL + "doorServer.js?" + Date.now(),        
        color: { r: 0, g: 0, b: 255 },
        dimensions: { x: 0.2 , y: doorDimension.y , z: 0.2},            
        lifetime: -1,            
        userData: JSON.stringify({
            grabbableKey: { grabbable: false, triggerable: false }
        })                          
    });  
    
    var outsideID = Entities.addEntity({
        type: "Shape",
        shape: "Cube",
        parentID: doorPivotID,
        name: "DoorOutside",       
        localPosition: { x: (doorDimension.x/2) * side, y: 0, z: 0.2 * side},           
        visible: true,
        alpha: 1,    
        script: LOCATION_ROOT_URL + "doorClickDetector.js?" + Date.now(),        
        color: { r: 0, g: 255, b: 0 },
        dimensions: { x: doorDimension.x , y: doorDimension.y , z: 0.3},            
        lifetime: -1,            
        userData: JSON.stringify({
            grabbableKey: { grabbable: false, triggerable: true }
        })                          
    });

    var insideID = Entities.addEntity({
        type: "Shape",
        shape: "Cube",
        parentID: doorPivotID,
        name: "DoorInside",       
        localPosition: { x: (doorDimension.x/2) * side, y: 0, z: -0.2 * side},           
        visible: true,
        alpha: 1,    
        script: LOCATION_ROOT_URL + "doorClickDetector.js?" + Date.now(),        
        color: { r: 255, g: 0, b: 0 },
        dimensions: { x: doorDimension.x , y: doorDimension.y , z: 0.3},            
        lifetime: -1,            
        userData: JSON.stringify({
            grabbableKey: { grabbable: false, triggerable: true }
        })                          
    });

    Entities.editEntity(doorPivotID,{parentID: Uuid.NULL});
    Entities.editEntity(doorID,{parentID: doorPivotID});

    Script.setTimeout(function () {
        var currentPosition = Entities.getEntityProperties(doorPivotID,"position").position;
        var newHeight = currentPosition.y - myHipPosition + doorDimension.y/2;
        var newPosition = { x: currentPosition.x, y: newHeight, z: currentPosition.z};
        Entities.editEntity(doorPivotID,{ position: newPosition, visible: false });
        Entities.editEntity(outsideID,{ visible: false });
        Entities.editEntity(insideID,{ visible: false });
        Script.stop();
    }, TIME_OUT_MS);
    
}, TIME_OUT_MS);
