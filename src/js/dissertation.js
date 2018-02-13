
//TODO CSS change ordered columns.
var ForListDiv = document.getElementById('ForListOL');
var StatementListDiv = document.getElementById('StatementListOL');
var AgainstListDiv = document.getElementById('AgainstListOL');

//TODO Perhaps grab this dynamically using AJAX request to Java backend
var statementArray = ['Brexit is shite', 'Immigration is horrible', 'Down with the Queen', 'There should be no encrpytion', 'Kill all humans', 'Kill all animals'];
var unformattedForArguments = ['Brexit is shite', 'Agree as means we can make our own rules', 'This can be broken if statement matches argument', 'Immigration is horrible', '-1 Disagree ', 'Down with the Queen', 'Id would not kill her dogs too', 'There should be no encrpytion', 'Edward Snowden is not a traitor', 'Kill all humans', 'Very extreme', 'Kill all animals', '-1 Animals are gorgeous'];
var unformattedAgainstArguments = ['Brexit is shite', 'Disagree as means we can make our own rules', 'This can be broken if statement matches argument', 'Immigration is horrible', '+ 1 agree ', 'Down with the Queen', 'Id kill her dogs too', 'There should be no encrpytion', 'Edward Snowden is a traitor', 'Kill all humans', 'Bit extreme but would save the planet', 'Kill all animals', '+1 taking up all humans space'];

var againstStatements = populateReasoningStatementArray(statementArray, unformattedAgainstArguments);
var forStatements = populateReasoningStatementArray(statementArray, unformattedForArguments);

populateStatementsAsUnorderedList(StatementListDiv, statementArray, false);

populateArgumentsAsUnorderedList(AgainstListDiv,againstStatements, true);
populateArgumentsAsUnorderedList(ForListDiv,forStatements,true);


$(StatementListDiv).click(function (event) {
    var statementId = event.target.parentNode.id.replace("li-id-","");
    hideAllDivElements(ForListDiv);
    hideAllDivElements(AgainstListDiv);

    showSpecifiedDivElements(ForListDiv, statementId);
    showSpecifiedDivElements(AgainstListDiv, statementId);

});

//TODO Worth just putting this in HTML, probs not actually.
function populateStatementsAsUnorderedList(div, arr, hiddenValue){
    for (var i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li');
        var anchorItem = document.createElement('a');
        listItem.id = 'li-id-' + i;
        listItem.hidden = hiddenValue;
        //anchorItem.setAttribute('href', "");
        anchorItem.innerHTML = arr[i];
        listItem.appendChild(anchorItem);
        div.appendChild(listItem);
    }
}

//TODO Another For loop for corresponding arrays within Statements.
function populateArgumentsAsUnorderedList(div, arr, hiddenValue){
    for (var i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li');
        listItem.id = 'li-id-' + i;
        listItem.hidden = hiddenValue;
        for(var j = 0; j < arr[i].length; j++){
            listItem.appendChild(populateArgumentStatements(i,j,arr));
            listItem.appendChild(populateButtonsForArguments(div.id));
        }
        div.appendChild(listItem);
    }
}
function populateArgumentStatements(i ,j, arr) {
    var textItem = document.createElement('p');
    textItem.id = 'pArguments';
    textItem.innerHTML = arr[i][j];
    return textItem;
}

function populateButtonsForArguments(divName) {
    var buttonStatement = document.createElement('button');
    var buttonId = "btn" + divName;
    buttonStatement.type = "button";
    buttonStatement.textContent = "Like / NO";
    buttonStatement.setAttribute("id", buttonId);
    return buttonStatement;
}

function hideAllDivElements(div) {
    for(var i = 0; i < div.childElementCount; i++){
        div.childNodes[i].hidden = true;
    }
}
function showSpecifiedDivElements(div, statementId) {
    div.childNodes[statementId].hidden = false;
}

//TODO Maybe don't need array index vs length check.
function populateReasoningStatementArray(statementArray, unformattedArgumentArray){
    var newList = [];
    var reasoningStatementList = [];
    var argumentIndex = 0;
    for (var i = 0; i < statementArray.length; i++) {
        do {
            if(isArgumentNotStatement(unformattedArgumentArray,argumentIndex,statementArray,i)) {
                newList = newList.concat(unformattedArgumentArray[argumentIndex]);
            }
            argumentIndex = argumentIndex + 1;
        } while((isArgumentForCurrentStatement(unformattedArgumentArray,argumentIndex,statementArray,i)) && argumentIndexInBounds(argumentIndex,unformattedArgumentArray));
        reasoningStatementList.push(newList);
        newList = [];
    }
    return reasoningStatementList;
}


function isArgumentNotStatement(unformattedArgumentArray, argumentIndex, statementArray, i){
    return unformattedArgumentArray[argumentIndex] != statementArray[i]
}
function isArgumentForCurrentStatement(unformattedArgumentArray, argumentIndex, statementArray, i) {
    return unformattedArgumentArray[argumentIndex] != statementArray[i+1];
}
function argumentIndexInBounds(argumentIndex, unformattedArgumentArray){
    return argumentIndex < unformattedArgumentArray.length;
}

