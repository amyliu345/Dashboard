//Activity Timeline//
$(document).ready(function() {

      // load the external data
      // var testDataWithColorPerTime = d3.json("data.json", function(error, root) {
      //   return root;
      // });\
  var testDataWithColorPerTime;

  function msToTime(s) {

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ' hrs ' + mins + ' mins';
  }

  d3.json("data/data.json", function(data){


      testDataWithColorPerTime = data;

      var width = 700;


      function timelineRectColorsPerTime() {

        var colors = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']

        var activities = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]


        var legend_colors = ['#E5DF96','#E5A698','#CC98E5','#F95D00','#E52700','#B34CE5','#CEE598','#969696']
        var legend_second_colors = ['#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']

        var legend_text = ["Home","Work","Education","Meal","Shopping","Entertain.","Exercise","Transfer"]
        var legend_second_text = ["Car/Van","Taxi","Bus","Other","Scooter","LRT/MRT","Bicycle","Foot"]

        var colorScale = d3.scale.ordinal().range(colors)
          .domain(activities);

            
        var chart = d3.timeline()
          .colors( colorScale )
          .colorProperty('activity');

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {

            return "<span style='color:white'>" + d.activity + "<br>" + msToTime(d.ending_time-d.starting_time)+"</span>";
          });

        chart.stack();
        chart.showTimeAxisTick();
        chart.itemHeight(30);
        chart.margin({left: 90, right: 20, top: 0, bottom: 20});
        chart.itemMargin(7);
        chart.labelMargin(20);
        chart.mouseover(function(d,i,datum){
          return tip.show(d)
        });
        chart.mouseout(function(d){      
          return tip.hide(d)
        });

        var svg = d3.select("#activity").append("svg").attr("width", width)
          .datum(testDataWithColorPerTime).call(chart)

        svg.call(tip);


        //Legend
        var svg2 = d3.select('#legend').append("svg")
          .attr("width", width).attr("height", 50);
        var counter = 0;
        for (i = 0; i < legend_text.length; i++) {


          var text = svg2.append('text')
                .attr('fill', 'black')
                .attr('x', ((90+i+counter)*2+10)/2)
                .attr('y', 20)
                .text(legend_text[i])

          var rects = svg2.append('rect')
                .attr('fill',legend_colors[i])
                .attr('width', 60)
                .attr('height', 25)
                .attr('x', 90+i+counter)
                .attr('y', 30);

          counter +=65;
        };

        //Legend second row
        var svg3 = d3.select('#legend2').append("svg")
          .attr("width", width).attr("height", 50);
        var counter = 0;
        for (i = 0; i < legend_second_text.length; i++) {


          var text = svg3.append('text')
                .attr('fill', 'black')
                .attr('x', ((90+i+counter)*2+10)/2)
                .attr('y', 10)
                .text(legend_second_text[i])

          var rects = svg3.append('rect')
                .attr('fill',legend_second_colors[i])
                .attr('width', 60)
                .attr('height', 25)
                .attr('x', 90+i+counter)
                .attr('y', 20);

          counter +=65;
        };

      }

      timelineRectColorsPerTime();


  }); //semi need to be here?
});