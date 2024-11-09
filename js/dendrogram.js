function createTreeJSON(currentNode, leftnode, rightnode, hgt, order, nrow)
{
    var children=[];
    var ent={};
    ent.name=currentNode;


    if(currentNode<nrow)
        ent.height=0;
    else
    {
        ent.height=hgt[currentNode-nrow];
        //console.log(currentNode+","+(currentNode-nrow)+":"+hgt[currentNode-nrow]);
    }

    if(currentNode>=nrow) 
    {
        children.push(createTreeJSON(leftnode[currentNode-nrow], leftnode, rightnode, hgt, order, nrow));
        children.push(createTreeJSON(rightnode[currentNode-nrow], leftnode, rightnode, hgt, order, nrow));
        ent.children=children;
    }

    if(currentNode<nrow)
        ent.order=order[currentNode];
    else
        ent.order=children[0].order;

    return ent;
    //JSON.Stringify(ent);  

}


function drawRowTree(data2, nowID, rowTreeX, rowTreeY, mode, heatmapId, row_number, cellHeight, firstRunRowTree) {
    //var nowID = "rowTree";
    //var rowTreeX = 1000;
    //var rowTreeY = 0;
    //
    // ************** Generate the tree diagram  *****************
    var height = row_number*cellHeight,
        width = height/3;

    //
    /*
    var svg = d3.select('#container').append('svg')
      .attr('width', width + 300)
      .attr('height', height + 60)
      .append('g')
        .attr('transform', 'translate(30,30)');*/
    var svg = d3.select(heatmapId).select("svg").select("#gap");

     //var root_node = d3.hierarchy(colorCluster.tree());
     //console.log(colorCluster.tree());
    var root_node = d3.hierarchy(data2);
    console.log("root_node");
    console.log(root_node);
    var cluster = d3.cluster()
      .size([height, width])
      .separation(function separation(a, b) {
        return a.parent == b.parent ? 1 : 1;
    });


    //function update(source) {
      //var nodes = cluster(root_node.sum(function(d) { return d.value; })
       // .sort(function(a, b) { return b.height - a.height || b.value - a.value; }));
    var nodes = cluster(root_node
        .sort(function(a, b) { return d3.ascending(a.data.order, b.data.order); }));
    var links = nodes.links();
    /*
        console.log("clustered nodes");
        console.log(nodes);
        console.log("clustered nodes (leaves)");
        console.log(nodes.leaves());
        console.log("clustered nodes (ancestors)"); // from root
        console.log(nodes.ancestors());
        console.log("clustered nodes (descendants)"); // from root
        console.log(nodes.descendants());
        console.log("clustered links");
        console.log(links);
    */
    var x = d3.scaleLinear()
        .domain(d3.extent(nodes.descendants(), function(d) { return d.data.height; }))
        .range([width, 0]);

      // http://bl.ocks.org/mbostock/2429963
    var elbow = function (d, i) {
        return "M" + (width-x(d.source.data.height)) + "," + d.source.x
          + "V" + d.target.x + "H" + (width-x(d.target.data.height));
    };

    if(!firstRunRowTree && mode == 0)
        d3.selectAll("#"+nowID).remove();

    var rowTreeSvg = svg.append("g")
        .attr("id", nowID)
        .attr("class", nowID)
        .attr("x", rowTreeX)
        .attr("y", rowTreeY)
        .attr("transform", function(d, i) {
            return "translate(" + rowTreeX + "," + rowTreeY + ")"; 
        });
                //.selectAll('.link')
    var link = rowTreeSvg.selectAll('.link')
        .data(links)
        .enter().append('path')
          .attr('class', 'link')
          .attr('id', function(d) { return "path_"+d.source.data.name; })
          .attr('stroke', '#AAA')
          .attr('stroke-width', '1.0px')
          .attr('d', elbow);

    /*  var node = svg.append("g")
                .attr("id", nowID)
                .attr("class", nowID)
                .attr("x", 500)
                .attr("y", 500)
                .selectAll('.node')    */
    var node = rowTreeSvg.selectAll('.node')
        .data(nodes.descendants())
        .enter().append('g')
          .attr('class', 'node')
          .attr('transform', function(d) { return 'translate('+(width-x(d.data.height))+','+d.x+')'; });

    node.append('circle')
        .style('stroke', 'none')
        .style('fill', '#777')
        .attr('r', function(d) { return d.children ? 1.5 : 0 })
        .on('mouseover', function () {
          d3.select(this)
            .style('fill', '#f00');
        })
        .on('mouseleave', function () {
          d3.select(this)
            .style('fill', '#777');
        })
        .on('dblclick', function (d) {;
          var subtree = d.children[0];
          d.children[0] = d.children[1];
          d.children[1] = subtree;
          update();
        })
        .on('click', function (d) {
          selectSubTree(d, mode);
          //update();
        });
    /*
      node.append('text')
        .attr('dx', -18)
        .attr('dy', 2)
        .text(function(d) { return d.children ? '' : d.data.name; });
        */
    //}

    function update() {

          //nodes = null;
        nodes = cluster(root_node);

          //links = nodes.links();
        var node_update = d3.select("#rowTree").selectAll('.node');
          //var t = svg1.transition().duration(1000);

        var x_update = d3.scaleLinear()
            .domain(d3.extent(nodes.descendants(), function(d) { return d.data.height; }))
            .range([width, 0]);

          // http://bl.ocks.org/mbostock/2429963
        var elbow_update = function (d, i) {
            return "M" + (width-x(d.source.data.height)) + "," + d.source.x
              + "V" + d.target.x + "H" + (width-x(d.target.data.height));
        };
        node_update.data(nodes.descendants())
            .attr('transform', function(d) { console.log(d.data.name+":"+(width-x_update(d.data.height))+','+d.x); return 'translate('+(width-x_update(d.data.height))+','+d.x+')'; });
          
        var link1 = d3.select("#rowTree").selectAll('.link')
        link1.data(links)
            .attr('d', elbow);

        var circle1 = node_update.selectAll('circle')
          //.attr('r', function(d) { return d.children ? 10.5 : 15 });
          
        circle1.remove();
          
        node_update.append('circle')
            .style('stroke', 'none')
            .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#777'; })
            .attr('r', function(d) { return d.children ? 1.5 : 0 })
            .on('mouseover', function () {
              d3.select(this)
                .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#f00'; });
            })
            .on('mouseleave', function () {
              d3.select(this)
                .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#777'; });
            })
            .on('dblclick', function (d) {
              var subtree = d.children[0];
              d.children[0] = d.children[1];
              d.children[1] = subtree;
              
              update();
            })
            .on('click', function (d) {
              selectSubTree(d, mode);
              //update();
            });
        
      /*
      var text_update = node_update.selectAll('text')
      text_update.remove();
      
      node_update.append('text')
        .attr('dx', -18)
        .attr('dy', 2)
        .text(function(d) { return d.children ? '' : d.data.name; });
        */

        console.log("clustered nodes");
        console.log(nodes);
        console.log("clustered nodes (leaves)");
        console.log(nodes.leaves());
        console.log("clustered nodes (ancestors)"); // from root
        console.log(nodes.ancestors());
        console.log("clustered nodes (descendants)"); // from root
        console.log(nodes.descendants());
        console.log("clustered links");
        console.log(links);
    }

}

