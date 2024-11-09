//#########################################################
function resetAllParameters(heatmapId) {
	dataFileName = "";
	cellSize = 24;
	cellOriWidth = 24;
	cellOriHeight = 6;
	cellWidth = 24;
	cellHeight = 6;
	xcov_cellWidth = 24;    //equal cellWidth
	xcov_cellHeight = 12;
	ycov_cellWidth = 12;
	ycov_cellHeight = 6;    //equal cellHeight
	colorSpecHeight = 24;
	max_value = 0;
	min_value = 0;
	rp_max_value = 0;
	rp_min_value = 0;
	cp_max_value = 0;
	cp_min_value = 0;
	svg =  null;
	d3.select(heatmapId).select("svg").remove();
	row_number = 0;
	col_number = 0;
	data.length = 0;
	rowProxData.length = 0;
	colProxData.length = 0;
	row_name.length = 0;
	col_name.length = 0;
	yd_name.length = 0;
	yc_name.length = 0;
	xd_name.length = 0;
	xc_name.length = 0;
	isRowProxfirst = true;
	isColProxfirst = true;
	hasRowName = true;
	hasColName = true;
	firstRunRowTree = true;
	firstRunColTree = true;
	rowIsSimilarity = false;
	colIsSimilarity = false;
	treeRowData = null;
	treeColData = null;
	row_output_left_array = null;
	row_output_right_array = null;
	row_output_hgt_array = null;
	row_output_order_array = null;
	col_output_left_array = null;
	col_output_right_array = null;
	col_output_hgt_array = null;
	col_output_order_array = null;
	row_r2e_order.length = 0;
	col_r2e_order.length = 0;
	row_r2e_order = [];
	col_r2e_order = [];
	rowOrderId = "sortinit_row";
	colOrderId = "sortinit_col";
	rowFlipId = "null";
	colFlipId = "null";
	rowCurrentOrder.length = 0;
	colCurrentOrder.length = 0;
	rowCurrentOrder = [];
	colCurrentOrder = [];
	yN = 0;
	yd = 0;
	xd = 0;
	yc = 0;
	xc = 0;
	yCov = 0;
	xCov = 0;
	ydData.length = 0;
	ycData.length = 0;
	xdData.length = 0;
	xcData.length = 0;
	yd_X = 0;
	yc_X = 0;
	xd_Y = 0;
	xc_Y = 0;
	yd_max_value.length = 0;
	yd_min_value.length = 0;
	yd_cate_col.length = 0;
	yc_max_value.length = 0;
	yc_min_value.length = 0;
	xd_max_value.length = 0;
	xd_min_value.length = 0;
	xd_cate_col.length = 0;
	xc_max_value.length = 0;
	xc_min_value.length = 0;
	data_max_value.length = 0;
	data_min_value.length = 0;
	data_row_max_value.length = 0;
	data_row_min_value.length = 0;
	viewerPosTop = 200;
	viewerPosLeft = 100;
	optionTargetDataMap = "rawdata";
	isNodeLinkfirst = true;
	ydSortOrder = false;
	ycSortOrder = false;
	xdSortOrder = false;
	xcSortOrder = false;
	rdPaletteReverse = false;
	rpPaletteReverse = false;
	cpPaletteReverse = false;
	ydPaletteReverse = false;
	ycPaletteReverse = false;
	xdPaletteReverse = false;
	xcPaletteReverse = false;
	$("#optionDataMap").empty();
	$("#optionDataMap").append($("<option></option>")
		.attr("value", "rawdata")
		.attr("selected", "selected")
		.text(" Raw Data Matrix "));


    $("#rowprox").prop('selectedIndex', 0);  
    $("#colprox").prop('selectedIndex', 0); 
	$("#roworder option[value='averagelinkage']").attr('disabled', 'disabled');
    $("#roworder option[value='singlelinkage']").attr('disabled', 'disabled');
    $("#roworder option[value='completelinkage']").attr('disabled', 'disabled');
    $("#roworder option[value='r2e']").attr('disabled', 'disabled');
	$("#colorder option[value='averagelinkage']").attr('disabled', 'disabled');
    $("#colorder option[value='singlelinkage']").attr('disabled', 'disabled');
    $("#colorder option[value='completelinkage']").attr('disabled', 'disabled');
    $("#colorder option[value='r2e']").attr('disabled', 'disabled');
    $("#roworder").prop('selectedIndex', 0);  
    $("#colorder").prop('selectedIndex', 0); 
    $("#rowflip").prop('selectedIndex', 0);  
    $("#colflip").prop('selectedIndex', 0);  
    $("#rowflip option[value='r2e']").prop("disabled",true);  
    $("#colflip option[value='r2e']").prop("disabled",true);  
    $("#rowflip").prop("disabled",true);
    $("#colflip").prop("disabled",true);

	$("#roworder_side option[value='averagelinkage']").attr('disabled', 'disabled');
    $("#roworder_side option[value='singlelinkage']").attr('disabled', 'disabled');
    $("#roworder_side option[value='completelinkage']").attr('disabled', 'disabled');
    $("#roworder_side option[value='r2e']").attr('disabled', 'disabled');
	$("#colorder_side option[value='averagelinkage']").attr('disabled', 'disabled');
    $("#colorder_side option[value='singlelinkage']").attr('disabled', 'disabled');
    $("#colorder_side option[value='completelinkage']").attr('disabled', 'disabled');
    $("#colorder_side option[value='r2e']").attr('disabled', 'disabled');
    $("#roworder_side").prop('selectedIndex', 0);  
    $("#colorder_side").prop('selectedIndex', 0); 
    $("#rowflip_side").prop('selectedIndex', 0);  
    $("#colflip_side").prop('selectedIndex', 0);  
    $("#rowflip_side option[value='r2e']").prop("disabled",true);  
    $("#colflip_side option[value='r2e']").prop("disabled",true);  
    $("#rowflip_side").prop("disabled",true);
    $("#colflip_side").prop("disabled",true);

    $('#palette').val("Spectral");
	$("#isColorReverse").prop("checked", false);
	$('#displaycondition').val("RangeMatrix");
}

