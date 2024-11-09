//var output_array = [];
// 釋放一塊wasm記憶體
function freeHeap(heapBytes) {
  Module._free(heapBytes.byteOffset);
}

var runR2EWASM = Module.cwrap("ellipse_sort", null, ["number", "number", "number", "number", "number"]); // void function

function runR2E(sortedTarget, data, size) {

    if(sortedTarget == 0)
    {
        var row_number = size;
        var rowProxData = data;

        var len = row_number * row_number; 

        var inputRowProx = new Float64Array(len);
        for(i = 0; i < row_number; i++)
        {
          for(j = 0; j < row_number; j++)
          {
            inputRowProx[i*row_number+j] = rowProxData[i][j]; 
          }
        }

        var bytes_per_element = inputRowProx.BYTES_PER_ELEMENT;   // 8 bytes each element
         console.log("bytes_per_element:"+inputRowProx.BYTES_PER_ELEMENT);
    
        var start = 0;
        var end = 0;
        start = new Date().getTime();
        // 要測試的 function 開始 =======

        // alloc memory
        var input_ptr = Module._malloc(len * bytes_per_element);
        var output_ptr = Module._malloc(row_number * 4);

        Module.HEAPF64.set(inputRowProx, input_ptr / bytes_per_element); // write WASM memory calling the set method of the Float64Array

        runR2EWASM(input_ptr, output_ptr, row_number, row_number, 0);

        var output_array = new Int32Array(Module.HEAP32.buffer, output_ptr, row_number); // extract data to another JS array

        // 要測試的 function 結束 =======
        end = new Date().getTime();
        // 計算花多久時間
        console.log((end - start) / 1000 + "sec");
        //console.log(output_array);
        //console.log(output_ptr);
        freeHeap(input_ptr);
        freeHeap(output_ptr);

    }
    else
    {
        var col_number = size;
        var colProxData = data;

        var len = col_number * col_number; 

        var inputColProx = new Float64Array(len);
        for(i = 0; i < col_number; i++)
        {
          for(j = 0; j < col_number; j++)
          {
            inputColProx[i*col_number+j] = colProxData[i][j]; 
          }
        }

        var bytes_per_element = inputColProx.BYTES_PER_ELEMENT;   // 8 bytes each element
         console.log("bytes_per_element:"+inputColProx.BYTES_PER_ELEMENT);
    
        var start = 0;
        var end = 0;
        start = new Date().getTime();
        // 要測試的 function 開始 =======

        // alloc memory
        var input_ptr = Module._malloc(len * bytes_per_element);
        var output_ptr = Module._malloc(col_number * 4);

        Module.HEAPF64.set(inputColProx, input_ptr / bytes_per_element); // write WASM memory calling the set method of the Float64Array

        runR2EWASM(input_ptr, output_ptr, col_number, col_number, 0);

        var output_array = new Int32Array(Module.HEAP32.buffer, output_ptr, col_number); // extract data to another JS array

        // 要測試的 function 結束 =======
        end = new Date().getTime();
        // 計算花多久時間
        console.log((end - start) / 1000 + "sec");
        //console.log(output_array);
        //console.log(output_ptr);
        freeHeap(input_ptr);
        freeHeap(output_ptr);
    }
        
    return output_array;

}