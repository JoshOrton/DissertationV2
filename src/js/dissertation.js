
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

var ForListDiv = document.getElementById('ForListUL');
var StatementListDiv = document.getElementById('StatementListUL');
var AgainstListDiv = document.getElementById('AgainstListUL');
var arrStatement = ['Array Statement', ['Inner value 1', 'Inner value 2', 'Inner value 3', 'Inner value 4'], 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6'];
var arrFor = ['Array For', 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6'];
var arrAgainst = ['Array Against', ['Inner value 1', 'Inner value 2', 'Inner value 3', 'Inner value 4'], 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6'];

GenerateStatements(ForListDiv,arrFor);
GenerateStatements(StatementListDiv,arrStatement);
GenerateStatements(AgainstListDiv,arrAgainst);


function submitComment() {

}