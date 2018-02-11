
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

populateStatementsAsUnorderedList(AgainstListDiv,againstStatements,true );
populateStatementsAsUnorderedList(ForListDiv,forStatements, true);

//TODO generate statements for once clicked on statement.
//populateStatementsAsUnorderedList(AgainstListDiv, againstStatements);
//populateStatementsAsUnorderedList(ForListDiv, forStatements);

console.log(statementArray.length);
console.log(forStatements[4]);
console.log(statementArray);
console.log(againstStatements);

$(StatementListDiv).click(function (event) {
    //TODO Clear Statement, For and Against.
    hideArrayAsUnorderedList(ForListDiv);
    hideArrayAsUnorderedList(AgainstListDiv);
    /*populateStatementsAsUnorderedList(AgainstListDiv,againstStatements[statementId]);
    populateStatementsAsUnorderedList(ForListDiv,forStatements[statementId]);*/
    var text = $(event.target).text();
    var statementId= event.target.parentNode.id.replace("li-id-","");
    populateStatementsAsUnorderedList(ForListDiv, forStatements[statementId]);
    populateStatementsAsUnorderedList(AgainstListDiv, againstStatements[statementId]);
    console.log(text);
});


// Print specified Array into specified div as unordered List.

//More like populate really.
function populateStatementsAsUnorderedList(div, arr){
    for (var i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li');
        var anchorItem = document.createElement('a');
        listItem.id = 'li-id-' + i;
        //anchorItem.setAttribute('href', "");
        anchorItem.innerHTML = arr[i];
        listItem.appendChild(anchorItem);
        div.appendChild(listItem);
    }
}

function hideArrayAsUnorderedList(div) {
    div.style.display = "none";
}
function showArrayAsUnorderedList(div) {
    div.style.display = ""
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

