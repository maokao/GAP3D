class GAP {
    constructor() {
        this.dataFileName = "";
        this.importDataFileName = "";
        this.cellSize = 24;
        this.cellOriWidth = 24;
        this.cellOriHeight = 6;
        this.cellWidth = 24;
        this.cellHeight = 6;
        this.xcov_cellWidth = 24;    //equal cellWidth
        this.xcov_cellHeight = 12;
        this.ycov_cellWidth = 12;
        this.ycov_cellHeight = 6;    //equal cellHeight
        this.colorSpecHeight = 24;
        this.row_fontsize = 8;
        this.col_fontsize = 8;
        this.xcov_fontsize = 8;
        this.ycov_fontsize = 8;
        this.max_value = 0;
        this.min_value = 0;
        this.rp_max_value = 0;
        this.rp_min_value = 0;
        this.cp_max_value = 0;
        this.cp_min_value = 0;
        this.svg = null;
        this.row_number = 0;
        this.col_number = 0;
        this.data = [];
        this.rowProxData = [];
        this.colProxData = [];
        this.row_name = [];
        this.col_name = [];
        this.yd_name = [];
        this.yc_name = [];
        this.xd_name = [];
        this.xc_name = [];
        this.isRowProxfirst = true;
        this.isColProxfirst = true;
        this.hasRowName = true;
        this.hasColName = true;
        this.yN = 1;
        this.firstRunRowTree = true;
        this.firstRunColTree = true;
        this.rowIsSimilarity = false;
        this.colIsSimilarity = false;
        this.treeRowData;
        this.treeColData;
        this.row_output_left_array;
        this.row_output_right_array;
        this.row_output_hgt_array;
        this.row_output_order_array = [];
        this.col_output_left_array;
        this.col_output_right_array;
        this.col_output_hgt_array;
        this.col_output_order_array;
        this.row_r2e_order = [];
        this.col_r2e_order = [];
        this.rowOrderId = "sortinit_row";
        this.colOrderId = "sortinit_col";
        this.rowFlipId = "null";
        this.colFlipId = "null";
        this.rowCurrentOrder = [];
        this.colCurrentOrder = [];
        this.yd = 0;
        this.xd = 0;
        this.yc = 0;
        this.xc = 0;
        this.yCov = 0;
        this.xCov = 0;
        this.ydData = [];
        this.ycData = [];
        this.xdData = [];
        this.xcData = [];
        this.yd_X = 0;
        this.yc_X = 0;
        this.xd_Y = 0;
        this.xc_Y = 0;
        this.yd_max_value = [];
        this.yd_min_value = [];
        this.yd_cate_col = [];
        this.yc_max_value = [];
        this.yc_min_value = [];
        this.xd_max_value = [];
        this.xd_min_value = [];
        this.xd_cate_col = [];
        this.xc_max_value = [];
        this.xc_min_value = [];
        this.data_max_value = [];
        this.data_min_value = [];
        this.data_row_max_value = [];
        this.data_row_min_value = [];
        this.viewerPosTop = 200;
        this.viewerPosLeft = 100;
        this.optionTargetDataMap = "rawdata";
        this.isNodeLinkfirst = true;
        this.importRowCount = 0;
        this.importColCount = 0;
        this.importYdiscrCount = 0;
        this.importYcontiCount = 0;
        this.importXdiscrCount = 0;
        this.importXcontiCount = 0;
        this.importOldYCount = 0;
        this.importOldXCount = 0;
        this.ydSortOrder = false;
        this.ycSortOrder = false;
        this.xdSortOrder = false;
        this.xcSortOrder = false;
        this.rdPalette;
        this.rpPalette;
        this.cpPalette;
        this.ydPalette;
        this.ycPalette;
        this.xdPalette;
        this.xcPalette;
        this.rdPaletteReverse = false;
        this.rpPaletteReverse = false;
        this.cpPaletteReverse = false;
        this.ydPaletteReverse = false;
        this.ycPaletteReverse = false;
        this.xdPaletteReverse = false;
        this.xcPaletteReverse = false;
        this.rdminInputRange1;
        this.rpminInputRange1;
        this.cpminInputRange1;
        this.rdmaxInputRange1;
        this.rpmaxInputRange1;
        this.cpmaxInputRange1;
        this.rdminInputRange2;
        this.rpminInputRange2;
        this.cpminInputRange2;
        this.rdmaxInputRange2;
        this.rpmaxInputRange2;
        this.cpmaxInputRange2;
        this.row_Scale_id;
        this.col_Scale_id;
        this.scaleP=1.0;
        this.heatmapId;
    }

//#########################################################
compute_yc_minmax() {
    var self = this;

    for(let j=0 ;j< self.yc; j++)
    {
        self.yc_max_value[j]=self.ycData[0][j];
        self.yc_min_value[j]=self.ycData[0][j];
        for(let i=1 ;i< self.row_number; i++)
        {
            if(self.yc_max_value[j] < self.ycData[i][j])
            {
                self.yc_max_value[j]=self.ycData[i][j];
            }
            if(self.yc_min_value[j] > self.ycData[i][j])
            {
                self.yc_min_value[j]=self.ycData[i][j];   
            }           
        }
    }
}

//#########################################################
heatmap_display(url, heatmapId, paletteName, delimiter) {
    var self = this;

    self.heatmapId = heatmapId;
    //==================================================
    //var viewerWidth = $(document).width();
    //var viewerHeight = $(document).height() - 70;

    var viewerWidth = d3.select(heatmapId).node().getBoundingClientRect().width;
    var viewerHeight = d3.select(heatmapId).node().getBoundingClientRect().height;

    if(viewerWidth/$(document).width() > viewerHeight/$(document).height())
        self.scaleP = viewerWidth/$(document).width();
    else
        self.scaleP = viewerHeight/$(document).height();

    //==================================================
    var tooltip = d3.select(heatmapId)
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden");

    /*function zoom() {
        self.svg.attr('transform', 'translate(' + (self.viewerPosLeft+d3.event.transform.x) + ',' + (self.viewerPosTop+d3.event.transform.y-100) + ') scale(' + d3.event.transform.k*self.scaleP + ')');
    }*/
    function zoom(event) {
        self.svg.attr('transform', 'translate(' + (self.viewerPosLeft + event.transform.x) + ',' + (self.viewerPosTop + event.transform.y) + ') scale(' + event.transform.k * self.scaleP + ')');
    }

    var zoomListener = d3.zoom().scaleExtent([0.01, 5]).on("zoom", zoom);

    //==================================================
    d3.text(url).then(function(textString) {
    //d3.text(url).then((textString) => {
        var dataset;
        var i = 0;
        var j = 0;
        var psv = d3.dsvFormat(delimiter);
        if(self.hasColName)
        {         
            //console.log(textString);
            dataset = psv.parse(textString);   
            //console.log(dataset);        
        }
        else
        {
            var tmpColCount = self.importColCount;
            var header = "v0";
            if(self.hasRowName)
            {
                header = "Name";

                for( i=0 ;i< self.yd; i++ )       
                {
                    header = header.concat(delimiter) + "self.yd" + i;    
                }
                for( i=0 ;i< self.yc; i++ )       
                {
                    header = header.concat(delimiter) + "self.yc" + i;    
                }
            }
            else
            {
                if(self.yd>0)
                {
                    header = "self.yd0";
                    for( i=1 ;i< self.yd; i++ )       
                    {
                        header = header.concat(delimiter) + "self.yd" + i;    
                    }
                    for( i=0 ;i< self.yc; i++ )       
                    {
                        header = header.concat(delimiter) + "self.yc" + i;    
                    } 
                }
                else
                {
                    if(self.yc>0)
                    {
                        header = "self.yc0";
                        for( i=1 ;i< self.yc; i++ )       
                        {
                            header = header.concat(delimiter) + "self.yc" + i;    
                        }
                    }
                }                                    
            }
            for( i=0 ;i< (tmpColCount-self.yd-self.yc); i++ )
            {
                if(self.yd==0 && self.yc==0)
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
        //setup self.data size
        
        //self.row_number = 150;
        self.row_number = dataset.length;
        //console.log(self.row_number);
        //if(!self.hasColName)
            //self.row_number = self.row_number + 1;   

        if(self.xc>0)
        {
            self.row_number = self.row_number - self.xc;
            self.xc_Y = -10-self.xc*self.xcov_cellHeight; 
            //console.log("self.yc_X:"+self.yc_X);  
        }
            
        if(self.xd>0)
        {
            self.row_number = self.row_number - self.xd;
            self.xd_Y = self.xc_Y -10-self.xd*self.xcov_cellHeight;
            //console.log("self.yd_X:"+self.yd_X);  
        }

        self.xCov = self.xd + self.xc; 

        if(self.hasRowName)
        {
            self.col_number = dataset.columns.length-1;
            self.yN = 1;
        }
        else
        {
            self.col_number = dataset.columns.length;
            self.yN = 0;
        }

        if(self.yc>0)
        {
            self.col_number = self.col_number - self.yc;
            self.yc_X = -10-self.yc*self.ycov_cellWidth; 
            //console.log("self.yc_X:"+self.yc_X);  
        }
            
        if(self.yd>0)
        {
            self.col_number = self.col_number - self.yd;
            self.yd_X = self.yc_X -10-self.yd*self.ycov_cellWidth;
            //console.log("self.yd_X:"+self.yd_X);  
        }

        self.yCov = self.yd + self.yc;

        //console.log("self.row_number: "+self.row_number);
        //console.log("self.col_number: "+self.col_number);
        
        //put self.data to variables
        for( i=0 ;i< self.row_number; i++)
        {
            if(self.hasRowName)
                self.row_name.push(dataset[i+self.xCov][dataset.columns[0]]);
                //self.row_name.push(Object.values(dataset[i+self.xCov])[0]);
            else
                self.row_name.push("r"+i);
        }
        for( i=0 ;i< self.col_number; i++ )
        {
            if(self.hasColName)
                self.col_name.push(dataset.columns[i+self.yCov+self.yN]);
            else
                self.col_name.push("v"+i);
            //console.log(dataset.columns[i+self.yCov+self.yN]);
        }
        for( i=0 ;i< self.xd; i++)
        {
            if(self.hasRowName)
                self.xd_name.push(dataset[i][dataset.columns[0]]);
                //self.xd_name.push(Object.values(dataset[i])[0]);
            else
                self.xd_name.push("self.xd"+i);
        }
        for( i=0 ;i< self.xc; i++)
        {
            if(self.hasRowName)
                self.xc_name.push(dataset[i+self.xd][dataset.columns[0]]);
                //self.xc_name.push(Object.values(dataset[i+self.xd])[0]);
            else
                self.xc_name.push("self.xc"+i);
        }
        for( i=0 ;i< self.yd; i++ )
        {
            if(self.hasColName)
                self.yd_name.push(dataset.columns[i+self.yN]);
            else
                self.yd_name.push("self.yd"+i);
            //console.log(dataset.columns[i+self.yCov+self.yN]);
        }
        for( i=0 ;i< self.yc; i++ )
        {
            if(self.hasColName)
                self.yc_name.push(dataset.columns[i+self.yd+self.yN]);
            else
                self.yc_name.push("self.yc"+i);
            //console.log(dataset.columns[i+self.yCov+self.yN]);
        }

        for( i=0 ;i< self.row_number; i++)
        {
            let tempdata = [];
            for( j=0 ;j< self.col_number; j++ )
            {
                tempdata.push(Number(dataset[i+self.xCov][dataset.columns[j+self.yCov+self.yN]]));
                //tempdata.push(Object.values(dataset[i+self.xCov])[j+self.yCov+self.yN]);
            } 
            self.data.push(tempdata);  
        }

        if(self.xd>0)
        {
            for( i=0 ;i< self.xd; i++ )
            {
                let tempdata = [];
                for( j=0 ;j< self.col_number; j++)
                {
                    tempdata.push(Number(dataset[i][dataset.columns[j+self.yCov+self.yN]]));
                    //tempdata.push(Object.values(dataset[i])[j+self.yCov+self.yN]);
                }   
                self.xdData.push(tempdata);   
            }
            for( i=0 ;i< self.xd; i++ )
            {
                self.xd_max_value[i]=self.xdData[i][0];
                self.xd_min_value[i]=self.xdData[i][0];
                for( j=0 ;j< self.col_number; j++)
                {
                    if(self.xd_max_value[i]<self.xdData[i][j])
                    {
                        self.xd_max_value[i]=self.xdData[i][j];   
                    }
                    if(self.xd_min_value[i]>self.xdData[i][j])
                    {
                        self.xd_min_value[i]=self.xdData[i][j];   
                    }                   
                }
            } 

            for(j=0; j<self.xd; j++) 
            {
                var temp_xd_cate_col = [];
                for(i=self.xd_min_value[j]; i<=self.xd_max_value[j]; i++)   
                {
                    temp_xd_cate_col.push(i);

                }
                //console.log(self.xd_min_value[j]+","+self.xd_max_value[j]+","+temp_xd_cate_col);
                self.xd_cate_col.push(temp_xd_cate_col);
            }
        }

        if(self.xc>0)
        {
            for( i=0 ;i< self.xc; i++ )
            {
                let tempdata = [];
                for( j=0 ;j< self.col_number; j++)
                {
                    tempdata.push(Number(dataset[i+self.xd][dataset.columns[j+self.yCov+self.yN]]));
                }   
                self.xcData.push(tempdata);   
            }
            for( i=0 ;i< self.xc; i++ )
            {
                self.xc_max_value[i]=self.xcData[i][0];
                self.xc_min_value[i]=self.xcData[i][0];
                for( j=0 ;j< self.col_number; j++)
                {
                    if(self.xc_max_value[i]<self.xcData[i][j])
                    {
                        self.xc_max_value[i]=self.xcData[i][j];   
                    }
                    if(self.xc_min_value[i]>self.xcData[i][j])
                    {
                        self.xc_min_value[i]=self.xcData[i][j];   
                    }                   
                }
                console.log("self.xc min and max: "+self.xc_min_value[i]+","+self.xc_max_value[i]);
            } 
        }

        if(self.yd>0)
        {
            for( i=0; i<self.row_number; i++)
            {
                let tempdata = [];
                for( j=0; j<self.yd; j++ )
                {
                    tempdata.push(Number(dataset[i+self.xCov][dataset.columns[j+self.yN]]));
                    //tempdata.push(Object.values(dataset[i+self.xCov])[j+self.yN]);
                } 
                self.ydData.push(tempdata);  
            }     

            for( j=0; j<self.yd; j++)
            {
                self.yd_max_value[j]=self.ydData[0][j];
                self.yd_min_value[j]=self.ydData[0][j];
                for( i=0 ;i< self.row_number; i++)
                {
                    if(self.yd_max_value[j]<self.ydData[i][j])
                    {
                        self.yd_max_value[j]=self.ydData[i][j];   
                    }
                    if(self.yd_min_value[j]>self.ydData[i][j])
                    {
                        self.yd_min_value[j]=self.ydData[i][j];   
                    }
                }
            } 
            for(j=0; j<self.yd; j++) 
            {
                var temp_yd_cate_col = [];
                for(i=self.yd_min_value[j]; i<=self.yd_max_value[j]; i++)   
                {
                    //self.yd_cate_col[j].push(i);
                    temp_yd_cate_col.push(i);

                }
                //console.log(self.yd_min_value[j]+","+self.yd_max_value[j]+","+temp_yd_cate_col);
                self.yd_cate_col.push(temp_yd_cate_col);
            }
               
        }

        if(self.yc>0)
        {
            for( i=0 ;i< self.row_number; i++)
            {
                let tempdata = [];
                for( j=0 ;j< self.yc; j++ )
                {
                    tempdata.push(Number(dataset[i+self.xCov][dataset.columns[j+self.yd+self.yN]]));
                    //tempdata.push(Object.values(dataset[i+self.xCov])[j+self.yd+self.yN]);
                } 
                self.ycData.push(tempdata);  
            }        


            for( j=0 ;j< self.yc; j++)
            {
                self.yc_max_value[j]=self.ycData[0][j];
                self.yc_min_value[j]=self.ycData[0][j];
                for( i=0 ;i< self.row_number; i++)
                {
                    if(self.yc_max_value[j]<self.ycData[i][j])
                    {
                        self.yc_max_value[j]=self.ycData[i][j];   
                    }
                    if(self.yc_min_value[j]>self.ycData[i][j])
                    {
                        self.yc_min_value[j]=self.ycData[i][j];   
                    }
                }
            }
        }

        self.max_value = d3.max(self.data, function(row) { return d3.max(row) });
        self.min_value = d3.min(self.data, function(row) { return d3.min(row) });
        //self.max_value = d3.max(self.data, function(row) { return d3.max(row, function(d) { return +d })});
        //self.min_value = d3.min(self.data, function(row) { return d3.min(row, function(d) { return +d })});

        for( j=0 ;j< self.col_number; j++)
        {
            self.data_max_value[j]=self.data[0][j];
            self.data_min_value[j]=self.data[0][j];
            for( i=0 ;i< self.row_number; i++)
            {
                if(self.data_max_value[j]<self.data[i][j])
                {
                    self.data_max_value[j]=self.data[i][j];   
                }
                if(self.data_min_value[j]>self.data[i][j])
                {
                    self.data_min_value[j]=self.data[i][j];   
                }
            }
        }

        for( i=0 ;i< self.row_number; i++)
        {
            self.data_row_max_value[i]=self.data[i][0];
            self.data_row_min_value[i]=self.data[i][0];
            for( j=0 ;j< self.col_number; j++)
            {
                if(self.data_row_max_value[i]<self.data[i][j])
                {
                    self.data_row_max_value[i]=self.data[i][j];   
                }
                if(self.data_row_min_value[i]>self.data[i][j])
                {
                    self.data_row_min_value[i]=self.data[i][j];   
                }
            }
        }

        //console.log(self.max_value);
        for( i=0 ;i< self.row_number; i++)
            self.rowCurrentOrder[i] = i;
        for( i=0 ;i< self.col_number; i++)
            self.colCurrentOrder[i] = i;

        var x_ratio = Math.ceil(viewerWidth/(self.col_number+self.row_number/2));
        var y_ratio = Math.ceil(viewerHeight/self.row_number);
        self.cellOriWidth = x_ratio;
        self.cellOriHeight = y_ratio;
        self.cellWidth = x_ratio;
        self.cellHeight = y_ratio;
        self.xcov_cellWidth = x_ratio;    //equal self.cellWidth
        self.ycov_cellHeight = y_ratio;    //equal self.cellHeight

        if(self.cellHeight<6)
            self.row_fontsize = self.cellHeight-1;
        else if(self.cellHeight>=6 && self.cellHeight<10)    
            self.row_fontsize = self.cellHeight-2;
        else if(self.cellHeight>=10 && self.cellHeight<12)    
            self.row_fontsize = self.cellHeight-3;
        else if(self.cellHeight>=12 && self.cellHeight<=24)    
            self.row_fontsize = 8;
        else
            self.row_fontsize = self.cellHeight/3;

        if(self.row_fontsize<1)
            self.row_fontsize = 1;

        if(self.cellWidth<6)
            self.col_fontsize = self.cellWidth-1;
        else if(self.cellWidth>=6 && self.cellWidth<10)
            self.col_fontsize = self.cellWidth-2;
        else if(self.cellWidth>=10 && self.cellWidth<12)
            self.col_fontsize = self.cellWidth-2;
        else if(self.cellWidth>=12 && self.cellWidth<=24)
            self.col_fontsize = 8;
        else  
            self.col_fontsize = self.cellWidth/3;
        if(self.col_fontsize<1)
            self.col_fontsize = 1;

        var colorScale = d3.scaleSequential()
            .domain([self.max_value, self.min_value])
            .interpolator(d3.interpolateSpectral);

        self.svg = d3.select(heatmapId).append("svg")
            .attr("width", viewerWidth)
            .attr("height", viewerHeight)
            .attr("id", "gapsvg")
	    .call(zoomListener)
            .append("g")
            .attr("id", "gap")
            //.attr("transform", "translate(" + self.viewerPosLeft + "," + (self.viewerPosTop-100) + ")");
            .attr('transform', 'translate(' + self.viewerPosLeft + ',' + (self.viewerPosTop-100) + ') scale(' + self.scaleP + ')');

        self.svg.append('defs')
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

        var rowLabels = self.svg.append("g")
            .attr("class", "rowLabels")
            .selectAll(".rowLabel")
            //.data(self.data.index)
            .data(self.row_name)
            .enter().append("text")
            .text(function(d) {
                //return d.count > 1 ? d.join("/") : d;
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * self.cellHeight);
            })
            .style("text-anchor", "end")
            .style("font-size", self.row_fontsize+"px")
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.cellHeight / 1.5 + ")";
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

        var colLabels = self.svg.append("g")
            .attr("class", "colLabels")
            .selectAll(".colLabel")
            //.data(self.data.columns)
            .data(self.col_name)
            .enter().append("text")
            .text(function(d) {
                //d.shift();
                //return d.count > 1 ? d.reverse().join("/") : d.reverse();
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * self.cellWidth);
            })
            .style("text-anchor", "left")
            .style("font-size", self.col_fontsize+"px")
            .attr("transform", function(d, i) {
                if(self.xc>0)
                {
                    if(self.xd>0)
                        return "translate(" + self.cellWidth / 2 + ", "+(-3+self.xd_Y)+") rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                    else
                        return "translate(" + self.cellWidth / 2 + ", "+(-3+self.xc_Y)+") rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                }
                else
                {
                    if(self.xd>0)
                        return "translate(" + self.cellWidth / 2 + ", "+(-3+self.xd_Y)+") rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                    else
                        return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                }
                //return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
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
        resetInputRange(self.min_value,self.max_value);
        //self.rdPalette = "Spectral";
        self.rdPalette = paletteName; 
        self.rdminInputRange1 = self.min_value;
        self.rdmaxInputRange1 = self.max_value;
        self.rdminInputRange2 = self.min_value;
        self.rdmaxInputRange2 = self.max_value;
        self.setupHeatmap2(self.data,"mv",0,0,0, heatmapId, self.getColorID(self.rdPalette));
        //this.setupHeatmap2(self.data,"mv",0,0,0, heatmapId, d3.interpolateSpectral);
        
        
        if(self.yc>0)
        {
            //self.yc_X = -5-self.yc*self.cellWidth; 
            self.setupycLabel(self.yc_X-self.col_fontsize/2, -5, heatmapId);
            self.ycPalette = "Spectral";
            self.setupHeatmap2(self.ycData,"mv12",self.yc_X,0,12, heatmapId, d3.interpolateSpectral);
            $("#optionDataMap").append($("<option></option>").attr("value", "self.yc").text("Yconti. covariates"));
        }
        if(self.yd>0)
        {
            //self.yd_X = self.yc_X -5-self.yd*self.cellWidth;
            self.setupydLabel(self.yd_X-self.col_fontsize/2, -5, heatmapId);
            //self.ydPalette = "Spectral";
            self.setupHeatmap2(self.ydData,"mv11",self.yd_X,0,11, heatmapId, d3.schemeSet1);
            $("#optionDataMap").append($("<option></option>").attr("value", "self.yd").text("Ydisc. covariates"));
        }
        if(self.xc>0)
        {
            //self.yc_X = -5-self.yc*self.cellWidth; 
            self.setupxcLabel(self.col_number*self.cellWidth+5, self.xc_Y+self.xcov_cellHeight-self.row_fontsize/2, heatmapId);
            self.xcPalette = "Spectral";
            self.setupHeatmap2(self.xcData,"mv14",0,self.xc_Y,14, heatmapId, d3.interpolateSpectral);
            $("#optionDataMap").append($("<option></option>").attr("value", "self.xc").text("Xconti. covariates"));
        }
        if(self.xd>0)
        {
            //self.yd_X = self.yc_X -5-self.yd*self.cellWidth;
            self.setupxdLabel(self.col_number*self.cellWidth+5, self.xd_Y+self.xcov_cellHeight-self.row_fontsize/2, heatmapId);
            //self.xdPalette = "Spectral";
            self.setupHeatmap2(self.xdData,"mv13",0,self.xd_Y,13, heatmapId, d3.schemeSet1);
            $("#optionDataMap").append($("<option></option>").attr("value", "self.xd").text("Xdisc. covariates"));
        }

        self.rowProxData = new Array(self.row_number);
        for(i = 0; i < self.row_number; i++) {
            self.rowProxData[i] = new Array(self.row_number);
            for(j = 0; j < self.row_number; j++) {
                self.rowProxData[i][j] = 0;
            }
        }
        self.colProxData = new Array(self.col_number);
        for(i = 0; i < self.col_number; i++) {
            self.colProxData[i] = new Array(self.col_number);
            for(j = 0; j < self.col_number; j++) {
                self.colProxData[i][j] = 0;
            }
        }
        
        
        
        
/*
        var legend_text = [];
        for(i=0 ; i <classesNumber ; i++)
        {
            temp_value = parseFloat(((self.max_value-self.min_value)/classesNumber)*i)+parseFloat(self.min_value);
            legend_text.push(temp_value);
        }
        //console.log(legend_text);
        var legend = self.svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(500,-300)")
            .selectAll(".legendElement")
            //.data([0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.9])
            .data(legend_text)
            .enter().append("g")
            .attr("class", "legendElement");

        legend.append("self.svg:rect")
            .attr("x", function(d, i) {
                return legendElementWidth * i;
            })
            .attr("y", self.viewerPosTop)
            .attr("class", "cellLegend bordered")
            .attr("width", legendElementWidth)
            .attr("height", self.cellSize / 2)
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
            .attr("y", self.viewerPosTop + self.cellSize);
*/
        //==================================================
        // Change ordering of cells
        function sortByValues(rORc, i, sortOrder) {
            //var self.svg = d3.select(heatmapId).select("self.svg").select("#gap").select("#mv");
            var t = self.svg.transition().duration(1000);
            var values = [];
            var sorted;
            d3.selectAll(".c" + rORc + i)
                .filter(function(d) {
                    if (d != null) values.push(d);
                    else values.push(-999); // to handle NaN
                });
            //console.log(values);		
            if (rORc == "r") { // sort on cols
                sorted = d3.range(self.col_number).sort(function(a, b) {
                    if (sortOrder) {
                        return values[b] - values[a];
                    } else {
                        return values[a] - values[b];
                    }
                });
                console.log(sorted);
                self.colCurrentOrder = sorted;
                t.select("#mv").selectAll(".cell")
                    .attr("x", function(d) {
                        var col = parseInt(d3.select(this).attr("col"));
                        return sorted.indexOf(col) * self.cellWidth;
                    });
                //if(t.select("#mv3"))
                if(!self.isColProxfirst)
                {

                    t.select("#mv3").selectAll(".cell")
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * self.cellWidth;
                        });  
                    t.select("#mv3").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            return sorted.indexOf(row) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv3")[0].getAttribute("x");
                            var temp_y = sorted.indexOf(row) * self.cellWidth-10-self.col_number*self.cellWidth;

                            if(self.xc>0)
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-5+self.xd_Y);
                                else
                                    temp_y = temp_y + (-5+self.xc_Y);
                            }
                            else
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-5+self.xd_Y);
                            }
                            //return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                            return "translate(" + temp_x + "," + temp_y + ")";
                        });

                    t.selectAll(".colLabel")
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                            if(self.xc>0)
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                                else
                                    temp_y = temp_y + (-3+self.xc_Y);
                            }
                            else
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                            }
                            return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                            //return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                        });
                }    
                else{
                    //redrawColLabels(heatmapId); 
                    t.selectAll(".colLabel")
                        .attr("x", 0)
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var temp_y = 0;
                            if(self.xc>0)
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                                else
                                    temp_y = temp_y + (-3+self.xc_Y);
                            }
                            else
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                                else
                                    temp_y = temp_y + (-3);
                            }
                            return "translate(" + self.cellWidth / 2 + ", "+temp_y+") rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                        }); 
                    /*t.selectAll(".colLabel")
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                        });*/
                }
            } else { // sort on rows
                sorted = d3.range(self.row_number).sort(function(a, b) {
                    if (sortOrder) {
                        return values[b] - values[a];
                    } else {
                        return values[a] - values[b];
                    }
                });
                self.rowCurrentOrder = sorted;
                t.select("#mv").selectAll(".row")
                    .attr("y", function(d) {
                        var row = parseInt(d3.select(this).attr("id"));
                        return sorted.indexOf(row) * self.cellHeight;
                    })
                    .attr("transform", function(d, i) {
                        var row = parseInt(d3.select(this).attr("id"));
                        return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                    });
                if(t.select("#mv2"))
                {
                    //console.log("yes");
                    t.select("#mv2").selectAll(".cell")
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * self.cellHeight;
                        });  
                    t.select("#mv2").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            return sorted.indexOf(row) * self.cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv2")[0].getAttribute("x");
                            return "translate(" + temp_x + "," + sorted.indexOf(row) * self.cellHeight + ")";
                        });

                }
                if(t.select("#mv11"))
                {
                    t.select("#mv11").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            //console.log(sorted.indexOf(row));
                            return sorted.indexOf(row) * self.cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv11")[0].getAttribute("x");
                            return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                        });

                }
                if(t.select("#mv12"))
                {
                    t.select("#mv12").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            //console.log(sorted.indexOf(row));
                            return sorted.indexOf(row) * self.cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv12")[0].getAttribute("x");
                            return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                        });

                }
                t.selectAll(".rowLabel")
                    .attr("y", function(d, i) {
                        return sorted.indexOf(i) * self.cellHeight;
                    })
                    .attr("transform", function(d, i) {
                        if(self.yc>0)
                        {
                            if(self.yd>0)
                                return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                            else
                                return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                        }
                        else
                        {
                            if(self.yd>0)
                                return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                            else
                                return "translate(-3," + self.cellHeight / 1.5 + ")";
                        }
                    });
            }
        }
        //==================================================
        d3.select("#rowprox").on("change", function() { 

            //gtag('event', 'proximity', {'event_category': '按鈕點擊','event_label': 'row prox'});
            var colorID;
            if (this.value == "euclidean_distance"){
                var rowProxData1D = runProximity(0, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = false;
                self.row_Scale_id = 3;
            }
            else if(this.value == "pearson_correlation"){
                var rowProxData1D = runProximity(1, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 1;
            }
            else if(this.value == "kendalls_tau"){
                var rowProxData1D = runProximity(2, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 1;
            }
            else if(this.value == "spearman_rank"){
                var rowProxData1D = runProximity(3, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 1;
            }
            else if(this.value == "atan_correlation"){
                var rowProxData1D = runProximity(4, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 1;
            }
            else if(this.value == "city_block"){
                var rowProxData1D = runProximity(5, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = false;
                self.row_Scale_id = 3;
            }
            else if(this.value == "abs_pearson_correlation"){
                var rowProxData1D = runProximity(6, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 1;
            }
            else if(this.value == "uncentered_correlation"){
                var rowProxData1D = runProximity(7, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 1;
            }
            else if(this.value == "abs_uncentered_correlation"){
                var rowProxData1D = runProximity(8, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 1;
            }
            else if(this.value == "covariance"){
                var rowProxData1D = runProximity(9, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.rpPalette = "GAP_Blue_White_Red";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 2;
            }
            else if (this.value == "Hamman"){
                var rowProxData1D = runProximity(20, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }
            else if (this.value == "Jaccard"){
                var rowProxData1D = runProximity(21, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }
            else if (this.value == "Phi"){
                var rowProxData1D = runProximity(22, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }
            else if (this.value == "Rao"){
                var rowProxData1D = runProximity(23, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }
            else if (this.value == "Rogers"){
                var rowProxData1D = runProximity(24, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }
            else if (this.value == "Simple_Match"){
                var rowProxData1D = runProximity(25, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }        
            else if (this.value == "Sneath"){
                var rowProxData1D = runProximity(26, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }
            else if (this.value == "Yule"){
                var rowProxData1D = runProximity(27, 0, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "GAP_Rainbow";
                self.rowIsSimilarity = true;
                self.row_Scale_id = 12;
            }

            for(i = 0; i < self.row_number; i++) {
                for(j = 0; j < self.row_number; j++) {
                    self.rowProxData[i][j] = rowProxData1D[i*self.row_number+j];
                }
            } 

            $("#roworder").prop("disabled",false);
            //console.log("a:"+self.rowProxData[0][1]);
            if(self.isRowProxfirst)
            {
                self.setupHeatmap2(self.rowProxData,"mv2", self.col_number*self.cellWidth+10, 0, 1, heatmapId, colorID);
                $("#optionDataMap").append($("<option></option>").attr("value", "rp").text(" Row Proximity Matrix "));
                //drawColorLegend("rp_colorspec", self.viewerPosTop, colorID, "Row Proximity Matrix");
                $("#roworder option[value='averagelinkage']").removeAttr('disabled');
                $("#roworder option[value='singlelinkage']").removeAttr('disabled');
                $("#roworder option[value='completelinkage']").removeAttr('disabled');
                $("#roworder option[value='r2e']").removeAttr('disabled');

                $("#roworder_side option[value='averagelinkage']").removeAttr('disabled');
                $("#roworder_side option[value='singlelinkage']").removeAttr('disabled');
                $("#roworder_side option[value='completelinkage']").removeAttr('disabled');
                $("#roworder_side option[value='r2e']").removeAttr('disabled');

                self.isRowProxfirst = false;
            }
            else
                self.changeProx(self.rowProxData,"mv2", heatmapId, 1, colorID);

            //if(self.rowIsSimilarity)
            if(self.row_Scale_id == 1)
            {
                self.rpminInputRange1 = -1;
                self.rpmaxInputRange1 = 1;
                self.rpminInputRange2 = -1;
                self.rpmaxInputRange2 = 1;
            }
            else
            {
                self.rpminInputRange1 = self.rp_min_value;
                self.rpmaxInputRange1 = self.rp_max_value;
                self.rpminInputRange2 = self.rp_min_value;
                self.rpmaxInputRange2 = self.rp_max_value;    
            }
        });

        //==================================================
        d3.select("#colprox").on("change", function() { 
            /*
            self.colProxData = new Array(self.col_number);
            for(i = 0; i < self.col_number; i++) {
                self.colProxData[i] = new Array(self.col_number);
                for(j = 0; j < self.col_number; j++) {
                    self.colProxData[i][j] = Math.random();
                }
            }
            */
            //gtag('event', 'proximity', {'event_category': '按鈕點擊','event_label': 'col prox'});
            var colorID;
            if (this.value == "euclidean_distance"){
                var colProxData1D = runProximity(0, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.cpPalette = "Spectral";
                self.colIsSimilarity = false;
                self.col_Scale_id = 3;
            }
            else if (this.value == "pearson_correlation"){
                var colProxData1D = runProximity(1, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 1;
            }
            else if (this.value == "kendalls_tau"){
                var colProxData1D = runProximity(2, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 1;
            }
            else if (this.value == "spearman_rank"){
                var colProxData1D = runProximity(3, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 1;
            }
            else if (this.value == "atan_correlation"){
                var colProxData1D = runProximity(4, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 1;
            }
            else if (this.value == "city_block"){
                var colProxData1D = runProximity(5, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.cpPalette = "Spectral";
                self.rowIsSimilarity = false;
                self.col_Scale_id = 3;
            }
            else if (this.value == "abs_pearson_correlation"){
                var colProxData1D = runProximity(6, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 1;
            }
            else if (this.value == "uncentered_correlation"){
                var colProxData1D = runProximity(7, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 1;
            }
            else if (this.value == "abs_uncentered_correlation"){
                var colProxData1D = runProximity(8, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 1;
            }
            else if (this.value == "covariance"){
                var colProxData1D = runProximity(9, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateRdBu;
                self.cpPalette = "RdBu";
                self.colIsSimilarity = true;
                self.col_Scale_id = 2;
            }
            else if (this.value == "Hamman"){
                var colProxData1D = runProximity(20, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }
            else if (this.value == "Jaccard"){
                var colProxData1D = runProximity(21, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }
            else if (this.value == "Phi"){
                var colProxData1D = runProximity(22, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }
            else if (this.value == "Rao"){
                var colProxData1D = runProximity(23, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }
            else if (this.value == "Rogers"){
                var colProxData1D = runProximity(24, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }
            else if (this.value == "Simple_Match"){
                var colProxData1D = runProximity(25, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }        
            else if (this.value == "Sneath"){
                var colProxData1D = runProximity(26, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }
            else if (this.value == "Yule"){
                var colProxData1D = runProximity(27, 1, self.data, self.row_number, self.col_number, 0);

                colorID = d3.interpolateSpectral;
                self.rpPalette = "Spectral";
                self.colIsSimilarity = true;
                self.col_Scale_id = 12;
            }

            for(i = 0; i < self.col_number; i++) {
                for(j = 0; j < self.col_number; j++) {
                    self.colProxData[i][j] = colProxData1D[i*self.col_number+j];
                }
            }

            $("#colorder").prop("disabled",false);

            if(self.isColProxfirst)
            {
                var colProxY = -10-self.col_number*self.cellWidth;
                if(self.xc>0)
                {
                    if(self.xd>0)
                        colProxY = colProxY + (-5+self.xd_Y);
                    else
                        colProxY = colProxY + (-5+self.xc_Y);
                }
                else
                {
                    if(self.xd>0)
                        colProxY = colProxY + (-5+self.xd_Y);
                }
                self.setupHeatmap2(self.colProxData,"mv3", 0, colProxY, 2, heatmapId ,colorID);
                self.changeColLabelsPosition(heatmapId, self.col_number);
                $("#optionDataMap").append($("<option></option>").attr("value", "cp").text(" Column Proximity Matrix "));
                //drawColorLegend("cp_colorspec", self.viewerPosTop, colorID, "Col. Proximity Matrix");
                $("#colorder option[value='averagelinkage']").removeAttr('disabled');
                $("#colorder option[value='singlelinkage']").removeAttr('disabled');
                $("#colorder option[value='completelinkage']").removeAttr('disabled');
                $("#colorder option[value='r2e']").removeAttr('disabled');

                $("#colorder_side option[value='averagelinkage']").removeAttr('disabled');
                $("#colorder_side option[value='singlelinkage']").removeAttr('disabled');
                $("#colorder_side option[value='completelinkage']").removeAttr('disabled');
                $("#colorder_side option[value='r2e']").removeAttr('disabled');

                self.isColProxfirst = false;
            }
            else
                self.changeProx(self.colProxData,"mv3", heatmapId, 2, colorID);

            //if(self.colIsSimilarity)
            if(self.col_Scale_id == 1)
            {
                self.cpminInputRange1 = -1;
                self.cpmaxInputRange1 = 1;
                self.cpminInputRange2 = -1;
                self.cpmaxInputRange2 = 1;
            }
            else
            {
                self.cpminInputRange1 = self.cp_min_value;
                self.cpmaxInputRange1 = self.cp_max_value;
                self.cpminInputRange2 = self.cp_min_value;
                self.cpmaxInputRange2 = self.cp_max_value;    
            }

        });

        //==================================================
        d3.select("#optionDataMap").on("change", function() {
           self.optionTargetDataMap = d3.select("#optionDataMap").property("value");    
           if(self.optionTargetDataMap == "rawdata")
           {
                setInputRange(self.rdminInputRange1,self.rdmaxInputRange1,self.rdminInputRange2,self.rdmaxInputRange2,self.min_value, self.max_value);
                $('#palette').val(self.rdPalette);
                if(self.rdPaletteReverse)
                    $("#isColorReverse").prop("checked", true);
                else
                    $("#isColorReverse").prop("checked", false);    
           }
           else if(self.optionTargetDataMap == "rp")
           {
                //if(self.rowIsSimilarity==true)
                if(self.row_Scale_id == 1)
                    setInputRange(self.rpminInputRange1,self.rpmaxInputRange1,self.rpminInputRange2,self.rpmaxInputRange2,-1,1);
                else
                    setInputRange(self.rpminInputRange1,self.rpmaxInputRange1,self.rpminInputRange2,self.rpmaxInputRange2, self.rp_min_value, self.rp_max_value);
                $('#palette').val(self.rpPalette);
                if(self.rpPaletteReverse)
                    $("#isColorReverse").prop("checked", true);
                else
                    $("#isColorReverse").prop("checked", false);  
           }
           else if(self.optionTargetDataMap == "cp")
           {
                //if(self.colIsSimilarity==true)
                if(self.col_Scale_id == 1)
                    resetInputRange(self.cpminInputRange1,self.cpmaxInputRange1,self.cpminInputRange2,self.cpmaxInputRange2,-1,1);
                else
                    resetInputRange(self.cpminInputRange1,self.cpmaxInputRange1,self.cpminInputRange2,self.cpmaxInputRange2, self.cp_min_value, self.cp_max_value);
                $('#palette').val(self.cpPalette);
                if(self.cpPaletteReverse)
                    $("#isColorReverse").prop("checked", true);
                else
                    $("#isColorReverse").prop("checked", false);  
           }
        });

        //==================================================
        d3.select("#order").on("change", function() {
	       var newOrder = d3.select("#order").property("value");	
            self.changeOrder(newOrder, heatmapId);
        });
/*
        //==================================================
        d3.select("#roworder").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row order'});
            $("#roworder_side").prop('selectedIndex', $("#roworder").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(self.rowOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            self.rowOrderId = d3.select("#roworder").property("value");   
            console.log(self.rowOrderId);
            if (self.rowOrderId == "singlelinkage" || self.rowOrderId == "averagelinkage" || self.rowOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#rowflip").prop('selectedIndex', 1);
                    $("#rowflip_side").prop('selectedIndex', 1);
                    self.rowFlipId = "r2e";
                }
            }
            else if(self.rowOrderId == "r2e")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                self.rowFlipId = "null";
            }
            else if(self.rowOrderId == "sortinit_row")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                self.rowFlipId = "null";
            }
            self.changeRowOrder(self.rowOrderId, heatmapId);
        });
*/
        

 /*       
        //==================================================
        //d3.select("#inputRange1").on("change", function() {
        $('#inputRange1').slider().on('slideStop', function(event) {
            gtag('event', 'sectional display', {'event_category': '按鈕點擊','event_label': 'sectional display'});
            if(self.optionTargetDataMap == "rawdata")
            {
                self.rdminInputRange1 = $('#inputRange1').data('slider').getValue()[0];
                self.rdmaxInputRange1 = $('#inputRange1').data('slider').getValue()[1];   
            }        
            else if(self.optionTargetDataMap == "rp")
            {
                self.rpminInputRange1 = $('#inputRange1').data('slider').getValue()[0];
                self.rpmaxInputRange1 = $('#inputRange1').data('slider').getValue()[1];   
            } 
            else if(self.optionTargetDataMap == "cp")
            {
                self.cpminInputRange1 = $('#inputRange1').data('slider').getValue()[0];
                self.cpmaxInputRange1 = $('#inputRange1').data('slider').getValue()[1];   
            } 

            //var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
            //var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
            var newCondition = d3.select("#displaycondition").property("value");
            var newPalette = d3.select("#palette").property("value");
            self.changePalette(newCondition, newPalette, heatmapId);
        });

        //==================================================
        //d3.select("#inputRange2").on("mouseup", function() {
        $('#inputRange2').slider().on('slideStop', function(event) {
            gtag('event', 'restricted display', {'event_category': '按鈕點擊','event_label': 'restricted display'});
            if(self.optionTargetDataMap == "rawdata")
            {
                self.rdminInputRange2 = $('#inputRange2').data('slider').getValue()[0];
                self.rdmaxInputRange2 = $('#inputRange2').data('slider').getValue()[1];   
            }        
            else if(self.optionTargetDataMap == "rp")
            {
                self.rpminInputRange2 = $('#inputRange2').data('slider').getValue()[0];
                self.rpmaxInputRange2 = $('#inputRange2').data('slider').getValue()[1];   
            } 
            else if(self.optionTargetDataMap == "cp")
            {
                self.cpminInputRange2 = $('#inputRange2').data('slider').getValue()[0];
                self.cpmaxInputRange2 = $('#inputRange2').data('slider').getValue()[1];   
            } 

            var newCondition = d3.select("#displaycondition").property("value");
            var newPalette = d3.select("#palette").property("value");
            self.changePalette(newCondition, newPalette, heatmapId);
        });
        */
    });


    //==================================================
}


//#########################################################
changeRowOrder(newOrder, heatmapId) {
    var self = this;
    var sorted;
    var sortedTarget = 0; //0 for rows
    var svg = d3.select(heatmapId);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage")
    {
        $("#rowflip").prop("disabled",false);
        $("#rowflip_side").prop("disabled",false);
    }
    
    var nowFlip = 0;

    if(self.rowFlipId == "r2e")
        nowFlip = 1;
    else if(self.rowFlipId == "uncle")
        nowFlip = 2;
    else if(self.rowFlipId == "grandpa")
        nowFlip = 3;
    else
        nowFlip = 0;
    //var t = self.svg.transition().duration(1000);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage" || newOrder == "random") { 
        
        if(newOrder == "r2e")   // R2E sort on rows  
        {
            console.log("start r2e");
            if(!self.firstRunRowTree)
                d3.selectAll("#rowTree").remove();
            if(self.row_r2e_order.length>0)
            {
                sorted = self.row_r2e_order.slice();   
            }
            else
            {
                sorted = runR2E(sortedTarget, self.rowProxData, self.row_number);
                self.row_r2e_order = sorted.slice();
                $("#rowflip option[value='r2e']").prop("disabled",false);   
                $("#rowflip_side option[value='r2e']").prop("disabled",false);   
            }           
            //console.log("Row R2E: "+sorted);
        }
        else if(newOrder == "random")   // Random sort on rows  
        {
            console.log("start random");
            if(!self.firstRunRowTree)
                d3.selectAll("#rowTree").remove();
            var random_order = [];
            for(var i=0; i<self.row_number; i++)
                random_order[i] = i;
            shuffle(random_order);     
            sorted = random_order;    
            //console.log("Row Random: "+sorted);
        }
        else if (newOrder == "singlelinkage")  // singlelinkage sort on rows
        {
            console.log("start single linkage");
            sorted = runHCTree(sortedTarget, 0, nowFlip, self, self.rowProxData, self.row_number, self.firstRunRowTree, self.cellWidth, self.cellHeight, self.row_r2e_order, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+13, 0, heatmapId, self.rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);
        }
        else if (newOrder == "averagelinkage")  // averagelinkage sort on rows
        {
            console.log("start average linkage");
            sorted = runHCTree(sortedTarget, 2, nowFlip, self, self.rowProxData, self.row_number, self.firstRunRowTree, self.cellWidth, self.cellHeight, self.row_r2e_order, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+13, 0, heatmapId, self.rowIsSimilarity);
            //console.log(sorted);
        }
        else    //completelinkage sorts on rows
        {
            console.log("start complete linkage");
            sorted = runHCTree(sortedTarget, 1, nowFlip, self, self.rowProxData, self.row_number, self.firstRunRowTree, self.cellWidth, self.cellHeight, self.row_r2e_order, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+13, 0, heatmapId, self.rowIsSimilarity);
            //console.log(sorted);            
        }

        if(newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage")
        {
            self.firstRunRowTree = false;
        }

        svg.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                //console.log(sorted.indexOf(row));
                return sorted.indexOf(row) * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
            });

        if(svg.select("#mv2"))
        {
            svg.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    //var temp_x = $("#mv2")[0].getAttribute("x");
                    return (sorted.indexOf(col) * self.cellHeight);
                });  
            svg.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return sorted.indexOf(row) * self.cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    //var temp_x = 0;
                    return "translate(" + temp_x + "," + sorted.indexOf(row) * self.cellHeight + ")";
                });

        }
        if(svg.select("#mv11"))
        {
            svg.select("#mv11").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return sorted.indexOf(row) * self.ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv11")[0].getAttribute("x");
                    return "translate(0," + sorted.indexOf(row) * self.ycov_cellHeight + ")";
                });

        }
        if(svg.select("#mv12"))
        {
            svg.select("#mv12").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return sorted.indexOf(row) * self.ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    return "translate(0," + sorted.indexOf(row) * self.ycov_cellHeight + ")";
                });

        }
        svg.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return sorted.indexOf(i) * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.ycov_cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.ycov_cellHeight / 1.5 + ")";
                }
            });

        self.rowCurrentOrder = sorted;
    
    } else if (newOrder == "sortinit_row") { // initial sort on rows (alphabetically if produced like this)
        svg.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                return row * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + row * self.cellHeight + ")";
            });
        if(!self.firstRunRowTree)
            d3.selectAll("#rowTree").remove();
        if(svg.select("#mv2"))
        {
            svg.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellHeight;
                });  
            svg.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * self.cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    return "translate(" + temp_x + "," + row * self.cellHeight + ")";
                });

        }
        if(svg.select("#mv11"))
        {
            svg.select("#mv11").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return row * self.ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv11")[0].getAttribute("x");
                    return "translate(0," + row * self.ycov_cellHeight + ")";
                });

        }
        if(svg.select("#mv12"))
        {
            svg.select("#mv12").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return row * self.ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    return "translate(0," + row * self.ycov_cellHeight + ")";
                });

        }
        svg.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return i * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.ycov_cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.ycov_cellHeight / 1.5 + ")";
                }
            });
        for( i=0 ;i< self.row_number; i++)
            self.rowCurrentOrder[i] = i;

    } 
}

//#########################################################
changeColOrder(newOrder, heatmapId) {
    var sorted;
    var self = this;
    var sortedTarget = 1; //1 for columns
    var svg = d3.select(heatmapId);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage")
    {
        $("#colflip").prop("disabled",false);
        $("#colflip_side").prop("disabled",false);
    }
    var nowFlip = 0;

    if(self.colFlipId == "r2e")
        nowFlip = 1;
    else if(self.colFlipId == "uncle")
        nowFlip = 2;
    else if(self.colFlipId == "grandpa")
        nowFlip = 3;
    else
        nowFlip = 0;
    //var t = svg.transition().duration(1000);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage" || newOrder == "random") { 
        var tree_y = (-10-self.col_number*self.cellWidth);

        if(self.xc>0)
        {
            if(self.xd>0)
                tree_y = tree_y + (-5+self.xd_Y);
            else
                tree_y = tree_y + (-5+self.xc_Y);
        }
        else
        {
            if(self.xd>0)
                tree_y = tree_y + (-5+self.xd_Y);
        }    
        if (newOrder == "r2e") { // R2E sort on columns
            console.log("start r2e");
            if(!self.firstRunColTree)
                d3.selectAll("#colTree").remove();
            if(self.col_r2e_order.length>0)
            {
                sorted = self.col_r2e_order.slice(); 
            }
            else
            {
                sorted = runR2E(sortedTarget, self.colProxData, self.col_number);
                self.col_r2e_order = sorted.slice();   
                $("#colflip option[value='r2e']").prop("disabled",false);  
                $("#colflip_side option[value='r2e']").prop("disabled",false);     
            } 

            //console.log("Col. R2E: "+sorted);
        }
        else if(newOrder == "random")   // Random sort on rows  
        {
            console.log("start random");
            if(!self.firstRunColTree)
                d3.selectAll("#colTree").remove();
            var random_order = [];
            for(var i=0; i<self.col_number; i++)
                random_order[i] = i;
            shuffle(random_order);     
            sorted = random_order;    
            //console.log("Row Random: "+sorted);
        }
        else if (newOrder == "singlelinkage")  // singlelinkage sort on rows
        {
            console.log("start single linkage"); //+$('.colLabels')[0].getBoundingClientRect().width
            sorted = runHCTree(sortedTarget, 0, nowFlip, self, self.colProxData, self.col_number, self.firstRunColTree, self.cellWidth, self.cellHeight, self.col_r2e_order, "colTree", self.col_number*self.cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, self.colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);
        }
        else if (newOrder == "averagelinkage")  // averagelinkage sort on rows
        {
            console.log("start average linkage");
            sorted = runHCTree(sortedTarget, 2, nowFlip, self, self.colProxData, self.col_number, self.firstRunColTree, self.cellWidth, self.cellHeight, self.col_r2e_order, "colTree", self.col_number*self.cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, self.colIsSimilarity);
            //console.log(sorted);
        }
        else    //completelinkage sorts on rows
        {
            console.log("start complete linkage");
            sorted = runHCTree(sortedTarget, 1, nowFlip, self, self.colProxData, self.col_number, self.firstRunColTree, self.cellWidth, self.cellHeight, self.col_r2e_order, "colTree", self.col_number*self.cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, self.colIsSimilarity);
            //console.log(sorted);            
        }
        self.colCurrentOrder = sorted;

        if(newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage")
        {
            self.firstRunColTree = false;
        }

        svg.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return sorted.indexOf(col) * self.cellWidth;
            });
        //if(svg.select("#mv3"))
        if(!self.isColProxfirst)
        {
            svg.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * self.cellWidth;
                });  
            svg.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return sorted.indexOf(row) * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = sorted.indexOf(row) * self.cellWidth-10-self.col_number*self.cellWidth;

                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                        else
                            temp_y = temp_y + (-5+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                    }
                    //return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    return "translate(" + temp_x + "," + temp_y + ")";
                });

            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                        else
                            temp_y = temp_y + (-5+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                    }
                    return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    //return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                });

        } 
        else
        {
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = 0;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = temp_y + (-3+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = -3;
                    }
                    //return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    return "translate(" + self.cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                    //return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                });
        }

        if(svg.select("#mv13"))
        {
            svg.select("#mv13").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * self.xcov_cellWidth;
                })
            svg.select("#mv13").selectAll(".row")
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv13")[0].getAttribute("x");
                    var temp_y = i * self.xcov_cellHeight + self.xd_Y;
                    //var temp_y = sorted.indexOf(row) * self.xcov_cellWidth-5-self.col_number*self.xcov_cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";           
                });
        }
        if(svg.select("#mv14"))
        {
            svg.select("#mv14").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * self.cellWidth;
                })
            svg.select("#mv14").selectAll(".row") 
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv14")[0].getAttribute("x");
                    var temp_y = i * self.xcov_cellHeight + self.xc_Y;
                    //var temp_y = sorted.indexOf(row) * self.cellWidth-5-self.col_number*self.cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
        }  

    } 
    else if (newOrder == "sortinit_col") { // initial sort on cols (alphabetically if produced like this)
        svg.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return col * self.cellWidth;
            });
        if(!self.firstRunColTree)
            d3.selectAll("#colTree").remove();
        //if(svg.select("#mv3"))
        if(!self.isColProxfirst)
        {
            svg.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellWidth;
                });  
            svg.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = row * self.cellWidth-10-self.col_number*self.cellWidth;

                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                        else
                            temp_y = temp_y + (-5+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                    }

                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * self.cellWidth;
                })            
                .attr("transform", function(d, i) {
                    var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                        else
                            temp_y = temp_y + (-5+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                    }
                    return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    //return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                });   
        } 
        else
        {
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * self.cellWidth;
                })            
                .attr("transform", function(d, i) {
                    var temp_y = 0;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = temp_y + (-3+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = -3;
                    }
                    //return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    return "translate(" + self.cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
/*
                    var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                        else
                            temp_y = temp_y + (-5+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                    }
                    //return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    return "translate(" + self.cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
*/
                });    
        }

        if(svg.select("#mv13"))
        {
            svg.select("#mv13").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellWidth;
                })
            svg.select("#mv13").selectAll(".row")
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv13")[0].getAttribute("x");
                    var temp_y = i * self.xcov_cellHeight + self.xd_Y;
                    //var temp_y = sorted.indexOf(row) * self.cellWidth-5-self.col_number*self.cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
        }
        if(svg.select("#mv14"))
        {
            svg.select("#mv14").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellWidth;
                })
            svg.select("#mv14").selectAll(".row") 
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv14")[0].getAttribute("x");
                    //var temp_y = sorted.indexOf(row) * self.cellWidth-5-self.col_number*self.cellWidth;
                    var temp_y = i * self.xcov_cellHeight + self.xc_Y;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
        }
        for( i=0 ;i< self.col_number; i++)
            self.colCurrentOrder[i] = i;
    }
}

