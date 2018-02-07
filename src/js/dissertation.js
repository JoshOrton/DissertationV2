
function GenerateStatements(div, arr) {
    for(var i = 0; i<arr.length; i++) {
        var listItem = document.createElement('li');
        var anchorItem = document.createElement('a');
        var arrayValue = arr[i];
        anchorItem.setAttribute('href', "http://www.msn.com");
        anchorItem.innerHTML = arrayValue;
        listItem.appendChild(anchorItem);
        div.appendChild(listItem);
    }
}
function populateReasonsFor(div, arr){
    Statement[i].forList, AgainstList
    arrayFor.push(['FirstStatementReason1','FirstStatementReason2','FirstStatementReason3','FirstStatementReason4']);
    arrayFor.push(['SecondStatementReason1','SecondStatementReason2','SecondStatementReason3','SecondStatementReason4','SecondStatementReason5']);

}

function populateReasonsAgainst(statementArray, againstArray) {
    var newList = [];
    for(var i = 0; i < statementArray.length; i++) {
        for(var j = 0; j< againstArray.length;j++) {
            newList= newList.concat(arrayAgainst[j]);
        }
        statementArray.push(newList[i]);
    }
}

var ForListDiv = document.getElementById('ForListUL');
var StatementListDiv = document.getElementById('StatementListUL');
var AgainstListDiv = document.getElementById('AgainstListUL');
var arrStatement = ['Brexit is shite', 'Immigration is horrible', 'Down with the Queen', 'There should be no encrpytion', 'Kill all kids', 'Kill all animals'];


var arrayFor = [];
var arrayAgainst = [];



var arrFor = ['Array For', 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6'];
var arrAgainst = ['Array Against', 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6'];

GenerateStatements(ForListDiv,arrFor);
GenerateStatements(StatementListDiv,arrStatement);
GenerateStatements(AgainstListDiv,arrAgainst);
console.log(arrStatement.length);
console.log(arrayFor[1][4]);
