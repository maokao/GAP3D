
//#########################################################
function changeRowOrder(newOrder, heatmapId) {
    var sortedTarget = 0; //0 for rows
    var svg = d3.select(heatmapId);
    $("#rowflip").prop("disabled",false);
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
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage") { 
        if(newOrder == "r2e")   // R2E sort on rows  
        {
            console.log("start r2e");
            if(!firstRunRowTree)
                d3.selectAll("#rowTree").remove();
            if(row_r2e_order.length>0)
            {
                sorted = row_r2e_order;   
            }
            else
            {
                sorted = runR2E(sortedTarget);
                row_r2e_order = sorted;
                $("#rowflip option[value='r2e']").prop("disabled",false);   
            }           
            console.log("Row R2E: "+sorted);
        }
        else if (newOrder == "singlelinkage")  // singlelinkage sort on rows
        {
            console.log("start single linkage");
            sorted = runHCTree(sortedTarget, 0, nowFlip, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted);
        }
        else if (newOrder == "averagelinkage")  // averagelinkage sort on rows
        {
            console.log("start average linkage");
            sorted = runHCTree(sortedTarget, 2, nowFlip, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId, rowIsSimilarity);
            console.log(sorted);
        }
        else    //completelinkage sorts on rows
        {
            console.log("start complete linkage");
            sorted = runHCTree(sortedTarget, 1, nowFlip, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId, rowIsSimilarity);
            console.log(sorted);            
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
                    return row * cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv11")[0].getAttribute("x");
                    return "translate(0," + row * cellHeight + ")";
                });

        }
        if(svg.select("#mv12"))
        {
            svg.select("#mv12").selectAll(".row")
                .attr("y", function(d) {
                    var row = parseInt(d3.select(this).attr("id"));
                    //console.log(sorted.indexOf(row));
                    return row * cellHeight;
                })
                .attr("transform", function(d, i) {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    return "translate(0," + row * cellHeight + ")";
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
function changeColOrder(newOrder, heatmapId) {
    var sortedTarget = 1; //1 for columns
    var svg = d3.select(heatmapId);
    $("#colflip").prop("disabled",false);
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
    if (newOrder == "r2e" || newOrder == "singlelinkage" || newOrder == "averagelinkage" || newOrder == "completelinkage") { 
        if (newOrder == "r2e") { // R2E sort on columns
            console.log("start r2e");
            if(!firstRunColTree)
                d3.selectAll("#colTree").remove();
            if(col_r2e_order.length>0)
            {
                sorted = col_r2e_order;   
            }
            else
            {
                sorted = runR2E(sortedTarget);
                col_r2e_order = sorted;   
                $("#colflip option[value='r2e']").prop("disabled",false);    
            } 

            console.log("Col. R2E: "+sorted);
        }
        else if (newOrder == "singlelinkage")  // singlelinkage sort on rows
        {
            console.log("start single linkage"); //+$('.colLabels')[0].getBoundingClientRect().width
            sorted = runHCTree(sortedTarget, 0, nowFlip, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted);
        }
        else if (newOrder == "averagelinkage")  // averagelinkage sort on rows
        {
            console.log("start average linkage");
            sorted = runHCTree(sortedTarget, 2, nowFlip, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, heatmapId, colIsSimilarity);
            console.log(sorted);
        }
        else    //completelinkage sorts on rows
        {
            console.log("start complete linkage");
            sorted = runHCTree(sortedTarget, 1, nowFlip, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, heatmapId, colIsSimilarity);
            console.log(sorted);            
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
                    var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -5-col_number*cellWidth+cellWidth / 1.5;
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
        }

    } else if (newOrder == "sortinit_col") { // initial sort on cols (alphabetically if produced like this)
        svg.select("#mv").selectAll(".cell")
            .attr("x", function(d) {
                var col = parseInt(d3.select(this).attr("col"));
                return col * cellWidth;
            });
        if(!firstRunColTree)
            d3.selectAll("#colTree").remove();
        if(svg.select("#mv3"))
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
                    var temp_y = row * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            svg.selectAll(".colLabel")
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
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return i * cellWidth;
                })            
                .attr("transform", function(d, i) {
                    return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
                });    
        }
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
            sorted = runHCTree(sortedTarget, nowOrder, 0, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted);   
    }
    else if(newFlip == "r2e")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 1, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted);    
    }
    else if (newFlip == "uncle")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 2, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId, rowIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted);
    }
    else if (newFlip == "grandpa")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 3, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId, rowIsSimilarity);
            console.log(sorted);
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

    if (newFlip == "null")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 0, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted);   
    }
    else if(newFlip == "r2e")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 1, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted); 
    }
    else if (newFlip == "uncle")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 2, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted); 
    }
    else if (newFlip == "grandpa")
    {
            sorted = runHCTree(sortedTarget, nowOrder, 3, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, heatmapId, colIsSimilarity);    //sortedTarget, hctType, nowID, x, y, heatmapId, isSimilarity
            console.log(sorted); 
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
                    var temp_y = sorted.indexOf(row) * cellWidth-5-col_number*cellWidth;
                    return "translate(" + temp_x + "," + temp_y + ")";
                });
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -5-col_number*cellWidth+cellWidth / 1.5;
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
    }

}