//#########################################################
changeOrder(newOrder, heatmapId) {
    var self = this;
    var svg = d3.select(heatmapId);
    var t = svg.transition().duration(1000);
    if (newOrder == "sortinit_col") { // initial sort on cols (alphabetically if produced like this)
        t.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return col * self.cellWidth;
            });
        if(t.select("#mv3"))
        {
            t.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellWidth;
                });  
            t.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = row * self.cellWidth-5-self.col_number*self.cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -5-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                    return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    //return "translate(" + self.cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellSize) + ")";
                });
        } 
        else
        {
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * self.cellWidth;
                })            
                .attr("transform", function(d, i) {
                    return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                });    
        }
    } else if (newOrder == "sortinit_row") { // initial sort on rows (alphabetically if produced like this)
        t.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                return row * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + row * self.cellHeight + ")";
            });
        if(t.select("#mv2"))
        {
            t.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellHeight;
                });  
            t.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * self.cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    return "translate(" + temp_x + "," + row * self.cellHeight + ")";
                });

        }
        t.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return i * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.cellHeight / 1.5 + ")";
                }
            });
    } else if (newOrder == "sortinit_col_row") { // initial sort on rows and cols (alphabetically if produced like this)
        t.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return col * self.cellWidth;
            });
        t.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                return row * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + row * self.cellHeight + ")";
            });
        if(t.select("#mv2"))
        {
            t.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellHeight;
                });  
            t.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * self.cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    return "translate(" + temp_x + "," + row * self.cellHeight + ")";
                });

        }
        if(t.select("#mv3"))
        {
            t.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * self.cellWidth;
                });  
            t.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = row * self.cellWidth-5-self.col_number*self.cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -5-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                    return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    //return "translate(" + self.cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellSize) + ")";
                });
        } 
        else
        {
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * self.cellWidth;
                })            
                .attr("transform", function(d, i) {
                    return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                });    
        }
        
        t.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return i * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.cellHeight / 1.5 + ")";
                }
            });
    }
}

