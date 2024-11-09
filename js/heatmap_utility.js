
//#########################################################
function changeRowOrder(newOrder, heatmapId) {
    var sortedTarget = 0; //0 for rows
    var svg = d3.select(heatmapId);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage")
    {
        $("#rowflip").prop("disabled",false);
        $("#rowflip_side").prop("disabled",false);
    }
    
    var nowFlip = 0;

    if(rowFlipId == "r2e")
        nowFlip = 1;
    else if(rowFlipId == "uncle")
        nowFlip = 2;
    else if(rowFlipId == "grandpa")
        nowFlip = 3;
    else
        nowFlip = 0;
    //var t = svg.transition().duration(1000);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage" || newOrder == "random") { 
        
        if(newOrder == "r2e")   // R2E sort on rows  
        {
            console.log("start r2e");
            if(!firstRunRowTree)
                d3.selectAll("#rowTree").remove();
            if(row_r2e_order.length>0)
            {
                sorted = row_r2e_order.slice();   
            }
            else
            {
                sorted = runR2E(sortedTarget);
                row_r2e_order = sorted.slice();
                $("#rowflip option[value='r2e']").prop("disabled",false);   
                $("#rowflip_side option[value='r2e']").prop("disabled",false);   
            }           
            //console.log("Row R2E: "+sorted);
        }
        else if(newOrder == "random")   // Random sort on rows  
        {
            console.log("start random");
            if(!firstRunRowTree)
                d3.selectAll("#rowTree").remove();
            var random_order = [];
            for(var i=0; i<row_number; i++)
                random_order[i] = i;
            shuffle(random_order);     
            sorted = random_order;    
            //console.log("Row Random: "+sorted);
        }
        else if (newOrder == "singlelinkage")  // singlelinkage sort on rows
        {
            console.log("start single linkage");
            sorted = runHCTree(sortedTarget, 0, nowFlip, "rowTree", col_number*cellWidth+row_number*cellHeight+13, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);
        }
        else if (newOrder == "averagelinkage")  // averagelinkage sort on rows
        {
            console.log("start average linkage");
            sorted = runHCTree(sortedTarget, 2, nowFlip, "rowTree", col_number*cellWidth+row_number*cellHeight+13, 0, heatmapId, rowIsSimilarity);
            //console.log(sorted);
        }
        else    //completelinkage sorts on rows
        {
            console.log("start complete linkage");
            sorted = runHCTree(sortedTarget, 1, nowFlip, "rowTree", col_number*cellWidth+row_number*cellHeight+13, 0, heatmapId, rowIsSimilarity);
            //console.log(sorted);            
        }

        svg.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                //console.log(sorted.indexOf(row));
                return sorted.indexOf(row) * cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + sorted.indexOf(row) * cellHeight + ")";
            });

        if(svg.select("#mv2"))
        {
            svg.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    //var temp_x = $("#mv2")[0].getAttribute("x");
                    return (sorted.indexOf(col) * cellHeight);
                });  
            svg.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return sorted.indexOf(row) * cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    //var temp_x = 0;
                    return "translate(" + temp_x + "," + sorted.indexOf(row) * cellHeight + ")";
                });

        }
        if(svg.select("#mv11"))
        {
            svg.select("#mv11").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return sorted.indexOf(row) * ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv11")[0].getAttribute("x");
                    return "translate(0," + sorted.indexOf(row) * ycov_cellHeight + ")";
                });

        }
        if(svg.select("#mv12"))
        {
            svg.select("#mv12").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return sorted.indexOf(row) * ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    return "translate(0," + sorted.indexOf(row) * ycov_cellHeight + ")";
                });

        }
        svg.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return sorted.indexOf(i) * cellHeight;
            })
            .attr("transform", function(d, i) {
                if(yc>0)
                {
                    if(yd>0)
                        return "translate("+(-3+yd_X)+"," + ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+yc_X)+"," + ycov_cellHeight / 1.5 + ")";
                }
                else
                {
                    if(yd>0)
                        return "translate("+(-3+yd_X)+"," + ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + ycov_cellHeight / 1.5 + ")";
                }
            });

        rowCurrentOrder = sorted;
    
    } else if (newOrder == "sortinit_row") { // initial sort on rows (alphabetically if produced like this)
        svg.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                return row * cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + row * cellHeight + ")";
            });
        if(!firstRunRowTree)
            d3.selectAll("#rowTree").remove();
        if(svg.select("#mv2"))
        {
            svg.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellHeight;
                });  
            svg.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    return "translate(" + temp_x + "," + row * cellHeight + ")";
                });

        }
        if(svg.select("#mv11"))
        {
            svg.select("#mv11").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return row * ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv11")[0].getAttribute("x");
                    return "translate(0," + row * ycov_cellHeight + ")";
                });

        }
        if(svg.select("#mv12"))
        {
            svg.select("#mv12").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return row * ycov_cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    return "translate(0," + row * ycov_cellHeight + ")";
                });

        }
        svg.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return i * cellHeight;
            })
            .attr("transform", function(d, i) {
                if(yc>0)
                {
                    if(yd>0)
                        return "translate("+(-3+yd_X)+"," + ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+yc_X)+"," + ycov_cellHeight / 1.5 + ")";
                }
                else
                {
                    if(yd>0)
                        return "translate("+(-3+yd_X)+"," + ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + ycov_cellHeight / 1.5 + ")";
                }
            });
        for( i=0 ;i< row_number; i++)
            rowCurrentOrder[i] = i;

    } 
}

