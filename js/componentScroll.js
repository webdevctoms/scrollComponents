function ScrollComponent(scrollComponentClass,leftArrowClass,rightArrowClass,dropdownRef,arrowClass){
	this.scrollComponents = document.getElementsByClassName(scrollComponentClass);
	this.leftArrows = document.getElementsByClassName(leftArrowClass);
	this.rightArrows = document.getElementsByClassName(rightArrowClass);
	this.arrows = document.getElementsByClassName(arrowClass);
	//reference to the previously created dropdown object 
	this.dropdown = dropdownRef;
	this.scrollArray = [];
	this.activeItemIndexesArray = [];
	console.log(this.scrollComponents,this.leftArrows);
	this.initScrollArray(3);
	console.log(this.scrollArray,this.activeItemIndexesArray);
	this.setHiddenToSecondRow();
	this.initViewHeights();
	this.initWindowListener();

}

ScrollComponent.prototype.initScrollArray = function(columns){
	for(var i = 0;i < this.scrollComponents.length;i++){
		var scrollData = [];
		var columnArray = [];
		for(var k = 0;k <= this.scrollComponents[i].children.length;k++){
			//console.log(columnArray,columnArray.length,k);
			if(columnArray.length < columns){
				columnArray.push(this.scrollComponents[i].children[k]);
			}
			else if(columnArray.length === columns){
				//
				scrollData.push(columnArray);
				columnArray = [];
				columnArray.push(this.scrollComponents[i].children[k]);
			}
		}
		this.activeItemIndexesArray.push(0);
		this.scrollArray.push(scrollData);
	}
}

ScrollComponent.prototype.initViewHeights = function(){
	var newHeight = 0;
	var maxHeights = [];
	for(var i = 0;i < this.activeItemIndexesArray.length;i++){
		var maxHeight = 0;
		for(var k = 0;k < this.scrollArray[i][this.activeItemIndexesArray[i]].length;k++){
			//need this here to reset margin so that max heights won't be affected by label margin
			this.scrollArray[i][this.activeItemIndexesArray[i]][k].children[1].style.marginBottom = "5px";
			if(this.scrollArray[i][this.activeItemIndexesArray[i]][k].scrollHeight > maxHeight){
				maxHeight = this.scrollArray[i][this.activeItemIndexesArray[i]][k].scrollHeight;
				maxHeights[i] = this.scrollArray[i][this.activeItemIndexesArray[i]][k].scrollHeight;
				
			}
		}
		this.scrollComponents[i].style.height = maxHeight + "px";
		//10 for margin
		newHeight += maxHeight;
	}
	//console.log(newHeight);
	this.setLabelOffsets(maxHeights);
	//console.log("maxHeights ", maxHeights)
	this.adjustArrows();
	this.dropdown.windowResized();
}

ScrollComponent.prototype.adjustArrows = function(){
	for(var i =0; i < this.scrollComponents.length; i++){
		//console.log(this.scrollComponents[i].style.height);
		var numHeight = parseInt(this.scrollComponents[i].style.height.replace("px",""))
		var halfHeight = numHeight / 2;
		this.leftArrows[i].style.top = halfHeight + "px";
		this.rightArrows[i].style.top = halfHeight + "px";
	}
}

ScrollComponent.prototype.initWindowListener = function(){
	window.addEventListener('resize',function(e){
		this.windowResized(e);
	}.bind(this),false);
}
//need to find active slide then resize based off that size
ScrollComponent.prototype.windowResized = function(event){
	console.log("test");
	this.initViewHeights();
	//this.dropdown.windowResized();
}

ScrollComponent.prototype.setLabelOffsets = function(maxHeights){	
	for(var i = 0;i < this.activeItemIndexesArray.length;i++){
		var maxHeight = 0;
		for(var k = 0;k < this.scrollArray[i][this.activeItemIndexesArray[i]].length;k++){
			if(this.scrollArray[i][this.activeItemIndexesArray[i]][k].scrollHeight < maxHeights[i]){
				var adjustedHeightDiff = maxHeights[i] - this.scrollArray[i][this.activeItemIndexesArray[i]][k].scrollHeight + 5;
				this.scrollArray[i][this.activeItemIndexesArray[i]][k].children[1].style.marginBottom = adjustedHeightDiff + "px";
			}
		}
	}
}

ScrollComponent.prototype.setHiddenToSecondRow = function(){
	var maxRowHeights = [];
	//will move everything to the second row and then will move them back and forth from second row
	for(var i = 0;i < this.scrollArray.length;i++){
		//skip the first row
		for(var k = 1;k < this.scrollArray[i].length;k++){
			var rowMax = 0;
			for(var j = 0;j < this.scrollArray[i][k].length;j++){
				//capture the max
				if(this.scrollArray[i][k][j].scrollHeight > rowMax){
						rowMax = this.scrollArray[i][k][j].scrollHeight;
				}
				if(k === 1){
					continue;
				}
				else{
					var transformPixels = 0;
					for(var x = 0;x < maxRowHeights.length;x++){
						transformPixels += maxRowHeights[x] + 5;
					}
					//minus will move it up)
					this.scrollArray[i][k][j].style.transform = "translateY(-" + transformPixels + "px)";

				}
			}
			maxRowHeights[k -1] = rowMax;
		}
	}
}