//#########################################################
changeRowFlip(newFlip, heatmapId) {
    var self = this;
    var sorted;
    var sortedTarget = 0; //0 for rows
    var svg = d3.select(heatmapId);
    //$("#rowflip").prop("disabled",false);
    //var t = svg.transition().duration(1000);
    var nowOrder = 0;

    if(self.rowOrderId == "singlelinkage")
        nowOrder = 0;
    else if(self.rowOrderId == "averagelinkage")
        nowOrder = 2;
    else if(self.rowOrderId == "completelinkage")
        nowOrder = 1;

    if (newFlip == "null")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 0, self, self.rowProxData, self.row_number, self.firstRunRowTree, self.cellWidth, self.cellHeight, self.row_r2e_order, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+13, 0, heatmapId, self.rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);   
    }
    else if(newFlip == "r2e")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 1, self, self.rowProxData, self.row_number, self.firstRunRowTree, self.cellWidth, self.cellHeight, self.row_r2e_order, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+13, 0, heatmapId, self.rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);    
    }
    else if (newFlip == "uncle")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 2, self, self.rowProxData, self.row_number, self.firstRunRowTree, self.cellWidth, self.cellHeight, self.row_r2e_order, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+13, 0, heatmapId, self.rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);
    }
    else if (newFlip == "grandpa")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 3, self, self.rowProxData, self.row_number, self.firstRunRowTree, self.cellWidth, self.cellHeight, self.row_r2e_order, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+13, 0, heatmapId, self.rowIsSimilarity);
            //console.log(sorted);
    }

    svg.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                //console.log(sorted.indexOf(row));
                return sorted.indexOf(row) * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
            });

    if(svg.select("#mv2"))
    {
            svg.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * self.cellHeight;
                });  
            svg.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return sorted.indexOf(row) * self.cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    return "translate(" + temp_x + "," + sorted.indexOf(row) * self.cellHeight + ")";
                });

    }
    if(svg.select("#mv11"))
    {
            svg.select("#mv11").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return sorted.indexOf(row) * self.cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv11")[0].getAttribute("x");
                    return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                });

    }
    if(svg.select("#mv12"))
    {
            svg.select("#mv12").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return sorted.indexOf(row) * self.cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                });

    }
    svg.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return sorted.indexOf(i) * self.cellHeight;
            })
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.cellHeight / 1.5 + ")";
                }
            });

    self.rowCurrentOrder = sorted;
}

