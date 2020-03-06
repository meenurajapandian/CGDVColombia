console.log("BC!!")
var margin = {top: 20, right: 50, bottom: 30, left: 100},
width = 1080 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.scale.linear()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
.scale(x)
.ticks(15)
.innerTickSize(10)
.outerTickSize(0)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.tickFormat(function(d) {return d + "%";})
.ticks(10)
.innerTickSize(10)
.outerTickSize(0)
.orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.inflation); });

var svg = d3.select("#infl").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("inflation_data.csv", function(error, data) {
color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));
console.log(data)

data.forEach(function(d) {
    d.year = +d.year;
    d.value = +d.value;
});

var economies = color.domain().map(function(name) {
    return {
    name: name,
    values: data.map(function(d) {
        return {year: d.year, inflation: +d[name]};
    })
    };
});
console.log(economies)

x.domain(d3.extent(data, function(d) { return d.year; }));
console.log(d3.extent(data, function(d) { return d.year; }))

subset = economies[0]["values"].slice(1,10)

y.domain([
    d3.min(economies, function(c) { return d3.min(c.values, function(v) { return v.inflation; }); }),
    d3.max(economies, function(c) { return d3.max(c.values, function(v) { return v.inflation/1000; }); })
]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .attr('id','yAxis')
    .call(yAxis);

svg.append("line")
    .attr(
    {
        "class":"horizontalGrid",
        "x1" : 0,
        "x2" : width,
        "y1" : y(0),
        "y2" : y(0),
        "fill" : "none",
        "shape-rendering" : "crispEdges",
        "stroke" : "black",
        "stroke-width" : "1px",
        "stroke-dasharray": ("3, 3")
    });

var economy = svg.selectAll(".economy")
    .data(economies)
    .enter().append("g")
    .attr("class", "economy");

var path = svg.selectAll(".economy").append("path")
    .attr("class", "line")
    .attr("d", function(d) { console.log("hi" ) ;return line(d.values); })
    .style("stroke", function(d) { return "#000"} )
                                   
var totalLength = [path[0][0].getTotalLength()];

var t0 = d3.select(path[0][0])
    .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] ) 
    .attr("stroke-dashoffset", totalLength[0])
    .transition()
        .duration(2000000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

y.domain([
    d3.min(economies, function(c) { return d3.min(c.values, function(v) { return v.inflation; }); }),
    d3.max(economies, function(c) { return d3.max(c.values, function(v) { return v.inflation; }); })
]);

yAxis.scale(y)

d3.select("#yAxis")
  .transition()
    .delay(5000)
    .duration(2500)
    .call(yAxis)
});