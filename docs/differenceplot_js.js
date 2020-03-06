var margin = {top: 20, right: 20, bottom: 30, left: 150},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

    
function getticks(d){
    return d;
}

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d) {return getticks(d) ;});

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


d3.tsv("differencedata.tsv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.Year = +d.Year;
    d["Colombia"]= +d["Colombia"];
    d["Venezuela"] = +d["Venezuela"];
  });

  console.log(data)

  x.domain(d3.extent(data, function(d) { return d.Year; }));

  y.domain([
    d3.min(data, function(d) { return Math.min(d["Colombia"], d["Venezuela"]); }),
    d3.max(data, function(d) { return Math.max(d["Colombia"], d["Venezuela"]); })
  ]);

  var line = d3.svg.area()
    .interpolate(d3.curveBasis)
    .x(function(d) { console.log(x(d.Year)); return x(d.Year); })
    .y(function(d) { return y(d["Colombia"]); });

var area = d3.svg.area()
    .interpolate(d3.curveBasis)
    .x(function(d) { return x(d.Year); })
    .y1(function(d) { return y(d["Venezuela"]); });

var svg = d3.select("#differenceplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.datum(data);

  svg.append("clipPath")
      .attr("id", "clip-below")
    .append("path")
      .attr("d", area.y0(height));

  svg.append("clipPath")
      .attr("id", "clip-above")
    .append("path")
      .attr("d", area.y0(0));

  svg.append("path")
      .attr("class", "area above")
      .attr("clip-path", "url(#clip-above)")
      .attr("d", area.y0(function(d) { return y(d["Colombia"]); }));

  svg.append("path")
      .attr("class", "area below")
      .attr("clip-path", "url(#clip-below)")
      .attr("d", area);

  svg.append("path")
      .attr("class", "line")
      .attr("d", line);


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("transform", "translate("+width/2+ "," +  (margin.bottom) +")")
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Refugees");
});