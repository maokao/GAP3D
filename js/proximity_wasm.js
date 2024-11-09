//emcc hctree.cpp r2e.cpp list.cpp ordering.cpp proximity.cpp -s ALLOW_MEMORY_GROWTH=1 -s "EXPORTED_FUNCTIONS=['_hctree_sort','_ellipse_sort','_computeProximity']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -o seriation.js
//emcc hctree.cpp r2e.cpp list.cpp ordering.cpp proximity.cpp -s "EXPORTED_FUNCTIONS=['_hctree_sort','_ellipse_sort','_computeProximity']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -o seriation.js

var Module = typeof Module !== 'undefined' ? Module : {};

var runProximityWASM = Module.cwrap("computeProximity", null, ["number", "number", "number", "number", "number", "number", "number"]); // void function

function runProximity(proxType, side, isContainMissingValue, axis) {
  
        if (axis == 0) {
            var row_number = numX;
            var col_number = numY * numZ;
        } else if (axis == 1) {
            var row_number = numY;
            var col_number = numX * numZ;
        } else {
            var row_number = numZ;
            var col_number = numX * numY;
        }
        

        var len = numX * numY * numZ; 
        var inputRawData = new Float64Array(len);
        
        // axis 是一個從 0 到 2 的值，分別代表 X 軸、Y 軸和 Z 軸
        if (axis == 0) { // X 軸
            for(var i = 0; i < numX; i++) {
                for(var j = 0; j < numY; j++) {
                    for(var k = 0; k < numZ; k++) {
                        var index = i * numY * numZ + j * numZ + k;
                        inputRawData[index] = data_array[i][j][k];
                    }
                }
            }
            // console.log(inputRawData);
            // exportArrayToTxt(inputRawData, 'inputRawDataYZ.txt');
        } else if (axis == 1) { // Y 軸
            for(var j = 0; j < numY; j++) {
                for(var i = 0; i < numX; i++) {
                    for(var k = 0; k < numZ; k++) {
                        var index = j * numX * numZ + i * numZ + k;
                        inputRawData[index] = data_array[i][j][k];
                    }         
                }
            }
            // console.log(inputRawData);
            // exportArrayToTxt(inputRawData, 'inputRawDataXZ.txt');
        } else { // Z 軸
            for(var k = 0; k < numZ; k++) {
                for(var i = 0; i < numX; i++) {
                    for(var j = 0; j < numY; j++) {
                        var index = k * numX * numY + i * numY + j;
                        inputRawData[index] = data_array[i][j][k];
                    }         
                }
            }
            // console.log(inputRawData);
            // exportArrayToTxt(inputRawData, 'inputRawDataXY.txt');
        }  

        var bytes_per_element = inputRawData.BYTES_PER_ELEMENT;   // 8 bytes each element
        // console.log("bytes_per_element:"+inputRawData.BYTES_PER_ELEMENT);
    
        var start = 0;
        var end = 0;
        start = new Date().getTime();
        // 要測試的 function 開始 =======

        // alloc memory
        var input_ptr = Module._malloc(len * bytes_per_element);
        var output_prox_ptr;
        var prox_len = 0;
        if (side == 0)
        {
          output_prox_ptr = Module._malloc(row_number * row_number * 8 );
          prox_len = row_number * row_number;
        }

        Module.HEAPF64.set(inputRawData, input_ptr / bytes_per_element); // write WASM memory calling the set method of the Float64Array

        runProximityWASM(input_ptr, output_prox_ptr, row_number, col_number, proxType, side, isContainMissingValue);
        /*
        Module.ccall(
          "hctree_sort", //c function name
          null,   //output type
          ["number", "number", "number", "number", "number", "number", "number", "number"], //input type
          [input_ptr, output_left_ptr, output_right_ptr, output_hgt_ptr, output_order_ptr, row_number, row_number, 0]       //input value
        );
        */

        var output_prox_array = new Float64Array(Module.HEAPF64.buffer, output_prox_ptr, prox_len); // extract data to another JS array
 
        // 要測試的 function 結束 =======
        end = new Date().getTime();
        // 計算花多久時間
        console.log((end - start) / 1000 + "sec");

        
        freeHeap(input_ptr);
        freeHeap(output_prox_ptr);



  return output_prox_array;
  
}
