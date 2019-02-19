function ScrollComponent(scrollComponentClass,leftArrowClass,rightArrowClass,dropdownRef,arrowClass){
	this.scrollComponents = document.getElementsByClassName(scrollComponentClass);
	this.leftArrows = document.getElementsByClassName(leftArrowClass);
	this.rightArrows = document.getElementsByClassName(rightArrowClass);
	this.arrows = document.getElementsByClassName(arrowClass);
	//reference to the previously created dropdown object 
	this.dropdown = dropdownRef;
	this.animationRunning = false;
	this.scrollArray = [];
	this.activeItemIndexesArray = [];
	console.log(this.scrollComponents,this.leftArrows);
	this.initScrollArray(3);
	console.log(this.scrollArray,this.activeItemIndexesArray);
	this.setHiddenLabelOffsets(this.setHiddenToSecondRow());
	this.initRightArrowButtons(this.rightArrows);
	this.initLeftArrowButtons(this.leftArrows);
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

ScrollComponent.prototype.initRightArrowButtons = function(buttons){
	for(var i = 0;i < buttons.length;i++){
		buttons[i].addEventListener('click',function(e){
			this.rightButtonClicked(e);
		}.bind(this),false);
	}
	
}
//resize scroll view on button click need to use this to adjust offsets of hidden ones that aren't active and weren't moved
ScrollComponent.prototype.adjustHiddenOffsets = function(scrollID,activeRow,adjustedRowDiff,offsetHeight,leftClicked){
	var selectedScrollView;
	if(leftClicked === undefined){
		leftClicked = false;
	}
	/*
	if(leftClicked){
		activeRow += 1;
	}
	*/

	for(var i = 0;i < this.scrollArray[scrollID].length;i++){
		//don't want to target current row or previous row when right clicked
		console.log(activeRow);
		if(i === activeRow || i === activeRow - 1){
			continue;
		}
		for(var k = 0;k < this.scrollArray[scrollID][i].length; k++){
			//console.log(this.scrollArray[scrollID][i][k]);
			var currentTranslate = parseInt(this.scrollArray[scrollID][i][k].style.transform.match(/-?\d+/g));
			if(!currentTranslate){
				currentTranslate = 0;
			}
			if(!leftClicked){
				this.scrollArray[scrollID][i][k].style.transform = "translateY(" + (currentTranslate - adjustedRowDiff) + "px)";
			}
			else{
				this.scrollArray[scrollID][i][k].style.transform = "translateY(" + (currentTranslate + adjustedRowDiff) + "px)";
			}
			
		}
	}

	console.log("row Difference hidden method ",adjustedRowDiff);
}
/*
can possibly add promises to set this variable when the timeout is done, but won't work on IE
ScrollComponent.prototype.setAnimationStopped = function(){
	this.animationRunning = false;
}
*/
ScrollComponent.prototype.handleTimeoutRight = function(i,scrollItem,offsetHeight,scrollUp,rowDifference){
	if(offsetHeight === undefined){
		offsetHeight =false;
	}
	if(scrollUp === undefined){
		scrollUp = false;
	}

	if(!scrollUp){
		setTimeout(function(){
	
			var currentTranslate = parseInt(scrollItem.style.transform.match(/-?\d+/g));
			if(!currentTranslate){
				currentTranslate = 0;
			}
			var newHeight = currentTranslate + offsetHeight;
			console.log("new height: ",newHeight);
			scrollItem.style.transform = "translateY(" + (newHeight) + "px)";				
			
		}.bind(this),1000 / i);
	}
	else if(scrollUp){
		setTimeout(function(){
			
			var currentTranslate = parseInt(scrollItem.style.transform.match(/-?\d+/g));
			var newHeight = currentTranslate - offsetHeight;
			//console.log(scrollItem.style.transform.match(/\d+/g));
			console.log("row diff right up ", rowDifference,offsetHeight);
			scrollItem.style.transform = "translateY(" + newHeight + "px)";
			//console.log(i,newHeight,scrollItem,currentTranslate,offsetHeight);
			
		}.bind(this),1500 / i);
	}
	
}
//right will increment the active arrow by 1 until it reaches the max of row arrow
ScrollComponent.prototype.rightButtonClicked = function(event){
	//console.log("Right button:", event.target);
	var scrollComponent = event.target.previousElementSibling;
	var scrollID = scrollComponent.dataset.scrollcomponentid;
	//console.log(this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][0].scrollHeight,this.scrollArray[scrollID][1][0])
	
	//this.initViewHeights();
	if(this.activeItemIndexesArray[scrollID] < (this.scrollArray[scrollID].length - 1)){
		var rowScrollHeight = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][0].scrollHeight + 5;
		var nextRowHeight = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID] + 1][0].scrollHeight + 5;
		var activeRow = this.activeItemIndexesArray[scrollID] + 1;
		var rowDifference = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][0].scrollHeight - this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID] + 1][0].scrollHeight;

		var adjustedRowDiff;
		if(rowDifference < 0){
			adjustedRowDiff = rowDifference + activeRow * 5;
		}
		else{
			adjustedRowDiff = rowDifference - activeRow * 5;
		}
		//bring current row down
		for(var i = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]].length;i > 0; i--){
			//console.log(i - 1);
			var scrollItem = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][i - 1];
			this.handleTimeoutRight(i,scrollItem,nextRowHeight,false,adjustedRowDiff);
		}
		
		this.activeItemIndexesArray[scrollID] += 1;
		this.adjustHiddenOffsets(scrollID,activeRow,rowDifference,rowScrollHeight);
		//bring next row up
		for(var i = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]].length;i > 0; i--){
			
			var scrollItem = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][i - 1];
			this.handleTimeoutRight(i,scrollItem,rowScrollHeight,true,adjustedRowDiff);			
		}
		
		this.initViewHeights();
		//this.setHiddenToSecondRow();
		
	}
	
	
}