//#########################################################
function changeColOrder(newOrder, heatmapId) {
    var sortedTarget = 1; //1 for columns
    var svg = d3.select(heatmapId);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage")
    {
        $("#colflip").prop("disabled",false);
        $("#colflip_side").prop("disabled",false);
    }
    var nowFlip = 0;

    if(colFlipId == "r2e")
        nowFlip = 1;
    else if(colFlipId == "uncle")
        nowFlip = 2;
    else if(colFlipId == "grandpa")
        nowFlip = 3;
    else
        nowFlip = 0;
    //var t = svg.transition().duration(1000);
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage" || newOrder == "random") { 
        var tree_y = (-10-col_number*cellWidth);

        if(xc>0)
        {
            if(xd>0)
                tree_y = tree_y + (-5+xd_Y);
            else
                tree_y = tree_y + (-5+xc_Y);
        }
        else
        {
            if(xd>0)
                tree_y = tree_y + (-5+xd_Y);
        }    
        if (newOrder == "r2e") { // R2E sort on columns
            console.log("start r2e");
            if(!firstRunColTree)
                d3.selectAll("#colTree").remove();
            if(col_r2e_order.length>0)
            {
                sorted = col_r2e_order.slice(); 
            }
            else
            {
                sorted = runR2E(sortedTarget);
                col_r2e_order = sorted.slice();   
                $("#colflip option[value='r2e']").prop("disabled",false);  
                $("#colflip_side option[value='r2e']").prop("disabled",false);     
            } 

            //console.log("Col. R2E: "+sorted);
        }
        else if(newOrder == "random")   // Random sort on rows  
        {
            console.log("start random");
            if(!firstRunColTree)
                d3.selectAll("#colTree").remove();
            var random_order = [];
            for(var i=0; i<col_number; i++)
                random_order[i] = i;
            shuffle(random_order);     
            sorted = random_order;    
            //console.log("Row Random: "+sorted);
        }
        else if (newOrder == "singlelinkage")  // singlelinkage sort on rows
        {
            console.log("start single linkage"); //+$('.colLabels')[0].getBoundingClientRect().width
            sorted = runHCTree(sortedTarget, 0, nowFlip, "colTree", col_number*cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);
        }
        else if (newOrder == "averagelinkage")  // averagelinkage sort on rows
        {
            console.log("start average linkage");
            sorted = runHCTree(sortedTarget, 2, nowFlip, "colTree", col_number*cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, colIsSimilarity);
            //console.log(sorted);
        }
        else    //completelinkage sorts on rows
        {
            console.log("start complete linkage");
            sorted = runHCTree(sortedTarget, 1, nowFlip, "colTree", col_number*cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, colIsSimilarity);
            //console.log(sorted);            
        }
        colCurrentOrder = sorted;

        svg.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return sorted.indexOf(col) * cellWidth;
            });
        //if(svg.select("#mv3"))
        if(!isColProxfirst)
        {
            svg.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * cellWidth;
                });  
            svg.select("#mv3").selectAll(".row")
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

            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -10-col_number*cellWidth+cellWidth / 1.5;
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
                    return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                    //return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                });

        } 
        else
        {
            svg.selectAll(".colLabel")
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
                            temp_y = -3;
                    }
                    //return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                    return "translate(" + cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                    //return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                });
        }

        if(svg.select("#mv13"))
        {
            svg.select("#mv13").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * xcov_cellWidth;
                })
            svg.select("#mv13").selectAll(".row")
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv13")[0].getAttribute("x");
                    var temp_y = i * xcov_cellHeight + xd_Y;
                    //var temp_y = sorted.indexOf(row) * xcov_cellWidth-5-col_number*xcov_cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";           
                });
        }
        if(svg.select("#mv14"))
        {
            svg.select("#mv14").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * cellWidth;
                })
            svg.select("#mv14").selectAll(".row") 
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv14")[0].getAttribute("x");
                    var temp_y = i * xcov_cellHeight + xc_Y;
                    //var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
        }  

    } 
    else if (newOrder == "sortinit_col") { // initial sort on cols (alphabetically if produced like this)
        svg.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return col * cellWidth;
            });
        if(!firstRunColTree)
            d3.selectAll("#colTree").remove();
        //if(svg.select("#mv3"))
        if(!isColProxfirst)
        {
            svg.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellWidth;
                });  
            svg.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = row * cellWidth-10-col_number*cellWidth;

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

                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * cellWidth;
                })            
                .attr("transform", function(d, i) {
                    var temp_y = -10-col_number*cellWidth+cellWidth / 1.5;
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
                    return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                    //return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                });   
        } 
        else
        {
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * cellWidth;
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
                            temp_y = -3;
                    }
                    //return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                    return "translate(" + cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
/*
                    var temp_y = -10-col_number*cellWidth+cellWidth / 1.5;
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
                    return "translate(" + cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
*/
                });    
        }

        if(svg.select("#mv13"))
        {
            svg.select("#mv13").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellWidth;
                })
            svg.select("#mv13").selectAll(".row")
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv13")[0].getAttribute("x");
                    var temp_y = i * xcov_cellHeight + xd_Y;
                    //var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
        }
        if(svg.select("#mv14"))
        {
            svg.select("#mv14").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellWidth;
                })
            svg.select("#mv14").selectAll(".row") 
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv14")[0].getAttribute("x");
                    //var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                    var temp_y = i * xcov_cellHeight + xc_Y;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
        }
        for( i=0 ;i< col_number; i++)
            colCurrentOrder[i] = i;
    }
}

