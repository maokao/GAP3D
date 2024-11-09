        //==================================================
        d3.select("#roworder").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row order'});
            $("#roworder_side").prop('selectedIndex', $("#roworder").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(gap.rowOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            gap.rowOrderId = d3.select("#roworder").property("value");   
            //console.log(gap.rowOrderId);
            if (gap.rowOrderId == "singlelinkage" || gap.rowOrderId == "averagelinkage" || gap.rowOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#rowflip").prop('selectedIndex', 1);
                    $("#rowflip_side").prop('selectedIndex', 1);
                    gap.rowFlipId = "r2e";
                }
            }
            else if(gap.rowOrderId == "r2e")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                gap.rowFlipId = "null";
            }
            else if(gap.rowOrderId == "sortinit_row")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                gap.rowFlipId = "null";
            }
            gap.changeRowOrder(gap.rowOrderId, gap.heatmapId);
        });

        //==================================================
        d3.select("#colorder").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col order'});
            $("#colorder_side").prop('selectedIndex', $("#colorder").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(gap.colOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            gap.colOrderId = d3.select("#colorder").property("value");   
            console.log(gap.colOrderId);
            if (gap.colOrderId == "singlelinkage" || gap.colOrderId == "averagelinkage" || gap.colOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#colflip").prop('selectedIndex', 1);
                    $("#colflip_side").prop('selectedIndex', 1);
                    gap.colFlipId = "r2e";
                }
            }
            else if(gap.colOrderId == "r2e")
            {
                $("#colflip").prop('selectedIndex', 0);  
                $("#colflip_side").prop('selectedIndex', 0); 
                gap.colFlipId = "null";
            }
            else if(gap.colOrderId == "sortinit_col")
            {
                $("#colflip").prop('selectedIndex', 0); 
                $("#colflip_side").prop('selectedIndex', 0); 
                gap.colFlipId = "null";
            }
            gap.changeColOrder(gap.colOrderId, gap.heatmapId);
        });

        //==================================================
        d3.select("#rowflip").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row flip'});
            $("#rowflip_side").prop('selectedIndex', $("#rowflip").prop('selectedIndex'));
            gap.rowFlipId = d3.select("#rowflip").property("value");   
            console.log(gap.rowFlipId);
            gap.changeRowFlip(gap.rowFlipId, gap.heatmapId);
        });

        //==================================================
        d3.select("#colflip").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col flip'});
            $("#colflip_side").prop('selectedIndex', $("#colflip").prop('selectedIndex'));
            gap.colFlipId = d3.select("#colflip").property("value");   
            console.log(gap.colFlipId);
            gap.changeColFlip(gap.colFlipId, gap.heatmapId);
        });
        //==================================================
        d3.select("#roworder_side").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row order'});
            $("#roworder").prop('selectedIndex', $("#roworder_side").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(gap.rowOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            gap.rowOrderId = d3.select("#roworder").property("value");   
            console.log(gap.rowOrderId);
            if (gap.rowOrderId == "singlelinkage" || gap.rowOrderId == "averagelinkage" || gap.rowOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#rowflip").prop('selectedIndex', 1);
                    $("#rowflip_side").prop('selectedIndex', 1);
                    gap.rowFlipId = "r2e";
                }
            }
            else if(gap.rowOrderId == "r2e")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                gap.rowFlipId = "null";
            }
            else if(gap.rowOrderId == "sortinit_row")
            {
                $("#rowflip").prop('selectedIndex', 0);  
                $("#rowflip_side").prop('selectedIndex', 0); 
                gap.rowFlipId = "null";
            }
            gap.changeRowOrder(gap.rowOrderId, gap.heatmapId);
        });

        //==================================================
        d3.select("#colorder_side").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col order'});
            $("#colorder").prop('selectedIndex', $("#colorder_side").prop('selectedIndex'));
            var previousOrderIsR2E = false;
            if(gap.colOrderId == "r2e")
                previousOrderIsR2E = true;
            else
                previousOrderIsR2E = false;
            gap.colOrderId = d3.select("#colorder").property("value");   
            console.log(gap.colOrderId);
            if (gap.colOrderId == "singlelinkage" || gap.colOrderId == "averagelinkage" || gap.colOrderId == "completelinkage") 
            { 
                if(previousOrderIsR2E)
                {
                    $("#colflip").prop('selectedIndex', 1);
                    $("#colflip_side").prop('selectedIndex', 1);
                    gap.colFlipId = "r2e";
                }
            }
            else if(gap.colOrderId == "r2e")
            {
                $("#colflip").prop('selectedIndex', 0);  
                $("#colflip_side").prop('selectedIndex', 0); 
                gap.colFlipId = "null";
            }
            else if(gap.colOrderId == "sortinit_col")
            {
                $("#colflip").prop('selectedIndex', 0); 
                $("#colflip_side").prop('selectedIndex', 0); 
                gap.colFlipId = "null";
            }
            gap.changeColOrder(gap.colOrderId, gap.heatmapId);
        });

        //==================================================
        d3.select("#rowflip_side").on("change", function() {
            gtag('event', 'row order', {'event_category': '按鈕點擊','event_label': 'row flip'});
            $("#rowflip").prop('selectedIndex', $("#rowflip_side").prop('selectedIndex'));
            gap.rowFlipId = d3.select("#rowflip").property("value");   
            console.log(gap.rowFlipId);
            gap.changeRowFlip(gap.rowFlipId, gap.heatmapId);
        });

        //==================================================
        d3.select("#colflip_side").on("change", function() {
            gtag('event', 'col order', {'event_category': '按鈕點擊','event_label': 'col flip'});
            $("#colflip").prop('selectedIndex', $("#colflip_side").prop('selectedIndex'));
            gap.colFlipId = d3.select("#colflip").property("value");   
            console.log(gap.colFlipId);
            gap.changeColFlip(gap.colFlipId, gap.heatmapId);
        });

        //==================================================
        d3.select("#palette")
            .on("mouseup", function() {
                gtag('event', 'change color', {'event_category': '按鈕點擊','event_label': 'change color'});
                if(gap.optionTargetDataMap == "rawdata")
                    gap.rdPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "rp")
                    gap.rpPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "cp")
                    gap.cpPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "yc")
                    gap.ycPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "yd")
                    gap.ydPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "xc")
                    gap.xcPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "xd")
                    gap.xdPalette = d3.select("#palette").property("value");

                var newPalette = d3.select("#palette").property("value");
                var newCondition = d3.select("#displaycondition").property("value");
                if (newPalette != null)                     // when interfaced with jQwidget, the ComboBox handles keyup event but value is then not available ?
                    gap.changePalette(newCondition, newPalette, gap.heatmapId);
            })
            .on("change", function() {
                gtag('event', 'change color', {'event_category': '按鈕點擊','event_label': 'change color'});
                if(gap.optionTargetDataMap == "rawdata")
                    gap.rdPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "rp")
                    gap.rpPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "cp")
                    gap.cpPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "yc")
                    gap.ycPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "yd")
                    gap.ydPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "xc")
                    gap.xcPalette = d3.select("#palette").property("value");
                else if(gap.optionTargetDataMap == "xd")
                    gap.xdPalette = d3.select("#palette").property("value");
                var newPalette = d3.select("#palette").property("value");
                var newCondition = d3.select("#displaycondition").property("value");
                gap.changePalette(newCondition, newPalette, gap.heatmapId);
            });

        //==================================================
        d3.select("#displaycondition")
            .on("mouseup", function() {
                gtag('event', 'change condition', {'event_category': '按鈕點擊','event_label': 'change condition'});
                var newCondition = d3.select("#displaycondition").property("value");
                var newPalette = d3.select("#palette").property("value");
                if (newCondition != null)                     // when interfaced with jQwidget, the ComboBox handles keyup event but value is then not available ?
                    gap.changePalette(newCondition, newPalette, gap.heatmapId);
            })
            .on("change", function() {
                gtag('event', 'change condition', {'event_category': '按鈕點擊','event_label': 'change condition'});
                var newCondition = d3.select("#displaycondition").property("value");
                var newPalette = d3.select("#palette").property("value");
                gap.changePalette(newCondition, newPalette, gap.heatmapId);
            });

        //==================================================
        d3.select("#widthZoomRange").on("mouseup", function() {
            gtag('event', 'zoom', {'event_category': '按鈕點擊','event_label': 'change width'});
            var widthZoomRange = d3.select("#widthZoomRange").property("value");   
            //console.log(widthZoomRange);
            gap.changeWidth(widthZoomRange, gap.heatmapId);
        });

        //==================================================
        d3.select("#heightZoomRange").on("mouseup", function() {
            gtag('event', 'zoom', {'event_category': '按鈕點擊','event_label': 'change height'});
            var heightZoomRange = d3.select("#heightZoomRange").property("value");   
            gap.changeHeight(heightZoomRange, gap.heatmapId);
        });

        //==================================================
        d3.select("#saveOrdering").on("click", function() {
            gtag('event', 'export', {'event_category': '按鈕點擊','event_label': 'export ordering'});
            gap.saveTextAsFile(gap.rowCurrentOrder.join("\t"), "row_ordering.txt");
            gap.saveTextAsFile(gap.colCurrentOrder.join("\t"), "col_ordering.txt");
        });

        //==================================================
        d3.select("#saveProxData").on("click", function() {
            gtag('event', 'export', {'event_category': '按鈕點擊','event_label': 'export proximity'});
            gap.saveTextAsFile(doubleArrayToString(gap.rowProxData), "row_prox.txt");
            gap.saveTextAsFile(doubleArrayToString(gap.colProxData), "col_prox.txt");
        });

        //==================================================
        d3.select("#saveImages").on("click", function() {
            gtag('event', 'export', {'event_category': '按鈕點擊','event_label': 'export image'});
            gap.saveImagetoPNG(gap.dataFileName);
        });
             
        //==================================================
        d3.select("#isColorReverse").on("click", function() {
            gtag('event', 'change color', {'event_category': '按鈕點擊','event_label': 'reverse'});
            var newCondition = d3.select("#displaycondition").property("value");
            var newPalette = d3.select("#palette").property("value");
            if($("#isColorReverse").prop("checked"))
            {
                if(gap.optionTargetDataMap == "rawdata")
                    gap.rdPaletteReverse = true;
                else if(gap.optionTargetDataMap == "rp")
                    gap.rpPaletteReverse = true;
                else if(gap.optionTargetDataMap == "cp")
                    gap.cpPaletteReverse = true;
                else if(gap.optionTargetDataMap == "gap.yd")
                    gap.gap.ydPaletteReverse = true;
                else if(gap.optionTargetDataMap == "gap.yc")
                    gap.gap.ycPaletteReverse = true;
                else if(gap.optionTargetDataMap == "gap.xd")
                    gap.gap.xdPaletteReverse = true;
                else if(gap.optionTargetDataMap == "gap.xc")
                    gap.gap.xcPaletteReverse = true;
            }
            else
            {
                if(gap.optionTargetDataMap == "rawdata")
                    gap.rdPaletteReverse = false;
                else if(gap.optionTargetDataMap == "rp")
                    gap.rpPaletteReverse = false;
                else if(gap.optionTargetDataMap == "cp")
                    gap.cpPaletteReverse = false;
                else if(gap.optionTargetDataMap == "gap.yd")
                    gap.gap.ydPaletteReverse = false;
                else if(gap.optionTargetDataMap == "gap.yc")
                    gap.gap.ycPaletteReverse = false;
                else if(gap.optionTargetDataMap == "gap.xd")
                    gap.gap.xdPaletteReverse = false;
                else if(gap.optionTargetDataMap == "gap.xc")
                    gap.gap.xcPaletteReverse = false;
            }

            gap.changePalette(newCondition, newPalette, gap.heatmapId);
        });  