//#########################################################
changeColFlip(newFlip, heatmapId) {
    var self = this;
    var sorted;
    var sortedTarget = 1; //1 for columns
    var svg = d3.select(heatmapId);
    //$("#colflip").prop("disabled",false);
    //var t = svg.transition().duration(1000);
    var nowOrder = 0;

    if(self.colOrderId == "singlelinkage")
        nowOrder = 0;
    else if(self.colOrderId == "averagelinkage")
        nowOrder = 2;
    else if(self.colOrderId == "completelinkage")
        nowOrder = 1;

    var tree_y = (-10-self.col_number*self.cellWidth);

    if(self.xc>0)
    {
        if(self.xd>0)
            tree_y = tree_y + (-5+self.xd_Y);
        else
            tree_y = tree_y + (-5+self.xc_Y);
    }
    else
    {
        if(self.xd>0)
            tree_y = tree_y + (-5+self.xd_Y);
    }   

    if (newFlip == "null")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 0, self, self.colProxData, self.col_number, self.firstRunColTree, self.cellWidth, self.cellHeight, self.col_r2e_order, "colTree", self.col_number*self.cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, self.colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity            
            //console.log(sorted);   
    }
    else if(newFlip == "r2e")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 1, self, self.colProxData, self.col_number, self.firstRunColTree, self.cellWidth, self.cellHeight, self.col_r2e_order, "colTree", self.col_number*self.cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, self.colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted); 
    }
    else if (newFlip == "uncle")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 2, self, self.colProxData, self.col_number, self.firstRunColTree, self.cellWidth, self.cellHeight, self.col_r2e_order, "colTree", self.col_number*self.cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, self.colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted); 
    }
    else if (newFlip == "grandpa")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 3, self, self.colProxData, self.col_number, self.firstRunColTree, self.cellWidth, self.cellHeight, self.col_r2e_order, "colTree", self.col_number*self.cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, self.colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted); 
    }

    svg.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return sorted.indexOf(col) * self.cellWidth;
            });
    if(svg.select("#mv3"))
    {
            svg.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * self.cellWidth;
                });  
            svg.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return sorted.indexOf(row) * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = sorted.indexOf(row) * self.cellWidth-10-self.col_number*self.cellWidth;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                        else
                            temp_y = temp_y + (-5+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                    }
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                        else
                            temp_y = temp_y + (-5+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-5+self.xd_Y);
                    }
                    return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    //return "translate(" + self.cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellSize) + ")";
                });
    }    
    else{
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                });
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * self.cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = 0;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = temp_y + (-3+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                    }
                    return "translate(" + self.cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                    //return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                });
    }

    if(svg.select("#mv13"))
    {
            svg.select("#mv13").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * self.cellWidth;
                })
            svg.select("#mv13").selectAll(".row")
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv13")[0].getAttribute("x");
                    var temp_y = i * self.xcov_cellHeight + self.xd_Y;
                    //var temp_y = sorted.indexOf(row) * self.cellWidth-5-self.col_number*self.cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
    }
    if(svg.select("#mv14"))
    {
            svg.select("#mv14").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * self.cellWidth;
                })
            svg.select("#mv14").selectAll(".row") 
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv14")[0].getAttribute("x");
                    var temp_y = i * self.xcov_cellHeight + self.xc_Y;
                    //var temp_y = sorted.indexOf(row) * self.cellWidth-5-self.col_number*self.cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
    }  

    self.colCurrentOrder = sorted;

}