ScrollComponent.prototype.initLeftArrowButtons = function(buttons){
	for(var i = 0;i < buttons.length;i++){
		buttons[i].addEventListener('click',function(e){
			this.leftButtonClicked(e);
		}.bind(this),false);
	}
	
}

ScrollComponent.prototype.handleTimeoutLeft = function(i,scrollItem,offsetHeight,scrollUp,rowDifference){
	if(offsetHeight === undefined){
		offsetHeight =false;
	}
	if(scrollUp === undefined){
		scrollUp = false;
	}
	//console.log(i);
	if(!scrollUp){
		setTimeout(function(){
		//console.log(scrollItem);
			var currentTranslate = parseInt(scrollItem.style.transform.match(/-?\d+/g));
			if(!currentTranslate){
				currentTranslate = 0;
			}
			var newHeight = currentTranslate + offsetHeight;
			scrollItem.style.transform = "translateY(" + (newHeight) + "px)";		
		}.bind(this),200 * i);
	}
	else if(scrollUp){
		setTimeout(function(){
			var currentTranslate = parseInt(scrollItem.style.transform.match(/-?\d+/g));
			var newHeight = currentTranslate - offsetHeight;			
			scrollItem.style.transform = "translateY(" + (newHeight) + "px)";
			console.log("row left:",offsetHeight);
		}.bind(this),500 * i);
	}
	
}

//left will decrement the active arrow by 1 until it reaches 0
ScrollComponent.prototype.leftButtonClicked = function(event){
	console.log("Left button:", event.target);
	var scrollComponent = event.target.nextElementSibling;
	var scrollID = scrollComponent.dataset.scrollcomponentid;
	//console.log("left scroll ",this.activeItemIndexesArray,scrollID);
	
	if(this.activeItemIndexesArray[scrollID] > 0){
		var rowScrollHeight = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][0].scrollHeight + 5;
		var nextRowHeight = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID] - 1][0].scrollHeight + 5;
		var activeRow = this.activeItemIndexesArray[scrollID] - 1;
		//this.adjustHiddenOffsets(scrollID,(this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][0].scrollHeight - this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID] - 1][0].scrollHeight),this.activeItemIndexesArray[scrollID] - 1,true);

		//var activeRow = this.activeItemIndexesArray[scrollID] - 1;

		var rowDifference = this.scrollArray[scrollID][activeRow][0].scrollHeight - this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][0].scrollHeight;
		activeRow++;
		var adjustedRowDiff;
		if(rowDifference < 0){
			adjustedRowDiff = rowDifference + activeRow * 5;
			//console.log(adjustedRowDiff);
		}
		else{
			adjustedRowDiff = rowDifference - activeRow * 5;
		}
		//active row
		for(var i = 0;i < this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]].length;i++){

			var scrollItem = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][i];
			this.handleTimeoutLeft(i,scrollItem,nextRowHeight,false,adjustedRowDiff);
		}
		this.activeItemIndexesArray[scrollID] -= 1;
		this.adjustHiddenOffsets(scrollID,activeRow,rowDifference,rowScrollHeight,true);
		//previous row
		for(var i = 0;i < this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]].length; i++){

			var scrollItem = this.scrollArray[scrollID][this.activeItemIndexesArray[scrollID]][i];
			this.handleTimeoutLeft(i,scrollItem,rowScrollHeight,true,adjustedRowDiff);			
		}
		this.initViewHeights();
		//this.adjustHiddenOffsets(scrollID);
	}
}
//need to find active slide then resize based off that size
ScrollComponent.prototype.windowResized = function(event){
	console.log("test");
	this.initViewHeights();
	this.setHiddenToSecondRow();
	//console.log(this.animationRunning);
	//this.dropdown.windowResized();
}

