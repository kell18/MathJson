'use strict';

window.onload = function () {
	
	var butEval = document.getElementById("eval");
	var mathInp   = document.getElementById("math-string");
	var JSONBlock = document.getElementById("json-block");

	butEval.onclick = function() {
		var ME = new MathExpression(mathInp.value);
		if(ME == null)
			alert("Incorrect expression");
		else
			JSONBlock.innerHTML = ME.getHtml();
	};
		
}
	