//#########################################################
changePalette(conditionName, paletteName, heatmapId) {
    var self = this;
    var colorID = d3.interpolateRdBu;
    //console.log("conditionName: "+conditionName);
    //console.log("paletteName: "+paletteName);
    //var colors = colorbrewer[paletteName][classesNumber];
    if(paletteName == "YlOrRd")
        colorID = d3.interpolateYlOrRd;
    else if(paletteName == "YlGnBu")
        colorID = d3.interpolateYlGnBu;
    else if(paletteName == "YlOrBr")
        colorID = d3.interpolateYlOrBr;
    else if(paletteName == "YlGn")
        colorID = d3.interpolateYlGn;
    else if(paletteName == "Reds")
        colorID = d3.interpolateReds;
    else if(paletteName == "RdPu")
        colorID = d3.interpolateRdPu;
    else if(paletteName == "Purples")
        colorID = d3.interpolatePurples;
    else if(paletteName == "PuRd")
        colorID = d3.interpolatePuRd;
    else if(paletteName == "PuBuGn")
        colorID = d3.interpolatePuBuGn;
    else if(paletteName == "PuBu")
        colorID = d3.interpolatePuBu;
    else if(paletteName == "OrRd")
        colorID = d3.interpolateOrRd;
    else if(paletteName == "Oranges")
        colorID = d3.interpolateOranges;
    else if(paletteName == "Greys")
        colorID = d3.interpolateGreys;
    else if(paletteName == "Greens")
        colorID = d3.interpolateGreens;
    else if(paletteName == "GnBu")
        colorID = d3.interpolateGnBu;
    else if(paletteName == "BuPu")
        colorID = d3.interpolateBuPu;
    else if(paletteName == "BuGn")
        colorID = d3.interpolateBuGn;
    else if(paletteName == "Blues")
        colorID = d3.interpolateBlues;
    else if(paletteName == "Spectral")
        colorID = d3.interpolateSpectral;
    else if(paletteName == "RdYlGn")
        colorID = d3.interpolateRdYlGn;
    else if(paletteName == "RdYlBu")
        colorID = d3.interpolateRdYlBu;
    else if(paletteName == "RdYlGn")
        colorID = d3.interpolateRdYlGn;
    else if(paletteName == "RdGy")
        colorID = d3.interpolateRdGy;
    else if(paletteName == "RdBu")
        colorID = d3.interpolateRdBu;
    else if(paletteName == "PuOr")
        colorID = d3.interpolatePuOr;
    else if(paletteName == "PRGn")
        colorID = d3.interpolatePRGn;
    else if(paletteName == "PiYG")
        colorID = d3.interpolatePiYG;
    else if(paletteName == "BrBG")
        colorID = d3.interpolateBrBG;  
    else if(paletteName == "Set3")
        colorID = d3.schemeSet3;
    else if(paletteName == "Set2")
        colorID = d3.schemeSet3;  
    else if(paletteName == "Set1")
        colorID = d3.schemeSet1;
    else if(paletteName == "Pastel2")
        colorID = d3.schemePastel2; 
    else if(paletteName == "Pastel1")
        colorID = d3.schemePastel1;
    else if(paletteName == "Paired")
        colorID = d3.schemePaired; 
    else if(paletteName == "Dark2")
        colorID = d3.schemeDark2;
    else if(paletteName == "Accent")
        colorID = d3.schemeAccent; 
    else if(paletteName == "GAP_Rainbow")
        colorID = d3.schemeSet3;
    else if(paletteName == "GAP_Blue_White_Red")
        colorID = d3.schemeSet3; 
    else
        colorID = d3.interpolateRdBu;

    if(self.optionTargetDataMap == "rawdata")
    {
        var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
        var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
        var minInputRange2 = $('#inputRange2').data('slider').getValue()[0];
        var maxInputRange2 = $('#inputRange2').data('slider').getValue()[1];
        if(conditionName == "RangeMatrix")
        {
            var colorScale = null;;
            if(self.rdPaletteReverse)
                colorScale = d3.scaleSequential()
                        //.domain([self.max_value, self.min_value])
                        .domain([minInputRange2, maxInputRange2])
                        .interpolator(colorID);  
            else
                colorScale = d3.scaleSequential()
                        //.domain([self.max_value, self.min_value])
                        .domain([maxInputRange2, minInputRange2])
                        .interpolator(colorID);  

            var svg = d3.select(heatmapId);
            var t = svg.transition().duration(500);
            t.select("#mv").selectAll(".cell")
                .style("fill", function(d) {
                        if (d != null) 
                        {
                            if(d<minInputRange1 || d>maxInputRange1)
                                return "#ffffff";
                            else
                                return colorScale(d);
                        }
                        else return "url(#diagonalHatch)";
                });
            d3.select("#md_colorspec").select("svg").selectAll(".cellLegend")
                .style("fill", function(d, i) {
                    return colorScale(d);
                });

            self.changeLegentTextForRawDataMatrix(conditionName);
        }
        else if(conditionName == "RangeRow")
        {
            var colorScale1 = d3.scaleSequential()
                        .domain([self.max_value, self.min_value])
                        .interpolator(colorID);  

            var svg = d3.select(heatmapId);
            var t = svg.transition().duration(500);
            t.select("#mv").selectAll(".cell")
                .style("fill", function(d) {

                    var rownum = d3.select(this).attr("row");
                    var colorScale;
                    if(self.data_row_min_value[rownum]<minInputRange2)
                    {
                        if(self.data_row_max_value[rownum]>maxInputRange2)
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([minInputRange2, maxInputRange2])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([maxInputRange2, minInputRange2])
                                .interpolator(colorID); 
                        }
                        else
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([minInputRange2, self.data_row_max_value[rownum]])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([self.data_row_max_value[rownum], minInputRange2])
                                .interpolator(colorID);                   
                        }
                    }
                    else
                    {
                        if(self.data_row_max_value[rownum]>maxInputRange2)
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([self.data_row_min_value[rownum], maxInputRange2])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([maxInputRange2, self.data_row_min_value[rownum]])
                                .interpolator(colorID);  
                        }
                        else
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([self.data_row_min_value[rownum], self.data_row_max_value[rownum]])
                                .interpolator(colorID);  
                            else
                                colorScale = d3.scaleSequential()
                                .domain([self.data_row_max_value[rownum], self.data_row_min_value[rownum]])
                                .interpolator(colorID);     
                        }
                    }
                    if (d != null) 
                    {
                        if(d<minInputRange1 || d>maxInputRange1)
                            return "#ffffff";
                        else
                        {
                            if(d<minInputRange2)
                                return colorScale(minInputRange2);
                            else if(d>maxInputRange2)
                                return colorScale(maxInputRange2);
                            else
                                return colorScale(d);
                        }
                    }
                    else return "url(#diagonalHatch)";  

                });
            d3.select("#md_colorspec").select("svg").selectAll(".cellLegend")
                .style("fill", function(d, i) {
                    return colorScale1(d);
                });  

            self.changeLegentTextForRawDataMatrix(conditionName);
        }
        else if(conditionName == "RangeCol")
        {
            var colorScale1 = d3.scaleSequential()
                        .domain([self.max_value, self.min_value])
                        .interpolator(colorID);  

            var svg = d3.select(heatmapId);
            var t = svg.transition().duration(500);
            t.select("#mv").selectAll(".cell")
                .style("fill", function(d) {

                    var colnum = d3.select(this).attr("col");
                    var colorScale;
                    if(self.data_min_value[colnum]<minInputRange2)
                    {
                        if(self.data_max_value[colnum]>maxInputRange2)
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([minInputRange2, maxInputRange2])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([maxInputRange2, minInputRange2])
                                .interpolator(colorID); 
                        }
                        else
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([minInputRange2, self.data_max_value[colnum]])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([self.data_max_value[colnum], minInputRange2])
                                .interpolator(colorID);                   
                        }
                    }
                    else
                    {
                        if(self.data_max_value[colnum]>maxInputRange2)
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([self.data_min_value[colnum], maxInputRange2])
                                .interpolator(colorID);  
                            else
                                colorScale = d3.scaleSequential()
                                .domain([maxInputRange2, self.data_min_value[colnum]])
                                .interpolator(colorID);  
                        }
                        else
                        {
                            if(self.rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([self.data_min_value[colnum], self.data_max_value[colnum]])
                                .interpolator(colorID);   
                            else
                                colorScale = d3.scaleSequential()
                                .domain([self.data_max_value[colnum], self.data_min_value[colnum]])
                                .interpolator(colorID);    
                        }
                    }
                    if (d != null) 
                    {
                        if(d<minInputRange1 || d>maxInputRange1)
                            return "#ffffff";
                        else
                        {
                            if(d<minInputRange2)
                                return colorScale(minInputRange2);
                            else if(d>maxInputRange2)
                                return colorScale(maxInputRange2);
                            else
                                return colorScale(d);
                        }
                    }
                    else return "url(#diagonalHatch)";  
                     
                });
            d3.select("#md_colorspec").select("svg").selectAll(".cellLegend")
                .style("fill", function(d, i) {
                    return colorScale1(d);
                });  

            self.changeLegentTextForRawDataMatrix(conditionName);
        }
        /*
        if(conditionName == "CenterMatrix")
        {
            let tmpmax=0.0;
            if(maxInputRange2>Math.abs([minInputRange2]))
            {
                tmpmax = maxInputRange2;
            }
            else
            {
                tmpmax = Math.abs([minInputRange2]);
            }
            var colorScale = null;
            if(self.rdPaletteReverse)
                colorScale = d3.scaleSequential()
                        //.domain([self.max_value, self.min_value])
                        .domain([-tmpmax, tmpmax])
                        .interpolator(colorID);  
            else
                colorScale = d3.scaleSequential()
                        //.domain([self.max_value, self.min_value])
                        .domain([tmpmax, -tmpmax])
                        .interpolator(colorID);  

            var svg = d3.select(heatmapId);
            var t = svg.transition().duration(500);
            t.select("#mv").selectAll(".cell")
                .style("fill", function(d) {
                        if (d != null) 
                        {
                            //if(d<minInputRange1 || d>maxInputRange1)
                                //return "#ffffff";
                            //else
                                return colorScale(d);
                        }
                        else return "url(#diagonalHatch)";
                });
            d3.select("#md_colorspec").select("svg").selectAll(".cellLegend")
                .style("fill", function(d, i) {
                    return colorScale(d);
                });

            self.changeLegentTextForRawDataMatrix(conditionName);
        }*/
    }
    else if(self.optionTargetDataMap == "rp")
    {
        /* //如果要讓rp也可以做filter
        var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
        var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
        var minInputRange2 = $('#inputRange2').data('slider').getValue()[0];
        var maxInputRange2 = $('#inputRange2').data('slider').getValue()[1];
        */
        var minInputRange1 = self.rp_min_value;
        var maxInputRange1 = self.rp_max_value;
        var minInputRange2 = self.rp_min_value;
        var maxInputRange2 = self.rp_max_value;
        var colorScale = null; 
        /*if(self.rowIsSimilarity==true)
        {
            colorScale = d3.scaleSequential()
                    .domain([1, -1])
                    .interpolator(colorID);
        }
        else
        {
            colorScale = d3.scaleSequential()
                    .domain([rp_max_value, self.rp_min_value])
                    .interpolator(colorID);        
        }*/
        if(self.rpPaletteReverse)
        {
            if(self.rowIsSimilarity){
                if(paletteName == "GAP_Rainbow")
                    colorScale = GAP_Rainbow(1, -1);
                else if(paletteName == "GAP_Blue_White_Red")
                    colorScale = GAP_Blue_White_Red(1, -1);
                else{
                    colorScale = d3.scaleSequential()
                        .domain([-1, 1])
                        .interpolator(colorID);
                }
            }
            else{
                if(paletteName == "GAP_Rainbow")
                    colorScale = GAP_Rainbow(minInputRange2, maxInputRange2);
                else if(paletteName == "GAP_Blue_White_Red")
                    colorScale = GAP_Blue_White_Red(maxInputRange2, minInputRange2);
                else
                    colorScale = d3.scaleSequential()
                        .domain([minInputRange2, maxInputRange2])
                        .interpolator(colorID);                
            }                    
        }
        else
        {
            if(self.rowIsSimilarity){
                if(paletteName == "GAP_Rainbow")
                    colorScale = GAP_Rainbow(-1, 1);
                else if(paletteName == "GAP_Blue_White_Red")
                    colorScale = GAP_Blue_White_Red(-1, 1);
                else{
                    colorScale = d3.scaleSequential()
                        .domain([1, -1])
                        .interpolator(colorID);
                }
            }
            else{
                if(paletteName == "GAP_Rainbow")
                    colorScale = GAP_Rainbow(maxInputRange2, minInputRange2);
                else if(paletteName == "GAP_Blue_White_Red")
                    colorScale = GAP_Blue_White_Red(minInputRange2, maxInputRange2);
                else
                    colorScale = d3.scaleSequential()
                        .domain([maxInputRange2, minInputRange2])
                        .interpolator(colorID); 
            }
        }

        var svg = d3.select(heatmapId);
        var t = svg.transition().duration(500);

        t.select("#mv2").selectAll(".cell")
            .style("fill", function(d) {
                    if (d != null)
                    {
                        if(d<minInputRange1 || d>maxInputRange1)
                            return "#ffffff";
                        else
                        {
                            if(d<minInputRange2)
                                return colorScale(minInputRange2);
                            else if(d>maxInputRange2)
                                return colorScale(maxInputRange2);
                            else
                                return colorScale(d);
                        }
                    } 
                    else return "url(#diagonalHatch)";
            });
        d3.select("#rp_colorspec").select("svg").selectAll(".cellLegend")
        //t.selectAll(".cellLegend")
            .style("fill", function(d, i) {
                //return colors[classesNumber-i-1];
                return colorScale(d);
            });
    }
    else if(self.optionTargetDataMap == "cp")
    { 
        var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
        var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
        var minInputRange2 = $('#inputRange2').data('slider').getValue()[0];
        var maxInputRange2 = $('#inputRange2').data('slider').getValue()[1];
        var colorScale = null; 
        /*if(self.colIsSimilarity==true)
        {
            colorScale = d3.scaleSequential()
                    .domain([1, -1])
                    .interpolator(colorID);
        }
        else
        {
            colorScale = d3.scaleSequential()
                    .domain([cp_max_value, self.cp_min_value])
                    .interpolator(colorID);        
        }*/
        if(self.cpPaletteReverse)
            colorScale = d3.scaleSequential()
                    .domain([minInputRange2, maxInputRange2])
                    .interpolator(colorID); 
        else
            colorScale = d3.scaleSequential()
                    .domain([maxInputRange2, minInputRange2])
                    .interpolator(colorID); 

        var svg = d3.select(heatmapId);
        var t = svg.transition().duration(500);
        t.select("#mv3").selectAll(".cell")
            .style("fill", function(d) {
                    if (d != null)
                    {
                        if(d<minInputRange1 || d>maxInputRange1)
                            return "#ffffff";
                        else
                        {
                            if(d<minInputRange2)
                                return colorScale(minInputRange2);
                            else if(d>maxInputRange2)
                                return colorScale(maxInputRange2);
                            else
                                return colorScale(d);
                        }
                    } 
                    else return "url(#diagonalHatch)";
            });
        d3.select("#cp_colorspec").select("svg").selectAll(".cellLegend")
        //t.selectAll(".cellLegend")
            .style("fill", function(d, i) {
                //return colors[classesNumber-i-1];
                return colorScale(d);
            });
    }
}

//#########################################################
getColorID(paletteName) {
    var self = this;
    var colorID = d3.interpolateRdBu;
    if(paletteName == "RdYlGn")
        colorID = d3.interpolateRdYlGn;
    else if(paletteName == "Spectral")
        colorID = d3.interpolateSpectral;
    else if(paletteName == "RdYlBu")
        colorID = d3.interpolateRdYlBu;
    else if(paletteName == "RdGy")
        colorID = d3.interpolateRdGy;
    else if(paletteName == "RdBu")
        colorID = d3.interpolateRdBu;
    else if(paletteName == "PiYG")
        colorID = d3.interpolatePiYG;
    else if(paletteName == "PRGn")
        colorID = d3.interpolatePRGn;
    else if(paletteName == "BrBG")
        colorID = d3.interpolateBrBG;
    else if(paletteName == "PuOr")
        colorID = d3.interpolatePuOr;
    else if(paletteName == "Grey")
        colorID = d3.interpolateGreys;
    else if(paletteName == "YlGnBu")
        colorID = d3.interpolateYlGnBu;
    else if(paletteName == "YlOrRd")
        colorID = d3.interpolateYlOrRd;
    else
        colorID = d3.interpolateRdBu;

    return colorID;
}

//#########################################################
changeLegentTextForRawDataMatrix(conditionName) {
    var self = this;
    var legend_text2 = [];
    if(conditionName == "RangeMatrix")
    {
        legend_text2.push(parseFloat(self.min_value));
        legend_text2.push((parseFloat(self.max_value)+parseFloat(self.min_value))/2.0);
        legend_text2.push(parseFloat(self.max_value)); 
    }
    else
    {
        legend_text2.push("Min");    
        legend_text2.push("Max");         
    }

    var legentText = d3.select("#md_colorspec").select("svg").selectAll("text");
    legentText.remove();

    d3.select("#md_colorspec").select("svg").selectAll(".legend_txt").selectAll("text")
        .data(legend_text2).enter()
        .append("text")  
        .attr("id", function(d, i) {
            return i;
        })            
        .attr("class", "mono legendElement")
        .text(function(d) {
            return conditionName == "RangeMatrix" ? Math.round(d * 100) / 100 : d;
        })
        .attr("x", function(d, i) {
            return conditionName == "RangeMatrix" ? (135 * i) : (270 * i);
        })
        .attr("y", self.viewerPosTop + 24);
}

//#########################################################
redrawRowLabels(heatmapId) {
    var self = this;
        var svg = d3.select(heatmapId);
        if(self.cellHeight<6)
            self.row_fontsize = self.cellHeight-1;
        else if(self.cellHeight>=6 && self.cellHeight<10)    
            self.row_fontsize = self.cellHeight-2;
        else if(self.cellHeight>=10 && self.cellHeight<12)    
            self.row_fontsize = self.cellHeight-3;
        else if(self.cellHeight>=12 && self.cellHeight<=24)    
            self.row_fontsize = 8;
        else
            self.row_fontsize = self.cellHeight/3;

        if(self.row_fontsize<1)
            self.row_fontsize = 1;

        svg.selectAll(".rowLabel")
            .attr("x", 0)
            .attr("y", function(d, i) {
                if(self.rowOrderId == "sortinit_row")
                    return (self.rowCurrentOrder[i] * self.cellHeight);
                else
                    return (self.rowCurrentOrder.indexOf(i) * self.cellHeight);
            })
            .style("text-anchor", "end")
            .style("font-size", self.row_fontsize+"px")
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.cellHeight / 1.5 + ")";
                }
            });

            /*
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yc_X-10-self.yd*self.ycov_cellWidth)+"," + self.ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.ycov_cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3 -10-self.yd*self.ycov_cellWidth)+"," + self.ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.ycov_cellHeight / 1.5 + ")";
                }
            });*/
}            

//#########################################################
redrawColLabels(heatmapId) {
    var self = this;
        var svg = d3.select(heatmapId);

        if(self.cellWidth<6)
            self.col_fontsize = self.cellWidth-1;
        else if(self.cellWidth>=6 && self.cellWidth<10)
            self.col_fontsize = self.cellWidth-2;
        else if(self.cellWidth>=10 && self.cellWidth<12)
            self.col_fontsize = self.cellWidth-2;
        else if(self.cellWidth>=12 && self.cellWidth<=24)
            self.col_fontsize = 8;
        else  
            self.col_fontsize = self.cellWidth/3;
        if(self.col_fontsize<1)
            self.col_fontsize = 1;
        //if(svg.select("#mv3"))
        if(!self.isColProxfirst)
        {
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    if(self.colOrderId == "sortinit_col")
                        return (self.colCurrentOrder[i] * self.cellWidth);
                    else
                        return self.colCurrentOrder.indexOf(i) * self.cellWidth;
                })
                .style("font-size", self.col_fontsize+"px")
                .attr("transform", function(d, i) {
                    var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = temp_y + (-3+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                    }
                    return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                    //return "translate(" + self.cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellSize) + ")";
                });            
        }
        else
        {
            svg.selectAll(".colLabel")
                .attr("x", 0)
                .attr("y", function(d, i) {
                    return (i * self.cellWidth);
                })
                .style("font-size", self.col_fontsize+"px")
                .attr("transform", function(d, i) {
                    var temp_y = 0;
                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = temp_y + (-3+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-3+self.xd_Y);
                        else
                            temp_y = temp_y + (-3);
                    }
                    return "translate(" + self.cellWidth / 2 + ", "+temp_y+") rotate(-90) rotate(45, 0, " + (i * self.cellWidth) + ")";
                });            
        }
}

