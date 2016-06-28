var activityToColor = {},
    i,
    color = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#FF0000','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5'],
    activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]
    for (i = 0; i < activity.length; i++) {
        activityToColor[activity[i]] = color[i];
    };

var activityToAbbrev = {},
    i,
    activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"],
    abbrev = ["Home", "Work", "Business","Edu.","Pick Up","Errand","Meal","Shop","Social","Rec.","Entertain.","Exercise","Accompany","Other","Medical","Other","Transfer","Car","Taxi","Bus","Other","Scooter","MRT","Bike","Foot"]
    for (i = 0; i < activity.length; i++) {
        activityToAbbrev[activity[i]] = abbrev[i];
    };

var legend_text = ["Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]


function initialize() {
    var myLatlng = new google.maps.LatLng(1.36692, 103.94706);
    var myOptions = {
        zoom: 15,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    }

    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    var bounds = new google.maps.LatLngBounds();

    // var coords = [];

    $.getJSON( "data/gps.json", function(data) {
        for (var i = 0; i < data[0].data.length; ++i){
            // console.log(data[0].data[i].EncodedPoints);

            var path = data[0].data[i].EncodedPoints
            var levels = data[0].data[i].Levels
            var mode = data[0].data[i].Mode
            var color = activityToColor[mode]

            var decodedPath = google.maps.geometry.encoding.decodePath(path); 
            var decodedLevels = decodeLevels(levels);
            var polyline = new google.maps.Polyline({
                path: decodedPath,
                levels: decodedLevels,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 5,
                map:map
            });
            // var bounds = new google.maps.LatLngBounds();
            polyline.getPath().forEach(function(LatLng) {
                bounds.extend(LatLng);
            });

        }

        // var bounds = new google.maps.LatLngBounds();
        // polyline.getPath().forEach(function(LatLng) {
        //     bounds.extend(LatLng);
        // });
        map.fitBounds(bounds);
    });
}



function updateMultiday(dayIndex, myLatlng){
    var myLatlng = new google.maps.LatLng(1.36692, 103.94706);

    var myOptions = {
        zoom: 15,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    var bounds = new google.maps.LatLngBounds();

    // var coordinates = []

    $.getJSON( "data/gps.json", function(data) {
        for (var i = 0; i < data[dayIndex].data.length; ++i){
            console.log(data[dayIndex].data[i].EncodedPoints);

            var path = data[dayIndex].data[i].EncodedPoints
            var levels = data[dayIndex].data[i].Levels
            var mode = data[dayIndex].data[i].Mode
            var color = activityToColor[mode]

            var decodedPath = google.maps.geometry.encoding.decodePath(path); 
            var decodedLevels = decodeLevels(levels);

            // coordinates.push(decodedPath);

            var polyline = new google.maps.Polyline({
                path: decodedPath,
                levels: decodedLevels,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 5,
                map: map
            });
            // var bounds = new google.maps.LatLngBounds();
            polyline.getPath().forEach(function(LatLng) {
                bounds.extend(LatLng);
            });
        }

        map.fitBounds(bounds);
    });
}

function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
        var level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
    }
    return decodedLevels;
}