function drawColTree(data2, nowID, colTreeX, colTreeY, mode, heatmapId, col_number, cellWidth, firstRunColTree) {
console.log(nowID, colTreeX, colTreeY, mode, heatmapId, col_number, cellWidth, firstRunColTree);
    // ************** Generate the tree diagram  *****************
    var height = col_number*cellWidth,
        width = height/3;

    var svg = d3.select("#heatmap").select("svg").select("#gap");

    var root_node = d3.hierarchy(data2);
    console.log("root_node");
    console.log(root_node);
    var cluster = d3.cluster()
      .size([height, width])
      .separation(function separation(a, b) {
        return a.parent == b.parent ? 1 : 1;
    });

    var nodes = cluster(root_node
        .sort(function(a, b) { return d3.ascending(a.data.order, b.data.order); }));
    var links = nodes.links();

    var x = d3.scaleLinear()
        .domain(d3.extent(nodes.descendants(), function(d) { return d.data.height; }))
        .range([width, 0]);

    var elbow = function (d, i) {
        return "M" + (width-x(d.source.data.height)) + "," + d.source.x
          + "V" + d.target.x + "H" + (width-x(d.target.data.height));
    };

    if(!firstRunColTree && mode == 1)
        d3.selectAll("#"+nowID).remove();

    var colTreeSvg = svg.append("g")
        .attr("id", nowID)
        .attr("class", nowID)
        .attr("x", colTreeX)
        .attr("y", colTreeY)
        .attr("transform", function(d, i) {
            return "translate(" + colTreeX + "," + colTreeY + ")"; 
        });
                //.selectAll('.link')
    var link = colTreeSvg.selectAll('.link')
        .data(links)
        .enter().append('path')
          .attr('class', 'link')
          .attr('id', function(d) { return "path_"+d.source.data.name; })
          .attr('stroke', '#AAA')
          .attr('stroke-width', '1.0px')
          .attr('d', elbow);

    /*  var node = svg.append("g")
                .attr("id", nowID)
                .attr("class", nowID)
                .attr("x", 500)
                .attr("y", 500)
                .selectAll('.node')    */
    var node = colTreeSvg.selectAll('.node')
        .data(nodes.descendants())
        .enter().append('g')
          .attr('class', 'node')
          .attr('transform', function(d) { return 'translate('+(width-x(d.data.height))+','+d.x+')'; });

    node.append('circle')
        .style('stroke', 'none')
        .style('fill', '#777')
        .attr('r', function(d) { return d.children ? 1.5 : 0 })
        .on('mouseover', function () {
          d3.select(this)
            .style('fill', '#f00');
        })
        .on('mouseleave', function () {
          d3.select(this)
            .style('fill', '#777');
        })
        .on('dblclick', function (d) {;
          var subtree = d.children[0];
          d.children[0] = d.children[1];
          d.children[1] = subtree;
          update();
        })
        .on('click', function (d) {
          selectSubTree(d, mode);
          //update();
        });


    function update() {

        nodes = cluster(root_node);

        var node_update = d3.select("#colTree").selectAll('.node');

        var x_update = d3.scaleLinear()
            .domain(d3.extent(nodes.descendants(), function(d) { return d.data.height; }))
            .range([width, 0]);

        var elbow_update = function (d, i) {
            return "M" + (width-x(d.source.data.height)) + "," + d.source.x
              + "V" + d.target.x + "H" + (width-x(d.target.data.height));
        };
        node_update.data(nodes.descendants())
            .attr('transform', function(d) { console.log(d.data.name+":"+(width-x_update(d.data.height))+','+d.x); return 'translate('+(width-x_update(d.data.height))+','+d.x+')'; });
          
        var link1 = d3.select("#colTree").selectAll('.link')
        link1.data(links)
            .attr('d', elbow);

        var circle1 = node_update.selectAll('circle')
          //.attr('r', function(d) { return d.children ? 10.5 : 15 });
          
        circle1.remove();
          
        node_update.append('circle')
            .style('stroke', 'none')
            .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#777'; })
            .attr('r', function(d) { return d.children ? 1.5 : 0 })
            .on('mouseover', function () {
              d3.select(this)
                .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#f00'; });
            })
            .on('mouseleave', function () {
              d3.select(this)
                .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#777'; });
            })
            .on('dblclick', function (d) {
              var subtree = d.children[0];
              d.children[0] = d.children[1];
              d.children[1] = subtree;
              
              update();
            })
            .on('click', function (d) {
              selectSubTree(d, mode);
              //update();
            });
        
      /*
      var text_update = node_update.selectAll('text')
      text_update.remove();
      
      node_update.append('text')
        .attr('dx', -18)
        .attr('dy', 2)
        .text(function(d) { return d.children ? '' : d.data.name; });
        */

        console.log("clustered nodes");
        console.log(nodes);
        console.log("clustered nodes (leaves)");
        console.log(nodes.leaves());
        console.log("clustered nodes (ancestors)"); // from root
        console.log(nodes.ancestors());
        console.log("clustered nodes (descendants)"); // from root
        console.log(nodes.descendants());
        console.log("clustered links");
        console.log(links);
    }

}