//#########################################################
function changePalette(paletteName, heatmapId) {
    var colorID = d3.interpolateRdBu;
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
    else
        colorID = d3.interpolateRdBu;

    if(optionTargetDataMap == "rawdata")
    {
        var colorScale = d3.scaleSequential()
                    .domain([max_value, min_value])
                    .interpolator(colorID);  

        var svg = d3.select(heatmapId);
        var t = svg.transition().duration(500);
        t.select("#mv").selectAll(".cell")
            .style("fill", function(d) {
                    if (d != null) return colorScale(d);
                    else return "url(#diagonalHatch)";
            });
        d3.select("#md_colorspec").select("svg").selectAll(".cellLegend")
        //t.selectAll(".cellLegend")
            .style("fill", function(d, i) {
                //return colors[classesNumber-i-1];
                return colorScale(d);
            });
    }
    else if(optionTargetDataMap == "rp")
    {
        var colorScale = d3.scaleSequential()
                    .domain([max_value, min_value])
                    .interpolator(colorID);  

        var svg = d3.select(heatmapId);
        var t = svg.transition().duration(500);
        t.select("#mv2").selectAll(".cell")
            .style("fill", function(d) {
                    if (d != null) return colorScale(d);
                    else return "url(#diagonalHatch)";
            });
        d3.select("#rp_colorspec").select("svg").selectAll(".cellLegend")
        //t.selectAll(".cellLegend")
            .style("fill", function(d, i) {
                //return colors[classesNumber-i-1];
                return colorScale(d);
            });
    }
}

//#########################################################
function redrawRowLabels(heatmapId) {
        var svg = d3.select(heatmapId);
        svg.selectAll(".rowLabel")
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * cellHeight);
            })
            .style("text-anchor", "end")
            .attr("transform", function(d, i) {
                if(yc>0)
                {
                    if(yd>0)
                        return "translate("+(-3-5-yd*cellWidth)+"," + cellHeight / 1.5 + ")";
                    else
                        return "translate("+(-3+yc_X)+"," + cellHeight / 1.5 + ")";
                }
                else
                {
                    if(yd>0)
                        return "translate("+(-3 -5-yd*cellWidth)+"," + cellHeight / 1.5 + ")";
                    else
                        return "translate(-3," + cellHeight / 1.5 + ")";
                }
            });
}

