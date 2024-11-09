//emcc hctree.cpp r2e.cpp list.cpp ordering.cpp -s "EXPORTED_FUNCTIONS=['_hctree_sort','_ellipse_sort']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -o seriation.js
var runHCTreeWASM = Module.cwrap("hctree_sort", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]); // void function

function runHCTree(sortedTarget, hctType, flipType, targetGAP, data, size, firstRunTree, cellWidth, cellHeight, r2e_order, nowID, x, y, heatmapId, isSimilarity) {
  
  if(sortedTarget == 0) //for row
  {
        var row_number = size;
        var rowProxData = data;
        var firstRunRowTree = firstRunTree;
        var row_r2e_order = r2e_order;

        var len = row_number * row_number; 

        var inputRowProx = new Float64Array(len);

        if(isSimilarity)
        {
          for(i = 0; i < row_number; i++)
          {
            for(j = 0; j < row_number; j++)
            {
              inputRowProx[i*row_number+j] = 1.0-rowProxData[i][j]; 
            }
          }         
        }
        else
        {
          for(i = 0; i < row_number; i++)
          {
            for(j = 0; j < row_number; j++)
            {
              inputRowProx[i*row_number+j] = rowProxData[i][j]; 
            }
          }
        }


        var bytes_per_element = inputRowProx.BYTES_PER_ELEMENT;   // 8 bytes each element
         console.log("bytes_per_element:"+inputRowProx.BYTES_PER_ELEMENT);


        var externalOrder = new Int32Array(row_number);

        if(flipType == 1) //r2e
        {
          for(i = 0; i < row_number; i++)
            externalOrder[i] = row_r2e_order[i]; 
        }
        else
        {
          for(i = 0; i < row_number; i++)
            externalOrder[i] = i;          
        }
    
        var start = 0;
        var end = 0;
        start = new Date().getTime();
        // 要測試的 function 開始 =======

        // alloc memory
        var input_ptr = Module._malloc(len * bytes_per_element);
        var externalOrder_ptr = Module._malloc(row_number * 4);
        var output_left_ptr = Module._malloc((row_number-1) * 4 );
        var output_right_ptr = Module._malloc((row_number-1) * 4 );
        var output_hgt_ptr = Module._malloc((row_number-1) * 8 );
        var output_order_ptr = Module._malloc(row_number * 4 );

        Module.HEAPF64.set(inputRowProx, input_ptr / bytes_per_element); // write WASM memory calling the set method of the Float64Array
        Module.HEAP32.set(externalOrder, externalOrder_ptr / 4); // write WASM memory calling the set method of the Float64Array

        runHCTreeWASM(input_ptr, externalOrder_ptr, output_left_ptr, output_right_ptr, output_hgt_ptr, output_order_ptr, row_number, row_number, hctType, flipType);
        /*
        Module.ccall(
          "hctree_sort", //c function name
          null,   //output type
          ["number", "number", "number", "number", "number", "number", "number", "number"], //input type
          [input_ptr, output_left_ptr, output_right_ptr, output_hgt_ptr, output_order_ptr, row_number, row_number, 0]       //input value
        );
*/
        var output_left_array = new Int32Array(Module.HEAP32.buffer, output_left_ptr, row_number-1); // extract data to another JS array
        var output_right_array = new Int32Array(Module.HEAP32.buffer, output_right_ptr, row_number-1); // extract data to another JS array
        var output_hgt_array = new Float64Array(Module.HEAPF64.buffer, output_hgt_ptr, row_number-1); // extract data to another JS array
        var output_order_array = new Int32Array(Module.HEAP32.buffer, output_order_ptr, row_number); // extract data to another JS array

        // 要測試的 function 結束 =======
        end = new Date().getTime();
        // 計算花多久時間
        console.log((end - start) / 1000 + "sec");

        targetGAP.row_output_left_array = output_left_array;
        targetGAP.row_output_right_array = output_right_array;
        targetGAP.row_output_hgt_array = output_hgt_array;
        targetGAP.row_output_order_array = output_order_array;        

        var currentOrder = [];

        for(i=0; i<(row_number-1); i++)
        {
            for(j=0; j<(row_number-1); j++)
            {
              if(i==output_order_array[j])
              {
                currentOrder[i]=j;  
                break;
              }
            }        
        }

        targetGAP.treeRowData = createTreeJSON((row_number*2-2), output_left_array, output_right_array, output_hgt_array, currentOrder, row_number);

        if(firstRunRowTree)
          firstRunRowTree = false;

        drawRowTree(targetGAP.treeRowData, nowID, x, y, sortedTarget, heatmapId, row_number, cellHeight, firstRunRowTree);
        
        freeHeap(input_ptr);
        freeHeap(externalOrder_ptr);
        freeHeap(output_left_ptr);
        freeHeap(output_right_ptr);
        freeHeap(output_hgt_ptr);
        freeHeap(output_order_ptr);

  }
  else  //for column
  {
        var col_number = size;
        var colProxData = data;
        var firstRunColTree = firstRunTree;
        var col_r2e_order = r2e_order;

        var len = col_number * col_number; 

        var inputColProx = new Float64Array(len);
        if(isSimilarity)
        {
          for(i = 0; i < col_number; i++)
          {
            for(j = 0; j < col_number; j++)
            {
              inputColProx[i*col_number+j] = 1.0-colProxData[i][j]; 
            }
          }
        }
        else
        {
          for(i = 0; i < col_number; i++)
          {
            for(j = 0; j < col_number; j++)
            {
              inputColProx[i*col_number+j] = colProxData[i][j]; 
            }
          }          
        }

        var bytes_per_element = inputColProx.BYTES_PER_ELEMENT;   // 8 bytes each element
         console.log("bytes_per_element:"+inputColProx.BYTES_PER_ELEMENT);

        var externalOrder = new Int32Array(col_number);

        if(flipType == 1) //r2e
        {
          for(i = 0; i < col_number; i++)
            externalOrder[i] = col_r2e_order[i]; 
        }
        else
        {
          for(i = 0; i < col_number; i++)
            externalOrder[i] = i;          
        }
    
        var start = 0;
        var end = 0;
        start = new Date().getTime();
        // 要測試的 function 開始 =======

        // alloc memory
        var input_ptr = Module._malloc(len * bytes_per_element);
        var externalOrder_ptr = Module._malloc(col_number * 4);
        var output_left_ptr = Module._malloc((col_number-1) * 4 );
        var output_right_ptr = Module._malloc((col_number-1) * 4 );
        var output_hgt_ptr = Module._malloc((col_number-1) * 8 );
        var output_order_ptr = Module._malloc(col_number * 4 );

        Module.HEAPF64.set(inputColProx, input_ptr / bytes_per_element); // write WASM memory calling the set method of the Float64Array
        Module.HEAP32.set(externalOrder, externalOrder_ptr / 4);

        runHCTreeWASM(input_ptr, externalOrder_ptr, output_left_ptr, output_right_ptr, output_hgt_ptr, output_order_ptr, col_number, col_number, hctType, flipType);
        /*
        Module.ccall(
          "hctree_sort", //c function name
          null,   //output type
          ["number", "number", "number", "number", "number", "number", "number", "number"], //input type
          [input_ptr, output_left_ptr, output_right_ptr, output_hgt_ptr, output_order_ptr, row_number, row_number, 0]       //input value
        );
*/
        var output_left_array = new Int32Array(Module.HEAP32.buffer, output_left_ptr, col_number-1); // extract data to another JS array
        var output_right_array = new Int32Array(Module.HEAP32.buffer, output_right_ptr, col_number-1); // extract data to another JS array
        var output_hgt_array = new Float64Array(Module.HEAPF64.buffer, output_hgt_ptr, col_number-1); // extract data to another JS array
        var output_order_array = new Int32Array(Module.HEAP32.buffer, output_order_ptr, col_number); // extract data to another JS array

        // 要測試的 function 結束 =======
        end = new Date().getTime();
        // 計算花多久時間
        console.log((end - start) / 1000 + "sec");

        targetGAP.col_output_left_array = output_left_array;
        targetGAP.col_output_right_array = output_right_array;
        targetGAP.col_output_hgt_array = output_hgt_array;
        targetGAP.col_output_order_array = output_order_array; 

        //console.log("output_hgt_array:"+output_hgt_array);

        var currentOrder = [];
        for(i=0; i<(col_number-1); i++)
        {
          for(j=0; j<(col_number-1); j++)
          {
            if(i==output_order_array[j])
            {
              currentOrder[i]=j;  
              break;
            }
          }
          
        }

        targetGAP.treeColData = createTreeJSON((col_number*2-2), output_left_array, output_right_array, output_hgt_array, currentOrder, col_number);

        if(firstRunColTree)
          firstRunColTree = false;

        drawColTree(targetGAP.treeColData, nowID, x, y, sortedTarget, heatmapId, col_number, cellWidth, firstRunColTree);
        
        freeHeap(input_ptr);
        freeHeap(externalOrder_ptr);
        freeHeap(output_left_ptr);
        freeHeap(output_right_ptr);
        freeHeap(output_hgt_ptr);
        freeHeap(output_order_ptr);

  }
  return output_order_array;
  
}