function selectSubTree(d, mode) {
    if(mode == 0)
    {
        d3.select("#rowTree").selectAll('.link')
            .attr('stroke', '#AAA');     
        changeRowPathColor(d);   
    }
    else
    {
        d3.select("#colTree").selectAll('.link')
            .attr('stroke', '#AAA');    
        changeColPathColor(d);    
    }

    
}

function changeRowPathColor(d) {

    var children = d.children;
    //console.log(d); 
    if(children){
        d3.select("#rowTree").selectAll('path#path_'+d.data.name)
            //d3.selectAll('path#'+d.data.name+".link")
            //d3.selectAll('#'+d.data.name)
            //svg.selectAll('path').selectAll(d.data.name)
            .attr('stroke', function(a) { return a.source.data.name==d.data.name ? '#f00' : '#AAA';});             
    }
    else
        console.log(d.data.name); 
    
    if (children) children.forEach(changeRowPathColor);

}

function changeColPathColor(d) {

    var children = d.children;
    //console.log(d); 
    if(children){
        d3.select("#colTree").selectAll('path#path_'+d.data.name)
            //d3.selectAll('path#'+d.data.name+".link")
            //d3.selectAll('#'+d.data.name)
            //svg.selectAll('path').selectAll(d.data.name)
            .attr('stroke', function(a) { return a.source.data.name==d.data.name ? '#f00' : '#AAA';});             
    }
    else
        console.log(d.data.name); 
    
    if (children) children.forEach(changeColPathColor);

}

