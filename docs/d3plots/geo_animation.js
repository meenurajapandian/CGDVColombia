"use strict"

//given a point, creates x and y coordinates.
var line = d3.svg.line()
    .x(function (point) {
        return point.lx;
    })
    .y(function (point) {
        return point.ly;
    });

//given a datasource d, with source containing x and y, this creates a d3 line element to target containing x and y
//uses line defined above.

function lineData(d) {
    var points = [{
        lx: d.source.x,
        ly: d.source.y
    },
    {
        lx: d.target.x,
        ly: d.target.y
    }
    ];
    return line(points);
}

//Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
    var l = path.getTotalLength();
    var ps = path.getPointAtLength(0);
    var pe = path.getPointAtLength(l);
    var angl = Math.atan2(pe.y - ps.y, pe.x - ps.x) * (180 / Math.PI) - 90;
    var rot_tran = "rotate(" + angl + ")";
    return function (d, i, a) {
        //console.log(d);

        return function (t) {
            var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ") " + rot_tran;
        };
    };
}

var bubble_map = new Datamap({
    element: document.getElementById('world'),
    scope: 'world',
    geographyConfig: {
        popupOnHover: true,
        highlightOnHover: true,
        borderWidth: 2,
        dataUrl: 'https://raw.githubusercontent.com/meenurajapandian/CGDVColombia/master/Viz/geomap/world.topo.json'
    },
    fills: {
        'MAJOR': '#66229D',
        'MEDIUM': '#0fa0fa',
        'MINOR': '#E585C8',
        defaultFill: '#dddddd'
    },
    data: {
        'JH': {
            fillKey: 'MINOR'
        },
        'MH': {
            fillKey: 'MINOR'
        }
    },
    setProjection: function (element) {
        //element is the div box. This is moving the div box center and position.
        var projection = d3.geo.mercator()
            .center([-55, 0]) // always in [East Latitude, North Longitude]
            .scale(160)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

        var path = d3.geo.path().projection(projection);
        return {
            path: path,
            projection: projection
        };
    }
});

let bubbles = [
//generate all to-countries with 0 DirectionAngle and arrowLineLength
{
    centered: "COL",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "ARG",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "BRA",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "CHL",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "ECU",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "MEX",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "PAN",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "PER",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "ESP",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},
{
    centered: "USA",
    fillKey: "MINOR",
    radius: 7,
    state: "CA",
    arrowDirectionAngle: 0,
    arrowLineLength: 0
},

//============ To arrows! ===================
{
//To Colombia.
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 150,
    arrowLineLength: 13
},
{
//TO Argentina
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 90,
    arrowLineLength: 120
},
{
//To Brazil
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 55,
    arrowLineLength: 53
},
{
//To Chile
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 96,
    arrowLineLength: 140
},
{
//To Ecuador
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 145,
    arrowLineLength: 33
},
{
//To Mexico
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 206,
    arrowLineLength: 104
},
{
//To Panama
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 188,
    arrowLineLength: 29
},
{
//To Peru
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 115,
    arrowLineLength: 40
},
{
//To Spain
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 329,
    arrowLineLength: 191
},
{
//TO USA
    centered: "VEN",
    fillKey: "MAJOR",
    radius: 12,
    state: "CA",
    arrowDirectionAngle: 228,
    arrowLineLength: 127
}
]

function renderArrows(targetElementId) {
    let svgRoot = d3.select("#" + targetElementId).select("svg");

    svgRoot.append("svg:defs")
        .append("svg:marker")
        .attr("id", "arrow")
        .attr("refX", 2)
        .attr("refY", 6)
        .attr("markerWidth", 1)
        .attr("markerHeight", 1)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M2,2 L2,11 L10,6 L2,2");

    let linesGroup = svgRoot.append("g");

    linesGroup.attr("class", "lines");

    let bubbleElements = svgRoot.selectAll(".datamaps-bubble")[0];

    bubbleElements.forEach(function (bubbleElement) {
        let xPosition = bubbleElement.cx.baseVal.value;
        let yPosition = bubbleElement.cy.baseVal.value;
        let datum = d3.select(bubbleElement).datum();

        let degree = datum.arrowDirectionAngle;
        let radius = datum.arrowLineLength;
        let theta = degree * Math.PI / 180;

        if(radius !== 0 ){
            let path = linesGroup.append("path")
                .data([{
                    source: {
                        x: xPosition,
                        y: yPosition
                    },
                    target: {
                        x: xPosition + radius * Math.cos(theta),
                        y: yPosition + radius * Math.sin(theta)
                    }
                }])
                .style("stroke", "#66229D")
                .style("stroke-width", "1.5px")
                .style("fill", "#C49EE3")
                //.style("marker-end", "url(#arrow)")
                .attr("d", lineData);


            let arrow = svgRoot.append("svg:path")
                .attr("d", d3.svg.symbol().type("triangle-down")(5, 1))
                .attr("fill", "#66229D");


            arrow.transition()
                .duration(2000)
                .ease("linear")
                .attrTween("transform", translateAlong(path.node()))

            var totalLength = path.node().getTotalLength();

            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);
        }

    });
}

var refugeescale = d3.scale.ordinal()
                        .domain(["VEN", "COL", "ARG","BRA", "CHL", "ECU","MEX", "PAN","PER","ESP","USA"])
                        .range([3078183, 1731789,144182,265586,557414,262572,2176329,2276067, 2932341, 31692,93059])

// // ISO ID code for city or <state></state>
// setTimeout(() => { // only start drawing bubbles on the map when map has rendered completely.
//     bubble_map.bubbles(bubbles, {
//         popupTemplate: function (geo, data) {
//             return `<div class="hoverinfo">Country: ${data.centered}, Refugees: ${refugeescale(data.centered)}</div>`;
//         }
//     });
//     renderArrows("world");
// }, 1000);


var svgobj = d3.select("#world")
                .on("mouseenter",settimeout1)
                .on("mouseleave",setmouseout );

function settimeout1(){
    setTimeout(() => { // only start drawing bubbles on the map when map has rendered completely.
        bubble_map.bubbles(bubbles, {
            popupTemplate: function (geo, data) {
                return `<div class="hoverinfo">Country: ${data.centered}, Refugees: ${refugeescale(data.centered)}</div>`;
            }
        });
        renderArrows("world");
    }, 1000);
}
function setmouseout(){
    d3.selectAll("svg:defs").remove()
}
