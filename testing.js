'use strict';

window.onload = function () {
	
	var butEval   = document.getElementById("eval");
	var mathInp   = document.getElementById("math-string");
	var JSONBlock = document.getElementById("json-block");

	butEval.onclick = function() {
		var ME = new MathExpression(mathInp.value);
		if(ME == null)
			alert("Incorrect expression");
		else
			JSONBlock.innerHTML = ME.getJSONHtml();
	};
	
	var get = location.search;
	if(get !== ""){
		var vars   = (get.substr(1)).split('&');	
		var keyVal = [];
		var varObj = {};
		for (var i=0; i < vars.length; i++) {
			keyVal = vars[i].split('=');
			varObj[keyVal[0]] = keyVal[1];
		}
		JSONBlock = document.getElementById("json-block");
		mathInp.value = varObj.expression;
		var ME = new MathExpression(varObj.expression);
		if(!ME)
			alert("Incorrect expression");
		else
			JSONBlock.innerHTML = ME.getJSONHtml();
	}
		
}
	