//#########################################################
function setAllParameters(tmp_dataFileName, tmp_hasRowName, tmp_hasColName, tmp_yd, tmp_yc, tmp_xd, tmp_xc) {
	dataFileName = tmp_dataFileName;
	hasRowName = tmp_hasRowName;
	hasColName = tmp_hasColName;
	yd = tmp_yd;
	xd = tmp_xd;
	yc = tmp_yc;
	xc = tmp_xc;
}

//#########################################################
function importOK() {
	var sep = ",";
	if(importDataFileExtension == "csv")
		sep = ",";
	else
		sep = "\t";
	resetAllParameters("#heatmap");
	removeAllColorLegend();
    setAllParameters(importDataFileName, document.getElementById('importHasRowName').checked, document.getElementById('importHasColName').checked, importYdiscrCount, importYcontiCount, importXdiscrCount, importXcontiCount);
    heatmap_display(dataFileName, "#heatmap", "Spectral", sep);
    document.getElementById("myModal").style.display = "none";
    $("#exampleFileName")[0].selectedIndex = 0;
}

//#########################################################
function checkHasRowName()
{
  	/*var checkbox = document.getElementById('importHasRowName');
  	var table = $('#example').DataTable();

	if (checkbox.checked != true)
	{
		$("#col_num").text(importColCount-importYdiscrCount-importYcontiCount);
		$(table.column(0).nodes()).css("background-color", "#ffffff");
	}
	else
	{
	    $("#col_num").text(importColCount-importYdiscrCount-importYcontiCount-1);
	    $(table.column(0).nodes()).css("background-color", "#764529");
	}*/
	importOldYCount = importYdiscrCount+importYcontiCount+1;
  	updateRowInfo(); 
}

//#########################################################
function checkHasColName()
{
  	importOldXCount = importXdiscrCount+importXcontiCount+1;
  	updateRowInfo(); 
}

//#########################################################
function checkYdiscrCount()
{
	/*var checkbox = document.getElementById('importHasColName');
	importYdiscrCount = parseInt(document.getElementById('importYdiscrCount').value);
	if (checkbox.checked != true)
	{
		$("#col_num").text(importColCount-importYdiscrCount-importYcontiCount);
	}
	else
	{
	    $("#col_num").text(importColCount-importYdiscrCount-importYcontiCount-1);
	}*/
	importOldYCount = importYdiscrCount+importYcontiCount+1;
	importYdiscrCount = parseInt(document.getElementById('importYdiscrCount').value);
  	updateRowInfo(); 
}

//#########################################################
function checkXdiscrCount()
{
	importOldXCount = importXdiscrCount+importXcontiCount+1;
	importXdiscrCount = parseInt(document.getElementById('importXdiscrCount').value);
	updateRowInfo();
}