//#########################################################
function changeOrder(newOrder, heatmapId) {
    var svg = d3.select(heatmapId);
    var t = svg.transition().duration(1000);
    if (newOrder == "sortinit_col") { // initial sort on cols (alphabetically if produced like this)
        t.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return col * cellWidth;
            });
        if(t.select("#mv3"))
        {
            t.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellWidth;
                });  
            t.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = row * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -5-col_number*cellWidth+cellWidth / 1.5;
                    return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                    //return "translate(" + cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellSize) + ")";
                });
        } 
        else
        {
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * cellWidth;
                })            
                .attr("transform", function(d, i) {
                    return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                });    
        }
    } else if (newOrder == "sortinit_row") { // initial sort on rows (alphabetically if produced like this)
        t.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                return row * cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + row * cellHeight + ")";
            });
        if(t.select("#mv2"))
        {
            t.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellHeight;
                });  
            t.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    return "translate(" + temp_x + "," + row * cellHeight + ")";
                });

        }
        t.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return i * cellHeight;
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
    } else if (newOrder == "sortinit_col_row") { // initial sort on rows and cols (alphabetically if produced like this)
        t.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return col * cellWidth;
            });
        t.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                return row * cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + row * cellHeight + ")";
            });
        if(t.select("#mv2"))
        {
            t.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellHeight;
                });  
            t.select("#mv2").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv2")[0].getAttribute("x");
                    return "translate(" + temp_x + "," + row * cellHeight + ")";
                });

        }
        if(t.select("#mv3"))
        {
            t.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return col * cellWidth;
                });  
            t.select("#mv3").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    return row * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv3")[0].getAttribute("x");
                    var temp_y = row * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -5-col_number*cellWidth+cellWidth / 1.5;
                    return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                    //return "translate(" + cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellSize) + ")";
                });
        } 
        else
        {
            t.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * cellWidth;
                })            
                .attr("transform", function(d, i) {
                    return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                });    
        }
        
        t.selectAll(".rowLabel")
            .attr("y", function(d, i) {
                return i * cellHeight;
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

//#########################################################
function changeRowFlip(newFlip, heatmapId) {
    var sortedTarget = 0; //0 for rows
    var svg = d3.select(heatmapId);
    //$("#rowflip").prop("disabled",false);
    //var t = svg.transition().duration(1000);
    var nowOrder = 0;

    if(rowOrderId == "singlelinkage")
        nowOrder = 0;
    else if(rowOrderId == "averagelinkage")
        nowOrder = 2;
    else if(rowOrderId == "completelinkage")
        nowOrder = 1;

    if (newFlip == "null")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 0, "rowTree", col_number*cellWidth+row_number*cellHeight+13, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);   
    }
    else if(newFlip == "r2e")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 1, "rowTree", col_number*cellWidth+row_number*cellHeight+13, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);    
    }
    else if (newFlip == "uncle")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 2, "rowTree", col_number*cellWidth+row_number*cellHeight+13, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);
    }
    else if (newFlip == "grandpa")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 3, "rowTree", col_number*cellWidth+row_number*cellHeight+13, 0, heatmapId, rowIsSimilarity);
            //console.log(sorted);
    }

    svg.select("#mv").selectAll(".row")
            .attr("y", function(d) {
                var row = parseInt(d3.select(this).attr("id"));
                //console.log(sorted.indexOf(row));
                return sorted.indexOf(row) * cellHeight;
            })
            .attr("transform", function(d, i) {
                var row = parseInt(d3.select(this).attr("id"));
                return "translate(0," + sorted.indexOf(row) * cellHeight + ")";
            });

    if(svg.select("#mv2"))
    {
            svg.select("#mv2").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * cellHeight;
                });  
            svg.select("#mv2").selectAll(".row")
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
    if(svg.select("#mv11"))
    {
            svg.select("#mv11").selectAll(".row")
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
    if(svg.select("#mv12"))
    {
            svg.select("#mv12").selectAll(".row")
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
    svg.selectAll(".rowLabel")
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

    rowCurrentOrder = sorted;
}

//#########################################################
function changeColFlip(newFlip, heatmapId) {
    var sortedTarget = 1; //1 for columns
    var svg = d3.select(heatmapId);
    //$("#colflip").prop("disabled",false);
    //var t = svg.transition().duration(1000);
    var nowOrder = 0;

    if(colOrderId == "singlelinkage")
        nowOrder = 0;
    else if(colOrderId == "averagelinkage")
        nowOrder = 2;
    else if(colOrderId == "completelinkage")
        nowOrder = 1;

    var tree_y = (-10-col_number*cellWidth);

    if(xc>0)
    {
        if(xd>0)
            tree_y = tree_y + (-5+xd_Y);
        else
            tree_y = tree_y + (-5+xc_Y);
    }
    else
    {
        if(xd>0)
            tree_y = tree_y + (-5+xd_Y);
    }   

    if (newFlip == "null")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 0, "colTree", col_number*cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted);   
    }
    else if(newFlip == "r2e")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 1, "colTree", col_number*cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted); 
    }
    else if (newFlip == "uncle")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 2, "colTree", col_number*cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted); 
    }
    else if (newFlip == "grandpa")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 3, "colTree", col_number*cellWidth+10+d3.selectAll('.colLabels').node().getBBox().width, tree_y, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            //console.log(sorted); 
    }

    svg.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return sorted.indexOf(col) * cellWidth;
            });
    if(svg.select("#mv3"))
    {
            svg.select("#mv3").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * cellWidth;
                });  
            svg.select("#mv3").selectAll(".row")
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
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -10-col_number*cellWidth+cellWidth / 1.5;
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
                    return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
                    //return "translate(" + cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellSize) + ")";
                });
    }    
    else{
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * cellWidth;
                })
                .attr("transform", function(d, i) {
                    return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                });
            svg.selectAll(".colLabel")
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
                    }
                    return "translate(" + cellWidth / 2 + ", " + temp_y + ") rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                    //return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellWidth) + ")";
                });
    }

    if(svg.select("#mv13"))
    {
            svg.select("#mv13").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * cellWidth;
                })
            svg.select("#mv13").selectAll(".row")
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv13")[0].getAttribute("x");
                    var temp_y = i * xcov_cellHeight + xd_Y;
                    //var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
    }
    if(svg.select("#mv14"))
    {
            svg.select("#mv14").selectAll(".cell")
                .attr("x", function(d) {
                    var col = parseInt(d3.select(this).attr("col"));
                    return sorted.indexOf(col) * cellWidth;
                })
            svg.select("#mv14").selectAll(".row") 
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv14")[0].getAttribute("x");
                    var temp_y = i * xcov_cellHeight + xc_Y;
                    //var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
    }  

    colCurrentOrder = sorted;

}

