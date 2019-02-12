function ScrollComponent(scrollComponentClass,leftArrowClass,rightArrowClass,dropdownRef){
	this.scrollComponents = document.getElementsByClassName(scrollComponentClass);
	this.plusButtons = document.getElementsByClassName(leftArrowClass);
	this.minusButtons = document.getElementsByClassName(rightArrowClass);
	//reference to the previously created dropdown object 
	this.dropdown = dropdownRef;
	this.scrollArray = [];
	this.activeItemIndexesArray = [];
	console.log(this.scrollComponents,this.plusButtons,this.minusButtons);
	this.initScrollArray(3);
	console.log(this.scrollArray);
}

ScrollComponent.prototype.initScrollArray = function(columns){
	for(var i = 0;i < this.scrollComponents.length;i++){
		var scrollData = [];
		var columnArray = [];
		for(var k = 0;k <= this.scrollComponents[i].children.length;k++){
			console.log(columnArray,columnArray.length,k);
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

		this.scrollArray.push(scrollData);
	}
}

ScrollComponent.prototype.setViewHeight = function(){

}