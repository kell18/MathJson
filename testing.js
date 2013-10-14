'use strict';

window.onload = function () {
	var mathInp   = document.getElementById("math-string");
	var JSONBlock = document.getElementById("json-block");
	var ME = new MathExpression(mathInp.text);
	JSONBlock.innerHTML = ME;