//#########################################################
function changePalette(conditionName, paletteName, heatmapId) {
    var colorID = d3.interpolateRdBu;
    //console.log("conditionName: "+conditionName);
    //var colors = colorbrewer[paletteName][classesNumber];
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

    if(optionTargetDataMap == "rawdata")
    {
        var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
        var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
        var minInputRange2 = $('#inputRange2').data('slider').getValue()[0];
        var maxInputRange2 = $('#inputRange2').data('slider').getValue()[1];
        if(conditionName == "RangeMatrix")
        {
            var colorScale = null;;
            if(rdPaletteReverse)
                colorScale = d3.scaleSequential()
                        //.domain([max_value, min_value])
                        .domain([minInputRange2, maxInputRange2])
                        .interpolator(colorID);  
            else
                colorScale = d3.scaleSequential()
                        //.domain([max_value, min_value])
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

            changeLegentTextForRawDataMatrix(conditionName);
        }
        else if(conditionName == "RangeRow")
        {
            var colorScale1 = d3.scaleSequential()
                        .domain([max_value, min_value])
                        .interpolator(colorID);  

            var svg = d3.select(heatmapId);
            var t = svg.transition().duration(500);
            t.select("#mv").selectAll(".cell")
                .style("fill", function(d) {

                    var rownum = d3.select(this).attr("row");
                    var colorScale;
                    if(data_row_min_value[rownum]<minInputRange2)
                    {
                        if(data_row_max_value[rownum]>maxInputRange2)
                        {
                            if(rdPaletteReverse)
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
                            if(rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([minInputRange2, data_row_max_value[rownum]])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([data_row_max_value[rownum], minInputRange2])
                                .interpolator(colorID);                   
                        }
                    }
                    else
                    {
                        if(data_row_max_value[rownum]>maxInputRange2)
                        {
                            if(rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([data_row_min_value[rownum], maxInputRange2])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([maxInputRange2, data_row_min_value[rownum]])
                                .interpolator(colorID);  
                        }
                        else
                        {
                            if(rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([data_row_min_value[rownum], data_row_max_value[rownum]])
                                .interpolator(colorID);  
                            else
                                colorScale = d3.scaleSequential()
                                .domain([data_row_max_value[rownum], data_row_min_value[rownum]])
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

            changeLegentTextForRawDataMatrix(conditionName);
        }
        else if(conditionName == "RangeCol")
        {
            var colorScale1 = d3.scaleSequential()
                        .domain([max_value, min_value])
                        .interpolator(colorID);  

            var svg = d3.select(heatmapId);
            var t = svg.transition().duration(500);
            t.select("#mv").selectAll(".cell")
                .style("fill", function(d) {

                    var colnum = d3.select(this).attr("col");
                    var colorScale;
                    if(data_min_value[colnum]<minInputRange2)
                    {
                        if(data_max_value[colnum]>maxInputRange2)
                        {
                            if(rdPaletteReverse)
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
                            if(rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([minInputRange2, data_max_value[colnum]])
                                .interpolator(colorID); 
                            else
                                colorScale = d3.scaleSequential()
                                .domain([data_max_value[colnum], minInputRange2])
                                .interpolator(colorID);                   
                        }
                    }
                    else
                    {
                        if(data_max_value[colnum]>maxInputRange2)
                        {
                            if(rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([data_min_value[colnum], maxInputRange2])
                                .interpolator(colorID);  
                            else
                                colorScale = d3.scaleSequential()
                                .domain([maxInputRange2, data_min_value[colnum]])
                                .interpolator(colorID);  
                        }
                        else
                        {
                            if(rdPaletteReverse)
                                colorScale = d3.scaleSequential()
                                .domain([data_min_value[colnum], data_max_value[colnum]])
                                .interpolator(colorID);   
                            else
                                colorScale = d3.scaleSequential()
                                .domain([data_max_value[colnum], data_min_value[colnum]])
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

            changeLegentTextForRawDataMatrix(conditionName);
        }
    }
    else if(optionTargetDataMap == "rp")
    {
        var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
        var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
        var minInputRange2 = $('#inputRange2').data('slider').getValue()[0];
        var maxInputRange2 = $('#inputRange2').data('slider').getValue()[1];
        var colorScale = null; 
        /*if(rowIsSimilarity==true)
        {
            colorScale = d3.scaleSequential()
                    .domain([1, -1])
                    .interpolator(colorID);
        }
        else
        {
            colorScale = d3.scaleSequential()
                    .domain([rp_max_value, rp_min_value])
                    .interpolator(colorID);        
        }*/
        if(rpPaletteReverse)
            colorScale = d3.scaleSequential()
                    .domain([minInputRange2, maxInputRange2])
                    .interpolator(colorID); 
        else
            colorScale = d3.scaleSequential()
                    .domain([maxInputRange2, minInputRange2])
                    .interpolator(colorID); 

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
    else if(optionTargetDataMap == "cp")
    { 
        var minInputRange1 = $('#inputRange1').data('slider').getValue()[0];
        var maxInputRange1 = $('#inputRange1').data('slider').getValue()[1];
        var minInputRange2 = $('#inputRange2').data('slider').getValue()[0];
        var maxInputRange2 = $('#inputRange2').data('slider').getValue()[1];
        var colorScale = null; 
        /*if(colIsSimilarity==true)
        {
            colorScale = d3.scaleSequential()
                    .domain([1, -1])
                    .interpolator(colorID);
        }
        else
        {
            colorScale = d3.scaleSequential()
                    .domain([cp_max_value, cp_min_value])
                    .interpolator(colorID);        
        }*/
        if(cpPaletteReverse)
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
function getColorID(paletteName) {
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
function changeLegentTextForRawDataMatrix(conditionName) {
    var legend_text2 = [];
    if(conditionName == "RangeMatrix")
    {
        legend_text2.push(parseFloat(min_value));
        legend_text2.push((parseFloat(max_value)+parseFloat(min_value))/2.0);
        legend_text2.push(parseFloat(max_value)); 
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
        .attr("y", viewerPosTop + 24);
}

//#########################################################
function redrawRowLabels(heatmapId) {
        var svg = d3.select(heatmapId);
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

        svg.selectAll(".rowLabel")
            .attr("x", 0)
            .attr("y", function(d, i) {
                if(rowOrderId == "sortinit_row")
                    return (rowCurrentOrder[i] * cellHeight);
                else
                    return (rowCurrentOrder.indexOf(i) * cellHeight);
            })
            .style("text-anchor", "end")
            .style("font-size", row_fontsize+"px")
            .attr("transform", function(d, i) {
                if(yc>0)
                {
                    if(yd>0)
                        return "translate("+(-3+yc_X-10-yd*ycov_cellWidth)+"," + ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+yc_X)+"," + ycov_cellHeight / 1.5 + ")";
                }
                else
                {
                    if(yd>0)
                        return "translate("+(-3 -10-yd*ycov_cellWidth)+"," + ycov_cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + ycov_cellHeight / 1.5 + ")";
                }
            });
}

//#########################################################
function redrawColLabels(heatmapId) {
        var svg = d3.select(heatmapId);

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
        //if(svg.select("#mv3"))
        if(!isColProxfirst)
        {
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    if(colOrderId == "sortinit_col")
                        return (colCurrentOrder[i] * cellWidth);
                    else
                        return sorted.indexOf(i) * cellWidth;
                })
                .style("font-size", col_fontsize+"px")
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
                    //return "translate(" + cellSize / 2 + ", -3) rotate(-90) rotate(45, 0, " + (sorted.indexOf(i) * cellSize) + ")";
                });            
        }
        else
        {
            svg.selectAll(".colLabel")
                .attr("x", 0)
                .attr("y", function(d, i) {
                    return (i * cellWidth);
                })
                .style("font-size", col_fontsize+"px")
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
                    return "translate(" + cellWidth / 2 + ", "+temp_y+") rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                });            
        }
}

//#########################################################
function redrawHeatmap(nowID, x, y, mode, heatmapId) {

        //console.log("nowID: "+nowID+","+max_data);
        var svg = d3.select(heatmapId);
        var row = svg.select("#"+nowID).selectAll(".row");
        j = 0;

        svg.select("#"+nowID)
            .attr("x", x)
            .attr("y", y);


        row.attr("y", function(d) {
                if(mode == 0)   //rd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(row) * cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return row * cellHeight;
                    else
                        return row_output_order_array.indexOf(row) * cellHeight;
                }
                else if(mode == 1)  //rp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(row) * cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return row * cellHeight;
                    else
                        return row_output_order_array.indexOf(row) * cellHeight;
                }
                else if(mode == 2)  //cp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(colOrderId == "r2e")
                        return col_r2e_order.indexOf(row) * cellWidth;
                    else if (colOrderId == "sortinit_col")
                        return row * cellWidth;
                    else
                        return col_output_order_array.indexOf(row) * cellWidth;

                }
                else if(mode == 11) //yd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(row) * ycov_cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return row * ycov_cellHeight;
                    else
                        return row_output_order_array.indexOf(row) * ycov_cellHeight;
                }
                else if(mode == 12) //yc
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(row) * ycov_cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return row * ycov_cellHeight;
                    else
                        return row_output_order_array.indexOf(row) * ycov_cellHeight;
                }
                else if(mode == 13) //xd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(colOrderId == "r2e")
                        return col_r2e_order.indexOf(row) * cellWidth;
                    else if (colOrderId == "sortinit_col")
                        return row * cellWidth;
                    else
                        return col_output_order_array.indexOf(row) * cellWidth;
                }
                else if(mode == 14) //xc
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(colOrderId == "r2e")
                        return col_r2e_order.indexOf(row) * cellWidth;
                    else if (colOrderId == "sortinit_col")
                        return row * cellWidth;
                    else
                        return col_output_order_array.indexOf(row) * cellWidth;
                }
            });

        row.attr("transform", function(d, i) {
                if(mode == 0)   //rd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(rowOrderId == "r2e")
                        return "translate(0," + row_r2e_order.indexOf(row) * cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* cellHeight+y) + ")"; 
                    else
                        return "translate(0," + row_output_order_array.indexOf(row) * cellHeight + ")";
                    //return "translate(" + 0 + "," + (i* cellHeight+y) + ")"; 
                }               
                else if(mode == 1)  //rp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    if(rowOrderId == "r2e")
                        return "translate(" + temp_x + "," + row_r2e_order.indexOf(row) * cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + temp_x + "," + (i* cellHeight+y) + ")"; 
                    else
                        return "translate(" + temp_x + "," + row_output_order_array.indexOf(row) * cellHeight + ")";
                    //return "translate(" + 0 + "," + (i* cellHeight+y) + ")"; 
                }                   
                else if(mode == 2)  //cp
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    var temp_y = 0; 
                    
                    if(colOrderId == "r2e")
                    {
                        temp_y = col_r2e_order.indexOf(row) * cellWidth-10-col_number*cellWidth;
                        //return "translate(" + temp_x + "," + temp_y + ")";
                    }
                    else if (colOrderId == "sortinit_col")
                    {
                        temp_y = i * cellWidth-10-col_number*cellWidth;
                        //return "translate(" + temp_x + "," + temp_y + ")";    
                    }
                    else
                    {
                        temp_y = col_output_order_array.indexOf(row) * cellWidth-10-col_number*cellWidth;
                        //return "translate(" + temp_x + "," + temp_y + ")";
                    }

                    if(xc>0)
                    {
                        if(xd>0)
                            temp_y = temp_y + (-10+xd_Y);
                        else
                            temp_y = temp_y + (-10+xc_Y);
                    }
                    else
                    {
                        if(xd>0)
                            temp_y = temp_y + (-10+xd_Y);
                    }                   
                    return "translate(" + temp_x + "," + temp_y + ")";   
                    //return "translate(" + 0 + "," + (i* cellWidth+y) + ")"; 
                }                   
                else if(mode == 11) //yd
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    if(rowOrderId == "r2e")
                        return "translate(0," + row_r2e_order.indexOf(row) * ycov_cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* ycov_cellHeight) + ")"; 
                    else
                        return "translate(0," + row_output_order_array.indexOf(row) * ycov_cellHeight + ")";
                }
                else if(mode == 12) //yc
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    if(rowOrderId == "r2e")
                        return "translate(0," + row_r2e_order.indexOf(row) * ycov_cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* ycov_cellHeight) + ")"; 
                    else
                        return "translate(0," + row_output_order_array.indexOf(row) * ycov_cellHeight + ")";
                }
                else if(mode == 13) //xd
                {
                    //var row = parseInt(d3.select(this).attr("id"));
                    return "translate(" + 0 + "," + (i* xcov_cellHeight + xd_Y) + ")"; 
                    /*
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    if(rowOrderId == "r2e")
                        return "translate(0," + row_r2e_order.indexOf(row) * cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* cellHeight) + ")"; 
                    else
                        return "translate(0," + row_output_order_array.indexOf(row) * cellHeight + ")";
                    */
                }
                else if(mode == 14) //xc
                {
                    //var row = parseInt(d3.select(this).attr("id"));
                    return "translate(" + 0 + "," + (i* xcov_cellHeight + xc_Y) + ")"; 
                    /*
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    if(rowOrderId == "r2e")
                        return "translate(0," + row_r2e_order.indexOf(row) * cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* cellHeight) + ")"; 
                    else
                        return "translate(0," + row_output_order_array.indexOf(row) * cellHeight + ")";
                    */
                }
                else
                    return "translate(" + 0 + "," + (i* cellHeight+y) + ")"; 
            });
        
        row.selectAll(".cell")
            .attr("x", function(d, i) {
                if(mode == 0)
                {
                    var col = parseInt(d3.select(this).attr("col"));
                    if(colOrderId == "r2e")
                        return col_r2e_order.indexOf(col) * cellWidth;
                    else if (colOrderId == "sortinit_col")
                        return i * cellWidth;
                    else
                        return col_output_order_array.indexOf(col) * cellWidth;
                    //return i * cellWidth + x;
                }                   
                else if(mode == 1)
                {
                    var col = parseInt(d3.select(this).attr("col"));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(col) * cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return i * cellHeight;
                    else
                        return (row_output_order_array.indexOf(col) * cellHeight);
                    //return i * cellHeight + x;
                }    
                else if(mode == 2)
                {
                    var col = parseInt(d3.select(this).attr("col"));
                    if(colOrderId == "r2e")
                        return col_r2e_order.indexOf(col) * cellWidth;
                    else if (colOrderId == "sortinit_col")
                        return i * cellWidth;
                    else
                        return col_output_order_array.indexOf(col) * cellWidth;
                }               
                else if(mode == 11)
                    return i * ycov_cellWidth + x;
                else if(mode == 12)
                    return i * ycov_cellWidth + x;
                else
                    return i * cellWidth + x;
            })
            .attr("width", function(d) {
                if(mode == 0)
                    return cellWidth;
                else if(mode == 1)
                    return cellHeight;
                else if(mode == 11)
                    return ycov_cellWidth;
                else if(mode == 12)
                    return ycov_cellWidth;
                else if(mode == 13)
                    return xcov_cellWidth;
                else if(mode == 14)
                    return xcov_cellWidth;
                else
                    return cellWidth;
            })
            .attr("height", function(d) {
                if(mode == 0)
                    return cellHeight;
                else if(mode == 1)
                    return cellHeight;
                else if(mode == 11)
                    return ycov_cellHeight;
                else if(mode == 12)
                    return ycov_cellHeight;
                else if(mode == 13)
                    return xcov_cellHeight;
                else if(mode == 14)
                    return xcov_cellHeight;
                else
                    return cellWidth;
            });
}

