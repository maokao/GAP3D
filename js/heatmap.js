var dataFileName = "";
var importDataFileName = "";
var cellSize = 24;
var cellOriWidth = 24;
var cellOriHeight = 6;
var cellWidth = 24;
var cellHeight = 6;
var xcov_cellWidth = 24;    //equal cellWidth
var xcov_cellHeight = 12;
var ycov_cellWidth = 12;
var ycov_cellHeight = 6;    //equal cellHeight
var colorSpecHeight = 24;
var row_fontsize = 8;
var col_fontsize = 8;
var xcov_fontsize = 8;
var ycov_fontsize = 8;
var max_value;
var min_value;
var rp_max_value;
var rp_min_value;
var cp_max_value;
var cp_min_value;
var svg;
var row_number = 0;
var col_number = 0;
var data = [];
var rowProxData = [];
var colProxData = [];
var row_name = [];
var col_name = [];
var yd_name = [];
var yc_name = [];
var xd_name = [];
var xc_name = [];
var isRowProxfirst = true;
var isColProxfirst = true;
var hasRowName = true;
var hasColName = true;
var yN = 1;
var firstRunRowTree = true;
var firstRunColTree = true;
var rowIsSimilarity = false;
var colIsSimilarity = false;
var treeRowData;
var treeColData;
var row_output_left_array;
var row_output_right_array;
var row_output_hgt_array;
var row_output_order_array;
var col_output_left_array;
var col_output_right_array;
var col_output_hgt_array;
var col_output_order_array;
var row_r2e_order = [];
var col_r2e_order = [];
var rowOrderId = "sortinit_row";
var colOrderId = "sortinit_col";
var rowFlipId = "null";
var colFlipId = "null";
var rowCurrentOrder = [];
var colCurrentOrder = [];
var yd = 1;
var xd = 0;
var yc = 0;
var xc = 0;
var yCov = 0;
var xCov = 0;
var ydData = [];
var ycData = [];
var xdData = [];
var xcData = [];
var yd_X = 0;
var yc_X = 0;
var xd_Y = 0;
var xc_Y = 0;
var yd_max_value = [];
var yd_min_value = [];
var yd_cate_col = [];
var yc_max_value = [];
var yc_min_value = [];
var xd_max_value = [];
var xd_min_value = [];
var xd_cate_col = [];
var xc_max_value = [];
var xc_min_value = [];
var data_max_value = [];
var data_min_value = [];
var data_row_max_value = [];
var data_row_min_value = [];
var viewerPosTop = 200;
var viewerPosLeft = 100;
var optionTargetDataMap = "rawdata";
var isNodeLinkfirst = true;
var importRowCount = 0;
var importColCount = 0;
var importYdiscrCount = 0;
var importYcontiCount = 0;
var importXdiscrCount = 0;
var importXcontiCount = 0;
var importOldYCount = 0;
var importOldXCount = 0;
var ydSortOrder = false;
var ycSortOrder = false;
var xdSortOrder = false;
var xcSortOrder = false;
var rdPalette;
var rpPalette;
var cpPalette;
var ydPalette;
var ycPalette;
var xdPalette;
var xcPalette;
var rdPaletteReverse = false;
var rpPaletteReverse = false;
var cpPaletteReverse = false;
var ydPaletteReverse = false;
var ycPaletteReverse = false;
var xdPaletteReverse = false;
var xcPaletteReverse = false;
var rdminInputRange1;
var rpminInputRange1;
var cpminInputRange1;
var rdmaxInputRange1;
var rpmaxInputRange1;
var cpmaxInputRange1;
var rdminInputRange2;
var rpminInputRange2;
var cpminInputRange2;
var rdmaxInputRange2;
var rpmaxInputRange2;
var cpmaxInputRange2;
var row_Scale_id;
var col_Scale_id;

