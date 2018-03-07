
//TODO Fix bug whereby respect and relevancy sliders appear wrongly.
//TODO Fix bug where comment appends to end of list rather than below next comment, probably down to fact that we look at the div at top and append, rather than individual divs.
//TODO Therefore we will probably need to either create a new Div for the first one, or a new function for new comments on comments, hopign that should do it.
//TODO NExt iteration, Twitter, Sources, and
//TODO Add source statements?
//TODO Add Twitter API somehow.


var ForListDiv = document.getElementById('ForListOL');
var StatementListDiv = document.getElementById('StatementListOL');
var AgainstListDiv = document.getElementById('AgainstListOL');

//TODO Perhaps grab this dynamically using AJAX request to Java backend, or through Twitter API?
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

function populateStatementsAsUnorderedList(div, arr, hiddenValue){
    for (var i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li');
        var paragraphItem = document.createElement('p');
        listItem.id = 'li-id-' + i;
        listItem.hidden = hiddenValue;
        paragraphItem.innerHTML = arr[i];
        paragraphItem.id = "p-" + i;
        listItem.appendChild(paragraphItem);
        div.appendChild(listItem);
    }
}

function populateArgumentsAsUnorderedList(div, arr, hiddenValue){
    //Do not need one for isAgaisntArguments, as by definition if it is not for this then must be agaisnt.
    //! converts from non boolean to Boolean
    // ! then inverts it.
    //TODO MAy need to change this.
    var isForArguments = !div.id.match("AgainstListOL");

    for (var statementIndex = 0; statementIndex < arr.length; statementIndex++) {
        var listItem = document.createElement('li');
        listItem.setAttribute("forArgument", isForArguments.toString());
        listItem.id = getlistItemId(listItem,statementIndex);
        listItem.hidden = hiddenValue;
        for(var argumentIndex = 0; argumentIndex < arr[statementIndex].length; argumentIndex++){
            var wrapperListItem = document.createElement('div');
            wrapperListItem.id  = getWrapperListItemId(listItem,statementIndex,argumentIndex);
            wrapperListItem.appendChild(populateArgumentStatements(statementIndex,argumentIndex,arr));
            wrapperListItem.appendChild(populateButtonsForArguments(wrapperListItem.id, hiddenValue, argumentIndex));
            wrapperListItem.appendChild(populateSliderForArguments("respect" , wrapperListItem.id, hiddenValue, argumentIndex));
            wrapperListItem.appendChild(populateSliderForArguments("relevancy", wrapperListItem.id, hiddenValue, argumentIndex));
            wrapperListItem.appendChild(populateTextAreaForArguments(wrapperListItem.id, hiddenValue, argumentIndex));
            listItem.appendChild(wrapperListItem);
            //TODO Add source submit text and css.
        }
        div.appendChild(listItem);
    }
}

