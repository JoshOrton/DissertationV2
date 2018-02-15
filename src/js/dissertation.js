
//TODO CSS change ordered columns.
var ForListDiv = document.getElementById('ForListOL');
var StatementListDiv = document.getElementById('StatementListOL');
var AgainstListDiv = document.getElementById('AgainstListOL');

//TODO Perhaps grab this dynamically using AJAX request to Java backend
var statementArray = ['Brexit is a bad idea',
    'Immigration is ruining our culture',
    'I am so proud of our queen',
    'There should be no privacy, if it means catching terrorists',
    'Global warming is our fault',
    'I should be able to eat whatever animal I want.'];
var unformattedForArguments = ['Brexit is a bad idea', 'Agree as it means leaving the single market', 'It could cost our economy loads',
    'Immigration is ruining our culture', '+1 Agree I cant go down my high street without seeing an immigrant',
    'I am so proud of our queen', 'Shes done our country the world of good.',
    'There should be no privacy, if it means catching terrorists', 'Agree catch those damn terrorists, if you have nothing to fear you have nothing to hide',
    'Global warming is our fault', 'Totally agree we should monitor how much we use.',
    'I should be able to eat whatever animal I want.', 'We are the top of the food chain, therefore I can eat Rhino if I want to.'];
var unformattedAgainstArguments = ['Brexit is a bad idea', 'Disagree as means we can make our own rules', 'Also results in uncontrolled immigration',
    'Immigration is ruining our culture', 'Immigration brings loads of new culture that expands our world view.',
    'I am so proud of our queen',  'I disagree with the monarchy regardless',
    'There should be no privacy, if it means catching terrorists', 'Privacy is our right, it should not be thrown away',
    'Global warming is our fault', 'Rubbish, scientists just trying to earn a big grant',
    'I should be able to eat whatever animal I want.', 'Horrible, we share this planet with them, we are no more important than them.'];

var againstStatements = populateReasoningStatementArray(statementArray, unformattedAgainstArguments);
var forStatements = populateReasoningStatementArray(statementArray, unformattedForArguments);

populateStatementsAsUnorderedList(StatementListDiv, statementArray, false);

populateArgumentsAsUnorderedList(AgainstListDiv,againstStatements, true);
populateArgumentsAsUnorderedList(ForListDiv,forStatements,true);


$(StatementListDiv).click(function (event) {
    var statementId = event.target.parentNode.id.replace("li-id-","");
    hideAllDivElements(ForListDiv);
    hideAllDivElements(AgainstListDiv);

    showDivChildNodes(ForListDiv, statementId);
    showDivChildNodes(AgainstListDiv, statementId);

});

$(ForListDiv).click(function (event) {
    //TODO Formats are not probably as nice, but change when crossing this brige.
    var eventName = event.target.id.slice(0,event.target.id.length-2);
    if(eventName === "pArguments") paragraphToggleHandler(event);
});

$(AgainstListDiv).click(function (event) {
    var eventName = event.target.id.slice(0,event.target.id.length-2);
    if(eventName === "pArguments") paragraphToggleHandler(event);
});

function paragraphToggleHandler(event) {
    var eventId = event.target.id;
    var parentEventId = event.target.parentNode.id;
    var btnElement = "btn" + parentEventId + "-" + eventId;
    var btnDiv = document.getElementById(btnElement);

    if(btnDiv.hidden === false) hideDiv(btnDiv);
    else showDiv(btnDiv, eventId);
}

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
    buttonStatement.textContent = "Like";
    buttonStatement.id = buttonId;
    buttonStatement.className = buttonClass;
    return buttonStatement;
}

function hideAllDivElements(div) {
    for(var i = 0; i < div.childElementCount; i++){
        div.childNodes[i].hidden = true;
    }
}
function showDivChildNodes(div, statementId) {
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