//#########################################################
function changeTreePosition(nowID, X, Y, mode, heatmapId) {
    var svg = d3.select("#heatmap").select("svg").select("#gap");
    svg.select("#"+nowID)
        .attr("x", X)
        .attr("y", Y)
        .attr("transform", function(d, i) {
            return "translate(" + X + "," + Y + ")"; 
        });

}

//#########################################################
function changeWidth(widthZoomRange, heatmapId) {
    cellWidth = cellOriWidth*widthZoomRange/50;
    xcov_cellWidth = cellWidth;

    if(optionTargetDataMap == "rawdata")
    {
        var mode = 0;
        redrawHeatmap("mv", 0, 0, mode, heatmapId);

        if(yd>0)
        {
            redrawHeatmap("mv11", yd_X, 0, 11, heatmapId);  
            redrawCovLabel(heatmapId,"yd");  
        }
        if(yc>0)
        {
            redrawHeatmap("mv12", yc_X, 0, 12, heatmapId);    
            redrawCovLabel(heatmapId,"yc");  
        }
        if(xd>0)
        {
            redrawHeatmap("mv13", 0, xd_Y, 13, heatmapId);    
            redrawCovLabel(heatmapId,"xd");  
        }
        if(xc>0)
        {
            redrawHeatmap("mv14", 0, xc_Y, 14, heatmapId);   
            redrawCovLabel(heatmapId,"xc");  
        }
        if(!isRowProxfirst)
        {
            redrawHeatmap("mv2", 10+col_number*cellWidth, 0, 1, heatmapId);    
            //if(!firstRunRowTree) 
            if (rowOrderId == "singlelinkage" || rowOrderId == "averagelinkage" || rowOrderId == "completelinkage") 
                changeTreePosition("rowTree", col_number*cellWidth+row_number*cellHeight+10+3, 0, heatmapId);
        }

        redrawRowLabels(heatmapId);
        redrawColLabels(heatmapId);

        if(!isColProxfirst)
        {
            var temp_y = (-10-col_number*cellWidth);
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
            redrawHeatmap("mv3", 0, temp_y, 2, heatmapId);    
            //if(!firstRunColTree) 
            if (colOrderId == "singlelinkage" || colOrderId == "averagelinkage" || colOrderId == "completelinkage") 
                drawColTree(treeColData, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, temp_y, 1, heatmapId); 
        }
    }

    //redrawRowLabels(heatmapId);
    //redrawColLabels(heatmapId);
}