function showDiv(div) {
    div.hidden = false;
}
function hideDiv(div) {
    div.hidden = true
}
function getlistItemId(listItem,i) {
    if (listItem.getAttribute("forArgument") === "true") {
        return 'For-li-id-'+i;
    } else {
       return 'Against-li-id-'+i;
    }
}
//TODO If use this one, need to update all child nodes CSS, / id.
//TODO Perhaps could add last item.
function getWrapperListItemId(listItem,i,j) {
    if (listItem.getAttribute("forArgument") === "true") {
        return 'For-li-id-'+i + '-' + j;
    } else {
        return 'Against-li-id-'+i + '-' + j;
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
    var buttonId = "btn" + parentNodeName + "-pArguments-" + j;
    var buttonClass = "btn" + parentNodeName.substr(0,parentNodeName.length-4);
    var buttonStatement = document.createElement('button');
    var initialButtonValue = ((11 * j)+6).toString();
    buttonStatement.type = "button";
    buttonStatement.setAttribute("ValueLike", initialButtonValue);
    buttonStatement.setAttribute("isLiked", "false");
    buttonStatement.hidden = hiddenValue;
    buttonStatement.id = buttonId;
    buttonStatement.className = buttonClass;
    buttonStatement.addEventListener("click", handleButtonToggle);
    buttonStatement.addEventListener("mouseover", handleButtonHover);
    buttonStatement.addEventListener("mouseout", handleButtonUnHover);
    return buttonStatement;

}

function populateSliderForArguments(currentNodeName,parentNodeName, hiddenValue, j) {
   var wrapper = document.createElement('div');
    wrapper.id = currentNodeName + "SliderWrapper" + parentNodeName + "-pArguments-" + j;
    wrapper.className = getSliderWrapperClassName(currentNodeName,parentNodeName);

    wrapper.hidden = hiddenValue;

    wrapper.appendChild(populateSliderElement(currentNodeName, parentNodeName, hiddenValue, j));
    wrapper.appendChild(populateSliderValueElement( currentNodeName, parentNodeName, j));

    return wrapper;
}
function getSliderWrapperClassName(currentNodeName, parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if(parentNodeName.toString().substr(0,1) === "A") lengthOfClassName = 13;

    return currentNodeName + "SliderWrapper" + parentNodeName.substr(0,lengthOfClassName) + " override";
}

function getSliderClassName(currentNodeName, parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if(parentNodeName.toString().substr(0,1) === "A") lengthOfClassName = 13;

    return currentNodeName + "Slider" + parentNodeName.substr(0,lengthOfClassName) + " override";
}

function getSliderValueClassName(currentNodeName, parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if(parentNodeName.toString().substr(0,1) === "A") lengthOfClassName = 13;

    return currentNodeName + "SliderValue" + parentNodeName.substr(0,lengthOfClassName) + " override";
}
function populateSliderElement(currentNodeName, parentNodeName, hiddenValue, j) {
    var sliderElement = document.createElement('input');
    var sliderId = currentNodeName + "Slider" + parentNodeName + "-pArguments-" + j;
    var sliderClass =  getSliderClassName(currentNodeName,parentNodeName);

    sliderElement.type  ="range";
    sliderElement.min = "1";
    sliderElement.max = "100";
    sliderElement.hidden = hiddenValue;
    sliderElement.background = "http://www.freeclipart.pw/uploads/2017/05/thumbs-up-in-blue-clip-art-at-clker--vector-clip-art-online--12.png";
    sliderElement.value = "50%";
    sliderElement.className = sliderClass;
    sliderElement.setAttribute("data-show-value","true");
    sliderElement.id = sliderId;
    sliderElement.addEventListener("change", handleSliderChange);
    sliderElement.addEventListener("input", handleSliderChange);
    sliderElement.addEventListener("mouseleave", handleSliderLeave);
    sliderElement.addEventListener("mouseover", handleSliderHover);

    return sliderElement;
    
}


function populateSliderValueElement(currentNodeName, parentNodeName, j, hiddenValue){
    var sliderElementValue = document.createElement('p');
    var sliderValueId = currentNodeName + "SliderValue" + parentNodeName + "-pArguments-" + j;
    var sliderValueClass =  getSliderValueClassName(currentNodeName,parentNodeName);

    sliderElementValue.hidden = hiddenValue;
    sliderElementValue.value = "50%";
    sliderElementValue.id = sliderValueId;
    sliderElementValue.className = sliderValueClass;
    sliderElementValue.innerHTML = sliderElementValue.value;

    return sliderElementValue;
}

function populateTextAreaForArguments(parentNodeName, hiddenValue, j) {
    var textAreaWrapper = document.createElement("div");
    textAreaWrapper.className = "TextAreaWrapper" + parentNodeName + "-pArguments-" + j;
    textAreaWrapper.id = "TextAreaWrapper" + parentNodeName.substr(0, parentNodeName.length - 4);

    textAreaWrapper.appendChild(populateTextAreaElement(parentNodeName, hiddenValue, j));
    textAreaWrapper.appendChild(populateSubmitTextAreaForArguments(parentNodeName,hiddenValue,j));

    return textAreaWrapper;
}
function populateTextAreaElement(parentNodeName, hiddenValue, j) {
    var textAreaElement = document.createElement("textarea");
    var textAreaId = "TextArea" + parentNodeName + "-pArguments-" + j;
    var textAreaClass = "TextArea" + parentNodeName.substr(0, parentNodeName.length - 4);
    textAreaElement.name = "comment";
    textAreaElement.id = textAreaId;
    textAreaElement.className = textAreaClass;
    textAreaElement.hidden = hiddenValue;
    textAreaElement.innerHTML = "Enter reply here...";
    textAreaElement.addEventListener("click", handleTextAreaClear);

    return textAreaElement;
}

function populateSubmitTextAreaForArguments(parentNodeName, hiddenValue, j) {
    var textAreaSubmit = document.createElement("input");
    var textAreaSubmitId = "submitTextArea" +parentNodeName + "-pArguments-" + j;
    var textAreaSubmitClass = "submitTextArea" + parentNodeName.substr(0, parentNodeName.length - 4);
    textAreaSubmit.type = "submit";
    textAreaSubmit.hidden = hiddenValue;
    textAreaSubmit.id = textAreaSubmitId;
    textAreaSubmit.className = textAreaSubmitClass;
    textAreaSubmit.addEventListener("click", handleSubmitTextArea);

    return textAreaSubmit;
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

function hideAllChildNodes(div) {
    for(var i = 0; i < div.childElementCount; i++){
        div.childNodes[i].hidden = true;
    }
}
function showDivChildNode(div, statementId) {
    div.childNodes[statementId].hidden = false;
}


function emboldenEvent(event){
    event.target.style.fontWeight = "bold";
}
function deBoldAllChildNodes(StatementListDiv) {
    for(var i = 0; i < StatementListDiv.childElementCount; i++){
        StatementListDiv.childNodes[i].childNodes[0].style.fontWeight ="";
    }

}
function handleButtonToggle(event){
    console.log(event.target.id);
    var buttonDiv = document.getElementById(event.target.id.toString());
    var currentButtonDivValue = parseInt(buttonDiv.getAttribute("ValueLike"));
    if(buttonDiv.getAttribute("isLiked") === "true"){
        currentButtonDivValue = currentButtonDivValue - 1;
        buttonDiv.setAttribute("isLiked", "false");
        buttonDiv.className = buttonDiv.className.toString().replace(" liked", "");
    } else {
        currentButtonDivValue = currentButtonDivValue + 1;
        buttonDiv.setAttribute("isLiked", "true");
        buttonDiv.className = buttonDiv.className + " liked";
    }

    buttonDiv.setAttribute("ValueLike",currentButtonDivValue.toString());

    $(buttonDiv).attr("data-original-title",buttonDiv.getAttribute("ValueLike"))
        .attr("trigger", "hover")
        .tooltip('show');


    if(buttonDiv.hidden === false) showDiv(buttonDiv); //TODO Perhaps toggle boolean change button to dislike, or undo perhaps.
    else showDiv(buttonDiv);

}
function handleButtonHover(event) {
    var buttonDiv = document.getElementById(event.target.id.toString());
    $(buttonDiv).attr("data-original-title",buttonDiv.getAttribute("ValueLike"))
        .attr("trigger", "hover")
        .tooltip('show');

    console.log(buttonDiv.getAttribute("ValueLike"));
}
function handleButtonUnHover(event) {
    var buttonDiv = document.getElementById(event.target.id.toString());
    $(buttonDiv).tooltip('hide');


}

function handleSliderChange(event) {
    console.log(event.target.id);
    var sliderElement = document.getElementById(event.target.id.toString());
    //sliderElement.childNodes[0].innerHTML = "Change " + sliderElement.value;
    sliderElement.parentNode.childNodes[1].className = "respectSliderValueAgainst-li-id:Hover override";
    sliderElement.parentNode.childNodes[1].innerHTML = sliderElement.value + "%";
    sliderElement.parentNode.childNodes[1].hidden = false;

}function handleSliderHover(event) {
    console.log(event.target.id);
    var sliderElement = document.getElementById(event.target.id.toString());
    sliderElement.parentNode.childNodes[1].innerHTML = sliderElement.value + "%";
    sliderElement.parentNode.childNodes[1].className = "respectSliderValueAgainst-li-id:Hover override";
    sliderElement.parentNode.childNodes[1].hidden = false;

}
function handleSliderLeave(event) {
    console.log(event.target.id);
    var sliderElement = document.getElementById(event.target.id.toString());
    sliderElement.parentNode.childNodes[1].innerHTML =  sliderElement.value + "%";
    sliderElement.parentNode.childNodes[1].className = "respectSliderValueAgainst-li-id override";
    sliderElement.parentNode.childNodes[1].hidden = false;

}
function handleTextAreaClear(event) {
    var textAreaElement = document.getElementById(event.target.id);
    if(textAreaElement.innerHTML === "Enter reply here...") textAreaElement.innerHTML = "";
}

function handleSubmitTextArea(event) {
    var textAreaElement = document.getElementById(event.target.parentNode.childNodes[0].id);
    var textAreaText = textAreaElement.value.toString();
    clearTextBox(textAreaElement, textAreaText);
    addComment(textAreaElement,textAreaText);

}
function clearTextBox(textBoxDiv, textAreaText) {
    if(!(textAreaText ==="")){
        textBoxDiv.value = "";
        console.log("AddComments and populate text");
        var relatedDiv = event.target.parentNode.classList[0];
        var relatedArgumentValue = relatedDiv.slice(relatedDiv.length-1, relatedDiv.length);
        console.log(relatedArgumentValue);
    }
}
//TODO Add other sliders and buttons, and id to this.
function addComment(textBoxDiv, textAreaText) {
    var replyWrapper = document.createElement('div');
    var originalPost = textBoxDiv.parentNode.parentNode;
    var numberOfPreviousReplies = getNumberOfPreviousReplies(originalPost.id);
    var hiddenValue = false;

    replyWrapper.id = getReplyNumber(originalPost.id,numberOfPreviousReplies);

    //Annoying to reuse have to put text into 2D array, maybe write new function.
    replyWrapper.appendChild(populateArgumentStatements(0,0,[[textAreaText]]));
    replyWrapper.appendChild(populateButtonsForArguments(replyWrapper.id, hiddenValue, numberOfPreviousReplies));
    replyWrapper.appendChild(populateSliderForArguments("respect" , replyWrapper.id, hiddenValue, numberOfPreviousReplies));
    replyWrapper.appendChild(populateSliderForArguments("relevancy", replyWrapper.id, hiddenValue, numberOfPreviousReplies));
    replyWrapper.appendChild(populateTextAreaForArguments(replyWrapper.id, hiddenValue, numberOfPreviousReplies));

    // Inside wrapperDiv for original comment.
    textBoxDiv.parentNode.parentNode.appendChild(replyWrapper);
}
function getReplyNumber(originalPost, numberOfPreviousReplies){
    return originalPost.toString() + "-" + numberOfPreviousReplies.toString();
}
function getNumberOfPreviousReplies(originalPostId) {
   return $('[id^='+originalPostId+']').length;
}

function paragraphToggleHandler(event) {
    var eventId = event.target.id;
    var parentEventId = event.target.parentNode.id;

    toggleButtonDiv(eventId, parentEventId);
    toggleRespectSliderDiv(eventId, parentEventId);
    toggleRelevancySliderDiv(eventId,parentEventId);
    toggleTextArea(eventId, parentEventId);

}
function toggleButtonDiv(eventId, parentEventId) {
    var btnElement = "btn" + parentEventId + "-" + eventId;
    var btnWrapperElement = "btnWrapper" + parentEventId + "-" + eventId;
    var btnWrapperDiv = document.getElementById(btnWrapperElement);
    var btnDiv = document.getElementById(btnElement);

    if(btnDiv.hidden === false) hideDiv(btnDiv);
    else showDiv(btnDiv);

}

function toggleRespectSliderDiv(eventId,parentEventId) {
    var respectSliderWrapperElement = "respectSliderWrapper" + parentEventId + "-" + eventId;
    var respectSliderWrapperDiv = document.getElementById(respectSliderWrapperElement);
    var respectSliderValueElement ="respectSliderValue" + parentEventId + "-" + eventId;
    var respectSliderValueDiv = document.getElementById(respectSliderValueElement);
    var respectSliderElement = "respectSlider" + parentEventId + "-" + eventId;
    var respectSliderDiv = document.getElementById(respectSliderElement);

    if(respectSliderDiv.hidden === false) {
        hideDiv(respectSliderDiv);
        hideDiv(respectSliderValueDiv);
        hideDiv(respectSliderWrapperDiv);
    }
    else {
        showDiv(respectSliderDiv);
        showDiv(respectSliderValueDiv);
        showDiv(respectSliderWrapperDiv);
    }
}

function toggleTextArea(eventId, parentEventId) {
    var textAreaElement = "TextArea" + parentEventId + "-" + eventId;
    var submitTextAreaElement = "submitTextArea" + parentEventId + "-" + eventId;

    var textAreaDiv = document.getElementById(textAreaElement);
    var submitTextAreaDiv = document.getElementById(submitTextAreaElement);

    if(textAreaDiv.hidden === false) hideDiv(textAreaDiv);
    else showDiv(textAreaDiv);

    if(submitTextAreaDiv.hidden === false) hideDiv(submitTextAreaDiv);
    else showDiv(submitTextAreaDiv);

}

function toggleRelevancySliderDiv(eventId, parentEventId) {
    var relevancySliderValueElement = "relevancySliderValue" + parentEventId + "-" + eventId;
    var relevancySliderWrapperElement = "relevancySliderWrapper" + parentEventId + "-" + eventId;
    var relevancySliderElement = "relevancySlider" + parentEventId + "-" + eventId;
    var relevancySliderDiv = document.getElementById(relevancySliderElement);
    var relevancySliderValueDiv = document.getElementById(relevancySliderValueElement);
    var relevancySliderWrapperDiv = document.getElementById(relevancySliderWrapperElement);
    if(relevancySliderDiv.hidden === false){
        hideDiv(relevancySliderDiv);
        hideDiv(relevancySliderValueDiv);
        hideDiv(relevancySliderWrapperDiv);
    }
    else {
        showDiv(relevancySliderDiv);
        showDiv(relevancySliderValueDiv);
        showDiv(relevancySliderWrapperDiv);
    }
}

$(StatementListDiv).click(function (event) {
    var statementId = event.target.parentNode.id.replace("li-id-","");
    hideAllChildNodes(ForListDiv);
    hideAllChildNodes(AgainstListDiv);
    deBoldAllChildNodes(StatementListDiv);

    showDivChildNode(ForListDiv, statementId);
    showDivChildNode(AgainstListDiv, statementId);

    emboldenEvent(event);

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