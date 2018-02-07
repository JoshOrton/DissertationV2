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


function populateReasonsAgainst(statementArray, againstArray, reasoningStatementList) {
    var newList = [];
    var j = 0;
    for (var i = 0; i < statementArray.length; i++) {

        do {
            if(againstArray[j] != statementArray[i]) {
                console.log("AgainstArray: ", j, " ", againstArray[j]);
                console.log("StatementArray[i+1]: ", i + 1, " ", statementArray[i + 1]);
                console.log("StatementArray[i]: ", i, " ", statementArray[i]);
                newList= newList.concat(againstArray[j]);
            }
            j = j + 1;
        } while(((againstArray[j] != statementArray[i+1]) && j < againstArray.length));
        //Maybe can remove length part, as when both each end of array they both equal undefined..
        //TODO cleanup above and try to generalise for many arrays.
        reasoningStatementList.push(newList);
        newList = [];
    }
}

var ForListDiv = document.getElementById('ForListUL');
var StatementListDiv = document.getElementById('StatementListUL');
var AgainstListDiv = document.getElementById('AgainstListUL');
var statementArray = ['Brexit is shite', 'Immigration is horrible', 'Down with the Queen', 'There should be no encrpytion', 'Kill all humans', 'Kill all animals'];
var againstStatements = [];
var forStatements = [];

var arrayFor = ['Brexit is shite', 'Agree as means we can make our own rules', 'This can be broken if statement matches argument', 'Immigration is horrible', '-1 Disagree ', 'Down with the Queen', 'Id would not kill her dogs too', 'There should be no encrpytion', 'Edward Snowden is not a traitor', 'Kill all humans', 'Very extreme', 'Kill all animals', '-1 Animals are gorgeous'];

var arrayAgainst = ['Brexit is shite', 'Disagree as means we can make our own rules', 'This can be broken if statement matches argument', 'Immigration is horrible', '+ 1 agree ', 'Down with the Queen', 'Id kill her dogs too', 'There should be no encrpytion', 'Edward Snowden is a traitor', 'Kill all humans', 'Bit extreme but would save the planet', 'Kill all animals', '+1 taking up all humans space'];

populateReasonsAgainst(statementArray, arrayAgainst, againstStatements);
populateReasonsAgainst(statementArray,arrayFor, forStatements);

printArrayInDiv(StatementListDiv, statementArray);
printArrayInDiv(AgainstListDiv, againstStatements);
printArrayInDiv(ForListDiv, forStatements);
console.log(statementArray.length);
console.log(arrayFor[4]);
console.log(statementArray);
console.log(againstStatements);
console.log(arrayAgainst);
