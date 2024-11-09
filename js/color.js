function GAP_Rainbow(min, max) {
	var colors = d3.scaleLinear()
    //.domain(d3.ticks(min, max, 13))
    .domain(MyTicks(min, max, 13))
    .range(["#A60000", "#D90000", "#FF0000", "#FF6600", "#FFB300", 
    "#FFE600", "#FFFF00", "#CCF200", "#B3E600", "#66A600", "#007359", "#004DEB", "#00008C"]);
    return colors;
}

function GAP_Blue_White_Red(min, max) {
	var colors = d3.scaleLinear()
    .domain(MyTicks(min, max, 20))
    .range(["#00006B", "#00009E", "#0000BF", "#0000E8", "#2121FF", 
    	"#4A4AFF", "#7A7AFF", "#ADADFF", "#E0E0FF", "#FAFAFF", 
    	"#FFFAFA", "#FFC7C7", "#FF9494", "#FF6161", "#FF3838", 
    	"#FF0000", "#CF0000", "#AD0000", "#850000", "#520000"]);
    return colors;
} 

function GAP_Color_16(index) {
	var colors =["#FF0000", "#007F00", "#0000FF", "#FFFF00", "#00FFFF", 
	"#FF00FF", "#7F7F7F", "#FF7F00", "#7F007F", "#7FFF00", "#7F3F3F", "#7F7F00", 
	"#3F7F7F", "#FF7F7F", "#00007F", "#FFFFFF"];

	if (index >= 0 && index < colors.length) {
        return d3.color(colors[index]); // 返回顏色的 HEX 值
    } else {
        return d3.color("#000000"); // 如果索引不在範圍內，返回 black
    }
}

function MyTicks(min, max, num)
{
	let arr = [];
	let range = (max-min)/(num-1);
	for(let i=0; i<num; i++)
	{
		if(i==(num-1))
			arr.push(max);
		else
			arr.push(min+i*range);
	}
	return arr;
}