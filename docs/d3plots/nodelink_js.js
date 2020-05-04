 d3.json('https://raw.githubusercontent.com/meenurajapandian/CGDVColombia/master/Viz/nodeline/nodelinkdata.json', 
        function(treeData){

    function getDepth(obj) {
            var depth = 0;
            if (obj.children) {
                obj.children.forEach(function (d) {
                    var tmpDepth = getDepth(d)
                    if (tmpDepth > depth) {
                        depth = tmpDepth
                    }
                })
            }
            return 1 + depth
        }
    var treedepth = getDepth(treeData) //4

    function tohorizontal() {
            var margin = {top: 40, right: 60, bottom: 20, left: 90},
                width = 700 - margin.right - margin.left,
                height = 500 - margin.top - margin.bottom;

            var i = 0,
            duration = 750,
            root;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });

            var svg = d3.select("#idexplore").append("svg")
                .attr("width", width + 2*margin.right + 2*margin.left)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            root = treeData;
            root.x0 = height / 2;
            root.y0 = 0;
            var nodes = tree.nodes(root);

            //#region 
            var value = nodes.map(d=> d.value)
            var multiplier= (d3.max(value)- d3.min(value))/5;
            //var color_scale = d3.scale.linear().domain([d3.min(value),(d3.min(value)+(multiplier * 0.01)),(d3.min(value)+(multiplier * 0.02)),(d3.min(value)+(multiplier * 0.3)),d3.max(value)]).range(["","#afc8e0",'#9eb6d7',"#97aad1","#4d004b"]);
            // var color_scale = d3.scale.linear()
            //                     .domain([d3.min(value),((d3.min(value)+d3.max(value))/1000),d3.max(value)])
            //                     .range(["white","black", "yellow"]);

            var color_scale = d3.scale.linear()
                .domain([d3.min(value),d3.max(value)])
                .interpolate(d3.interpolateLab)
                .range([d3.rgb("#ffffcc"), d3.rgb('#af0225')]);
                
            //#endregion
        
            var mydepth = 3
            function collapseLevel(d) {
                if (d.children && d.depth > mydepth) {
                    d._children = d.children;
                    d._children.forEach(collapseLevel);
                    d.children = null;
                } else if (d.children){
                    d.children.forEach(collapseLevel);
                    }
	        }
            root.children.forEach(collapseLevel); //iterate each node and collapse excluding node zero
	
        update(root);

        d3.select(self.frameElement).style("height", "500px");

        //Legend 
        height1 = 500;
        width1 = 60;

        //Inside Legend creating gradient to append graphical unit using defs (x,y show direction of gradient)
        var gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%') // bottom
            .attr('y1', '100%')
            .attr('x2', '0%') // to top
            .attr('y2', '0%');
            // .attr('spreadMethod', 'pad');
        
        //setting color over the axis 
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#ffffcc")
            .attr("stop-opacity", 1);
        
        // gradient.append("stop")
        //     .attr("offset", "99.05%")
        //     .attr("stop-color", "black")
        //     .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#af0225")
            .attr("stop-opacity", 1);
        
        //Create a rectagle to show the legend scale. 
        var legend = svg.append("rect")
            .attr("width", 10)
            .attr("height", height1 - 250)
            .style("fill", "url(#gradient)")
            .attr('stroke', 'black')
            .attr("transform", "translate("+ (-margin.left + 20) +","+20+")");
        
        //Create a colour legend scale. 
        var legendScale = d3.scale.linear()
            .range([0,(height1 - 250)])
            .domain([d3.max(value), d3.min(value)]);
            
        var legendaxis = d3.svg.axis()
                            .scale(legendScale)    
                            .orient("left")
                            .tickFormat(function(d) {return d/1000000+"m" ;})
                            .ticks(4)
                            .tickSize(1);
        
        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate("+ (margin.left-150) +","+ 20 +")")
                .attr("id", "legendaxis")
                .attr('stroke', 'none')
                //.attr("transform", "translate(10," + height + ")")
                .call(legendaxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", -15);
        
        svg.append("text")
                .attr("class", "legendTitle")
                .attr('id','ylegend')
                .attr("x", -75)
                .attr("y", 12)
                .style("text-decoration", "underline")
                .text("Number of Refugees");

        function update(source) {
            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            
            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });
            
            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });
            
            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", click);
            
            nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("stroke", function(d) { return d._children ? "#FFAB3B" : "#3B8CCF"; });
                
            nodeEnter.append("text")
                    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                    .text(function(d) { return d.name; })
                    .style("fill-opacity", 1e-6);
                
            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
            
            nodeUpdate.select("circle")
                .attr("r", 10)
                .style("fill", function(d) { return String(color_scale(d.value)); })
                .style("stroke", function(d) { return d._children ? "#FFAB3B" : "#3B8CCF"; });
            
            nodeUpdate.select("text")
                .style("fill-opacity", 1);
            
            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();
                        
            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);
            
            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });
            
            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);
            
            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();
            
            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Toggle children on click.
            function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
            }
        }
        function depthcontrol(selectedValue){
            mydepth = selectedValue
            d3.json('nodelinkdata.json', function(treeData){
            root = treeData;
            nodes = tree.nodes(root);
            root.children.forEach(collapseLevel); 
            update(root);
            d3.select(self.frameElement).style("height", "500px");
            })
        }
    }
    
    tohorizontal()
    })