//#########################################################
redrawHeatmap(nowID, x, y, mode, heatmapId) {
        var self = this;
        //console.log("nowID: "+nowID+","+max_data);
        var svg = d3.select(heatmapId);
        var row = svg.select("#"+nowID).selectAll(".row");
        var j = 0;

        svg.select("#"+nowID)
            .attr("x", x)
            .attr("y", y);


        row.attr("y", function(d) {
                if(mode == 0)   //rd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    if(self.rowOrderId == "r2e")
                        return self.row_r2e_order.indexOf(row) * self.cellHeight;
                    else if (self.rowOrderId == "sortinit_row")
                        return row * self.cellHeight;
                    else
                        return self.row_output_order_array.indexOf(row) * self.cellHeight;
                }
                else if(mode == 1)  //rp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(self.rowOrderId == "r2e")
                        return self.row_r2e_order.indexOf(row) * self.cellHeight;
                    else if (self.rowOrderId == "sortinit_row")
                        return row * self.cellHeight;
                    else
                        return self.row_output_order_array.indexOf(row) * self.cellHeight;
                }
                else if(mode == 2)  //cp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(self.colOrderId == "r2e")
                        return self.col_r2e_order.indexOf(row) * self.cellWidth;
                    else if (self.colOrderId == "sortinit_col")
                        return row * self.cellWidth;
                    else
                        return self.col_output_order_array.indexOf(row) * self.cellWidth;

                }
                else if(mode == 11) //self.yd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(self.rowOrderId == "r2e")
                        return self.row_r2e_order.indexOf(row) * self.cellHeight;
                    else if (self.rowOrderId == "sortinit_row")
                        return row * self.cellHeight;
                    else
                        return self.row_output_order_array.indexOf(row) * self.cellHeight;
                }
                else if(mode == 12) //self.yc
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(self.rowOrderId == "r2e")
                        return self.row_r2e_order.indexOf(row) * self.cellHeight;
                    else if (self.rowOrderId == "sortinit_row")
                        return row * self.cellHeight;
                    else
                        return self.row_output_order_array.indexOf(row) * self.cellHeight;
                }
                else if(mode == 13) //self.xd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(self.colOrderId == "r2e")
                        return self.col_r2e_order.indexOf(row) * self.cellWidth;
                    else if (self.colOrderId == "sortinit_col")
                        return row * self.cellWidth;
                    else
                        return self.col_output_order_array.indexOf(row) * self.cellWidth;
                }
                else if(mode == 14) //self.xc
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(self.colOrderId == "r2e")
                        return self.col_r2e_order.indexOf(row) * self.cellWidth;
                    else if (self.colOrderId == "sortinit_col")
                        return row * self.cellWidth;
                    else
                        return self.col_output_order_array.indexOf(row) * self.cellWidth;
                }
            });

        row.attr("transform", function(d, i) {
                if(mode == 0)   //rd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(self.rowOrderId == "r2e")
                        return "translate(0," + self.row_r2e_order.indexOf(row) * self.cellHeight + ")";
                    else if (self.rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* self.cellHeight+y) + ")"; 
                    else
                        return "translate(0," + self.row_output_order_array.indexOf(row) * self.cellHeight + ")";
                    //return "translate(" + 0 + "," + (i* self.cellHeight+y) + ")"; 
                }               
                else if(mode == 1)  //rp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    //var temp_x = $("#"+nowID)[0].getAttribute("x");
                    var temp_x = $(heatmapId+" #"+nowID)[0].getAttribute("x")
                    if(self.rowOrderId == "r2e")
                        return "translate(" + temp_x + "," + self.row_r2e_order.indexOf(row) * self.cellHeight + ")";
                    else if (self.rowOrderId == "sortinit_row")
                        return "translate(" + temp_x + "," + (i* self.cellHeight+y) + ")"; 
                    else
                        return "translate(" + temp_x + "," + self.row_output_order_array.indexOf(row) * self.cellHeight + ")";
                    //return "translate(" + 0 + "," + (i* self.cellHeight+y) + ")"; 
                }                   
                else if(mode == 2)  //cp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    //var temp_x = $("#"+nowID)[0].getAttribute("x");
                    var temp_x = $(heatmapId+" #"+nowID)[0].getAttribute("x")
                    var temp_y = 0; 
                    
                    if(self.colOrderId == "r2e")
                    {
                        temp_y = self.col_r2e_order.indexOf(row) * self.cellWidth-10-self.col_number*self.cellWidth;
                        //return "translate(" + temp_x + "," + temp_y + ")";
                    }
                    else if (self.colOrderId == "sortinit_col")
                    {
                        temp_y = i * self.cellWidth-10-self.col_number*self.cellWidth;
                        //return "translate(" + temp_x + "," + temp_y + ")";    
                    }
                    else
                    {
                        temp_y = self.col_output_order_array.indexOf(row) * self.cellWidth-10-self.col_number*self.cellWidth;
                        //return "translate(" + temp_x + "," + temp_y + ")";
                    }

                    if(self.xc>0)
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-10+self.xd_Y);
                        else
                            temp_y = temp_y + (-10+self.xc_Y);
                    }
                    else
                    {
                        if(self.xd>0)
                            temp_y = temp_y + (-10+self.xd_Y);
                    }                   
                    return "translate(" + temp_x + "," + temp_y + ")";   
                    //return "translate(" + 0 + "," + (i* self.cellWidth+y) + ")"; 
                }                   
                else if(mode == 11) //self.yd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    //var temp_x = $("#"+nowID)[0].getAttribute("x");
                    var temp_x = $(heatmapId+" #"+nowID)[0].getAttribute("x")
                    if(self.rowOrderId == "r2e")
                        return "translate(0," + self.row_r2e_order.indexOf(row) * self.cellHeight + ")";
                    else if (self.rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* self.cellHeight) + ")"; 
                    else
                        return "translate(0," + self.row_output_order_array.indexOf(row) * self.cellHeight + ")";
                }
                else if(mode == 12) //self.yc
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    var temp_x = $(heatmapId+" #mv12")[0].getAttribute("x")
                    if(self.rowOrderId == "r2e")
                        return "translate(0," + self.row_r2e_order.indexOf(row) * self.cellHeight + ")";
                    else if (self.rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* self.cellHeight) + ")"; 
                    else
                        return "translate(0," + self.row_output_order_array.indexOf(row) * self.cellHeight + ")";
                }
                else if(mode == 13) //self.xd
                {
                    //var row = parseInt(d3.select(this).attr("id"));
                    return "translate(" + 0 + "," + (i* self.xcov_cellHeight + self.xd_Y) + ")"; 
                    /*
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    if(self.rowOrderId == "r2e")
                        return "translate(0," + self.row_r2e_order.indexOf(row) * self.cellHeight + ")";
                    else if (self.rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* self.cellHeight) + ")"; 
                    else
                        return "translate(0," + self.row_output_order_array.indexOf(row) * self.cellHeight + ")";
                    */
                }
                else if(mode == 14) //self.xc
                {
                    //var row = parseInt(d3.select(this).attr("id"));
                    return "translate(" + 0 + "," + (i* self.xcov_cellHeight + self.xc_Y) + ")"; 
                    /*
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    if(self.rowOrderId == "r2e")
                        return "translate(0," + self.row_r2e_order.indexOf(row) * self.cellHeight + ")";
                    else if (self.rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* self.cellHeight) + ")"; 
                    else
                        return "translate(0," + self.row_output_order_array.indexOf(row) * self.cellHeight + ")";
                    */
                }
                else
                    return "translate(" + 0 + "," + (i* self.cellHeight+y) + ")"; 
            });
        
        row.selectAll(".cell")
            .attr("x", function(d, i) {
                if(mode == 0)
                {
                    var col = parseInt(d3.select(this).attr("col"));
                    if(self.colOrderId == "r2e")
                        return self.col_r2e_order.indexOf(col) * self.cellWidth;
                    else if (self.colOrderId == "sortinit_col")
                        return i * self.cellWidth;
                    else
                        return self.col_output_order_array.indexOf(col) * self.cellWidth;
                    //return i * self.cellWidth + x;
                }                   
                else if(mode == 1)
                {
                    var col = parseInt(d3.select(this).attr("col"));
                    if(self.rowOrderId == "r2e")
                        return self.row_r2e_order.indexOf(col) * self.cellHeight;
                    else if (self.rowOrderId == "sortinit_row")
                        return i * self.cellHeight;
                    else
                        return (self.row_output_order_array.indexOf(col) * self.cellHeight);
                    //return i * self.cellHeight + x;
                }    
                else if(mode == 2)
                {
                    var col = parseInt(d3.select(this).attr("col"));
                    if(self.colOrderId == "r2e")
                        return self.col_r2e_order.indexOf(col) * self.cellWidth;
                    else if (self.colOrderId == "sortinit_col")
                        return i * self.cellWidth;
                    else
                        return self.col_output_order_array.indexOf(col) * self.cellWidth;
                }               
                else if(mode == 11)
                    return i * self.ycov_cellWidth + x;
                else if(mode == 12)
                    return i * self.ycov_cellWidth + x;
                else
                    return i * self.cellWidth + x;
            })
            .attr("width", function(d) {
                if(mode == 0)
                    return self.cellWidth;
                else if(mode == 1)
                    return self.cellHeight;
                else if(mode == 11)
                    return self.ycov_cellWidth;
                else if(mode == 12)
                    return self.ycov_cellWidth;
                else if(mode == 13)
                    return self.xcov_cellWidth;
                else if(mode == 14)
                    return self.xcov_cellWidth;
                else
                    return self.cellWidth;
            })
            .attr("height", function(d) {
                if(mode == 0)
                    return self.cellHeight;
                else if(mode == 1)
                    return self.cellHeight;
                else if(mode == 11)
                    return self.cellHeight;
                else if(mode == 12)
                    return self.cellHeight;
                else if(mode == 13)
                    return self.xcov_cellHeight;
                else if(mode == 14)
                    return self.xcov_cellHeight;
                else
                    return self.cellWidth;
            });
}

//#########################################################
changeTreePosition(nowID, X, Y, mode, heatmapId) {
    var self = this;
    var svg = d3.select("#heatmap").select("svg").select("#gap");
    svg.select("#"+nowID)
        .attr("x", X)
        .attr("y", Y)
        .attr("transform", function(d, i) {
            return "translate(" + X + "," + Y + ")"; 
        });

}

