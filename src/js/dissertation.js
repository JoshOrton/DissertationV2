

var ForListDiv = document.getElementById('ForListUL');
var StatementListDiv = document.getElementById('StatementListUL');
var AgainstListDiv = document.getElementById('AgainstListUL');

var statementArray = ['Brexit is shite', 'Immigration is horrible', 'Down with the Queen', 'There should be no encrpytion', 'Kill all humans', 'Kill all animals'];
var unformattedForArguments = ['Brexit is shite', 'Agree as means we can make our own rules', 'This can be broken if statement matches argument', 'Immigration is horrible', '-1 Disagree ', 'Down with the Queen', 'Id would not kill her dogs too', 'There should be no encrpytion', 'Edward Snowden is not a traitor', 'Kill all humans', 'Very extreme', 'Kill all animals', '-1 Animals are gorgeous'];
var unformattedAgainstArguments = ['Brexit is shite', 'Disagree as means we can make our own rules', 'This can be broken if statement matches argument', 'Immigration is horrible', '+ 1 agree ', 'Down with the Queen', 'Id kill her dogs too', 'There should be no encrpytion', 'Edward Snowden is a traitor', 'Kill all humans', 'Bit extreme but would save the planet', 'Kill all animals', '+1 taking up all humans space'];

var againstStatements = populateReasoningStatementArray(statementArray, unformattedAgainstArguments);
var forStatements = populateReasoningStatementArray(statementArray, unformattedForArguments);

printArrayInDiv(StatementListDiv, statementArray);
printArrayInDiv(AgainstListDiv, againstStatements);
printArrayInDiv(ForListDiv, forStatements);
console.log(statementArray.length);
console.log(forStatements[4]);
console.log(statementArray);
console.log(againstStatements);


function printArrayInDiv(div, arr) {
    for (var i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li');
        var anchorItem = document.createElement('a');
        var arrayValue = arr[i];
        anchorItem.setAttribute('href', "http://www.msn.com");
        anchorItem.innerHTML = arrayValue;
        listItem.appendChild(anchorItem);
        div.appendChild(listItem);
    }
}

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
        //Maybe can remove length part, as when both each end of array they both equal undefined..
        //TODO cleanup above and try to generalise for many arrays.
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