//#########################################################
function heatmap_display(url, heatmapId, paletteName, delimiter) {


    //==================================================
    var tooltip = d3.select(heatmapId)
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden");

    function zoom() {
        svg.attr('transform', 'translate(' + (viewerPosLeft+d3.event.transform.x) + ',' + (viewerPosTop+d3.event.transform.y-100) + ') scale(' + d3.event.transform.k + ')');
    }

    var zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    //==================================================
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height()-70;

    d3.text(url).then(function(textString) {
        var dataset;
        var psv = d3.dsvFormat(delimiter);
        if(hasColName)
        {         
            //console.log(textString);
            dataset = psv.parse(textString);   
            //console.log(dataset);        
        }
        else
        {
            var tmpColCount = importColCount;
            var header = "v0";
            if(hasRowName)
            {
                header = "Name";

                for( i=0 ;i< yd; i++ )       
                {
                    header = header.concat(delimiter) + "yd" + i;    
                }
                for( i=0 ;i< yc; i++ )       
                {
                    header = header.concat(delimiter) + "yc" + i;    
                }
            }
            else
            {
                if(yd>0)
                {
                    header = "yd0";
                    for( i=1 ;i< yd; i++ )       
                    {
                        header = header.concat(delimiter) + "yd" + i;    
                    }
                    for( i=0 ;i< yc; i++ )       
                    {
                        header = header.concat(delimiter) + "yc" + i;    
                    } 
                }
                else
                {
                    if(yc>0)
                    {
                        header = "yc0";
                        for( i=1 ;i< yc; i++ )       
                        {
                            header = header.concat(delimiter) + "yc" + i;    
                        }
                    }
                }                                    
            }
            for( i=0 ;i< (tmpColCount-yd-yc); i++ )
            {
                if(yd==0 && yc==0)
                {
                    if(i==0)
                        header = "v0";
                    else
                        header = header.concat(delimiter) + "v" + i;
                }
                else
                    header = header.concat(delimiter) + "v" + i;
            }
            var tmpData = header + "\n" + textString;
            dataset = psv.parse(tmpData);
            //console.log(dataset);
        }
 
        //Start to Setup all Heatmap Parameters       
        //setup data size
        row_number = dataset.length;

        //if(!hasColName)
            //row_number = row_number + 1;   

        if(xc>0)
        {
            row_number = row_number - xc;
            xc_Y = -10-xc*xcov_cellHeight; 
            //console.log("yc_X:"+yc_X);  
        }
            
        if(xd>0)
        {
            row_number = row_number - xd;
            xd_Y = xc_Y -10-xd*xcov_cellHeight;
            //console.log("yd_X:"+yd_X);  
        }

        xCov = xd + xc; 

        if(hasRowName)
        {
            col_number = dataset.columns.length-1;
            yN = 1;
        }
        else
        {
            col_number = dataset.columns.length;
            yN = 0;
        }

        if(yc>0)
        {
            col_number = col_number - yc;
            yc_X = -10-yc*ycov_cellWidth; 
            //console.log("yc_X:"+yc_X);  
        }
            
        if(yd>0)
        {
            col_number = col_number - yd;
            yd_X = yc_X -10-yd*ycov_cellWidth;
            //console.log("yd_X:"+yd_X);  
        }

        yCov = yd + yc;

        console.log("row_number: "+row_number);
        console.log("col_number: "+col_number);
        
        //put data to variables
        for( i=0 ;i< row_number; i++)
        {
            if(hasRowName)
                row_name.push(dataset[i+xCov][dataset.columns[0]]);
                //row_name.push(Object.values(dataset[i+xCov])[0]);
            else
                row_name.push("r"+i);
        }
        for( i=0 ;i< col_number; i++ )
        {
            if(hasColName)
                col_name.push(dataset.columns[i+yCov+yN]);
            else
                col_name.push("v"+i);
            //console.log(dataset.columns[i+yCov+yN]);
        }
        for( i=0 ;i< xd; i++)
        {
            if(hasRowName)
                xd_name.push(dataset[i][dataset.columns[0]]);
                //xd_name.push(Object.values(dataset[i])[0]);
            else
                xd_name.push("xd"+i);
        }
        for( i=0 ;i< xc; i++)
        {
            if(hasRowName)
                xc_name.push(dataset[i+xd][dataset.columns[0]]);
                //xc_name.push(Object.values(dataset[i+xd])[0]);
            else
                xc_name.push("xc"+i);
        }
        for( i=0 ;i< yd; i++ )
        {
            if(hasColName)
                yd_name.push(dataset.columns[i+yN]);
            else
                yd_name.push("yd"+i);
            //console.log(dataset.columns[i+yCov+yN]);
        }
        for( i=0 ;i< yc; i++ )
        {
            if(hasColName)
                yc_name.push(dataset.columns[i+yd+yN]);
            else
                yc_name.push("yc"+i);
            //console.log(dataset.columns[i+yCov+yN]);
        }

        for( i=0 ;i< row_number; i++)
        {
            tempdata = [];
            for( j=0 ;j< col_number; j++ )
            {
                tempdata.push(Number(dataset[i+xCov][dataset.columns[j+yCov+yN]]));
                //tempdata.push(Object.values(dataset[i+xCov])[j+yCov+yN]);
            } 
            data.push(tempdata);  
        }

        if(xd>0)
        {
            for( i=0 ;i< xd; i++ )
            {
                tempdata = [];
                for( j=0 ;j< col_number; j++)
                {
                    tempdata.push(Number(dataset[i][dataset.columns[j+yCov+yN]]));
                    //tempdata.push(Object.values(dataset[i])[j+yCov+yN]);
                }   
                xdData.push(tempdata);   
            }
            for( i=0 ;i< xd; i++ )
            {
                xd_max_value[i]=xdData[i][0];
                xd_min_value[i]=xdData[i][0];
                for( j=0 ;j< col_number; j++)
                {
                    if(xd_max_value[i]<xdData[i][j])
                    {
                        xd_max_value[i]=xdData[i][j];   
                    }
                    if(xd_min_value[i]>xdData[i][j])
                    {
                        xd_min_value[i]=xdData[i][j];   
                    }                   
                }
            } 

            for(j=0; j<xd; j++) 
            {
                var temp_xd_cate_col = [];
                for(i=xd_min_value[j]; i<=xd_max_value[j]; i++)   
                {
                    temp_xd_cate_col.push(i);

                }
                //console.log(xd_min_value[j]+","+xd_max_value[j]+","+temp_xd_cate_col);
                xd_cate_col.push(temp_xd_cate_col);
            }
        }

        if(xc>0)
        {
            for( i=0 ;i< xc; i++ )
            {
                tempdata = [];
                for( j=0 ;j< col_number; j++)
                {
                    tempdata.push(Number(dataset[i+xd][dataset.columns[j+yCov+yN]]));
                }   
                xcData.push(tempdata);   
            }
            for( i=0 ;i< xc; i++ )
            {
                xc_max_value[i]=xcData[i][0];
                xc_min_value[i]=xcData[i][0];
                for( j=0 ;j< col_number; j++)
                {
                    if(xc_max_value[i]<xcData[i][j])
                    {
                        xc_max_value[i]=xcData[i][j];   
                    }
                    if(xc_min_value[i]>xcData[i][j])
                    {
                        xc_min_value[i]=xcData[i][j];   
                    }                   
                }
                console.log("xc min and max: "+xc_min_value[i]+","+xc_max_value[i]);
            } 
        }

        if(yd>0)
        {
            for( i=0; i<row_number; i++)
            {
                tempdata = [];
                for( j=0; j<yd; j++ )
                {
                    tempdata.push(Number(dataset[i+xCov][dataset.columns[j+yN]]));
                    //tempdata.push(Object.values(dataset[i+xCov])[j+yN]);
                } 
                ydData.push(tempdata);  
            }     

            for( j=0; j<yd; j++)
            {
                yd_max_value[j]=ydData[0][j];
                yd_min_value[j]=ydData[0][j];
                for( i=0 ;i< row_number; i++)
                {
                    if(yd_max_value[j]<ydData[i][j])
                    {
                        yd_max_value[j]=ydData[i][j];   
                    }
                    if(yd_min_value[j]>ydData[i][j])
                    {
                        yd_min_value[j]=ydData[i][j];   
                    }
                }
            } 
            for(j=0; j<yd; j++) 
            {
                var temp_yd_cate_col = [];
                for(i=yd_min_value[j]; i<=yd_max_value[j]; i++)   
                {
                    //yd_cate_col[j].push(i);
                    temp_yd_cate_col.push(i);

                }
                //console.log(yd_min_value[j]+","+yd_max_value[j]+","+temp_yd_cate_col);
                yd_cate_col.push(temp_yd_cate_col);
            }
               
        }

        if(yc>0)
        {
            for( i=0 ;i< row_number; i++)
            {
                tempdata = [];
                for( j=0 ;j< yc; j++ )
                {
                    tempdata.push(Number(dataset[i+xCov][dataset.columns[j+yd+yN]]));
                    //tempdata.push(Object.values(dataset[i+xCov])[j+yd+yN]);
                } 
                ycData.push(tempdata);  
            }        


            for( j=0 ;j< yc; j++)
            {
                yc_max_value[j]=ycData[0][j];
                yc_min_value[j]=ycData[0][j];
                for( i=0 ;i< row_number; i++)
                {
                    if(yc_max_value[j]<ycData[i][j])
                    {
                        yc_max_value[j]=ycData[i][j];   
                    }
                    if(yc_min_value[j]>ycData[i][j])
                    {
                        yc_min_value[j]=ycData[i][j];   
                    }
                }
            }
        }

        max_value = d3.max(data, function(row) { return d3.max(row) });
        min_value = d3.min(data, function(row) { return d3.min(row) });
        //max_value = d3.max(data, function(row) { return d3.max(row, function(d) { return +d })});
        //min_value = d3.min(data, function(row) { return d3.min(row, function(d) { return +d })});

        for( j=0 ;j< col_number; j++)
        {
            data_max_value[j]=data[0][j];
            data_min_value[j]=data[0][j];
            for( i=0 ;i< row_number; i++)
            {
                if(data_max_value[j]<data[i][j])
                {
                    data_max_value[j]=data[i][j];   
                }
                if(data_min_value[j]>data[i][j])
                {
                    data_min_value[j]=data[i][j];   
                }
            }
        }

        for( i=0 ;i< row_number; i++)
        {
            data_row_max_value[i]=data[i][0];
            data_row_min_value[i]=data[i][0];
            for( j=0 ;j< col_number; j++)
            {
                if(data_row_max_value[i]<data[i][j])
                {
                    data_row_max_value[i]=data[i][j];   
                }
                if(data_row_min_value[i]>data[i][j])
                {
                    data_row_min_value[i]=data[i][j];   
                }
            }
        }

        //console.log(max_value);
        for( i=0 ;i< row_number; i++)
            rowCurrentOrder[i] = i;
        for( i=0 ;i< col_number; i++)
            colCurrentOrder[i] = i;

        var x_ratio = Math.ceil(viewerWidth/(col_number+row_number/2));
        var y_ratio = Math.ceil(viewerHeight/row_number);
        cellOriWidth = x_ratio;
        cellOriHeight = y_ratio;
        cellWidth = x_ratio;
        cellHeight = y_ratio;
        xcov_cellWidth = x_ratio;    //equal cellWidth
        ycov_cellHeight = y_ratio;    //equal cellHeight

        if(cellHeight<6)
            row_fontsize = cellHeight-1;
        else if(cellHeight>=6 && cellHeight<10)    
            row_fontsize = cellHeight-2;
        else if(cellHeight>=10 && cellHeight<12)    
            row_fontsize = cellHeight-3;
        else if(cellHeight>=12 && cellHeight<=24)    
            row_fontsize = 8;
        else
            row_fontsize = cellHeight/3;

        if(row_fontsize<1)
            row_fontsize = 1;

        if(cellWidth<6)
            col_fontsize = cellWidth-1;
        else if(cellWidth>=6 && cellWidth<10)
            col_fontsize = cellWidth-2;
        else if(cellWidth>=10 && cellWidth<12)
            col_fontsize = cellWidth-2;
        else if(cellWidth>=12 && cellWidth<=24)
            col_fontsize = 8;
        else  
            col_fontsize = cellWidth/3;
        if(col_fontsize<1)
            col_fontsize = 1;

        var colorScale = d3.scaleSequential()
            .domain([max_value, min_value])
            .interpolator(d3.interpolateSpectral);

        svg = d3.select(heatmapId).append("svg")
            .attr("width", viewerWidth)
            .attr("height", viewerHeight)
            .attr("id", "gapsvg")
	    .call(zoomListener)
            .append("g")
            .attr("id", "gap")
            .attr("transform", "translate(" + viewerPosLeft + "," + (viewerPosTop-100) + ")");

        svg.append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1);

        var rowSortOrder = false;
        var colSortOrder = false;        

        var rowLabels = svg.append("g")
            .attr("class", "rowLabels")
            .selectAll(".rowLabel")
            //.data(data.index)
            .data(row_name)
            .enter().append("text")
            .text(function(d) {
                //return d.count > 1 ? d.join("/") : d;
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * cellHeight);
            })
            .style("text-anchor", "end")
            .style("font-size", row_fontsize+"px")
            .attr("transform", function(d, i) {
                if(yc>0)
                {
                    if(yd>0)
                        return "translate("+(-3+yd_X)+"," + cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+yc_X)+"," + cellHeight / 1.5 + ")";
                }
                else
                {
                    if(yd>0)
                        return "translate("+(-3+yd_X)+"," + cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + cellHeight / 1.5 + ")";
                }
            })
            .attr("class", "rowLabel mono")
            .attr("id", function(d, i) {
                return "rowLabel_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#rowLabel_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#rowLabel_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                rowSortOrder = !rowSortOrder;
                sortByValues("r", i, rowSortOrder);
                d3.select("#order").property("selectedIndex", 0);
                //$("#order").jqxComboBox({selectedIndex: 0});
            });

        var colLabels = svg.append("g")
            .attr("class", "colLabels")
            .selectAll(".colLabel")
            //.data(data.columns)
            .data(col_name)
            .enter().append("text")
            .text(function(d) {
                //d.shift();
                //return d.count > 1 ? d.reverse().join("/") : d.reverse();
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * cellWidth);
            })
            .style("text-anchor", "left")
            .style("font-size", col_fontsize+"px")
            .attr("transform", function(d, i) {
                if(xc>0)
                {
                    if(xd>0)
                        return "translate(" + cellWidth / 2 + ", "+(-3+xd_Y)+") rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                    else
                        return "translate(" + cellWidth / 2 + ", "+(-3+xc_Y)+") rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                }
                else
                {
                    if(xd>0)
                        return "translate(" + cellWidth / 2 + ", "+(-3+xd_Y)+") rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                    else
                        return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                }
                //return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
            })
            .attr("class", "colLabel mono")
            .attr("id", function(d, i) {
                return "colLabel_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#colLabel_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#colLabel_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                colSortOrder = !colSortOrder;
                sortByValues("c", i, colSortOrder);
                d3.select("#order").property("selectedIndex", 0);
            });


        //reset input range UI
        resetInputRange(min_value,max_value);
        //rdPalette = "Spectral";
        rdPalette = paletteName; 
        rdminInputRange1 = min_value;
        rdmaxInputRange1 = max_value;
        rdminInputRange2 = min_value;
        rdmaxInputRange2 = max_value;
        setupHeatmap2(data,"mv",0,0,0, heatmapId, getColorID(rdPalette));
        //setupHeatmap2(data,"mv",0,0,0, heatmapId, d3.interpolateSpectral);
        
        
        if(yc>0)
        {
            //yc_X = -5-yc*cellWidth; 
            setupycLabel(yc_X-col_fontsize/2, -5, heatmapId);
            ycPalette = "Spectral";
            setupHeatmap2(ycData,"mv12",yc_X,0,12, heatmapId, d3.interpolateSpectral);
            $("#optionDataMap").append($("<option></option>").attr("value", "yc").text("Yconti. covariates"));
        }
        if(yd>0)
        {
            //yd_X = yc_X -5-yd*cellWidth;
            setupydLabel(yd_X-col_fontsize/2, -5, heatmapId);
            //ydPalette = "Spectral";
            setupHeatmap2(ydData,"mv11",yd_X,0,11, heatmapId, d3.schemeSet1);
            $("#optionDataMap").append($("<option></option>").attr("value", "yd").text("Ydisc. covariates"));
        }
        if(xc>0)
        {
            //yc_X = -5-yc*cellWidth; 
            setupxcLabel(col_number*cellWidth+5, xc_Y+xcov_cellHeight-row_fontsize/2, heatmapId);
            xcPalette = "Spectral";
            setupHeatmap2(xcData,"mv14",0,xc_Y,14, heatmapId, d3.interpolateSpectral);
            $("#optionDataMap").append($("<option></option>").attr("value", "xc").text("Xconti. covariates"));
        }
        if(xd>0)
        {
            //yd_X = yc_X -5-yd*cellWidth;
            setupxdLabel(col_number*cellWidth+5, xd_Y+xcov_cellHeight-row_fontsize/2, heatmapId);
            //xdPalette = "Spectral";
            setupHeatmap2(xdData,"mv13",0,xd_Y,13, heatmapId, d3.schemeSet1);
            $("#optionDataMap").append($("<option></option>").attr("value", "xd").text("Xdisc. covariates"));
        }

        rowProxData = new Array(row_number);
        for(i = 0; i < row_number; i++) {
            rowProxData[i] = new Array(row_number);
            for(j = 0; j < row_number; j++) {
                rowProxData[i][j] = 0;
            }
        }
        colProxData = new Array(col_number);
        for(i = 0; i < col_number; i++) {
            colProxData[i] = new Array(col_number);
            for(j = 0; j < col_number; j++) {
                colProxData[i][j] = 0;
            }
        }
        
        
        
        
/*
        var legend_text = [];
        for(i=0 ; i <classesNumber ; i++)
        {
            temp_value = parseFloat(((max_value-min_value)/classesNumber)*i)+parseFloat(min_value);
            legend_text.push(temp_value);
        }
        //console.log(legend_text);
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(500,-300)")
            .selectAll(".legendElement")
            //.data([0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.9])
            .data(legend_text)
            .enter().append("g")
            .attr("class", "legendElement");

        legend.append("svg:rect")
            .attr("x", function(d, i) {
                return legendElementWidth * i;
            })
            .attr("y", viewerPosTop)
            .attr("class", "cellLegend bordered")
            .attr("width", legendElementWidth)
            .attr("height", cellSize / 2)
            .style("fill", function(d, i) {
                return colors[classesNumber-i-1];
            });

        legend.append("text")
            .attr("class", "mono legendElement")
            .text(function(d) {
                return "≥" + Math.round(d * 100) / 100;
            })
            .attr("x", function(d, i) {
                return legendElementWidth * i;
            })
            .attr("y", viewerPosTop + cellSize);
*/
        //==================================================
        // Change ordering of cells
        function sortByValues(rORc, i, sortOrder) {
            //var svg = d3.select(heatmapId).select("svg").select("#gap").select("#mv");
            var t = svg.transition().duration(1000);
            var values = [];
            var sorted;
            d3.selectAll(".c" + rORc + i)
                .filter(function(d) {
                    if (d != null) values.push(d);
                    else values.push(-999); // to handle NaN
                });
            //console.log(values);		
            if (rORc == "r") { // sort on cols
                sorted = d3.range(col_number).sort(function(a, b) {
                    if (sortOrder) {
                        return values[b] - values[a];
                    } else {
                        return values[a] - values[b];
                    }
                });
                console.log(sorted);
                colCurrentOrder = sorted;
                t.select("#mv").selectAll(".cell")
                    .attr("x", function(d) {
                        var col = parseInt(d3.select(this).attr("col"));
                        return sorted.indexOf(col) * cellWidth;
                    });
                //if(t.select("#mv3"))
                if(!isColProxfirst)
                {
                    /*t.select("#mv3").selectAll(".cell")
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * cellWidth;
                        });  
                    t.select("#mv3").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            return sorted.indexOf(row) * cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv3")[0].getAttribute("x");
                            var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                            return "translate(" + temp_x + "," + temp_y + ")";
                        });
                    t.selectAll(".colLabel")
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var temp_y = -5-col_number*cellWidth+cellWidth / 1.5;
                            return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                            //return "translate(" + cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellSize) + ")";
                        });*/
                    t.select("#mv3").selectAll(".cell")
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * cellWidth;
                        });  
                    t.select("#mv3").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            return sorted.indexOf(row) * cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv3")[0].getAttribute("x");
                            var temp_y = sorted.indexOf(row) * cellWidth-10-col_number*cellWidth;

                            if(xc>0)
                            {
                                if(xd>0)
                                    temp_y = temp_y + (-5+xd_Y);
                                else
                                    temp_y = temp_y + (-5+xc_Y);
                            }
                            else
                            {
                                if(xd>0)
                                    temp_y = temp_y + (-5+xd_Y);
                            }
                            //return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                            return "translate(" + temp_x + "," + temp_y + ")";
                        });

                    t.selectAll(".colLabel")
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var temp_y = -10-col_number*cellWidth+cellWidth / 1.5;
                            if(xc>0)
                            {
                                if(xd>0)
                                    temp_y = temp_y + (-3+xd_Y);
                                else
                                    temp_y = temp_y + (-3+xc_Y);
                            }
                            else
                            {
                                if(xd>0)
                                    temp_y = temp_y + (-3+xd_Y);
                            }
                            return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                            //return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                        });
                }    
                else{
                    //redrawColLabels(heatmapId); 
                    t.selectAll(".colLabel")
                        .attr("x", 0)
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var temp_y = 0;
                            if(xc>0)
                            {
                                if(xd>0)
                                    temp_y = temp_y + (-3+xd_Y);
                                else
                                    temp_y = temp_y + (-3+xc_Y);
                            }
                            else
                            {
                                if(xd>0)
                                    temp_y = temp_y + (-3+xd_Y);
                                else
                                    temp_y = temp_y + (-3);
                            }
                            return "translate(" + cellWidth / 2 + ", "+temp_y+") rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                        }); 
                    /*t.selectAll(".colLabel")
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                        });*/
                }
            } else { // sort on rows
                sorted = d3.range(row_number).sort(function(a, b) {
                    if (sortOrder) {
                        return values[b] - values[a];
                    } else {
                        return values[a] - values[b];
                    }
                });
                rowCurrentOrder = sorted;
                t.select("#mv").selectAll(".row")
                    .attr("y", function(d) {
                        var row = parseInt(d3.select(this).attr("id"));
                        return sorted.indexOf(row) * cellHeight;
                    })
                    .attr("transform", function(d, i) {
                        var row = parseInt(d3.select(this).attr("id"));
                        return "translate(0," + sorted.indexOf(row) * cellHeight + ")";
                    });
                if(t.select("#mv2"))
                {
                    //console.log("yes");
                    t.select("#mv2").selectAll(".cell")
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * cellHeight;
                        });  
                    t.select("#mv2").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            return sorted.indexOf(row) * cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv2")[0].getAttribute("x");
                            return "translate(" + temp_x + "," + sorted.indexOf(row) * cellHeight + ")";
                        });

                }
                if(t.select("#mv11"))
                {
                    t.select("#mv11").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            //console.log(sorted.indexOf(row));
                            return sorted.indexOf(row) * cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv11")[0].getAttribute("x");
                            return "translate(0," + sorted.indexOf(row) * cellHeight + ")";
                        });

                }
                if(t.select("#mv12"))
                {
                    t.select("#mv12").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            //console.log(sorted.indexOf(row));
                            return sorted.indexOf(row) * cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv12")[0].getAttribute("x");
                            return "translate(0," + sorted.indexOf(row) * cellHeight + ")";
                        });

                }
                t.selectAll(".rowLabel")
                    .attr("y", function(d, i) {
                        return sorted.indexOf(i) * cellHeight;
                    })
                    .attr("transform", function(d, i) {
                        if(yc>0)
                        {
                            if(yd>0)
                                return "translate("+(-3+yd_X)+"," + cellHeight / 1.5 + ")";
                            else
                                return "translate("+(-3+yc_X)+"," + cellHeight / 1.5 + ")";
                        }
                        else
                        {
                            if(yd>0)
                                return "translate("+(-3+yd_X)+"," + cellHeight / 1.5 + ")";
                            else
                                return "translate(-3," + cellHeight / 1.5 + ")";
                        }
                    });
            }
        }
        //==================================================
        d3.select("#rowprox").on("change", function() { 
          /*  rowProxData = new Array(row_number);
            for(i = 0; i < row_number; i++) {
                rowProxData[i] = new Array(row_number);
                for(j = 0; j < row_number; j++) {
                    rowProxData[i][j] = Math.random();
                }
            }*/
            gtag('event', 'proximity', {'event_category': '按鈕點擊','event_label': 'row prox'});
            var colorID;
            if (this.value == "euclidean_distance"){
                var rowProxData1D = runProximity(0, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = false;
                row_Scale_id = 3;
            }
            else if(this.value == "pearson_correlation"){
                var rowProxData1D = runProximity(1, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 1;
            }
            else if(this.value == "kendalls_tau"){
                var rowProxData1D = runProximity(2, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 1;
            }
            else if(this.value == "spearman_rank"){
                var rowProxData1D = runProximity(3, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 1;
            }
            else if(this.value == "atan_correlation"){
                var rowProxData1D = runProximity(4, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 1;
            }
            else if(this.value == "city_block"){
                var rowProxData1D = runProximity(5, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = false;
                row_Scale_id = 3;
            }
            else if(this.value == "abs_pearson_correlation"){
                var rowProxData1D = runProximity(6, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 1;
            }
            else if(this.value == "uncentered_correlation"){
                var rowProxData1D = runProximity(7, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 1;
            }
            else if(this.value == "abs_uncentered_correlation"){
                var rowProxData1D = runProximity(8, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 1;
            }
            else if(this.value == "covariance"){
                var rowProxData1D = runProximity(9, 0, 0);

                colorID = d3.interpolateRdBu;
                rpPalette = "RdBu";
                rowIsSimilarity = true;
                row_Scale_id = 2;
            }
            else if (this.value == "Hamman"){
                var rowProxData1D = runProximity(20, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }
            else if (this.value == "Jaccard"){
                var rowProxData1D = runProximity(21, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }
            else if (this.value == "Phi"){
                var rowProxData1D = runProximity(22, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }
            else if (this.value == "Rao"){
                var rowProxData1D = runProximity(23, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }
            else if (this.value == "Rogers"){
                var rowProxData1D = runProximity(24, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }
            else if (this.value == "Simple_Match"){
                var rowProxData1D = runProximity(25, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }        
            else if (this.value == "Sneath"){
                var rowProxData1D = runProximity(26, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }
            else if (this.value == "Yule"){
                var rowProxData1D = runProximity(27, 0, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                rowIsSimilarity = true;
                row_Scale_id = 12;
            }

            for(i = 0; i < row_number; i++) {
                for(j = 0; j < row_number; j++) {
                    rowProxData[i][j] = rowProxData1D[i*row_number+j];
                }
            } 

            $("#roworder").prop("disabled",false);
            //console.log("a:"+rowProxData[0][1]);
            if(isRowProxfirst)
            {
                setupHeatmap2(rowProxData,"mv2", col_number*cellWidth+10, 0, 1, heatmapId, colorID);
                $("#optionDataMap").append($("<option></option>").attr("value", "rp").text(" Row Proximity Matrix "));
                //drawColorLegend("rp_colorspec", viewerPosTop, colorID, "Row Proximity Matrix");
                $("#roworder option[value='averagelinkage']").removeAttr('disabled');
                $("#roworder option[value='singlelinkage']").removeAttr('disabled');
                $("#roworder option[value='completelinkage']").removeAttr('disabled');
                $("#roworder option[value='r2e']").removeAttr('disabled');

                $("#roworder_side option[value='averagelinkage']").removeAttr('disabled');
                $("#roworder_side option[value='singlelinkage']").removeAttr('disabled');
                $("#roworder_side option[value='completelinkage']").removeAttr('disabled');
                $("#roworder_side option[value='r2e']").removeAttr('disabled');

                isRowProxfirst = false;
            }
            else
                changeProx(rowProxData,"mv2", heatmapId, 1, colorID);

            //if(rowIsSimilarity)
            if(row_Scale_id == 1)
            {
                rpminInputRange1 = -1;
                rpmaxInputRange1 = 1;
                rpminInputRange2 = -1;
                rpmaxInputRange2 = 1;
            }
            else
            {
                rpminInputRange1 = rp_min_value;
                rpmaxInputRange1 = rp_max_value;
                rpminInputRange2 = rp_min_value;
                rpmaxInputRange2 = rp_max_value;    
            }
        });

        //==================================================
        d3.select("#colprox").on("change", function() { 
            /*
            colProxData = new Array(col_number);
            for(i = 0; i < col_number; i++) {
                colProxData[i] = new Array(col_number);
                for(j = 0; j < col_number; j++) {
                    colProxData[i][j] = Math.random();
                }
            }
            */
            gtag('event', 'proximity', {'event_category': '按鈕點擊','event_label': 'col prox'});
            var colorID;
            if (this.value == "euclidean_distance"){
                var colProxData1D = runProximity(0, 1, 0);

                colorID = d3.interpolateSpectral;
                cpPalette = "Spectral";
                colIsSimilarity = false;
                col_Scale_id = 3;
            }
            else if (this.value == "pearson_correlation"){
                var colProxData1D = runProximity(1, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 1;
            }
            else if (this.value == "kendalls_tau"){
                var colProxData1D = runProximity(2, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 1;
            }
            else if (this.value == "spearman_rank"){
                var colProxData1D = runProximity(3, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 1;
            }
            else if (this.value == "atan_correlation"){
                var colProxData1D = runProximity(4, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 1;
            }
            else if (this.value == "city_block"){
                var colProxData1D = runProximity(5, 1, 0);

                colorID = d3.interpolateSpectral;
                cpPalette = "Spectral";
                rowIsSimilarity = false;
                col_Scale_id = 3;
            }
            else if (this.value == "abs_pearson_correlation"){
                var colProxData1D = runProximity(6, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 1;
            }
            else if (this.value == "uncentered_correlation"){
                var colProxData1D = runProximity(7, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 1;
            }
            else if (this.value == "abs_uncentered_correlation"){
                var colProxData1D = runProximity(8, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 1;
            }
            else if (this.value == "covariance"){
                var colProxData1D = runProximity(9, 1, 0);

                colorID = d3.interpolateRdBu;
                cpPalette = "RdBu";
                colIsSimilarity = true;
                col_Scale_id = 2;
            }
            else if (this.value == "Hamman"){
                var colProxData1D = runProximity(20, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }
            else if (this.value == "Jaccard"){
                var colProxData1D = runProximity(21, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }
            else if (this.value == "Phi"){
                var colProxData1D = runProximity(22, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }
            else if (this.value == "Rao"){
                var colProxData1D = runProximity(23, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }
            else if (this.value == "Rogers"){
                var colProxData1D = runProximity(24, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }
            else if (this.value == "Simple_Match"){
                var colProxData1D = runProximity(25, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }        
            else if (this.value == "Sneath"){
                var colProxData1D = runProximity(26, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }
            else if (this.value == "Yule"){
                var colProxData1D = runProximity(27, 1, 0);

                colorID = d3.interpolateSpectral;
                rpPalette = "Spectral";
                colIsSimilarity = true;
                col_Scale_id = 12;
            }

            for(i = 0; i < col_number; i++) {
                for(j = 0; j < col_number; j++) {
                    colProxData[i][j] = colProxData1D[i*col_number+j];
                }
            }

            $("#colorder").prop("disabled",false);

            if(isColProxfirst)
            {
                var colProxY = -10-col_number*cellWidth;
                if(xc>0)
                {
                    if(xd>0)
                        colProxY = colProxY + (-5+xd_Y);
                    else
                        colProxY = colProxY + (-5+xc_Y);
                }
                else
                {
                    if(xd>0)
                        colProxY = colProxY + (-5+xd_Y);
                }
                setupHeatmap2(colProxData,"mv3", 0, colProxY, 2, heatmapId ,colorID);
                changeColLabelsPosition(heatmapId, col_number);
                $("#optionDataMap").append($("<option></option>").attr("value", "cp").text(" Column Proximity Matrix "));
                //drawColorLegend("cp_colorspec", viewerPosTop, colorID, "Col. Proximity Matrix");
                $("#colorder option[value='averagelinkage']").removeAttr('disabled');
                $("#colorder option[value='singlelinkage']").removeAttr('disabled');
                $("#colorder option[value='completelinkage']").removeAttr('disabled');
                $("#colorder option[value='r2e']").removeAttr('disabled');

                $("#colorder_side option[value='averagelinkage']").removeAttr('disabled');
                $("#colorder_side option[value='singlelinkage']").removeAttr('disabled');
                $("#colorder_side option[value='completelinkage']").removeAttr('disabled');
                $("#colorder_side option[value='r2e']").removeAttr('disabled');

                isColProxfirst = false;
            }
            else
                changeProx(colProxData,"mv3", heatmapId, 2, colorID);

            //if(colIsSimilarity)
            if(col_Scale_id == 1)
            {
                cpminInputRange1 = -1;
                cpmaxInputRange1 = 1;
                cpminInputRange2 = -1;
                cpmaxInputRange2 = 1;
            }
            else
            {
                cpminInputRange1 = cp_min_value;
                cpmaxInputRange1 = cp_max_value;
                cpminInputRange2 = cp_min_value;
                cpmaxInputRange2 = cp_max_value;    
            }

        });

        //==================================================
        d3.select("#optionDataMap").on("change", function() {
           optionTargetDataMap = d3.select("#optionDataMap").property("value");    
           if(optionTargetDataMap == "rawdata")
           {
                setInputRange(rdminInputRange1,rdmaxInputRange1,rdminInputRange2,rdmaxInputRange2,min_value, max_value);
                $('#palette').val(rdPalette);
                if(rdPaletteReverse)
                    $("#isColorReverse").prop("checked", true);
                else
                    $("#isColorReverse").prop("checked", false);    
           }
           else if(optionTargetDataMap == "rp")
           {
                //if(rowIsSimilarity==true)
                if(row_Scale_id == 1)
                    setInputRange(rpminInputRange1,rpmaxInputRange1,rpminInputRange2,rpmaxInputRange2,-1,1);
                else
                    setInputRange(rpminInputRange1,rpmaxInputRange1,rpminInputRange2,rpmaxInputRange2,rp_min_value, rp_max_value);
                $('#palette').val(rpPalette);
                if(rpPaletteReverse)
                    $("#isColorReverse").prop("checked", true);
                else
                    $("#isColorReverse").prop("checked", false);  
           }
           else if(optionTargetDataMap == "cp")
           {
                //if(colIsSimilarity==true)
                if(col_Scale_id == 1)
                    resetInputRange(cpminInputRange1,cpmaxInputRange1,cpminInputRange2,cpmaxInputRange2,-1,1);
                else
                    resetInputRange(cpminInputRange1,cpmaxInputRange1,cpminInputRange2,cpmaxInputRange2,cp_min_value, cp_max_value);
                $('#palette').val(cpPalette);
                if(cpPaletteReverse)
                    $("#isColorReverse").prop("checked", true);
                else
                    $("#isColorReverse").prop("checked", false);  
           }
        });

        //==================================================
        d3.select("#order").on("change", function() {
	       var newOrder = d3.select("#order").property("value");	
            changeOrder(newOrder, heatmapId);
        });

        //==================================================
        d3.select("#roworder").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row order'});
            $("#roworder_side").prop('selectedIndex', $("#roworder").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(rowOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            rowOrderId = d3.select("#roworder").property("value");   
            console.log(rowOrderId);
            if (rowOrderId == "singlelinkage" || rowOrderId == "averagelinkage" || rowOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#rowflip").prop('selectedIndex', 1);
                    $("#rowflip_side").prop('selectedIndex', 1);
                    rowFlipId = "r2e";
                }
            }
            else if(rowOrderId == "r2e")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                rowFlipId = "null";
            }
            else if(rowOrderId == "sortinit_row")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                rowFlipId = "null";
            }
            changeRowOrder(rowOrderId, heatmapId);
        });

        //==================================================
        d3.select("#colorder").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col order'});
            $("#colorder_side").prop('selectedIndex', $("#colorder").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(colOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            colOrderId = d3.select("#colorder").property("value");   
            console.log(colOrderId);
            if (colOrderId == "singlelinkage" || colOrderId == "averagelinkage" || colOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#colflip").prop('selectedIndex', 1);
                    $("#colflip_side").prop('selectedIndex', 1);
                    colFlipId = "r2e";
                }
            }
            else if(colOrderId == "r2e")
            {
                $("#colflip").prop('selectedIndex', 0);  
                $("#colflip_side").prop('selectedIndex', 0); 
                colFlipId = "null";
            }
            else if(colOrderId == "sortinit_col")
            {
                $("#colflip").prop('selectedIndex', 0); 
                $("#colflip_side").prop('selectedIndex', 0); 
                colFlipId = "null";
            }
            changeColOrder(colOrderId, heatmapId);
        });

        //==================================================
        d3.select("#rowflip").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row flip'});
            $("#rowflip_side").prop('selectedIndex', $("#rowflip").prop('selectedIndex'));
            rowFlipId = d3.select("#rowflip").property("value");   
            console.log(rowFlipId);
            changeRowFlip(rowFlipId, heatmapId);
        });

        //==================================================
        d3.select("#colflip").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col flip'});
            $("#colflip_side").prop('selectedIndex', $("#colflip").prop('selectedIndex'));
            colFlipId = d3.select("#colflip").property("value");   
            console.log(colFlipId);
            changeColFlip(colFlipId, heatmapId);
        });
        //==================================================
        d3.select("#roworder_side").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row order'});
            $("#roworder").prop('selectedIndex', $("#roworder_side").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(rowOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            rowOrderId = d3.select("#roworder").property("value");   
            console.log(rowOrderId);
            if (rowOrderId == "singlelinkage" || rowOrderId == "averagelinkage" || rowOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#rowflip").prop('selectedIndex', 1);
                    $("#rowflip_side").prop('selectedIndex', 1);
                    rowFlipId = "r2e";
                }
            }
            else if(rowOrderId == "r2e")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                rowFlipId = "null";
            }
            else if(rowOrderId == "sortinit_row")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                rowFlipId = "null";
            }
            changeRowOrder(rowOrderId, heatmapId);
        });

        //==================================================
        d3.select("#colorder_side").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col order'});
            $("#colorder").prop('selectedIndex', $("#colorder_side").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(colOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            colOrderId = d3.select("#colorder").property("value");   
            console.log(colOrderId);
            if (colOrderId == "singlelinkage" || colOrderId == "averagelinkage" || colOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#colflip").prop('selectedIndex', 1);
                    $("#colflip_side").prop('selectedIndex', 1);
                    colFlipId = "r2e";
                }
            }
            else if(colOrderId == "r2e")
            {
                $("#colflip").prop('selectedIndex', 0);  
                $("#colflip_side").prop('selectedIndex', 0); 
                colFlipId = "null";
            }
            else if(colOrderId == "sortinit_col")
            {
                $("#colflip").prop('selectedIndex', 0); 
                $("#colflip_side").prop('selectedIndex', 0); 
                colFlipId = "null";
            }
            changeColOrder(colOrderId, heatmapId);
        });

        //==================================================
        d3.select("#rowflip_side").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row flip'});
            $("#rowflip").prop('selectedIndex', $("#rowflip_side").prop('selectedIndex'));
            rowFlipId = d3.select("#rowflip").property("value");   
            console.log(rowFlipId);
            changeRowFlip(rowFlipId, heatmapId);
        });

        //==================================================
        d3.select("#colflip_side").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col flip'});
            $("#colflip").prop('selectedIndex', $("#colflip_side").prop('selectedIndex'));
            colFlipId = d3.select("#colflip").property("value");   
            console.log(colFlipId);
            changeColFlip(colFlipId, heatmapId);
        });

        //==================================================
        d3.select("#palette")
            .on("mouseup", function() {
                gtag('event', 'change color', {'event_category': '按鈕點擊','event_label': 'change color'});
                if(optionTargetDataMap == "rawdata")
                    rdPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "rp")
                    rpPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "cp")
                    cpPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "yc")
                    ycPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "yd")
                    ydPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "xc")
                    xcPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "xd")
                    xdPalette = d3.select("#palette").property("value");

        		var newPalette = d3.select("#palette").property("value");
                var newCondition = d3.select("#displaycondition").property("value");
        		if (newPalette != null)						// when interfaced with jQwidget, the ComboBox handles keyup event but value is then not available ?
                    changePalette(newCondition, newPalette, heatmapId);
            })
            .on("change", function() {
                gtag('event', 'change color', {'event_category': '按鈕點擊','event_label': 'change color'});
                if(optionTargetDataMap == "rawdata")
                    rdPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "rp")
                    rpPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "cp")
                    cpPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "yc")
                    ycPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "yd")
                    ydPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "xc")
                    xcPalette = d3.select("#palette").property("value");
                else if(optionTargetDataMap == "xd")
                    xdPalette = d3.select("#palette").property("value");
		        var newPalette = d3.select("#palette").property("value");
                var newCondition = d3.select("#displaycondition").property("value");
                changePalette(newCondition, newPalette, heatmapId);
            });

        //==================================================
        d3.select("#displaycondition")
            .on("mouseup", function() {
                gtag('event', 'change condition', {'event_category': '按鈕點擊','event_label': 'change condition'});
                var newCondition = d3.select("#displaycondition").property("value");
                var newPalette = d3.select("#palette").property("value");
                if (newCondition != null)                     // when interfaced with jQwidget, the ComboBox handles keyup event but value is then not available ?
                    changePalette(newCondition, newPalette, heatmapId);
            })
            .on("change", function() {
                gtag('event', 'change condition', {'event_category': '按鈕點擊','event_label': 'change condition'});
                var newCondition = d3.select("#displaycondition").property("value");
                var newPalette = d3.select("#palette").property("value");
                changePalette(newCondition, newPalette, heatmapId);
            });

        //==================================================
        d3.select("#widthZoomRange").on("mouseup", function() {
            gtag('event', 'zoom', {'event_category': '按鈕點擊','event_label': 'change width'});
            var widthZoomRange = d3.select("#widthZoomRange").property("value");   
            //console.log(widthZoomRange);
            changeWidth(widthZoomRange, heatmapId);
        });

        //==================================================
        d3.select("#heightZoomRange").on("mouseup", function() {
            gtag('event', 'zoom', {'event_category': '按鈕點擊','event_label': 'change height'});
            var heightZoomRange = d3.select("#heightZoomRange").property("value");   
            changeHeight(heightZoomRange, heatmapId);
        });

        //==================================================
        d3.select("#saveOrdering").on("click", function() {
            gtag('event', 'export', {'event_category': '按鈕點擊','event_label': 'export ordering'});
            saveTextAsFile(rowCurrentOrder.join("\t"), "row_ordering.txt");
            saveTextAsFile(colCurrentOrder.join("\t"), "col_ordering.txt");
        });

        //==================================================
        d3.select("#saveProxData").on("click", function() {
            gtag('event', 'export', {'event_category': '按鈕點擊','event_label': 'export proximity'});
            saveTextAsFile(doubleArrayToString(rowProxData), "row_prox.txt");
            saveTextAsFile(doubleArrayToString(colProxData), "col_prox.txt");
        });

        //==================================================
        d3.select("#saveImages").on("click", function() {
            gtag('event', 'export', {'event_category': '按鈕點擊','event_label': 'export image'});
            saveImagetoPNG(dataFileName);
        });
             
        //==================================================
        d3.select("#isColorReverse").on("click", function() {
            gtag('event', 'change color', {'event_category': '按鈕點擊','event_label': 'reverse'});
            var newCondition = d3.select("#displaycondition").property("value");
            var newPalette = d3.select("#palette").property("value");
            if($("#isColorReverse").prop("checked"))
            {
                if(optionTargetDataMap == "rawdata")
                    rdPaletteReverse = true;
                else if(optionTargetDataMap == "rp")
                    rpPaletteReverse = true;
                else if(optionTargetDataMap == "cp")
                    cpPaletteReverse = true;
                else if(optionTargetDataMap == "yd")
                    ydPaletteReverse = true;
                else if(optionTargetDataMap == "yc")
                    ycPaletteReverse = true;
                else if(optionTargetDataMap == "xd")
                    xdPaletteReverse = true;
                else if(optionTargetDataMap == "xc")
                    xcPaletteReverse = true;
            }
            else
            {
                if(optionTargetDataMap == "rawdata")
                    rdPaletteReverse = false;
                else if(optionTargetDataMap == "rp")
                    rpPaletteReverse = false;
                else if(optionTargetDataMap == "cp")
                    cpPaletteReverse = false;
                else if(optionTargetDataMap == "yd")
                    ydPaletteReverse = false;
                else if(optionTargetDataMap == "yc")
                    ycPaletteReverse = false;
                else if(optionTargetDataMap == "xd")
                    xdPaletteReverse = false;
                else if(optionTargetDataMap == "xc")
                    xcPaletteReverse = false;
            }

            changePalette(newCondition, newPalette, heatmapId);
        });  
        
        //==================================================
        //d3.select("#inputRange1").on("change", function() {
        $('#inputRange1').slider().on('slideStop', function(event) {
            gtag('event', 'sectional display', {'event_category': '按鈕點擊','event_label': 'sectional display'});
            if(optionTargetDataMap == "rawdata")
            {
                rdminInputRange1 = $('#inputRange1').data('slider').getValue()[0];
                rdmaxInputRange1 = $('#inputRange1').data('slider').getValue()[1];   
            }        
            else if(optionTargetDataMap == "rp")
            {
                rpminInputRange1 = $('#inputRange1').data('slider').getValue()[0];
                rpmaxInputRange1 = $('#inputRange1').data('slider').getValue()[1];   
            } 
            else if(optionTargetDataMap == "cp")
            {
                cpminInputRange1 = $('#inputRange1').data('slider').getValue()[0];
                cpmaxInputRange1 = $('#inputRange1').data('slider').getValue()[1];   
            } 

            //var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
            //var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
            var newCondition = d3.select("#displaycondition").property("value");
            var newPalette = d3.select("#palette").property("value");
            changePalette(newCondition, newPalette, heatmapId);
        });

        //==================================================
        //d3.select("#inputRange2").on("mouseup", function() {
        $('#inputRange2').slider().on('slideStop', function(event) {
            gtag('event', 'restricted display', {'event_category': '按鈕點擊','event_label': 'restricted display'});
            if(optionTargetDataMap == "rawdata")
            {
                rdminInputRange2 = $('#inputRange2').data('slider').getValue()[0];
                rdmaxInputRange2 = $('#inputRange2').data('slider').getValue()[1];   
            }        
            else if(optionTargetDataMap == "rp")
            {
                rpminInputRange2 = $('#inputRange2').data('slider').getValue()[0];
                rpmaxInputRange2 = $('#inputRange2').data('slider').getValue()[1];   
            } 
            else if(optionTargetDataMap == "cp")
            {
                cpminInputRange2 = $('#inputRange2').data('slider').getValue()[0];
                cpmaxInputRange2 = $('#inputRange2').data('slider').getValue()[1];   
            } 

            var newCondition = d3.select("#displaycondition").property("value");
            var newPalette = d3.select("#palette").property("value");
            changePalette(newCondition, newPalette, heatmapId);
        });
    });


    //==================================================
}

