import Papa from 'https://cdn.skypack.dev/papaparse@5.3.0';
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';



// 正規化資料值
function normalize(value, min, max) {
    // 防止除以零
    if (max === min) {
        return 0.5; // 或者根據需要返回其他合理的值
    }
    return (value - min) / (max - min);
}

// 顏色映射函數
function mapValueToColor(value, colorScheme, min, max) {
    switch (colorScheme) {
        case 'jet':
            return mapValueTocolorSchemes("jet", value, min, max);
        case 'RdYlGn':
            return mapValueTocolorSchemes("RdYlGn", value, min, max);
        case 'Blues':
            return mapValueTocolorSchemes("Blues", value, min, max);
        case 'Reds':
            return mapValueTocolorSchemes("Reds", value, min, max);
        case 'Greys':
            return mapValueTocolorSchemes("Greys", value, min, max);
        case 'YlGnBu':
            return mapValueTocolorSchemes("YlGnBu", value, min, max);
        case 'YlOrRd':
            return mapValueTocolorSchemes("YlOrRd", value, min, max);
        case 'RdYlBu':
            return mapValueTocolorSchemes("RdYlBu", value, min, max);
        case 'RdGy':
            return mapValueTocolorSchemes("RdGy", value, min, max);
        case 'RdBu':
            return mapValueTocolorSchemes("RdBu", value, min, max);
        case 'PiYG':
            return mapValueTocolorSchemes("PiYG", value, min, max);
        case 'PRGn':
            return mapValueTocolorSchemes("PRGn", value, min, max);
        case 'BrBG':
            return mapValueTocolorSchemes("BrBG", value, min, max);
        case 'PuOr':
            return mapValueTocolorSchemes("PuOr", value, min, max);
        case 'GAP_Rainbow':
            return mapValueTocolorSchemes("GAP_Rainbow", value, min, max);
        case 'GAP_Blue_White_Red':
            return mapValueTocolorSchemes("GAP_Blue_White_Red",value, min, max);
        default:
            return new THREE.Color(0xffffff); // 預設白色
    }
}

// 更新顏色方案
function updateColorScheme() {
    var colorSchemeSelect = document.getElementById('colorSchemeSelect');
    var selectedColorScheme = colorSchemeSelect.value;

    // 確保 globalMin 和 globalMax 已被定義
    if (typeof globalMin === 'number' && typeof globalMax === 'number') {
        scene.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                var value = object.userData.value;
                // 確保 value 是有效的數字
                if (typeof value === 'number' && !isNaN(value)) {
                    object.material.color = mapValueToColor(value, selectedColorScheme, globalMin, globalMax);
                    object.material.needsUpdate = true;
                }
            }
        });
    }
}

// 定義顏色方案的映射 (colorbrewer)
const colorSchemes = {
jet: ['#00008F', '#0000FF', '#008FFF', '#00FFFF', '#8FFFFF', '#FFFF00', '#FF8F00', '#FF0000', '#8F0000'],
RdYlGn: ['#D73027', '#F46D43', '#FDAE61', '#FEE08B', '#FFFFBF', '#D9EF8B', '#A6D96A', '#66BD63', '#1A9850'],
Blues: ['#EFF3FF', '#C6DBEF', '#9ECAE1', '#6BAED6', '#3182BD', '#08519C'],
Reds: ['#FFF5F0', '#FEE0D2', '#FCBBA1', '#FC9272', '#FB6A4A', '#EF3B2C', '#CB181D', '#A50F15', '#67000D'],
GAP_Rainbow: ["#00008C", "#004DEB", "#007359", "#66A600", "#B3E600", "#CCF200", "#FFFF00", "#FFE600", "#FFB300", "#FF6600", "#FF0000", "#D90000", "#A60000"],
GAP_Blue_White_Red: ["#00006B", "#00009E", "#0000BF", "#0000E8", "#2121FF", "#4A4AFF", "#7A7AFF", "#ADADFF", "#E0E0FF", "#FAFAFF", "#FFFAFA", "#FFC7C7", "#FF9494", "#FF6161", "#FF3838", "#FF0000", "#CF0000", "#AD0000", "#850000", "#520000"],
Greys: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'],
YlGnBu: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
YlOrRd: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
RdYlBu: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
RdGy: ['#ef3b2c', '#fcbba1', '#ffffff', '#bababa', '#878787', '#4d4d4d'],
RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
PiYG: ['#d01c8b', '#f1b6da', '#f7f7f7', '#b8e186', '#4dac26'],
PRGn: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
};