//#########################################################
changeWidth(widthZoomRange, heatmapId) {
    var self = this;
    self.cellWidth = self.cellOriWidth*widthZoomRange/50;
    self.xcov_cellWidth = self.cellWidth;

    if(self.optionTargetDataMap == "rawdata")
    {
        var mode = 0;
        self.redrawHeatmap("mv", 0, 0, mode, heatmapId);

        if(self.yd>0)
        {
            self.redrawHeatmap("mv11", self.yd_X, 0, 11, heatmapId);  
            self.redrawCovLabel(heatmapId,"self.yd");  
        }
        if(self.yc>0)
        {
            self.redrawHeatmap("mv12", self.yc_X, 0, 12, heatmapId);    
            self.redrawCovLabel(heatmapId,"self.yc");  
        }
        if(self.xd>0)
        {
            self.redrawHeatmap("mv13", 0, self.xd_Y, 13, heatmapId);    
            self.redrawCovLabel(heatmapId,"self.xd");  
        }
        if(self.xc>0)
        {
            self.redrawHeatmap("mv14", 0, self.xc_Y, 14, heatmapId);   
            self.redrawCovLabel(heatmapId,"self.xc");  
        }
        if(!self.isRowProxfirst)
        {
            self.redrawHeatmap("mv2", 10+self.col_number*self.cellWidth, 0, 1, heatmapId);    
            //if(!self.firstRunRowTree) 
            if (self.rowOrderId == "singlelinkage" || self.rowOrderId == "averagelinkage" || self.rowOrderId == "completelinkage") 
                self.changeTreePosition("rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+10+3, 0, heatmapId);
        }

        self.redrawRowLabels(heatmapId);
        self.redrawColLabels(heatmapId);

        if(!self.isColProxfirst)
        {
            var temp_y = (-10-self.col_number*self.cellWidth);
            if(self.xc>0)
            {
                if(self.xd>0)
                    temp_y = temp_y + (-5+self.xd_Y);
                else
                    temp_y = temp_y + (-5+self.xc_Y);
            }
            else
            {
                if(self.xd>0)
                    temp_y = temp_y + (-5+self.xd_Y);
            }  
            self.redrawHeatmap("mv3", 0, temp_y, 2, heatmapId);    
            //if(!self.firstRunColTree) 

            if (self.colOrderId == "singlelinkage" || self.colOrderId == "averagelinkage" || self.colOrderId == "completelinkage") 
                drawColTree(self.treeColData, "colTree", self.col_number*self.cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, temp_y, 1, heatmapId, self.col_number, self.cellWidth, self.firstRunColTree); 
        }
    }

    //redrawRowLabels(heatmapId);
    //redrawColLabels(heatmapId);
}

//#########################################################
changeHeight(heightZoomRange, heatmapId) {
    var self = this;
    self.cellHeight = self.cellOriHeight*heightZoomRange/50;
    self.ycov_cellHeight = self.cellHeight;

    if(self.optionTargetDataMap == "rawdata")
    {
        var mode = 0;
        self.redrawHeatmap("mv", 0, 0, mode, heatmapId);

        if(self.yd>0)
        {
            self.redrawHeatmap("mv11", self.yd_X, 0, 11, heatmapId); 
            self.redrawCovLabel(heatmapId,"self.yd");  
            //redrawHeatmap("mv11", -10-self.yd*self.cellWidth, 0, 11, heatmapId);  
        }
        if(self.yc>0)
        {
            self.redrawHeatmap("mv12", self.yc_X, 0, 12, heatmapId);    
            self.redrawCovLabel(heatmapId,"self.yc");  
        }
        if(self.xd>0)
        {
            self.redrawHeatmap("mv13", 0, self.xd_Y, 13, heatmapId);   
            self.redrawCovLabel(heatmapId,"self.xd");  
        }
        if(self.xc>0)
        {
            self.redrawHeatmap("mv14", 0, self.xc_Y, 14, heatmapId);    
            self.redrawCovLabel(heatmapId,"self.xc");  
        }
        if(!self.isRowProxfirst)
        {
            self.redrawHeatmap("mv2", 10+self.col_number*self.cellWidth, 0, 1, heatmapId);  
            if(!self.firstRunRowTree) 
                drawRowTree(self.treeRowData, "rowTree", self.col_number*self.cellWidth+self.row_number*self.cellHeight+10+3, 0, 0, heatmapId, self.row_number, self.cellHeight, self.firstRunRowTree); 
        }
        if(!self.isColProxfirst)
        {
            self.redrawHeatmap("mv3", 0, -10-self.col_number*self.cellWidth, 2, heatmapId);    
            //if(!self.firstRunColTree) 
                //changeTreePosition("colTree", self.col_number*self.cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-self.col_number*self.cellWidth, 1, heatmapId);
        }
    }

    self.redrawRowLabels(heatmapId);
    self.redrawColLabels(heatmapId);

}
//#########################################################
setupHeatmap2(nowdata, nowID, x, y, mode, heatmapId, colorID) {
        var self = this;
        var i = 0;
        var temp_value = 0;
        var svg = d3.select(heatmapId).select("svg").select("#gap");
        var max_data = d3.max(nowdata, function(row) { return d3.max(row) });
        var min_data = d3.min(nowdata, function(row) { return d3.min(row) });

        if(mode==1)
        {
            self.rp_max_value = max_data;
            self.rp_min_value = min_data;
        }
        else if(mode==2)
        {
            self.cp_max_value = max_data;
            self.cp_min_value = min_data;
        }

        //if((mode==1 && self.rowIsSimilarity==true) || (mode==2 && self.colIsSimilarity==true))
        if((mode==1 && self.row_Scale_id == 1) || (mode==2 && self.col_Scale_id == 1))
        {
            
            let paletteName;
            var colorScale;
            if(mode == 0)
                paletteName = self.rwPalette;
            else if(mode==1)
                paletteName = self.rpPalette;
            else if(mode==2)
                paletteName = self.cpPalette;

            if(paletteName == "GAP_Rainbow")
                colorScale = GAP_Rainbow(-1, 1);
            else if(paletteName == "GAP_Blue_White_Red")
                colorScale = GAP_Blue_White_Red(-1, 1);
            else{
                colorScale = d3.scaleSequential()
                    .domain([1, -1])
                    .interpolator(colorID);
            }
            
            if(mode==1)
                self.drawColorLegend("rp_colorspec", self.viewerPosTop, colorScale, "Row Proximity Matrix", -1, 1, false);
            else
                self.drawColorLegend("cp_colorspec", self.viewerPosTop, colorScale, "Column Proximity Matrix", -1, 1, false);
        }
        else if(mode==11)   //self.yd
        {
            var legend_text = [];
            for(i=0 ; i <9 ; i++)
            {
                //temp_value = i+parseFloat(minValue);
                temp_value = i;
                legend_text.push(temp_value);
            }  
            //var colorScale = d3.scaleOrdinal().domain(nowdata[0])
            //    .range(colorID);   
            var colorScale = d3.scaleOrdinal().domain(legend_text)
                .range(colorID);  
            self.drawColorLegend("self.yd_colorspec", self.viewerPosTop, colorScale, "Ydisc. covariates", min_data, max_data, true);       
        }
        else if(mode==12)   //self.yc
        {
            let paletteName = self.ycPalette;
            var colorScale;
            if(paletteName == "GAP_Rainbow")
                colorScale = GAP_Rainbow(self.yc_min_value[0], self.yc_max_value[0]);
            else if(paletteName == "GAP_Blue_White_Red")
                colorScale = GAP_Blue_White_Red(self.yc_min_value[0], self.yc_max_value[0]);
            else{
                colorScale = d3.scaleSequential()
                    .domain([self.yc_max_value[0], self.yc_min_value[0]])
                    .interpolator(colorID); 
            }
            //var colorScale = d3.scaleSequential()
            //    .domain([self.yc_max_value[0], self.yc_min_value[0]])
            //    .interpolator(colorID);     
            self.drawColorLegend("self.yc_colorspec", self.viewerPosTop, colorScale, "Yconti. covariates", self.yc_min_value[0], self.yc_max_value[0], false);    
        }
        else if(mode==13)   //self.xd
        {
            var legend_text = [];
            for(i=0 ; i <9 ; i++)
            {
                //temp_value = i+parseFloat(minValue);
                temp_value = i;
                legend_text.push(temp_value);
            }  
            //var colorScale = d3.scaleOrdinal().domain(nowdata[0])
            //    .range(colorID);   
            var colorScale = d3.scaleOrdinal().domain(legend_text)
                .range(colorID);    
            self.drawColorLegend("self.xd_colorspec", self.viewerPosTop, colorScale, "Xdisc. covariates", self.min_value, max_data, true);       
        }
        else if(mode==14)   //self.xc
        {
            var colorScale = d3.scaleSequential()
                .domain([self.xc_max_value[0], self.xc_min_value[0]])
                .interpolator(colorID);     
            self.drawColorLegend("self.xc_colorspec", self.viewerPosTop, colorScale, "Xconti. covariates", self.xc_min_value[0], self.xc_max_value[0], false);    
        }
        else{
            var colorScale;
            if(self.optionTargetDataMap == "rawdata" && self.rdPaletteReverse)
                colorScale = d3.scaleSequential()
                .domain([min_data, max_data])
                .interpolator(colorID);  
            else
            {
                let paletteName;
                if(mode == 0)
                    paletteName = self.rwPalette;
                else if(mode==1)
                    paletteName = self.rpPalette;
                else if(mode==2)
                    paletteName = self.cpPalette;

                if(paletteName == "GAP_Rainbow")
                    colorScale = GAP_Rainbow(max_data, min_data);
                else if(paletteName == "GAP_Blue_White_Red")
                    colorScale = GAP_Blue_White_Red(max_data, min_data);
                else{
                    colorScale = d3.scaleSequential()
                    .domain([max_data, min_data])
                    .interpolator(colorID);  
                }
            }
            if(mode == 0)
                self.drawColorLegend("md_colorspec", self.viewerPosTop, colorScale, "Raw Data Matrix", min_data, max_data, false);
            else if(mode==1)
                self.drawColorLegend("rp_colorspec", self.viewerPosTop, colorScale, "Row Proximity Matrix", min_data, max_data, false);  
            else if(mode==2)
                self.drawColorLegend("cp_colorspec", self.viewerPosTop, colorScale, "Column Proximity Matrix", min_data, max_data, false);  
        }
        
        var tooltip = d3.select(heatmapId)
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden");

        //console.log("nowID: "+nowID+","+max_data);

        var mv = svg.append("g")
            //.attr("class", className)
            .attr("id", nowID)
            .attr("class", nowID)
            .attr("x", x)
            .attr("y", y)
            .selectAll(".row")
            //.data([0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.9])
            .data(nowdata)
            .enter().append("g")
            .attr("id", function(d, i) {
                //return d.idx;
                return i;
            })
            .attr("transform", function(d, i) {
                if(mode == 0)
                    return "translate(" + 0 + "," + (i* self.cellHeight+y) + ")"; 
                else if(mode == 1)
                    return "translate(" + 0 + "," + (self.rowCurrentOrder.indexOf(i)* self.cellHeight+y) + ")"; 
                else if(mode == 2)
                    return "translate(" + 0 + "," + (self.colCurrentOrder.indexOf(i)* self.cellWidth+y) + ")"; 
                else if(mode == 13)
                    return "translate(" + 0 + "," + (i* self.xcov_cellHeight+y) + ")"; 
                else if(mode == 14)
                    return "translate(" + 0 + "," + (i* self.xcov_cellHeight+y) + ")"; 
                else
                    return "translate(" + 0 + "," + (self.rowCurrentOrder.indexOf(i)* self.cellHeight+y) + ")"; 
            })
            .attr("class", "row");
        var row = svg.select("#"+nowID).selectAll(".row");


        var j = 0;
        
        var heatMap = row.selectAll(".cell")
            .data(function(d) {
                //j++;
                return d;
            })
            .enter().append("svg:rect")
            .attr("x", function(d, i) {
                if(mode == 0)
                    return i * self.cellWidth + x;
                else if(mode == 1)
                    return self.rowCurrentOrder.indexOf(i) * self.cellHeight + x;
                else if(mode == 2)
                    return self.colCurrentOrder.indexOf(i) * self.cellWidth + x;
                else if(mode == 11)
                    return i * self.ycov_cellWidth + x;
                else if(mode == 12)
                    return i * self.ycov_cellWidth + x;
                else if(mode == 13)
                    return i * self.xcov_cellWidth + x;
                else if(mode == 14)
                    return i * self.xcov_cellWidth + x;
                else
                    return i * self.cellWidth + x;
            })
            //.attr("rx", 4)
            //.attr("ry", 4)
            .attr("class", function(d, i) {
                //console.log(d, i, this.parentNode.id);
                return "cell bordered cr" + this.parentNode.id + " cc" + i;
            })
            .attr("row", function(d) {
                return this.parentNode.id;
            })
            .attr("col", function(d, i) {
                return i;
            })
            .attr("width", function(d) {
                if(mode == 0)
                    return self.cellWidth;
                else if(mode == 1)
                    return self.cellHeight;
                else if(mode == 11)
                    return self.ycov_cellWidth;
                else if(mode == 12)
                    return self.ycov_cellWidth;
                else if(mode == 13)
                    return self.xcov_cellWidth;
                else if(mode == 14)
                    return self.xcov_cellWidth;
                else
                    return self.cellWidth;
            })
            .attr("height", function(d) {
                if(mode == 0)
                    return self.cellHeight;
                else if(mode == 1)
                    return self.cellHeight;
                else if(mode == 11)
                    return self.cellHeight;
                else if(mode == 12)
                    return self.cellHeight;
                else if(mode == 13)
                    return self.xcov_cellHeight;
                else if(mode == 14)
                    return self.xcov_cellHeight;
                else
                    return self.cellWidth;
            })
            .style("fill", function(d) {
                var colnum = d3.select(this).attr("col");
                var rownum = d3.select(this).attr("row");
                //var colorScale;
                if(mode==11)
                {
                    //var colorScale = d3.scaleSequential()
                    //    .domain([self.yd_max_value[colnum], self.yd_min_value[colnum]])
                    //    .interpolator(colorID);    
                    var colorScale2;
                    let paletteName = self.ydPalette;

                    if(paletteName == "GAP_Color_16")
                    {
                        if (d != null) return GAP_Color_16(d);
                        else return "url(#diagonalHatch)";
                    }
                    else
                    {
                        colorScale2 = d3.scaleOrdinal().domain(self.yd_cate_col[colnum])
                            .range(colorID); 
                        if (d != null) return colorScale2(d);
                        else return "url(#diagonalHatch)";
                    }
                    
                }
                else if(mode==12)
                {
                    /*var colorScale2 = d3.scaleSequential()
                        .domain([self.yc_max_value[colnum], self.yc_min_value[colnum]])
                        .interpolator(colorID);
                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";*/
                    var colorScale2;
                    let paletteName = self.ycPalette;

                    if(paletteName == "GAP_Rainbow")
                        colorScale2 = GAP_Rainbow(self.yc_min_value[colnum], self.yc_max_value[colnum]);
                    else if(paletteName == "GAP_Blue_White_Red")
                        colorScale2 = GAP_Blue_White_Red(self.yc_min_value[colnum], self.yc_max_value[colnum]);
                    else{
                        colorScale2 = d3.scaleSequential()
                            .domain([self.yc_max_value[colnum], self.yc_min_value[colnum]])
                            .interpolator(colorID); 
                    }

                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";
                }
                else if(mode==13)
                {
                    //var colorScale = d3.scaleSequential()
                    //   .domain([self.xd_max_value[colnum], self.xd_min_value[colnum]])
                    //    .interpolator(colorID);
                    var colorScale2 = d3.scaleOrdinal().domain(self.xd_cate_col[rownum])
                        .range(colorID); 
                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";
                }
                else if(mode==14)
                {
                    var colorScale2 = d3.scaleSequential()
                        .domain([self.xc_max_value[rownum], self.xc_min_value[rownum]])
                        .interpolator(colorID);
                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";
                }
                else
                {
                    if (d != null) return colorScale(d);
                    else return "url(#diagonalHatch)";
                }

            }).on('mouseover', function(e, d, i) {
                if(mode==0) {
                    d3.select('#colLabel_' + i).classed("hover", true);
                    //let pt = d3.pointer(event, svg.node())
                    //d3.select('#colLabel_' + pt).classed("hover", true);
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", true);
                }
                else if(mode==1){
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", true);
                }
                else if(mode==11){
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", true);
                }
                else if(mode==12){
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", true);
                }
                else if(mode==13){
                    d3.select('#colLabel_' + i).classed("hover", true);  
                }
                else if(mode==14){
                    d3.select('#colLabel_' + i).classed("hover", true);  
                }
                else {
                    d3.select('#colLabel_' + i).classed("hover", true);    
                }
                
                /*if (d != null) {
                    tooltip.html('<div class="heatmap_tooltip">' + Number.parseFloat(d).toFixed(3) + '</div>');
                    tooltip.style("visibility", "visible");
                } else
                    tooltip.style("visibility", "hidden");*/
            })
            .on('mouseout', function(e, d, i) {
                if(mode==0) {
                    d3.select('#colLabel_' + i).classed("hover", false);
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", false);
                }
                else if(mode==1){
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", false);
                }
                else if(mode==11){
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", false);
                }
                else if(mode==12){
                    d3.select('#rowLabel_' + this.parentNode.id).classed("hover", false);
                }
                else if(mode==13){
                    d3.select('#colLabel_' + i).classed("hover", false);  
                }
                else if(mode==14){
                    d3.select('#colLabel_' + i).classed("hover", false);  
                }
                else {
                    d3.select('#colLabel_' + i).classed("hover", false);    
                }
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(e, d, i) {
                //tooltip.style("top", (d3.event.pageY - 47) + "px").style("left", (d3.event.pageX - 39) + "px");
                //tooltip.style("top", (e.pageY - 47) + "px").style("left", (e.pageX - 39) + "px");
            })
            .on('click', function(e, d, i) {
                if (d != null) {
                    tooltip.html('<div class="heatmap_tooltip">' + Number.parseFloat(d).toFixed(3) + '</div>');
                    tooltip.style("visibility", "visible");
                } else
                    tooltip.style("visibility", "hidden");
            });

}

//#########################################################
changeProx(prefs, nowID, heatmapId, mode, colorID) {
    var self = this;
    var svg = d3.select(heatmapId).select("svg").select("#gap").select("#"+nowID+"");
    var max_data = d3.max(prefs, function(row) { return d3.max(row) });
    var min_data = d3.min(prefs, function(row) { return d3.min(row) });
    //console.log("max:"+ max_data);
    if((mode==1 || mode==2) && colorID==d3.interpolateRdBu)
    {
        var colorScale = d3.scaleSequential()
            .domain([1, -1])
            .interpolator(colorID);
    }
    else{
        var colorScale = d3.scaleSequential()
            .domain([max_data, min_data])
            .interpolator(colorID);    
    }
           
    //var t = svg.transition().duration(500);
    d3.select("#"+nowID).selectAll(".row")
        .data(prefs)
        .selectAll(".cell")
        .data(function(d) { return d });

    svg.selectAll(".cell")
        .style("fill", function(d) {
                if (d != null) return colorScale(d);
                else return "url(#diagonalHatch)";
        });

        /*
    t.selectAll(".cellLegend")
        .style("fill", function(d, i) {
            return colors[classesNumber-i-1];
        });*/
}

//#########################################################
//Only for input data = Row Proximity Matrix Data
setupProximityData(heatmapId)
{
    var self = this;
    var viewerWidth = d3.select(heatmapId).node().getBoundingClientRect().width;
    //var viewerHeight = d3.select(heatmapId).node().getBoundingClientRect().height;
    var viewerHeight = d3.select(heatmapId).node().offsetHeight;
    if (d3.select(heatmapId).node().parentNode.firstChild !== d3.select(heatmapId).node()) {
        var titleHeight = d3.select(heatmapId).node().parentNode.firstChild.offsetHeight;
        //b2.style.height = 'calc(100% - ' + titleHeight + 'px)';
        d3.select(heatmapId).style("height", 'calc(100% - ' + titleHeight + 'px)');
        viewerHeight = d3.select(heatmapId).node().offsetHeight;
    }
    
    //console.log(viewerHeight);
    //if(viewerWidth/$(document).width() > viewerHeight/$(document).height())
    //    this.scaleP = (viewerWidth*3/4)/$(document).width();
    //else
    //    this.scaleP = (viewerHeight*3/4)/$(document).height();
    this.scaleP = 1.0;
    //if(viewerWidth/$(document).width() < viewerHeight/$(document).height())
    if(viewerWidth < viewerHeight)
    {
        self.cellWidth = viewerWidth*0.9/self.row_number;
        self.cellHeight = self.cellWidth;
    }
    else
    {
        self.cellWidth = viewerHeight*0.9/self.row_number;
        self.cellHeight = self.cellWidth;    
    }

    let covCount = 0;
    if(this.yd > 0)
        covCount++;
    if(this.yc > 0)
        covCount++;
    //this.viewerPosLeft = (viewerWidth-this.scaleP*this.row_number*this.cellWidth)/2;
    //this.viewerPosTop = (viewerHeight-this.scaleP*this.row_number*this.cellHeight)/2;
    this.viewerPosLeft = 40+(this.yd+this.yc)*this.ycov_cellWidth+covCount*10;
    this.viewerPosTop = (viewerHeight-this.scaleP*this.row_number*this.cellHeight)/2;
/*
    function zoom() {
        self.svg.attr('transform', 'translate(' + (self.viewerPosLeft+d3.event.transform.x) + ',' + (self.viewerPosTop+d3.event.transform.y) + ') scale(' + d3.event.transform.k*self.scaleP + ')');
    }
*/
    function zoom(event) {
        self.svg.attr('transform', 'translate(' + (self.viewerPosLeft + event.transform.x) + ',' + (self.viewerPosTop + event.transform.y) + ') scale(' + event.transform.k * self.scaleP + ')');
    }

    var zoomListener = d3.zoom().scaleExtent([0.01, 10]).on("zoom", zoom);

    this.svg = d3.select(heatmapId).append("svg")
            //.attr("width", viewerWidth)
            //.attr("height", viewerHeight)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("id", "gapsvg")
      .call(zoomListener)
            .append("g")
            .attr("id", "gap")
            //.attr("transform", "translate(" + self.viewerPosLeft + "," + (self.viewerPosTop-100) + ")");
            .attr('transform', 'translate(' + self.viewerPosLeft + ',' + (self.viewerPosTop) + ') scale(' + self.scaleP + ')');

    this.svg.append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1);
}

//#########################################################
changeColLabelsPosition(heatmapId, col_number) {
    var self = this;
    var svg = d3.select(heatmapId).select("svg").select("#gap").selectAll(".colLabels");
    svg.selectAll(".colLabel")
        .attr("x", 0)
        .attr("y", function(d, i) {
            return (self.colCurrentOrder.indexOf(i) * self.cellWidth);
        })
        .style("text-anchor", "left")
        .attr("transform", function(d, i) {
                //return "translate(" + self.cellSize / 2 + ", -3) rotate(0) rotate(0, 0, " + (i * self.cellSize) + ")";
                var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                if(self.xc>0)
                {
                    if(self.xd>0)
                        temp_y = temp_y + (-5+self.xd_Y);
                    else
                        temp_y = temp_y + (-5+self.xc_Y);
                }
                else
                {
                    if(self.xd>0)
                        temp_y = temp_y + (-5+self.xd_Y);
                }
                return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
        });
}

//#########################################################
removeAllColorLegend() {
    var self = this;
    d3.select("#mv_color").selectAll("#colorlegend").remove();    
}

//#########################################################
drawColorLegend(svgId, viewerPosTop, colorScale, displayText, minValue, maxValue, isDiscrete) {
        //var svg = d3.select(heatmapId).select("svg").select("#gap");
        /*var svg = d3.select("#mv_color").append("svg")
                    .attr("width", 270)
                    .attr("height", 30);*/
        /*var colorScale = d3.scaleSequential()
                .domain([maxValue, minValue])
                .interpolator(colorID);*/
        //console.log(colorScale);
        var self = this;
        var legendElementWidth=30;

        var basediv = d3.select("#mv_color").append("div")
                    .attr("class", "dropdown-item d-flex align-items-center")
                    .attr("id", "colorlegend")
                    .append("div")
                    .attr("class", "font-weight-bold");
        basediv.append("div")
                    .attr("class", "small")
                    .style("text-align", "center")
                    .text(displayText);
        var svg = basediv.append("div")
                    .attr("id", svgId)
                    .attr("class","small text-gray-500")
                    .append("svg")
                    .attr("width", 290)
                    .attr("height", 30);

        
        var legend_text = [];
        var i = 0;
        var temp_value = 0;
        /*
        for(i=0 ; i <classesNumber ; i++)
        {
            temp_value = parseFloat(((maxValue-minValue)/classesNumber)*i)+parseFloat(minValue);
            legend_text.push(temp_value);
        }
        */
        if(isDiscrete)
        {
            for(i=0 ; i <9 ; i++)
            {
                //temp_value = i+parseFloat(minValue);
                temp_value = i;
                legend_text.push(temp_value);
            }            
        }
        else
        {
            for(i=0 ; i <270 ; i++)
            {
                temp_value = parseFloat(((maxValue-minValue)/270)*i)+parseFloat(minValue);
                legend_text.push(temp_value);
            }
        }
    
        var legend;
        legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(0,-200)")
            .selectAll(".legendElement")
            .data(legend_text)
            //.data(d3.range(270), function(d) { return d; })
            .enter().append("g")
            .attr("class", "legendElement");

        legend.append("svg:rect")
            .attr("x", function(d, i) {
                //return legendElementWidth * i;
                return isDiscrete==true ? legendElementWidth*i : i;
            })
            .attr("y", self.viewerPosTop)
            .attr("class", "cellLegend bordered")
            //.attr("width", legendElementWidth)
            .attr("width", function(d) {
                return isDiscrete==true ? legendElementWidth : 1;
            })
            .attr("height", self.colorSpecHeight / 2)
            .style("fill", function(d, i) {
                //return colors[classesNumber-i-1];
                //console.log(i+","+d);
                return colorScale(d);
            });

        var legend_text2 = [];
        if(isDiscrete)
        {
            legend_text2.push("Min");    
            legend_text2.push("Max");   
        }
        else
        {
            legend_text2.push(parseFloat(minValue));
            legend_text2.push((parseFloat(maxValue)+parseFloat(minValue))/2.0);
            legend_text2.push(parseFloat(maxValue));
        }

        svg.append("g")
            .attr("class", "legend_txt")
            .attr("transform", "translate(0,-200)")
            .selectAll('text').data(legend_text2).enter()
            .append("text")  
            .attr("id", function(d, i) {
                return i;
            })            
            .attr("class", "mono legendElement")
            .text(function(d) {
                return isDiscrete==true ? d : Math.round(d * 100) / 100;
            })
            .attr("x", function(d, i) {
                return isDiscrete==true ? (270 * i) : (135 * i);
            })
            .attr("y", viewerPosTop + 24);
/*
        var xScale = d3.scaleLinear()
            .domain([parseFloat(minValue),parseFloat(maxValue)])
            .range([0,269]);

        var xAxis = d3.axisBottom(xScale)
                .tickValues(legend_text2)
                .ticks(3);

        console.log(xAxis);

        svg.append("g")
            .attr("class","mono legendElement")
            .call(xAxis)
            .attr("transform","translate(0,13)");
            //.append("text") ;//新增座標軸說明
            //.text("天數")
            //.attr("transform","translate("+(height-padding)+",0)");//指定座標軸說明的座標
*/

/*
        legend.append("text").data(legend_text)
            .attr("class", "mono legendElement")
            .text(function(d) {
                //return "≥" + Math.round(d * 100) / 100;
                return Math.round(d * 100) / 100;
            })
            .attr("x", function(d, i) {
                return legendElementWidth * i;
                //return 135 * i;
            })
            .attr("y", self.viewerPosTop + 24);
*/
}

//#########################################################
setupxdLabel(x, y, heatmapId) {
     var svg = d3.select(heatmapId).select("svg").select("#gap");
            var rowLabels = svg.append("g")
            .attr("class", "xdLabels")
            .selectAll(".xdLabel")
            //.data(self.data.index)
            .data(self.xd_name)
            .enter().append("text")
            .text(function(d) {
                //return d.count > 1 ? d.join("/") : d;
                return d;
            })
            .attr("x", x)
            .attr("y", function(d, i) {
                return (i * self.xcov_cellHeight)+y;
            })
            .attr("class", "xdLabel mono")
            .attr("id", function(d, i) {
                return "xdLabel_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#xdLabel_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#xdLabel_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                self.xdSortOrder = !self.xdSortOrder;
                sortByValuesCov("r", i, self.xdSortOrder, "#mv13");
                d3.select("#order").property("selectedIndex", 0);
                //$("#order").jqxComboBox({selectedIndex: 0});
            });
}

//#########################################################
setupxcLabel(x, y, heatmapId) {
    var self = this;
     var svg = d3.select(heatmapId).select("svg").select("#gap");
            var rowLabels = svg.append("g")
            .attr("class", "xcLabels")
            .selectAll(".xcLabels")
            //.data(self.data.index)
            .data(self.xc_name)
            .enter().append("text")
            .text(function(d) {
                //return d.count > 1 ? d.join("/") : d;
                return d;
            })
            .attr("x", x)
            .attr("y", function(d, i) {
                return (i * self.xcov_cellHeight)+y;
            })
            .attr("class", "xcLabels mono")
            .attr("id", function(d, i) {
                return "xcLabels_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#xcLabels_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#xcLabels_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                self.xcSortOrder = !self.xcSortOrder;
                sortByValuesCov("r", i, self.xcSortOrder, "#mv14");
                d3.select("#order").property("selectedIndex", 0);
                //$("#order").jqxComboBox({selectedIndex: 0});
            });
}

//#########################################################
setupydLabel(x, y, heatmapId) {
    var self = this;
     var svg = d3.select(heatmapId).select("svg").select("#gap");
        var colLabels = svg.append("g")
            .attr("class", "ydLabels")
            .selectAll(".ydLabels")
            //.data(self.data.columns)
            .data(self.yd_name)
            .enter().append("text")
            .text(function(d) {
                //d.shift();
                //return d.count > 1 ? d.reverse().join("/") : d.reverse();
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * self.ycov_cellWidth)+x;
            })
            .style("text-anchor", "left")
            .attr("transform", function(d, i) {
                return "translate(" + self.ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * self.cellWidth) + ")";
            })
            .attr("class", "ydLabels mono")
            .attr("id", function(d, i) {
                return "ydLabels_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#ydLabels_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#ydLabels_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                self.ydSortOrder = !self.ydSortOrder;
                sortByValuesCov("c", i, self.ydSortOrder, "#mv11");
                d3.select("#order").property("selectedIndex", 0);
            });
}