//#########################################################
function changeHeight(heightZoomRange, heatmapId) {
    cellHeight = cellOriHeight*heightZoomRange/50;
    ycov_cellHeight = cellHeight;

    if(optionTargetDataMap == "rawdata")
    {
        var mode = 0;
        redrawHeatmap("mv", 0, 0, mode, heatmapId);

        if(yd>0)
        {
            redrawHeatmap("mv11", yd_X, 0, 11, heatmapId); 
            redrawCovLabel(heatmapId,"yd");  
            //redrawHeatmap("mv11", -10-yd*cellWidth, 0, 11, heatmapId);  
        }
        if(yc>0)
        {
            redrawHeatmap("mv12", yc_X, 0, 12, heatmapId);    
            redrawCovLabel(heatmapId,"yc");  
        }
        if(xd>0)
        {
            redrawHeatmap("mv13", 0, xd_Y, 13, heatmapId);   
            redrawCovLabel(heatmapId,"xd");  
        }
        if(xc>0)
        {
            redrawHeatmap("mv14", 0, xc_Y, 14, heatmapId);    
            redrawCovLabel(heatmapId,"xc");  
        }
        if(!isRowProxfirst)
        {
            redrawHeatmap("mv2", 10+col_number*cellWidth, 0, 1, heatmapId);  
            if(!firstRunRowTree) 
                drawRowTree(treeRowData, "rowTree", col_number*cellWidth+row_number*cellHeight+10+3, 0, 0, heatmapId); 
        }
        if(!isColProxfirst)
        {
            redrawHeatmap("mv3", 0, -10-col_number*cellWidth, 2, heatmapId);    
            //if(!firstRunColTree) 
                //changeTreePosition("colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, 1, heatmapId);
        }
    }

    redrawRowLabels(heatmapId);
    redrawColLabels(heatmapId);

}
//#########################################################
function setupHeatmap2(nowdata, nowID, x, y, mode, heatmapId, colorID) {
        var svg = d3.select(heatmapId).select("svg").select("#gap");
        var max_data = d3.max(nowdata, function(row) { return d3.max(row) });
        var min_data = d3.min(nowdata, function(row) { return d3.min(row) });

        if(mode==1)
        {
            rp_max_value = max_data;
            rp_min_value = min_data;
        }
        else if(mode==2)
        {
            cp_max_value = max_data;
            cp_min_value = min_data;
        }

        //if((mode==1 && rowIsSimilarity==true) || (mode==2 && colIsSimilarity==true))
        if((mode==1 && row_Scale_id == 1) || (mode==2 && col_Scale_id == 1))
        {
            var colorScale = d3.scaleSequential()
                .domain([1, -1])
                .interpolator(colorID);
            if(mode==1)
                drawColorLegend("rp_colorspec", viewerPosTop, colorScale, "Row Proximity Matrix", -1, 1, false);
            else
                drawColorLegend("cp_colorspec", viewerPosTop, colorScale, "Column Proximity Matrix", -1, 1, false);
        }
        else if(mode==11)   //yd
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
            drawColorLegend("yd_colorspec", viewerPosTop, colorScale, "Ydisc. covariates", min_data, max_data, true);       
        }
        else if(mode==12)   //yc
        {
            var colorScale = d3.scaleSequential()
                .domain([yc_max_value[0], yc_min_value[0]])
                .interpolator(colorID);     
            drawColorLegend("yc_colorspec", viewerPosTop, colorScale, "Yconti. covariates", yc_min_value[0], yc_max_value[0], false);    
        }
        else if(mode==13)   //xd
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
            drawColorLegend("xd_colorspec", viewerPosTop, colorScale, "Xdisc. covariates", min_value, max_data, true);       
        }
        else if(mode==14)   //xc
        {
            var colorScale = d3.scaleSequential()
                .domain([xc_max_value[0], xc_min_value[0]])
                .interpolator(colorID);     
            drawColorLegend("xc_colorspec", viewerPosTop, colorScale, "Xconti. covariates", xc_min_value[0], xc_max_value[0], false);    
        }
        else{
            var colorScale;
            if(optionTargetDataMap == "rawdata" && rdPaletteReverse)
                colorScale = d3.scaleSequential()
                .domain([min_data, max_data])
                .interpolator(colorID);  
            else
                colorScale = d3.scaleSequential()
                .domain([max_data, min_data])
                .interpolator(colorID);  
            if(mode == 0)
                drawColorLegend("md_colorspec", viewerPosTop, colorScale, "Raw Data Matrix", min_data, max_data, false);
            else if(mode==1)
                drawColorLegend("rp_colorspec", viewerPosTop, colorScale, "Row Proximity Matrix", min_data, max_data, false);  
            else if(mode==2)
                drawColorLegend("cp_colorspec", viewerPosTop, colorScale, "Column Proximity Matrix", min_data, max_data, false);  
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
                    return "translate(" + 0 + "," + (i* cellHeight+y) + ")"; 
                else if(mode == 1)
                    return "translate(" + 0 + "," + (rowCurrentOrder.indexOf(i)* cellHeight+y) + ")"; 
                else if(mode == 2)
                    return "translate(" + 0 + "," + (colCurrentOrder.indexOf(i)* cellWidth+y) + ")"; 
                else if(mode == 13)
                    return "translate(" + 0 + "," + (i* xcov_cellHeight+y) + ")"; 
                else if(mode == 14)
                    return "translate(" + 0 + "," + (i* xcov_cellHeight+y) + ")"; 
                else
                    return "translate(" + 0 + "," + (i* cellHeight+y) + ")"; 
            })
            .attr("class", "row");
        var row = svg.select("#"+nowID).selectAll(".row");


        j = 0;
        
        var heatMap = row.selectAll(".cell")
            .data(function(d) {
                //j++;
                return d;
            })
            .enter().append("svg:rect")
            .attr("x", function(d, i) {
                if(mode == 0)
                    return i * cellWidth + x;
                else if(mode == 1)
                    return rowCurrentOrder.indexOf(i) * cellHeight + x;
                else if(mode == 2)
                    return colCurrentOrder.indexOf(i) * cellWidth + x;
                else if(mode == 11)
                    return i * ycov_cellWidth + x;
                else if(mode == 12)
                    return i * ycov_cellWidth + x;
                else if(mode == 13)
                    return i * xcov_cellWidth + x;
                else if(mode == 14)
                    return i * xcov_cellWidth + x;
                else
                    return i * cellWidth + x;
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
                    return cellWidth;
                else if(mode == 1)
                    return cellHeight;
                else if(mode == 11)
                    return ycov_cellWidth;
                else if(mode == 12)
                    return ycov_cellWidth;
                else if(mode == 13)
                    return xcov_cellWidth;
                else if(mode == 14)
                    return xcov_cellWidth;
                else
                    return cellWidth;
            })
            .attr("height", function(d) {
                if(mode == 0)
                    return cellHeight;
                else if(mode == 1)
                    return cellHeight;
                else if(mode == 11)
                    return ycov_cellHeight;
                else if(mode == 12)
                    return ycov_cellHeight;
                else if(mode == 13)
                    return xcov_cellHeight;
                else if(mode == 14)
                    return xcov_cellHeight;
                else
                    return cellWidth;
            })
            .style("fill", function(d) {
                var colnum = d3.select(this).attr("col");
                var rownum = d3.select(this).attr("row");
                //var colorScale;
                if(mode==11)
                {
                    //var colorScale = d3.scaleSequential()
                    //    .domain([yd_max_value[colnum], yd_min_value[colnum]])
                    //    .interpolator(colorID);    

                    var colorScale2 = d3.scaleOrdinal().domain(yd_cate_col[colnum])
                        .range(colorID); 
                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";
                }
                else if(mode==12)
                {
                    var colorScale2 = d3.scaleSequential()
                        .domain([yc_max_value[colnum], yc_min_value[colnum]])
                        .interpolator(colorID);
                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";
                }
                else if(mode==13)
                {
                    //var colorScale = d3.scaleSequential()
                    //   .domain([xd_max_value[colnum], xd_min_value[colnum]])
                    //    .interpolator(colorID);
                    var colorScale2 = d3.scaleOrdinal().domain(xd_cate_col[rownum])
                        .range(colorID); 
                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";
                }
                else if(mode==14)
                {
                    var colorScale2 = d3.scaleSequential()
                        .domain([xc_max_value[rownum], xc_min_value[rownum]])
                        .interpolator(colorID);
                    if (d != null) return colorScale2(d);
                    else return "url(#diagonalHatch)";
                }
                else
                {
                    if (d != null) return colorScale(d);
                    else return "url(#diagonalHatch)";
                }

            }).on('mouseover', function(d, i) {
                if(mode==0) {
                    d3.select('#colLabel_' + i).classed("hover", true);
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
            .on('mouseout', function(d, i) {
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
            .on("mousemove", function(d, i) {
                tooltip.style("top", (d3.event.pageY - 47) + "px").style("left", (d3.event.pageX - 39) + "px");
            })
            .on('click', function(d, i) {
                if (d != null) {
                    tooltip.html('<div class="heatmap_tooltip">' + Number.parseFloat(d).toFixed(3) + '</div>');
                    tooltip.style("visibility", "visible");
                } else
                    tooltip.style("visibility", "hidden");
            });

}

//#########################################################
function changeProx(prefs, nowID, heatmapId, mode, colorID) {
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
function changeColLabelsPosition(heatmapId, col_number) {
    var svg = d3.select(heatmapId).select("svg").select("#gap").selectAll(".colLabels");
    svg.selectAll(".colLabel")
        .attr("x", 0)
        .attr("y", function(d, i) {
            return (colCurrentOrder.indexOf(i) * cellWidth);
        })
        .style("text-anchor", "left")
        .attr("transform", function(d, i) {
                //return "translate(" + cellSize / 2 + ", -3) rotate(0) rotate(0, 0, " + (i * cellSize) + ")";
                var temp_y = -10-col_number*cellWidth+cellWidth / 1.5;
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
                return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
        });
}

//#########################################################
function removeAllColorLegend() {
    d3.select("#mv_color").selectAll("#colorlegend").remove();    
}

//#########################################################
function drawColorLegend(svgId, viewerPosTop, colorScale, displayText, minValue, maxValue, isDiscrete) {
        //var svg = d3.select(heatmapId).select("svg").select("#gap");
        /*var svg = d3.select("#mv_color").append("svg")
                    .attr("width", 270)
                    .attr("height", 30);*/
        /*var colorScale = d3.scaleSequential()
                .domain([maxValue, minValue])
                .interpolator(colorID);*/
        //console.log(colorScale);

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
            .attr("y", viewerPosTop)
            .attr("class", "cellLegend bordered")
            //.attr("width", legendElementWidth)
            .attr("width", function(d) {
                return isDiscrete==true ? legendElementWidth : 1;
            })
            .attr("height", colorSpecHeight / 2)
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
            .attr("y", viewerPosTop + 24);
*/
}

//#########################################################
function setupxdLabel(x, y, heatmapId) {
     var svg = d3.select(heatmapId).select("svg").select("#gap");
            var rowLabels = svg.append("g")
            .attr("class", "xdLabels")
            .selectAll(".xdLabel")
            //.data(data.index)
            .data(xd_name)
            .enter().append("text")
            .text(function(d) {
                //return d.count > 1 ? d.join("/") : d;
                return d;
            })
            .attr("x", x)
            .attr("y", function(d, i) {
                return (i * xcov_cellHeight)+y;
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
                xdSortOrder = !xdSortOrder;
                sortByValuesCov("r", i, xdSortOrder, "#mv13");
                d3.select("#order").property("selectedIndex", 0);
                //$("#order").jqxComboBox({selectedIndex: 0});
            });
}

//#########################################################
function setupxcLabel(x, y, heatmapId) {
     var svg = d3.select(heatmapId).select("svg").select("#gap");
            var rowLabels = svg.append("g")
            .attr("class", "xcLabels")
            .selectAll(".xcLabel")
            //.data(data.index)
            .data(xc_name)
            .enter().append("text")
            .text(function(d) {
                //return d.count > 1 ? d.join("/") : d;
                return d;
            })
            .attr("x", x)
            .attr("y", function(d, i) {
                return (i * xcov_cellHeight)+y;
            })
            .attr("class", "xcLabel mono")
            .attr("id", function(d, i) {
                return "xcLabel_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#xcLabel_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#xcLabel_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                xcSortOrder = !xcSortOrder;
                sortByValuesCov("r", i, xcSortOrder, "#mv14");
                d3.select("#order").property("selectedIndex", 0);
                //$("#order").jqxComboBox({selectedIndex: 0});
            });
}

//#########################################################
function setupydLabel(x, y, heatmapId) {
     var svg = d3.select(heatmapId).select("svg").select("#gap");
        var colLabels = svg.append("g")
            .attr("class", "ydLabels")
            .selectAll(".ydLabel")
            //.data(data.columns)
            .data(yd_name)
            .enter().append("text")
            .text(function(d) {
                //d.shift();
                //return d.count > 1 ? d.reverse().join("/") : d.reverse();
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * ycov_cellWidth)+x;
            })
            .style("text-anchor", "left")
            .attr("transform", function(d, i) {
                return "translate(" + ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * cellWidth) + ")";
            })
            .attr("class", "ydLabel mono")
            .attr("id", function(d, i) {
                return "ydLabel_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#ydLabel_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#ydLabel_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                ydSortOrder = !ydSortOrder;
                sortByValuesCov("c", i, ydSortOrder, "#mv11");
                d3.select("#order").property("selectedIndex", 0);
            });
}

//#########################################################
function setupycLabel(x, y, heatmapId) {
     var svg = d3.select(heatmapId).select("svg").select("#gap");
        var colLabels = svg.append("g")
            .attr("class", "ycLabels")
            .selectAll(".ycLabel")
            //.data(data.columns)
            .data(yc_name)
            .enter().append("text")
            .text(function(d) {
                //d.shift();
                //return d.count > 1 ? d.reverse().join("/") : d.reverse();
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * ycov_cellWidth)+x;
            })
            .style("text-anchor", "left")
            .attr("transform", function(d, i) {
                return "translate(" + ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * cellWidth) + ")";
            })
            .attr("class", "ycLabel mono")
            .attr("id", function(d, i) {
                return "ycLabel_" + i;
            })
            .on('mouseover', function(d, i) {
                d3.select('#ycLabel_' + i).classed("hover", true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#ycLabel_' + i).classed("hover", false);
            })
            .on("click", function(d, i) {
                ycSortOrder = !ycSortOrder;
                sortByValuesCov("c", i, ycSortOrder, "#mv12");
                d3.select("#order").property("selectedIndex", 0);
            });
}

//#########################################################
function redrawCovLabel(heatmapId, mode) {
    var selectLabel = "";
    if(mode=="yc")
        selectLabel = ".ycLabel";
    else if(mode=="yd")
        selectLabel = ".ydLabel";
    else if(mode=="xc")
        selectLabel = ".xcLabel";
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
                    return col_number*cellWidth+5;
                else
                    return col_number*cellWidth+5;
            })
            .attr("y", function(d, i) {
                if(mode=="yc")
                    return (i * ycov_cellWidth)+yc_X-ycov_fontsize/2;
                else if(mode=="yd")
                    return (i * ycov_cellWidth)+yd_X-ycov_fontsize/2;
                else if(mode=="xc")
                    return (i * xcov_cellHeight)+xc_Y+xcov_cellHeight-xcov_fontsize/2;
                else
                    return (i * xcov_cellHeight)+xd_Y+xcov_cellHeight-xcov_fontsize/2;
            })
            .style("text-anchor", "left")
            .attr("transform", function(d, i) {
                if(mode=="yc")
                    return "translate(" + ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * cellWidth) + ")";
                else if(mode=="yd")
                    return "translate(" + ycov_cellWidth + ", -3) rotate(-90) rotate(0, 0, " + (i * cellWidth) + ")";
                else
                    return null;
            });
}