// 顏色映射函數
function mapValueTocolorSchemes(schemeName, value, min, max) {
    var colors = colorSchemes[schemeName];
    var reverse = document.getElementById('reverseColors').checked; // 檢查 checkbox 是否被勾選
    var normalized = normalize(value, min, max);
    var index = Math.floor(normalized * (colors.length - 1));

    if (reverse) {
        index = colors.length - 1 - index; // 反轉顏色索引
    }

    return new THREE.Color(colors[index]);
}

// 根據顏色方案更新 colorbar 的背景，並更新最小值和最大值標籤的內容
function updateColorbar(colorScheme, min, max) {
    var colorbarContainer = document.getElementById('colorbar-container');
    var colorbar = document.getElementById('colorbar');
    var colorbarMinLabel = document.getElementById('colorbar-min-label');
    var colorbarMaxLabel = document.getElementById('colorbar-max-label');

    // 根據顏色方案更新 colorbar 的背景漸變
    var gradient = getColorGradient(colorScheme);
    colorbar.style.background = gradient;

    // 顯示 colorbar 容器
    colorbarContainer.style.display = 'block';

    // 更新最小值和最大值標籤的內容
    colorbarMinLabel.textContent = min; // 四捨五入?
    colorbarMaxLabel.textContent = max;
}

// 根據顏色方案獲取漸變樣式的函數
function getColorGradient(colorScheme) {
    var reverse = document.getElementById('reverseColors').checked; // 檢查 checkbox 是否被選中
    var direction = reverse ? 'to bottom' : 'to top'; // 根據是否反轉來決定漸變方向

    switch (colorScheme) {
        case 'jet':
            return `linear-gradient(${direction}, blue, cyan, green, yellow, red)`;
        case 'RdYlGn':
            return `linear-gradient(${direction}, red, yellow, green)`;
        case 'Blues':
            return `linear-gradient(${direction}, #f7fbff, #4292c6)`;
        case 'Reds':
            return `linear-gradient(${direction}, #fff5f0, #cb181d)`;
        case 'Greys':
            return `linear-gradient(${direction}, #f7f7f7, #cccccc, #969696, #636363, #252525)`;
        case 'YlGnBu':
            return `linear-gradient(${direction}, #ffffcc, #a1dab4, #41b6c4, #2c7fb8, #253494)`;
        case 'YlOrRd':
            return `linear-gradient(${direction}, #ffffb2, #fecc5c, #fd8d3c, #f03b20, #bd0026)`;
        case 'RdYlBu':
            return `linear-gradient(${direction}, #d73027, #fc8d59, #fee090, #e0f3f8, #91bfdb, #4575b4)`;
        case 'RdGy':
            return `linear-gradient(${direction}, #ef3b2c, #fcbba1, #ffffff, #bababa, #878787, #4d4d4d)`;
        case 'RdBu':
            return `linear-gradient(${direction}, #67001f, #b2182b, #d6604d, #f4a582, #fddbc7, #d1e5f0, #92c5de, #4393c3, #2166ac, #053061)`;
        case 'PiYG':
            return `linear-gradient(${direction}, #d01c8b, #f1b6da, #f7f7f7, #b8e186, #4dac26)`;
        case 'PRGn':
            return `linear-gradient(${direction}, #762a83, #af8dc3, #e7d4e8, #d9f0d3, #7fbf7b, #1b7837)`;
        case 'BrBG':
            return `linear-gradient(${direction}, #543005, #8c510a, #bf812d, #dfc27d, #f6e8c3, #c7eae5, #80cdc1, #35978f, #01665e, #003c30)`;
        case 'PuOr':
            return `linear-gradient(${direction}, #7f3b08, #b35806, #e08214, #fdb863, #fee0b6, #d8daeb, #b2abd2, #8073ac, #542788, #2d004b)`;
        case 'GAP_Rainbow':
            return `linear-gradient(${direction}, #00008C, #004DEB, #007359, #66A600, #B3E600, #CCF200, #FFFF00, #FFE600, #FFB300, #FF6600, #FF0000, #D90000, #A60000)`;
        case 'GAP_Blue_White_Red':
            return `linear-gradient(${direction}, #00006B, #00009E, #0000BF, #0000E8, #2121FF, #4A4AFF, #7A7AFF, #ADADFF, #E0E0FF, #FAFAFF, #FFFAFA, #FFC7C7, #FF9494, #FF6161, #FF3838, #FF0000, #CF0000, #AD0000, #850000, #520000)`;
        default:
            return `linear-gradient(${direction}, white, black)`; // 預設漸變
    }
}