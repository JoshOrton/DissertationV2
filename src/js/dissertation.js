
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

$(ForListDiv).click(function (event) {
    var eventId = event.target.id.replace("pArguments-", "");
    var parentEventId = event.target.parentNode.id;
    parentEventId = parentEventId.substr(parentEventId.length-1);
    var btnElement = "btnFor-li-id-" + parentEventId + "-pArguments-" + eventId;
    var btnForListDiv = document.getElementById(btnElement);
    if(btnForListDiv.hidden === false) hideDiv(btnForListDiv);
    else showDiv(btnForListDiv,eventId);

});

$(AgainstListDiv).click(function (event) {
    var eventId = event.target.id.replace("pArguments-", "");
    var btnElement = "btnAgainstListOL-" + eventId;
    var btnAgainstListDiv = document.getElementById(btnElement);
    if(btnAgainstListDiv.hidden === false) hideDiv(btnAgainstListDiv);
    else showDiv(btnAgainstListDiv, eventId);
});

function showDiv(div) {
    div.hidden = false;
}
function hideDiv(div) {
    div.hidden = true
}

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

function populateArgumentsAsUnorderedList(div, arr, hiddenValue){
    //Do not need one for isAgaisntArguments, as by definition if it is not for this then must be agaisnt.
    //! converts from non boolean to Boolean
    // ! then inverts it.
    var isForArguments = !div.id.match("AgainstListOL");

    for (var i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li');
        listItem.setAttribute("forArgument", isForArguments);
        listItem.id = getlistItemId(listItem,i);
        listItem.hidden = hiddenValue;
        for(var j = 0; j < arr[i].length; j++){
            listItem.appendChild(populateArgumentStatements(i,j,arr));
            listItem.appendChild(populateButtonsForArguments(listItem.id, hiddenValue, j));
        }
        div.appendChild(listItem);
    }
}
function getlistItemId(listItem,i) {
    if (listItem.getAttribute("forArgument") === "true") {
        return 'For-li-id-'+i;
    } else {
       return 'Against-li-id-'+i;
    }


}

function populateArgumentStatements(i ,j, arr) {
    var textItem = document.createElement('p');
    textItem.id = 'pArguments-' + j;
    textItem.className = "pArgumentStyle";
    textItem.innerHTML = arr[i][j];
    return textItem;
}

function populateButtonsForArguments(parentNodeName, hiddenValue, j) {
    var buttonStatement = document.createElement('button');
    var buttonId = "btn" + parentNodeName + "-pArguments-" + j;
    var buttonClass = "btn" + parentNodeName.substr(0,parentNodeName.length-2);
    buttonStatement.type = "button";
    buttonStatement.hidden = hiddenValue;
    buttonStatement.textContent = "Like / NO";
    buttonStatement.id = buttonId;
    buttonStatement.className = buttonClass;
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