//#########################################################
setupycLabel(x, y, heatmapId) {
    var self = this;
     var svg = d3.select(heatmapId).select("svg").select("#gap");
        var colLabels = svg.append("g")
            .attr("class", "ycLabelss")
            .selectAll(".ycLabels")
            //.data(self.data.columns)
            .data(self.yc_name)
            .enter().append("text")
            .text(function(d) {
                //d.shift();
                //return d.count > 1 ? d.reverse().join("/") : d.reverse();
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * self.ycov_cellWidth)+x;
            })
            .style("text-anchor", "left")
            .attr("transform", function(d, i) {
                return "translate(" + self.ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * self.cellWidth) + ")";
            })
            .attr("class", "ycLabels mono")
            .attr("id", function(d, i) {
                return "ycLabels_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#ycLabels_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#ycLabels_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                self.ycSortOrder = !self.ycSortOrder;
                sortByValuesCov("c", i, self.ycSortOrder, "#mv12");
                d3.select("#order").property("selectedIndex", 0);
            });
}

//#########################################################
redrawCovLabel(heatmapId, mode) {
    var self = this;
    var selectLabel = "";
    if(mode=="yc")
        selectLabel = ".ycLabels";
    else if(mode=="yd")
        selectLabel = ".ydLabels";
    else if(mode=="xc")
        selectLabel = ".xcLabels";
    else
        selectLabel = ".xdLabel";

     var svg = d3.select(heatmapId).select("svg").select("#gap");
        var colLabels = svg.selectAll(selectLabel)
            .attr("x", function(d, i) {
                if(mode=="yc")
                    return 0;
                else if(mode=="yd")
                    return 0;
                else if(mode=="xc")
                    return self.col_number*self.cellWidth+5;
                else
                    return self.col_number*self.cellWidth+5;
            })
            .attr("y", function(d, i) {
                if(mode=="yc")
                    return (i * self.ycov_cellWidth)+self.yc_X-self.ycov_fontsize/2;
                else if(mode=="yd")
                    return (i * self.ycov_cellWidth)+self.yd_X-self.ycov_fontsize/2;
                else if(mode=="xc")
                    return (i * self.xcov_cellHeight)+self.xc_Y+self.xcov_cellHeight-self.xcov_fontsize/2;
                else
                    return (i * self.xcov_cellHeight)+self.xd_Y+self.xcov_cellHeight-self.xcov_fontsize/2;
            })
            .style("text-anchor", "left")
            .attr("transform", function(d, i) {
                if(mode=="yc")
                    return "translate(" + self.ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * self.cellWidth) + ")";
                else if(mode=="yd")
                    return "translate(" + self.ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * self.cellWidth) + ")";
                else
                    return null;
            });
}

//==================================================
// Change ordering of cells
sortByValuesCov(rORc, i, sortOrder, target) {
    var self = this;
            //var svg = d3.select(heatmapId).select("svg").select("#gap").select("#mv");
            var t = svg.transition().duration(1000);
            var values = [];
            var sorted;
            d3.select(target).selectAll(".c" + rORc + i)
                .filter(function(d) {
                    if (d != null) values.push(d);
                    else values.push(-999); // to handle NaN
                });
            //console.log(values);      
            if (rORc == "r") { // sort on cols
                sorted = d3.range(self.col_number).sort(function(a, b) {
                    if (sortOrder) {
                        return values[b] - values[a];
                    } else {
                        return values[a] - values[b];
                    }
                });
                self.colCurrentOrder = sorted;
                t.select("#mv").selectAll(".cell")
                    .attr("x", function(d) {
                        var col = parseInt(d3.select(this).attr("col"));
                        return sorted.indexOf(col) * self.cellWidth;
                    });
                //if(t.select("#mv3"))
                if(t.select("#mv13"))
                {
                    t.select("#mv13").selectAll(".cell")                      
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * self.cellWidth;
                        });
                }
                if(t.select("#mv14"))
                {
                    t.select("#mv14").selectAll(".cell")                      
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * self.cellWidth;
                        });
                }
                if(!self.isColProxfirst)
                {
                    t.select("#mv3").selectAll(".cell")
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * self.cellWidth;
                        });  
                    t.select("#mv3").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            return sorted.indexOf(row) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv3")[0].getAttribute("x");
                            var temp_y = sorted.indexOf(row) * self.cellWidth-10-self.col_number*self.cellWidth;

                            if(self.xc>0)
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-5+self.xd_Y);
                                else
                                    temp_y = temp_y + (-5+self.xc_Y);
                            }
                            else
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-5+self.xd_Y);
                            }
                            //return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                            return "translate(" + temp_x + "," + temp_y + ")";
                        });

                    t.selectAll(".colLabel")
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var temp_y = -10-self.col_number*self.cellWidth+self.cellWidth / 1.5;
                            if(self.xc>0)
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                                else
                                    temp_y = temp_y + (-3+self.xc_Y);
                            }
                            else
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                            }
                            return "translate("+ (-3+5+self.col_number*self.cellWidth) + "," + temp_y + ")";
                            //return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                        });
                }    
                else{
                    //redrawColLabels(heatmapId); 
                    t.selectAll(".colLabel")
                        .attr("x", 0)
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            var temp_y = 0;
                            if(self.xc>0)
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                                else
                                    temp_y = temp_y + (-3+self.xc_Y);
                            }
                            else
                            {
                                if(self.xd>0)
                                    temp_y = temp_y + (-3+self.xd_Y);
                                else
                                    temp_y = temp_y + (-3);
                            }
                            return "translate(" + self.cellWidth / 2 + ", "+temp_y+") rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                        }); 
                    /*t.selectAll(".colLabel")
                        .attr("y", function(d, i) {
                            return sorted.indexOf(i) * self.cellWidth;
                        })
                        .attr("transform", function(d, i) {
                            return "translate(" + self.cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * self.cellWidth) + ")";
                        });*/
                }
            } else { // sort on rows
                sorted = d3.range(self.row_number).sort(function(a, b) {
                    if (sortOrder) {
                        return values[b] - values[a];
                    } else {
                        return values[a] - values[b];
                    }
                });
                self.rowCurrentOrder = sorted;
                t.select("#mv").selectAll(".row")
                    .attr("y", function(d) {
                        var row = parseInt(d3.select(this).attr("id"));
                        return sorted.indexOf(row) * self.cellHeight;
                    })
                    .attr("transform", function(d, i) {
                        var row = parseInt(d3.select(this).attr("id"));
                        return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                    });
                if(t.select("#mv2"))
                {
                    //console.log("yes");
                    t.select("#mv2").selectAll(".cell")
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * self.cellHeight;
                        });  
                    t.select("#mv2").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            return sorted.indexOf(row) * self.cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv2")[0].getAttribute("x");
                            return "translate(" + temp_x + "," + sorted.indexOf(row) * self.cellHeight + ")";
                        });

                }
                if(t.select("#mv11"))
                {
                    t.select("#mv11").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            //console.log(sorted.indexOf(row));
                            return sorted.indexOf(row) * self.cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv11")[0].getAttribute("x");
                            return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                        });

                }
                if(t.select("#mv12"))
                {
                    t.select("#mv12").selectAll(".row")
                        .attr("y", function(d) {
                            var row = parseInt(d3.select(this).attr("id"));
                            //console.log(sorted.indexOf(row));
                            return sorted.indexOf(row) * self.cellHeight;
                        })
                        .attr("transform", function(d, i) {
                            var row = parseInt(d3.select(this).attr("id"));
                            var temp_x = $("#mv12")[0].getAttribute("x");
                            return "translate(0," + sorted.indexOf(row) * self.cellHeight + ")";
                        });

                }
                t.selectAll(".rowLabel")
                    .attr("y", function(d, i) {
                        return sorted.indexOf(i) * self.cellHeight;
                    })
                    .attr("transform", function(d, i) {
                        if(self.yc>0)
                        {
                            if(self.yd>0)
                                return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                            else
                                return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                        }
                        else
                        {
                            if(self.yd>0)
                                return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                            else
                                return "translate(-3," + self.cellHeight / 1.5 + ")";
                        }
                    });
            }
}

//#########################################################
shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
//#########################################################
//setAllParameters(tmp_dataFileName, tmp_hasRowName, tmp_hasColName, tmp_yd, tmp_yc, tmp_xd, tmp_xc)
loadExample(filename) {
    var self = this;
    if(filename == "iris")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = ",";
        var dataFileName = "iris.csv";   
        setAllParameters(self.dataFileName, true, true, 1, 0, 0, 0);
        heatmap_display(self.dataFileName, "#heatmap", "Spectral", sep); 
    }
    else if(filename == "crab")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = "\t";
        var dataFileName = "CRAB.txt";   
        setAllParameters(self.dataFileName, true, true, 3, 1, 0, 0);
        heatmap_display(self.dataFileName, "#heatmap", "Spectral", sep); 
    }
    else if(filename == "mona_lisa")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = "\t";
        var dataFileName = "Mona_Lisa_300_217_1.txt";   
        setAllParameters(self.dataFileName, true, true, 0, 0, 0, 0);
        heatmap_display(self.dataFileName, "#heatmap", "Spectral", sep); 
    }
    else if(filename == "journal_survey")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = "\t";
        var dataFileName = "Journal_Survey.txt";   
        setAllParameters(self.dataFileName, true, true, 0, 3, 3, 0);
        $('#palette').val("Grey");
        self.rdPaletteReverse = true;
        $("#isColorReverse").prop("checked", true);
        heatmap_display(self.dataFileName, "#heatmap", "Grey", sep); 
    }
}

//#########################################################
/*downloadFile(textString, filename) {
    var blob = new Blob([textString], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
}*/

saveTextAsFile( _text, _fileName) {
    var self = this;
    var textFileAsBlob = new Blob([_text], {type:'text/plain'});
 
    var downloadLink = document.createElement("a");
    downloadLink.download = _fileName;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
 
    downloadLink.click();
}

//#########################################################
doubleArrayToString(arr) {
  let str = '';
  for(var i = 0; i < arr.length; i++)
  {
    for(var j = 0; j <arr[0].length; j++)
    {
        str = str + arr[i][j];
        if (j != (arr[0].length - 1)) {
          str += '\t';
        };
    }
    str += '\n';
  }

  return str;
}

//#########################################################
saveImagetoPNG(filename) {
    var self = this;
    /*var canvas = document.getElementById("heatmap");
    canvas.toBlob(function(blob) {
        saveAs(blob, "pretty image.png");
    });*/
    var svg1 = d3.select("#heatmap").select("svg");
    //var svg2 = document.getElementById('gapsvg');
   //var bBox = svg2.getBBox();
    //console.log(bBox.width+","+bBox.height);
    var svgString = getSVGString(svg1.node());
    svgString2Image( svgString, $(document).width(), $(document).height(), 'png', save ); // passes Blob and filesize String to the callback
    //svgString2Image( svgString, bBox.width, bBox.height, 'png', save ); // passes Blob and filesize String to the callback

    function save( dataBlob, filesize ){
        saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
    }
}

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push( '#'+parentElement.id );
        for (var c = 0; c < parentElement.classList.length; c++)
                if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                    selectorTextArr.push( '.'+parentElement.classList[c] );

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if ( !contains('#'+id, selectorTextArr) )
                selectorTextArr.push( '#'+id );

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if ( !contains('.'+classes[c], selectorTextArr) )
                    selectorTextArr.push( '.'+classes[c] );
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];
            
            try {
                if(!s.cssRules) continue;
            } catch( e ) {
                    if(e.name !== 'SecurityError') throw e; // for Firefox
                    continue;
                }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                    extractedCSSText += cssRules[r].cssText;
            }
        }
        

        return extractedCSSText;

        function contains(str,arr) {
            return arr.indexOf( str ) === -1 ? false : true;
        }

    }

   function appendCSS( cssText, element ) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css"); 
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore( styleElement, refNode );
    }
}


svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'self.data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to self.data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
        context.clearRect ( 0, 0, width, height );
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob( function(blob) {
            var filesize = Math.round( blob.length/1024 ) + ' KB';
            if ( callback ) callback( blob, filesize );
        });

        
    };

    image.src = imgsrc;
}

//#########################################################
//Only for input data = Row Proximity Matrix Data   
setupProxLabel(heatmapId) {
    var self = this;
    if(self.cellHeight<6)
        self.row_fontsize = self.cellHeight-1;
    else if(self.cellHeight>=6 && self.cellHeight<10)    
        self.row_fontsize = self.cellHeight-2;
    else if(self.cellHeight>=10 && self.cellHeight<12)    
        self.row_fontsize = self.cellHeight-3;
    else if(self.cellHeight>=12 && self.cellHeight<=24)    
        self.row_fontsize = 8;
    else
        self.row_fontsize = self.cellHeight/3;

    if(self.row_fontsize<1)
        self.row_fontsize = 1;

    var rowLabels = self.svg.append("g")
            .attr("class", "rowLabels")
            .selectAll(".rowLabel")
            //.data(self.data.index)
            .data(self.row_name)
            .enter().append("text")
            .text(function(d) {
                //return d.count > 1 ? d.join("/") : d;
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * self.cellHeight);
            })
            .style("text-anchor", "end")
            .style("font-size", self.row_fontsize+"px")
            .attr("transform", function(d, i) {
                if(self.yc>0)
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+self.yc_X)+"," + self.cellHeight / 1.5 + ")";
                }
                else
                {
                    if(self.yd>0)
                        return "translate("+(-3+self.yd_X)+"," + self.cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + self.cellHeight / 1.5 + ")";
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
            });
            /*.on("click", function(d, i) {
                rowSortOrder = !rowSortOrder;
                sortByValues("r", i, rowSortOrder);
                d3.select("#order").property("selectedIndex", 0);
                //$("#order").jqxComboBox({selectedIndex: 0});
            });*/
}

//#########################################################
pearsonCorrelation(prefs, p1, p2, n, mode) {
    if(mode == 0)   //for row
    {
      var sum1 = 0;
      for (var i = 0; i < n; i++) sum1 += parseFloat(prefs[p1][i]);

      var sum2 = 0;
      for (var i = 0; i < n; i++) sum2 += parseFloat(prefs[p2][i]);

      var sum1Sq = 0;
      for (var i = 0; i < n; i++) {
        sum1Sq += Math.pow(prefs[p1][i], 2);
      }

      var sum2Sq = 0;
      for (var i = 0; i < n; i++) {
        sum2Sq += Math.pow(prefs[p2][i], 2);
      }

      var pSum = 0;
      for (var i = 0; i < n; i++) {
        pSum += prefs[p1][i] * prefs[p2][i];
      }
  }
  else if(mode == 1)  //for col
  {
      var sum1 = 0;
      for (var i = 0; i < n; i++) sum1 += parseFloat(prefs[i][p1]);

      var sum2 = 0;
      for (var i = 0; i < n; i++) sum2 += parseFloat(prefs[i][p2]);

      var sum1Sq = 0;
      for (var i = 0; i < n; i++) {
        sum1Sq += Math.pow(prefs[i][p1], 2);
      }

      var sum2Sq = 0;
      for (var i = 0; i < n; i++) {
        sum2Sq += Math.pow(prefs[i][p2], 2);
      }

      var pSum = 0;
      for (var i = 0; i < n; i++) {
        pSum += prefs[i][p1] * prefs[i][p2];
      }    
  }

      var num = pSum - (sum1 * sum2 / n);
      //console.log("a:"+ sum1);
      var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
          (sum2Sq - Math.pow(sum2, 2) / n));

      if (den == 0) return 0;

      return num / den;
}

//#########################################################
EuclideanDistance(prefs, p1, p2, n, mode) {
     var sum=0;
     if(mode == 0)   //for row
     {
         for(var i=0; i<n; i++){
          sum+= Math.pow(parseFloat(prefs[p1][i])-parseFloat(prefs[p2][i]),2);
         }
     }
     else if(mode == 1) //for col
     {
         for(var i=0; i<n; i++){
          sum+= Math.pow(parseFloat(prefs[i][p1])-parseFloat(prefs[i][p2]),2);
         }  
     }
     return Math.sqrt(sum);
};
/*
strip(num, precision = 2) {
  return +parseFloat(num.toPrecision(precision));
}
*/
}
