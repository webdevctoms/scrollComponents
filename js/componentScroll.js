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
	for(var i = 0;i < this.activeItemIndexesArray.length;i++){
		var maxHeight = 0;
		for(var k = 0; k < this.scrollArray[i].length;k++){
			for(var j = 0;j < this.scrollArray[i][k].length; j++){
				//console.log(this.scrollArray[i][k][j].scrollHeight);
				if(this.scrollArray[i][k][j].scrollHeight > maxHeight){
					maxHeight = this.scrollArray[i][k][j].scrollHeight;
				}
			}
		}
		this.scrollComponents[i].style.height = maxHeight + "px";
		//10 for margin
		newHeight += maxHeight;
	}
	console.log(newHeight);
	this.adjustArrows();
	this.dropdown.windowResized();
}

ScrollComponent.prototype.adjustArrows = function(){
	for(var i =0; i < this.scrollComponents.length; i++){
		console.log(this.scrollComponents[i].style.height);
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
	this.dropdown.windowResized();
}
//will need to resize the scroll "view" when changing elements
ScrollComponent.prototype.resizeScrollView = function(){

}