//-----------------------------------------------------------------
function runHCTree_3D(sortedTarget, hctType, flipType, nowID, x, y, heatmapId, isSimilarity, axisdatamt, gapTmp) {
  
  var row_number;

  if(sortedTarget == 0) //for X
  {
        row_number = numX;
  }
  else if (sortedTarget == 1) //for Y
  {
        row_number = numY;
  }
  else //for Z
  {
        row_number = numZ;
  }


        var len = row_number * row_number; 

        var inputRowProx = new Float64Array(len);
        

        if(isSimilarity)
        {
          for(i = 0; i < row_number; i++)
          {
            for(j = 0; j < row_number; j++)
            {
              inputRowProx[i*row_number+j] = 1.0-axisdatamt[i][j]; 
            }
          }         
        }
        else
        {
          for(i = 0; i < row_number; i++)
          {
            for(j = 0; j < row_number; j++)
            {
              inputRowProx[i*row_number+j] = axisdatamt[i][j]; 
            }
          }
        }


        var bytes_per_element = inputRowProx.BYTES_PER_ELEMENT;   // 8 bytes each element
         console.log("bytes_per_element:"+inputRowProx.BYTES_PER_ELEMENT);


        var externalOrder = new Int32Array(row_number);

        if(flipType == 1) //r2e
        {
          if(sortedTarget == 0) //for X
          {
            for(i = 0; i < row_number; i++)
              externalOrder[i] = gapX.row_r2e_order[i];
          }
          else if(sortedTarget == 1) //for Y
          {
            for(i = 0; i < row_number; i++)
              externalOrder[i] = gapY.row_r2e_order[i];
          }
          else
          {
            for(i = 0; i < row_number; i++)
              externalOrder[i] = gapZ.row_r2e_order[i];
          }
        }
        else
        {
          for(i = 0; i < row_number; i++)
            externalOrder[i] = i;          
        }
    
        var start = 0;
        var end = 0;
        start = new Date().getTime();
        // 要測試的 function 開始 =======

        // alloc memory
        var input_ptr = Module._malloc(len * bytes_per_element);
        var externalOrder_ptr = Module._malloc(row_number * 4);
        var output_left_ptr = Module._malloc((row_number-1) * 4 );
        var output_right_ptr = Module._malloc((row_number-1) * 4 );
        var output_hgt_ptr = Module._malloc((row_number-1) * 8 );
        var output_order_ptr = Module._malloc(row_number * 4 );

        Module.HEAPF64.set(inputRowProx, input_ptr / bytes_per_element); // write WASM memory calling the set method of the Float64Array
        Module.HEAP32.set(externalOrder, externalOrder_ptr / 4); // write WASM memory calling the set method of the Float64Array

        runHCTreeWASM(input_ptr, externalOrder_ptr, output_left_ptr, output_right_ptr, output_hgt_ptr, output_order_ptr, row_number, row_number, hctType, flipType);

        var output_left_array = new Int32Array(Module.HEAP32.buffer, output_left_ptr, row_number-1); // extract data to another JS array
        var output_right_array = new Int32Array(Module.HEAP32.buffer, output_right_ptr, row_number-1); // extract data to another JS array
        var output_hgt_array = new Float64Array(Module.HEAPF64.buffer, output_hgt_ptr, row_number-1); // extract data to another JS array
        var output_order_array = new Int32Array(Module.HEAP32.buffer, output_order_ptr, row_number); // extract data to another JS array

        // 要測試的 function 結束 =======
        end = new Date().getTime();
        // 計算花多久時間
        console.log((end - start) / 1000 + "sec");

        row_output_left_array = output_left_array;
        row_output_right_array = output_right_array;
        row_output_hgt_array = output_hgt_array;
        row_output_order_array = output_order_array;        

        var currentOrder = [];

        for(i=0; i<(row_number-1); i++)
        {
            for(j=0; j<(row_number-1); j++)
            {
              if(i==output_order_array[j])
              {
                currentOrder[i]=j;  
                break;
              }
            }        
        }

        treeRowData = createTreeJSON((row_number*2-2), output_left_array, output_right_array, output_hgt_array, currentOrder, row_number);

        if(gapTmp.firstRunRowTree)
          gapTmp.firstRunRowTree = false;

        //function drawRowTree_3D(data2, nowID, rowTreeX, rowTreeY, mode, heatmapId, gapTmp)
        drawRowTree_3D(treeRowData, nowID, x, y, sortedTarget, heatmapId, gapTmp);
        
        freeHeap(input_ptr);
        freeHeap(externalOrder_ptr);
        freeHeap(output_left_ptr);
        freeHeap(output_right_ptr);
        freeHeap(output_hgt_ptr);
        freeHeap(output_order_ptr);


  return output_order_array;
  
}
