/*
 *  @autor - Albert Bikeev
 *
 *  MathExpression - class for converting mathematical sring into object (JSON three).
 *
 */
function MathExpression(stringMathLine) {
    var sMathLine = stringMathLine || null,
        exprJSON  = {},
        exprArr   = [],
        tokensRegExp = "(\\d+_\\d+)",
        // Object of list operations with regexp & hierarchy
        execOrder = {
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
    /* Recurrent method to generate idented HTML stucture */
    var getJSONHtml = function (object, depth) {
        var obj = object || exprJSON;
        var dep = depth  || 4;
        var html = "{<div>";
        var insSpaces = function (count) {
            var spaces = "";
            for(var i = 0; i < count; i++)
                spaces += "&nbsp;";
            return spaces;
        };
        for(var key in obj){
            if(typeof(obj[key]) == "object")
                html += insSpaces(depth)+key+": <span class='key'>"+this.getJSONHtml(obj[key], dep+4)+"</span>";
            else
                html += insSpaces(depth)+key+": <span class='key'>"+obj[key]+"</span></br>";
        }
        return html+"</div>"+insSpaces(depth)+"}</br>";
    };
    /* Returns string in JSON format */
    var getJSONString = function (objFilter, iIdent) {
        var fo  = objFilter || null;
        var ind = iIdent || 4;
        return JSON.stringify(exprJSON, fo, ind);
    };
    /* Returns string in JS object format */
    var getJSONObj = function() {
        return exprJSON;
    };
    /* Screening the special simbols of @sLine */
    var screening = function (sLine) {
        return sLine.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    /* Remove surrounding brackets of sExpr in @sLine */
    var rmBracketsNearExpr = function(sLine, sExpr) {
        sLine = sLine.replace(new RegExp("[(](?=(" + screening(sExpr) + "))"), "");
        sLine = sLine.replace(new RegExp("(?!(" + screening(sExpr) + "))[)]"), "");
        return sLine;
    };
    /* Get cell from exprArray[i][j] by token: "i_j" */
    var tokenToExpr = function (token) {
        if(!token)
            return "";
        if(token.search(tokensRegExp) === -1)
            return token;
        var tokenNum = new RegExp("\\d+(?=(_\\d+))").exec(token)[0];
        var exprNum  = new RegExp("(?!(\\d+_))\\d+").exec(token)[0];
        return exprArr[tokenNum][exprNum];
    };
    /* Generate exprexxion array from sMathLine by sRegexp
     * and substitude matched expr-s by tokens */
    var getExprArray = function (sRegexp, tokenNum) {
        var rgxp = new RegExp(sRegexp, "g");
        var exprArr = new Array();
        var expr = rgxp.exec(sMathLine);
        var i = 0;
        while (expr !== null) {
            sMathLine = rmBracketsNearExpr(sMathLine, expr[0]);
            rgxp.lastIndex = 0;
            exprArr.push(expr[0]);
            sMathLine = sMathLine.replace(expr[0], tokenNum+"_"+i);
            expr = rgxp.exec(sMathLine);
            i++;
        };
        return exprArr;
    };
    /* Recurrently generates JSON object */
    var buildOperations = function (token, objContext) {
        var obj = objContext || exprJSON;
        var expression = tokenToExpr(token);
        var operation  = new RegExp("(?!((\\d+_)?\\d))[*/+\\-](?=((\\d+_)?[0-9]))").exec(expression)[0];
        var operands   = expression.split(operation);
        obj.operand1  = operands[0];
        obj.operand2  = operands[1];
        obj.operation = operation;
        // if operands[n] is token recurrently call this fun
        if(operands[0].search(tokensRegExp) !== -1) {
            obj.operand1 = {};
            buildOperations(operands[0], obj.operand1);
        }
        if(operands[1].search(tokensRegExp) !== -1) {
            obj.operand2 = {};
            buildOperations(operands[1], obj.operand2);
        }
    };

    var constructor = (function() {
        try {
            if((typeof sMathLine !== "string") || !sMathLine)
                throw new Error("Incorrect expression: "+sMathLine);
            if(sMathLine.search("[^0-9a-zA-Z()+\\-*/%^| ]&\n") !== -1)
                throw new Error("Incorrect expression: "+sMathLine);
            sMathLine  = sMathLine.replace(/\s+|\n+/g, '');
            var i = 0;
            for(key in execOrder) {
                exprArr[i] = getExprArray(execOrder[key].regexp, i);
                i++;
            }
            buildOperations(sMathLine, exprJSON);
        }
        catch(e) {
            console.log(e);
            alert(e.message);
        }
    })();
    return {
        getJSONHtml: getJSONHtml,
        getJSONString: getJSONString,
        getJSONObj: getJSONObj
    };
};