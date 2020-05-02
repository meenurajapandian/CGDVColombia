
function dashboard(id, fData){
    var barColor = '#F68E93';
    function segColor(c){ return {below_10:"#3288bd" , between_10_20:"#66c2a5",between_20_30:"#abdda4",between_30_40: "#e6f598", between_40_50:"#fee08b" ,between_50_60: "#fdae61", between_60_70: "#f46d43",over_70:"#d53e4f"  }[c]; }
   // 'below_10','between_10_20','between_20_30', 'between_30_40', 'between_40_50', 'between_50_60', 'between_60_70', 'over_70'

    // compute total for each state.
    fData.forEach(function(d){d.total= d.freq.below_10+ d.freq.between_10_20+ d.freq.between_20_30+ d.freq.between_30_40+ d.freq.between_40_50+ d.freq.between_50_60+ d.freq.between_60_70+ d.freq.over_70;});

    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 30, r: 40, b: 18, l: 40};
        hGDim.w = 200 - hGDim.l - hGDim.r,
        hGDim.h = 200 - hGDim.t - hGDim.b;

        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "axisWhite")
            .attr("transform", "translate(1," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");

        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover", mouseover)// mouseover is defined below.
            .on("mouseout", mouseout);// mouseout is defined below.

        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .style("fill", "#FFFFFF")
            .attr("text-anchor", "middle");

        function mouseover(d){  // utility function to be called on mouseover.
            d3.select(this).attr("r", 10).style("fill", "#B3343A");

            // filter for selected state.
            var st = fData.filter(function(s){ return s.Sex == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});

            // call update functions of pie-chart and legend.
            pC.update(nD);
            leg.update(nD);
        }

        function mouseout(d){    // utility function to be called on mouseout.
            d3.select(this).attr("r", 10).style("fill", "#F68E93");
            // reset the pie-chart and legend.
            pC.update(tF);
            leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });
        }
        return hG;
    }

    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:190, h: 190};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            // .append("text")
            //     .text(function(d) {
            //         console.log(d.data.type)
            //         return d.data.type;
            //     })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){
                return [v.sex,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.Sex,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
        return pC;
    }

    // function to handle legend.
    function legend(lD){
        var leg = {};

        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend')
            .attr("width", 230).attr("height", 50).append("g");

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '12').attr("height", '12').append("rect")
            .attr("width", '12').attr("height", '12')
			.attr("fill",function(d){ return segColor(d.type); });

        // create the second column for each segment.
        tr.append("td").text(function(d){
          if (d.type=="below_10") {
            return "< 10";
          } else if (d.type=="between_10_20"){
            return "10 < 20";
          } else if (d.type=="between_20_30"){
            return "20 < 30";
          } else if (d.type=="between_30_40"){
            return "30 < 40";
          } else if (d.type=="between_40_50"){
            return "40 < 50";
          } else if (d.type=="between_50_60"){
            return "50 < 60";
          } else if (d.type=="between_60_70"){
            return "60 < 70";
          } else {
            return "> 70";
          };});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
        }

        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }

    // calculate total frequency by segment for all state.
    var tF = ['below_10','between_10_20','between_20_30', 'between_30_40', 'between_40_50', 'between_50_60', 'between_60_70', 'over_70'].map(function(d){
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))};
    });

    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.Sex,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}

var freqData_back=[
{State:'Male',freq:{low:10.9, mid:11.3, high:8.1}}
,{State:'Female',freq:{low:11.4, mid:12.2, high:11.8}}
];

var freqData = [
    {Sex: 'Male', freq: {below_10: 91866, between_10_20: 66945, between_20_30: 126727, between_30_40: 123316,
                            between_40_50: 84296, between_50_60: 47172, between_60_70: 23557, over_70: 11926    }},
    {Sex: 'Female', freq: {below_10: 95907, between_10_20: 75063, between_20_30: 147156, between_30_40: 108648,
                            between_40_50: 67237, between_50_60: 39991, between_60_70: 21164, over_70: 11348 }}
];

dashboard('#dashboard',freqData);