ScrollComponent.prototype.setLabelOffsets = function(maxHeights){	
	for(var i = 0;i < this.activeItemIndexesArray.length;i++){
		var maxHeight = 0;
		for(var k = 0;k < this.scrollArray[i][this.activeItemIndexesArray[i]].length;k++){
			if(this.scrollArray[i][this.activeItemIndexesArray[i]][k].scrollHeight < maxHeights[i]){
				var adjustedHeightDiff = maxHeights[i] - this.scrollArray[i][this.activeItemIndexesArray[i]][k].scrollHeight + 5;
				//target the label
				this.scrollArray[i][this.activeItemIndexesArray[i]][k].children[1].style.marginBottom = adjustedHeightDiff + "px";
			}
		}
	}
}

ScrollComponent.prototype.setHiddenLabelOffsets = function(rowMaxHeights){
	for(var i = 0;i < this.scrollArray.length;i++){
		for(var k =0;k< this.scrollArray[i].length;k++){
			for (var j = 0; j < this.scrollArray[i][k].length; j++) {
				//console.log("hidden offset ", this.scrollArray[i][k][j].scrollHeight,rowMaxHeights[i][k]);
				if(this.scrollArray[i][k][j].scrollHeight < rowMaxHeights[i][k]){

					var adjustedHeightDiff = rowMaxHeights[i][k] - this.scrollArray[i][k][j].scrollHeight + 5;
					this.scrollArray[i][k][j].children[1].style.marginBottom = adjustedHeightDiff + "px";
					//console.log("margin bottom offset ", this.scrollArray[i][k][j].children[1].style.marginBottom);
				}
			}
		}
	}
}

ScrollComponent.prototype.enableItemTransitions = function(){
	for(var i = 0;i < this.scrollArray.length;i++){
		for(var k =0;k< this.scrollArray[i].length;k++){
			for (var j = 0; j < this.scrollArray[i][k].length; j++) {
				this.scrollArray[i][k][j].style.transition = "all 1s";
			}
		}
	}
}

ScrollComponent.prototype.disableItemTransitions = function(){
	for(var i = 0;i < this.scrollArray.length;i++){
		for(var k =0;k< this.scrollArray[i].length;k++){
			for (var j = 0; j < this.scrollArray[i][k].length; j++) {
				this.scrollArray[i][k][j].style.transition = "none";
			}
		}
	}
}

ScrollComponent.prototype.setHiddenToSecondRow = function(){
	//this array will be passed for setting offsets
	var maxRowHeights = [];
	//will move everything to the second row and then will move them back and forth from second row
	this.disableItemTransitions();
	for(var i = 0;i < this.scrollArray.length;i++){
		//this array is used inside the loops
		var tempMaxHeights = [];
		//this array is used to capture the max heights
		var rowHeights = [];

		for(var k = 0;k < this.scrollArray[i].length;k++){
			var rowMax = 0;
			for(var j = 0;j < this.scrollArray[i][k].length;j++){
				//capture the max
				if(this.scrollArray[i][k][j].scrollHeight > rowMax){
					rowMax = this.scrollArray[i][k][j].scrollHeight;

				}
				if(k === this.activeItemIndexesArray[i]){
					continue;
				}
				else{
					var transformPixels = 0;
					//console.log(k,tempMaxHeights);
					for(var x = 0;x < tempMaxHeights.length;x++){
						transformPixels += tempMaxHeights[x] + 5;
					}
					//minus will move it up)
					if(k == 0){
						//console.log("transformPixels ",transformPixels);
						transformPixels = rowMax + 5;
						this.scrollArray[i][k][j].style.transform = "translateY(" + transformPixels + "px)";
						continue;
					}
					this.scrollArray[i][k][j].style.transform = "translateY(-" + transformPixels + "px)";
					
				}

			}
			rowHeights.push(rowMax);
			tempMaxHeights[k -1] = rowMax;

		}
		maxRowHeights.push(rowHeights);
	}
	this.enableItemTransitions();
	//console.log("max row heights after translate ",maxRowHeights);

	return maxRowHeights;
}