//#########################################################
function redrawColLabels(heatmapId) {
        var svg = d3.select(heatmapId);
        if(svg.select("#mv3"))
        {
            svg.selectAll(".colLabel")
                .attr("y", function(d, i) {
                    return sorted.indexOf(i) * cellWidth;
                })
                .attr("transform", function(d, i) {
                    var temp_y = -5-col_number*cellWidth+cellWidth / 1.5;
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
            .attr("transform", function(d, i) {
                return "translate(" + cellWidth / 2 + ", -3) rotate(-90) rotate(45, 0, " + (i * cellWidth) + ")";
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
                if(mode == 0)
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
                else if(mode == 1)
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(row) * cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return row * cellHeight;
                    else
                        return row_output_order_array.indexOf(row) * cellHeight;
                }
                else if(mode == 2)
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(colOrderId == "r2e")
                        return col_r2e_order.indexOf(row) * cellWidth;
                    else if (colOrderId == "sortinit_col")
                        return row * cellWidth;
                    else
                        return col_output_order_array.indexOf(row) * cellWidth;

                }
                else if(mode == 11)
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(row) * cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return row * cellHeight;
                    else
                        return row_output_order_array.indexOf(row) * cellHeight;
                }
                else if(mode == 12)
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    if(rowOrderId == "r2e")
                        return row_r2e_order.indexOf(row) * cellHeight;
                    else if (rowOrderId == "sortinit_row")
                        return row * cellHeight;
                    else
                        return row_output_order_array.indexOf(row) * cellHeight;
                }
            });

        row.attr("transform", function(d, i) {
                if(mode == 0)
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
                else if(mode == 1)
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
                else if(mode == 2)
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    
                    if(colOrderId == "r2e")
                    {
                        var temp_y = col_r2e_order.indexOf(row) * cellWidth-5-col_number*cellWidth;
                        return "translate(" + temp_x + "," + temp_y + ")";
                    }
                    else if (colOrderId == "sortinit_col")
                    {
                        var temp_y = i * cellWidth-5-col_number*cellWidth;
                        return "translate(" + temp_x + "," + temp_y + ")";    
                    }
                    else
                    {
                        var temp_y = col_output_order_array.indexOf(row) * cellWidth-5-col_number*cellWidth;
                        return "translate(" + temp_x + "," + temp_y + ")";
                    }
                        
                    //return "translate(" + 0 + "," + (i* cellWidth+y) + ")"; 
                }                   
                else if(mode == 11)
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#"+nowID)[0].getAttribute("x");
                    if(rowOrderId == "r2e")
                        return "translate(0," + row_r2e_order.indexOf(row) * cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* cellHeight) + ")"; 
                    else
                        return "translate(0," + row_output_order_array.indexOf(row) * cellHeight + ")";
                }
                else if(mode == 12)
                {
                    var row = parseInt(d3.select(this).attr("id"));
                    var temp_x = $("#mv12")[0].getAttribute("x");
                    if(rowOrderId == "r2e")
                        return "translate(0," + row_r2e_order.indexOf(row) * cellHeight + ")";
                    else if (rowOrderId == "sortinit_row")
                        return "translate(" + 0 + "," + (i* cellHeight) + ")"; 
                    else
                        return "translate(0," + row_output_order_array.indexOf(row) * cellHeight + ")";
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
                    return i * cellWidth + x;
                else if(mode == 12)
                    return i * cellWidth + x;
                else
                    return i * cellWidth + x;
            })
            .attr("width", function(d) {
                if(mode == 0)
                    return cellWidth;
                else if(mode == 1)
                    return cellHeight;
                else
                    return cellWidth;
            })
            .attr("height", function(d) {
                if(mode == 0)
                    return cellHeight;
                else if(mode == 1)
                    return cellHeight;
                else if(mode == 11)
                    return cellHeight;
                else if(mode == 12)
                    return cellHeight;
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

    if(optionTargetDataMap == "rawdata")
    {
        var mode = 0;
        redrawHeatmap("mv", 0, 0, mode, heatmapId);

        if(yd>0)
        {
            redrawHeatmap("mv11", -5-yd*cellWidth, 0, 11, heatmapId);    
        }
        if(!isRowProxfirst)
        {
            redrawHeatmap("mv2", 5+col_number*cellWidth, 0, 1, heatmapId);    
            //if(!firstRunRowTree) 
            if (rowOrderId == "singlelinkage" || rowOrderId == "averagelinkage" || rowOrderId == "completelinkage") 
                changeTreePosition("rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, heatmapId);
        }
        if(!isColProxfirst)
        {
            redrawHeatmap("mv3", 0, -5-col_number*cellWidth, 2, heatmapId);    
            //if(!firstRunColTree) 
            if (colOrderId == "singlelinkage" || colOrderId == "averagelinkage" || colOrderId == "completelinkage") 
                drawColTree(treeColData, "colTree", col_number*cellWidth+5+d3.selectAll('.colLabels').node().getBBox().width, -5-col_number*cellWidth, 1, heatmapId); 
        }
    }

    redrawRowLabels(heatmapId);
    redrawColLabels(heatmapId);
}

//#########################################################
function changeHeight(heightZoomRange, heatmapId) {
    cellHeight = cellOriHeight*heightZoomRange/50;

    if(optionTargetDataMap == "rawdata")
    {
        var mode = 0;
        redrawHeatmap("mv", 0, 0, mode, heatmapId);
        if(yd>0)
        {
            redrawHeatmap("mv11", -5-yd*cellWidth, 0, 11, heatmapId);    
        }
        if(!isRowProxfirst)
        {
            redrawHeatmap("mv2", 5+col_number*cellWidth, 0, 1, heatmapId);  
            if(!firstRunRowTree) 
                drawRowTree(treeRowData, "rowTree", col_number*cellWidth+row_number*cellHeight+10, 0, 0, heatmapId); 
        }
        if(!isColProxfirst)
        {
            redrawHeatmap("mv3", 0, -5-col_number*cellWidth, 2, heatmapId);    
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
        if((mode==1 || mode==2) && colorID==d3.interpolateRdBu)
        {
            var colorScale = d3.scaleSequential()
                .domain([1, -1])
                .interpolator(colorID);
            if(mode==1)
                drawColorLegend("rp_colorspec", viewerPosTop, colorScale, "Row Proximity Matrix", -1, 1, false);
            else
                drawColorLegend("cp_colorspec", viewerPosTop, colorScale, "Column Proximity Matrix", -1, 1, false);
        }
        else if(mode==11)
        {
            var colorScale = d3.scaleOrdinal().domain(nowdata)
                .range(colorID);    
            drawColorLegend("yd_colorspec", viewerPosTop, colorScale, "Ydisc. covariates", min_data, max_data, true);       
        }
        else if(mode==12)
        {
            var colorScale = d3.scaleSequential()
                .domain([yc_max_value[0], yc_min_value[0]])
                .interpolator(colorID);     
            drawColorLegend("yc_colorspec", viewerPosTop, colorScale, "Yconti. covariates", yc_min_value[0], yc_max_value[0], false);    
        }
        else{
            var colorScale = d3.scaleSequential()
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
                    return "translate(" + 0 + "," + (i* cellHeight+y) + ")"; 
                else if(mode == 2)
                    return "translate(" + 0 + "," + (i* cellWidth+y) + ")"; 
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
                    return i * cellHeight + x;
                else if(mode == 11)
                    return i * cellWidth + x;
                else if(mode == 12)
                    return i * cellWidth + x;
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
                else
                    return cellWidth;
            })
            .attr("height", function(d) {
                if(mode == 0)
                    return cellHeight;
                else if(mode == 1)
                    return cellHeight;
                else if(mode == 11)
                    return cellHeight;
                else if(mode == 12)
                    return cellHeight;
                else
                    return cellWidth;
            })
            .style("fill", function(d) {
                if (d != null) return colorScale(d);
                else return "url(#diagonalHatch)";
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
                else {
                    d3.select('#colLabel_' + i).classed("hover", true);    
                }
                
                if (d != null) {
                    tooltip.html('<div class="heatmap_tooltip">' + Number.parseFloat(d).toFixed(3) + '</div>');
                    tooltip.style("visibility", "visible");
                } else
                    tooltip.style("visibility", "hidden");
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
                else {
                    d3.select('#colLabel_' + i).classed("hover", false);    
                }
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(d, i) {
                tooltip.style("top", (d3.event.pageY - 55) + "px").style("left", (d3.event.pageX - 45) + "px");
            })
            .on('click', function() {
                //console.log(d3.select(this));
            });

}

//#########################################################
function changeProx(prefs, nowID, heatmapId, mode, colorID) {
    var svg = d3.select(heatmapId).select("svg").select("#gap").select("#"+nowID+"");
    var max_data = d3.max(prefs, function(row) { return d3.max(row) });
    var min_data = d3.min(prefs, function(row) { return d3.min(row) });
    console.log("max:"+ max_data);
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
           
    var t = svg.transition().duration(500);
    d3.select("#"+nowID).selectAll(".row")
        .data(prefs)
        .selectAll(".cell")
        .data(function(d) { return d });

    t.selectAll(".cell")
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
            return (i * cellWidth);
        })
        .style("text-anchor", "left")
        .attr("transform", function(d, i) {
                //return "translate(" + cellSize / 2 + ", -3) rotate(0) rotate(0, 0, " + (i * cellSize) + ")";
                var temp_y = -5-col_number*cellWidth+cellWidth / 1.5;
                return "translate("+ (-3+5+col_number*cellWidth) + "," + temp_y + ")";
        });
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
                temp_value = i+parseFloat(minValue);
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