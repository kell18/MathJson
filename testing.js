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
			JSONBlock.innerHTML = ME.getJSONHtml();
	};
	
	var get = location.search;
	if(get !== ""){
		var tmp1 = (get.substr(1)).split('&');	// разделяем переменные
		var tmp2 = [];
		var param = {};
		for(var i=0; i < tmp1.length; i++) {
			tmp2 = tmp1[i].split('=');		// массив param будет содержать
			param[tmp2[0]] = tmp2[1];		// пары ключ(имя переменной)->значение
		}
		JSONBlock = document.getElementById("json-block");
		mathInp.value = param.expression;
		var ME = new MathExpression(param.expression);
		if(!ME)
			alert("Incorrect expression");
		else
			JSONBlock.innerHTML = ME.getJSONHtml();
	}
		
}
	
