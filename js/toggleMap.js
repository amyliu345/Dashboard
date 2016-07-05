var activityToColor = {},
    i,
    color = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#FF0000','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5'],
    activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]
    for (i = 0; i < activity.length; i++) {
        activityToColor[activity[i]] = color[i];
    };

// var activityToEmissionsColor = {},
//     i,
//     color = [],
//     activity = ["Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]
//     for (i = 0; i < activity.length; i++) {
//         activityToColor[activity[i]] = color[i];
//     };

var activityToAbbrev = {},
    i,
    activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"],
    abbrev = ["Home", "Work", "Business","Edu.","Pick Up","Errand","Meal","Shop","Social","Rec.","Entertain.","Exercise","Accompany","Other","Medical","Other","Transfer","Car","Taxi","Bus","Other","Scooter","MRT","Bike","Foot"]
    for (i = 0; i < activity.length; i++) {
        activityToAbbrev[activity[i]] = abbrev[i];
    };

var legend_text = ["Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]

var linesToAdd = []

var linesToRemove = []

var lines = []


var map;
var bounds;
var data;

function initialize() {
    var myLatlng = new google.maps.LatLng(1.36692, 103.94706);
    var myOptions = {
        zoom: 15,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    }

    map = new google.maps.Map(document.getElementById("map"), myOptions);
    bounds = new google.maps.LatLngBounds();

    // var coords = [];

    // addDomListener(instance:Object, eventName:string, handler:Function)


    $.getJSON( "data/gps.json", function(data) {
        // for (var i = 0; i < data[0].data.length; ++i){
        //     // console.log(data[0].data[i].EncodedPoints);
        //     var path = data[0].data[i].EncodedPoints
        //     var levels = data[0].data[i].Levels
        //     var mode = data[0].data[i].Mode
        //     var color = activityToColor[mode]

        //     var decodedPath = google.maps.geometry.encoding.decodePath(path); 
        //     var decodedLevels = decodeLevels(levels);
        //     var newLine = new google.maps.Polyline({
        //         path: decodedPath,
        //         levels: decodedLevels,
        //         strokeColor: color,
        //         strokeOpacity: 1.0,
        //         strokeWeight: 5,
        //     });
        //         newLine.getPath().forEach(function(LatLng) {
        //         bounds.extend(LatLng);
        //     });
        //     linesToAdd.push(newLine);
        //     // console.log(newLine)
        // }
        // addPolyline();
        // map.fitBounds(bounds);
        data = data;
        for (var i = 0; i < data.length; i++){
            var dayLines = []
            for (var j = 0; j < data[i].data.length; j++){
                dayLines.push(newPolyline(i,j,data));
            }
            lines.push(dayLines)
            toggle(i)
        }
        // setBounds(lines[0]);
    });


}

(function($) {
  $.fn.clickToggle = function(func1, func2) {
      var funcs = [func1, func2];
      this.data('toggleclicked', 0);
      this.click(function() {
          var data = $(this).data();
          var tc = data.toggleclicked;
          $.proxy(funcs[tc], this)();
          data.toggleclicked = (tc + 1) % 2;
      });
      return this;
  };
}(jQuery));

function toggle(dayIndex){
    $('#'+dayIndex).clickToggle(function() {   
        // console.log("handler1")
        updateMultiday(dayIndex,true);
    },
    function() {
        // console.log("handler2")
        updateMultiday(dayIndex,false);
    });
}

function newPolyline(dayIndex, dataIndex, data){
    var path = data[dayIndex].data[dataIndex].EncodedPoints
    var levels = data[dayIndex].data[dataIndex].Levels
    var mode = data[dayIndex].data[dataIndex].Mode
    var color = activityToColor[mode]

    var decodedPath = google.maps.geometry.encoding.decodePath(path); 
    var decodedLevels = decodeLevels(levels);
    var newLine = new google.maps.Polyline({
        path: decodedPath,
        levels: decodedLevels,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map: null
    });
    return newLine;
}



function addPolylines(dayLines){ //array of polylines for a single day
    for (var i=0; i < dayLines.length; i++){
        dayLines[i].setMap(map);
    }
}

function removePolyLines(dayLines){
    for (var i=0; i < dayLines.length; i++){
        dayLines[i].setMap(null);
    }
}

function setBounds(dayLines){
    for (var i=0; i < dayLines.length; i++){
        dayLines[i].getPath().forEach(function(LatLng) {
            bounds.extend(LatLng);
        });
    }
    map.fitBounds(bounds);
}

// function toggle(dayIndex){

//     function handler1() {
//         console.log("handler1")
//         updateMultiday(dayIndex,false);
//         $(this).on("click", handler2);
//     }
//     function handler2() {
//         console.log("handler2")
//         updateMultiday(dayIndex,true);
//         $(this).on("click", handler1);
//     }

//     $('#'+dayIndex).on("click", handler1); //YO FIX THIS SHIT THANKS
// }

function updateMultiday(dayIndex, visibility = True){
        console.log(visibility);

    if (visibility){
        addPolylines(lines[dayIndex]);
        setBounds(lines[dayIndex]);
    }
    else{
        removePolyLines(lines[dayIndex]);
        bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < lines.length; i++){
            for (var j = 0; j < lines[i].length; j++){
                if (lines[i][j].map == map){
                    setBounds(lines[i])
                } 
            }
        }

    }
    // $.getJSON( "data/gps.json", function(data) {
    //     for (var i = 0; i < data[dayIndex].data.length; ++i){
    //         // console.log(data[dayIndex].data[i].EncodedPoints);

    //         var path = data[dayIndex].data[i].EncodedPoints
    //         var levels = data[dayIndex].data[i].Levels
    //         var mode = data[dayIndex].data[i].Mode
    //         var color = activityToColor[mode]

    //         var decodedPath = google.maps.geometry.encoding.decodePath(path); 
    //         var decodedLevels = decodeLevels(levels);

    //         // coordinates.push(decodedPath);

    //         var newLine = new google.maps.Polyline({
    //             path: decodedPath,
    //             levels: decodedLevels,
    //             strokeColor: color,
    //             strokeOpacity: 1.0,
    //             strokeWeight: 5,
    //         });
    //         newLine.getPath().forEach(function(LatLng) {
    //             bounds.extend(LatLng);
    //         });

    //         if (visibility == true){
    //             console.log(visibility)
    //             linesToAdd.push(newLine);
    //         }
    //         else{
    //             linesToRemove.push(newLine);
    //         }

    //     }
        
    //     console.log(visibility);
    //     console.log(linesToAdd);
    //     console.log(linesToRemove);
    //     addPolyline();
    //     removePolyLine();
    //     map.fitBounds(bounds);
    // });
}

function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
        var level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
    }
    return decodedLevels;
}


// displayLines(){ 
//     var p; 
//     for (p = 0; p < polylines.length; p++) {
//         if(polylines[p].getMap(map)) { 
//             polylines[p].setMap(null); 
//         } 
//         else { polylines[p].setMap(map); 
//         } 
//     }
// } 
