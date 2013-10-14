/*
*	@autor - Albert Bikeev
*	
*	MathExpression - class for converting mathematical sring into object. 
*	For example: 4 + 6 -> { operand1: "4", operand2: "6", operation: + }
*
*/
var MathExpression = function(_mathLine) {
	var varMLine = _mathLine;

	var exprObj  = {};  // resulting JSON obj 
	var exprArr = [];

	var tokensRegExp = "";

	var execOrder = {
		BRACKETS : {
			token: "0",
			regexp : "(?![(])(\\d+_)?\\d+[*/+\-](\\d+_)?\\d+(?=[)])"
		},
		MULTIPLICATIVE : {
			token: "1",
			regexp : "(\\d+_)?\\d+[*/](\\d+_)?\\d+"
		},
		ADDITIVE : {
			token: "2",
			regexp : "(\\d+_)?\\d+[+\-](\\d+_)?\\d+"
		}
	};

	this.getHtml = function(objFilter, iIdent) {
		var html = "<div>";
		for(var key in objFilter){
			html += "<p>" + key + ": " + objFilter[key] + "</p>";
		}
		return html+"</div>";
	};

	var getJSONExpr = function(objFilter, iIdent) {
		var fo  = objFilter || null;
		var ind = iIdent || 4;
		return JSON.stringify(exprObj, fo, ind);
	};
	var getObjExpr = function() {
		return exprObj;
	};
	var logExp = function(objFilter, iIdent) {
		var fo  = objFilter || null;
		var ind = iIdent || 4;
		console.log(JSON.stringify(exprObj, fo, ind));
	};
	/* Remove surrounding brackets of sExpr in @sLine */
	var rmBracketsNearExpr = function(sLine, sExpr) {
		sLine = sLine.replace(new RegExp("[(](?=(" + screening(sExpr) + "))"), "");
		sLine = sLine.replace(new RegExp("(?!(" + screening(sExpr) + "))[)]"), "");
		return sLine;
	};
	/* Screening the special simbols of @sLine */
	var screening = function(sLine) {
	    return sLine.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}

	var getExprArray = function(sRegexp, tokenNum) {
		var rgxp = new RegExp(sRegexp, "g");
		var exprArr = new Array();
		var expr = rgxp.exec(varMLine);
		var i = 0;
		while (expr !== null) {
			varMLine = rmBracketsNearExpr(varMLine, expr[0]);
			rgxp.lastIndex = 0;
			exprArr.push(expr[0]);
			varMLine = varMLine.replace(expr[0], tokenNum+"_"+i);
			expr = rgxp.exec(varMLine);
			i++;
		};
		// console.log("Совпадения: " + exprArr + "   " + varMLine);
		return exprArr;
	};

	var buildOperations = function(token, objContext) {

		var expression = tokenTobjExpr(token);
		var operation  = new RegExp("(?!((\\d+_)?\\d))[*/+\\-](?=((\\d+_)?[0-9]))").exec(expression)[0];
        var operands   = expression.split(operation);

        objContext.operand1  = operands[0];
        objContext.operand2  = operands[1];
        objContext.operation = operation;

        if(operands[0].search("\\d+_") !== -1) {
        	objContext.operand1 = {};
        	buildOperations(operands[0], objContext.operand1);
        }
        if(operands[1].search("\\d+_") !== -1) {
        	objContext.operand2 = {};
        	buildOperations(operands[1], objContext.operand2);
        }

	};

	var tokenTobjExpr = function(token) {
		if(!token) 
			return "";
		if(token.search(tokensRegExp) === -1)
			return token;
		var tokenNum = new RegExp("\\d+(?=(_\\d+))").exec(token)[0];
		var exprNum  = new RegExp("(?!(\\d+_))\\d+").exec(token)[0];		
		return exprArr[tokenNum][exprNum];
	};




	var __construct__ = function() {
		try {
			if(!_mathLine)
				throw new Error("Incorrect expression: "+_mathLine);
			if(_mathLine.search("[^0-9a-zA-Z()+\\-*/%^| ]") !== -1)
				throw new Error("Incorrect expression: "+_mathLine);

			console.log(_mathLine);
			varMLine  = _mathLine.replace(/\s+/g, '');

			var i = 0;
			for(key in execOrder) {
				exprArr[i] = getExprArray(execOrder[key].regexp, i);
				i++;
			}
			buildOperations(varMLine, exprObj);
			console.log(JSON.stringify(exprObj, null, 4));
		}
		catch(e) {
			console.log(e.stack);
			alert(e.message);
		}
};