//function drawRowTree_3D(data2, nowID, rowTreeX, rowTreeY, mode, heatmapId, row_number, cellHeight, firstRunRowTree) {
function drawRowTree_3D(data2, nowID, rowTreeX, rowTreeY, mode, heatmapId, gapTmp) {
    // ************** Generate the tree diagram  *****************
    var row_number = gapTmp.row_number;
    var cellHeight = gapTmp.cellHeight;
    var height = row_number*cellHeight,
        width = height/3;

    var svg = d3.select(heatmapId).select("svg").select("#gap");

     //var root_node = d3.hierarchy(colorCluster.tree());
     //console.log(colorCluster.tree());
    var root_node = d3.hierarchy(data2);
    console.log("root_node");
    console.log(root_node);
    var cluster = d3.cluster()
      .size([height, width])
      .separation(function separation(a, b) {
        return a.parent == b.parent ? 1 : 1;
    });


    //function update(source) {
      //var nodes = cluster(root_node.sum(function(d) { return d.value; })
       // .sort(function(a, b) { return b.height - a.height || b.value - a.value; }));
    var nodes = cluster(root_node
        .sort(function(a, b) { return d3.ascending(a.data.order, b.data.order); }));
    var links = nodes.links();
    /*
        console.log("clustered nodes");
        console.log(nodes);
        console.log("clustered nodes (leaves)");
        console.log(nodes.leaves());
        console.log("clustered nodes (ancestors)"); // from root
        console.log(nodes.ancestors());
        console.log("clustered nodes (descendants)"); // from root
        console.log(nodes.descendants());
        console.log("clustered links");
        console.log(links);
    */
    var x = d3.scaleLinear()
        .domain(d3.extent(nodes.descendants(), function(d) { return d.data.height; }))
        .range([width, 0]);

      // http://bl.ocks.org/mbostock/2429963
    var elbow = function (d, i) {
        return "M" + (width-x(d.source.data.height)) + "," + d.source.x
          + "V" + d.target.x + "H" + (width-x(d.target.data.height));
    };

    if(!gapTmp.firstRunRowTree)
        d3.select(heatmapId).selectAll("#"+nowID).remove();

    var rowTreeSvg = svg.append("g")
        .attr("id", nowID)
        .attr("class", nowID)
        .attr("x", rowTreeX)
        .attr("y", rowTreeY)
        .attr("transform", function(d, i) {
            return "translate(" + rowTreeX + "," + rowTreeY + ")"; 
        });
                //.selectAll('.link')
    var link = rowTreeSvg.selectAll('.link')
        .data(links)
        .enter().append('path')
          .attr('class', 'link')
          .attr('id', function(d) { return "path_"+d.source.data.name; })
          .attr('stroke', '#AAA')
          .attr('stroke-width', '1.0px')
          .attr('d', elbow);

    /*  var node = svg.append("g")
                .attr("id", nowID)
                .attr("class", nowID)
                .attr("x", 500)
                .attr("y", 500)
                .selectAll('.node')    */
    var node = rowTreeSvg.selectAll('.node')
        .data(nodes.descendants())
        .enter().append('g')
          .attr('class', 'node')
          .attr('transform', function(d) { return 'translate('+(width-x(d.data.height))+','+d.x+')'; });

    node.append('circle')
        .style('stroke', 'none')
        .style('fill', '#777')
        .attr('r', function(d) { return d.children ? 1.5 : 0 })
        .on('mouseover', function () {
          d3.select(this)
            .style('fill', '#f00');
        })
        .on('mouseleave', function () {
          d3.select(this)
            .style('fill', '#777');
        })
        .on('dblclick', function (d) {;
          var subtree = d.children[0];
          d.children[0] = d.children[1];
          d.children[1] = subtree;
          update();
        })
        .on('click', function (d) {
          selectSubTree(d, mode);
          //update();
        });
    /*
      node.append('text')
        .attr('dx', -18)
        .attr('dy', 2)
        .text(function(d) { return d.children ? '' : d.data.name; });
        */
    //}

    function update() {

          //nodes = null;
        nodes = cluster(root_node);

          //links = nodes.links();
        var node_update = d3.select("#rowTree").selectAll('.node');
          //var t = svg1.transition().duration(1000);

        var x_update = d3.scaleLinear()
            .domain(d3.extent(nodes.descendants(), function(d) { return d.data.height; }))
            .range([width, 0]);

          // http://bl.ocks.org/mbostock/2429963
        var elbow_update = function (d, i) {
            return "M" + (width-x(d.source.data.height)) + "," + d.source.x
              + "V" + d.target.x + "H" + (width-x(d.target.data.height));
        };
        node_update.data(nodes.descendants())
            .attr('transform', function(d) { console.log(d.data.name+":"+(width-x_update(d.data.height))+','+d.x); return 'translate('+(width-x_update(d.data.height))+','+d.x+')'; });
          
        var link1 = d3.select("#rowTree").selectAll('.link')
        link1.data(links)
            .attr('d', elbow);

        var circle1 = node_update.selectAll('circle')
          //.attr('r', function(d) { return d.children ? 10.5 : 15 });
          
        circle1.remove();
          
        node_update.append('circle')
            .style('stroke', 'none')
            .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#777'; })
            .attr('r', function(d) { return d.children ? 1.5 : 0 })
            .on('mouseover', function () {
              d3.select(this)
                .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#f00'; });
            })
            .on('mouseleave', function () {
              d3.select(this)
                .style('fill', function(d) { return d.position ? 'rgb('+d.position.join(',')+')' : '#777'; });
            })
            .on('dblclick', function (d) {
              var subtree = d.children[0];
              d.children[0] = d.children[1];
              d.children[1] = subtree;
              
              update();
            })
            .on('click', function (d) {
              selectSubTree(d, mode);
              //update();
            });
        
      /*
      var text_update = node_update.selectAll('text')
      text_update.remove();
      
      node_update.append('text')
        .attr('dx', -18)
        .attr('dy', 2)
        .text(function(d) { return d.children ? '' : d.data.name; });
        */

        console.log("clustered nodes");
        console.log(nodes);
        console.log("clustered nodes (leaves)");
        console.log(nodes.leaves());
        console.log("clustered nodes (ancestors)"); // from root
        console.log(nodes.ancestors());
        console.log("clustered nodes (descendants)"); // from root
        console.log(nodes.descendants());
        console.log("clustered links");
        console.log(links);
    }

}