//==================================================
// Change ordering of cells
function sortByValuesCov(rORc, i, sortOrder, target) {
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
                sorted = d3.range(col_number).sort(function(a, b) {
                    if (sortOrder) {
                        return values[b] - values[a];
                    } else {
                        return values[a] - values[b];
                    }
                });
                colCurrentOrder = sorted;
                t.select("#mv").selectAll(".cell")
                    .attr("x", function(d) {
                        var col = parseInt(d3.select(this).attr("col"));
                        return sorted.indexOf(col) * cellWidth;
                    });
                //if(t.select("#mv3"))
                if(t.select("#mv13"))
                {
                    t.select("#mv13").selectAll(".cell")                      
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * cellWidth;
                        });
                }
                if(t.select("#mv14"))
                {
                    t.select("#mv14").selectAll(".cell")                      
                        .attr("x", function(d) {
                            var col = parseInt(d3.select(this).attr("col"));
                            return sorted.indexOf(col) * cellWidth;
                        });
                }
                if(!isColProxfirst)
                {
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

//#########################################################
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
//#########################################################
//setAllParameters(tmp_dataFileName, tmp_hasRowName, tmp_hasColName, tmp_yd, tmp_yc, tmp_xd, tmp_xc)
function loadExample(filename) {
    
    if(filename == "iris")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = ",";
        var dataFileName = "iris.csv";   
        setAllParameters(dataFileName, true, true, 1, 0, 0, 0);
        heatmap_display(dataFileName, "#heatmap", "Spectral", sep); 
    }
    else if(filename == "crab")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = "\t";
        var dataFileName = "CRAB.txt";   
        setAllParameters(dataFileName, true, true, 3, 1, 0, 0);
        heatmap_display(dataFileName, "#heatmap", "Spectral", sep); 
    }
    else if(filename == "mona_lisa")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = "\t";
        var dataFileName = "Mona_Lisa_300_217_1.txt";   
        setAllParameters(dataFileName, true, true, 0, 0, 0, 0);
        heatmap_display(dataFileName, "#heatmap", "Spectral", sep); 
    }
    else if(filename == "journal_survey")
    {
        resetAllParameters("#heatmap");
        removeAllColorLegend();
        var sep = "\t";
        var dataFileName = "Journal_Survey.txt";   
        setAllParameters(dataFileName, true, true, 0, 3, 3, 0);
        $('#palette').val("Grey");
        rdPaletteReverse = true;
        $("#isColorReverse").prop("checked", true);
        heatmap_display(dataFileName, "#heatmap", "Grey", sep); 
    }
}

//#########################################################
/*function downloadFile(textString, filename) {
    var blob = new Blob([textString], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
}*/

function saveTextAsFile( _text, _fileName) {
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
function doubleArrayToString(arr) {
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
function saveImagetoPNG(filename) {
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
function getSVGString( svgNode ) {
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


function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

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
function pearsonCorrelation(prefs, p1, p2, n, mode) {
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
function EuclideanDistance(prefs, p1, p2, n, mode) {
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
function strip(num, precision = 2) {
  return +parseFloat(num.toPrecision(precision));
}
*/