//#########################################################
function checkYcontiCount()
{
	/*var checkbox = document.getElementById('importHasColName');
	importYcontiCount = parseInt(document.getElementById('importYcontiCount').value);
	if (checkbox.checked != true)
	{
		$("#col_num").text(importColCount-importYdiscrCount-importYcontiCount);
	}
	else
	{
	    $("#col_num").text(importColCount-importYdiscrCount-importYcontiCount-1);
	}*/
	importOldYCount = importYdiscrCount+importYcontiCount+1;
	importYcontiCount = parseInt(document.getElementById('importYcontiCount').value);
  	updateRowInfo(); 
}

//#########################################################
function checkXcontiCount()
{
	importOldXCount = importXdiscrCount+importXcontiCount+1;
	importXcontiCount = parseInt(document.getElementById('importXcontiCount').value);
	updateRowInfo();
}

//#########################################################
function updateRowInfo()
{
	var targetTable = document.getElementById("example");
	var checkbox = document.getElementById('importHasColName');
	var checkboxRow = document.getElementById('importHasRowName');
  	var table = $('#example').DataTable();

	if (checkboxRow.checked != true)
	{
		$("#col_num").text(importColCount-importYdiscrCount-importYcontiCount);
		for(var i=0; i<importOldYCount; i++)
		{
			$(table.column(i).nodes()).css("background-color", "");
			$(table.column(i).nodes()).css("color", "");
		}
		for(var i=0; i<importYdiscrCount; i++)
		{
			$(table.column(i).nodes()).css("background-color", "#fdffdb");
			$(table.column(i).nodes()).css("color", "#858796");
		}
		for(var i=0; i<importYcontiCount; i++)
		{
			$(table.column(i+importYdiscrCount).nodes()).css("background-color", "#ffdbdb");
			$(table.column(i+importYdiscrCount).nodes()).css("color", "#858796");
		}
	}
	else
	{
	    $("#col_num").text(importColCount-importYdiscrCount-importYcontiCount-1);
	    for(var i=0; i<importOldYCount; i++)
		{
			$(table.column(i).nodes()).css("background-color", "");
			$(table.column(i).nodes()).css("color", "");
		}
	    $(table.column(0).nodes()).css("background-color", "#764529");
	    $(table.column(0).nodes()).css("color", "#ffffff");
	    for(var i=0; i<importYdiscrCount; i++)
		{
			$(table.column(i+1).nodes()).css("background-color", "#fdffdb");
			$(table.column(i+1).nodes()).css("color", "#858796");
		}
		for(var i=0; i<importYcontiCount; i++)
		{
			$(table.column(i+importYdiscrCount+1).nodes()).css("background-color", "#ffdbdb");
			$(table.column(i+importYdiscrCount+1).nodes()).css("color", "#858796");
		}
	}

	if (checkbox.checked != true)
	{
		$("#row_num").text(importRowCount-importXdiscrCount-importXcontiCount);
		//targetTable.rows[1].setAttribute("style","background: #ffffff;");
		for(var i=0; i<importOldXCount; i++)
		{
			targetTable.rows[i+1].setAttribute("style","background: #ffffff;");		
			targetTable.rows[1].setAttribute("style","color: '';");
		}
		for(var i=0; i<importXdiscrCount; i++)
		{
			targetTable.rows[2+i].setAttribute("style","background: #ffffff;");	
			targetTable.rows[1+i].setAttribute("style","background: #dffbff;");	
		}
		for(var i=0; i<importXcontiCount; i++)
		{
			targetTable.rows[2+i+importXdiscrCount].setAttribute("style","background: #ffffff;");	
			targetTable.rows[1+i+importXdiscrCount].setAttribute("style","background: #e8ffe6;");	
		}
	}
	else
	{
		importOldXCount = importOldXCount + 1;
	    $("#row_num").text(importRowCount-importXdiscrCount-importXcontiCount-1);

		for(var i=0; i<importOldXCount; i++)
		{
			targetTable.rows[i+1].setAttribute("style","background: #ffffff;");		
			targetTable.rows[1].setAttribute("style","color: '';");
		}
		targetTable.rows[1].setAttribute("style","background: #1e3f91; color: #ffffff;");
	    for(var i=0; i<importXdiscrCount; i++)
		{
			targetTable.rows[2+i].setAttribute("style","background: #dffbff;");	
		}
		for(var i=0; i<importXcontiCount; i++)
		{
			targetTable.rows[2+i+importXdiscrCount].setAttribute("style","background: #e8ffe6;");	
		}
	}
}


