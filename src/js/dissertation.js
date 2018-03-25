
//TODO Future Work: Setup Post and Get for Databases to grab Values using AJAX requests.
//TODO            : Fade in and out transition between Statements and Pros and Cons
//TODO            : Add filtering on the WordCloud, making it clear what size represents.



var ForListDiv = document.getElementById('ForListOL');
var StatementListDiv = document.getElementById('StatementListOL');
var AgainstListDiv = document.getElementById('AgainstListOL');
var backToStatementsButton = document.getElementById('backToStatements');

var ForListDivWrapper = document.getElementById('ForListWrapper');
var AgainstListDivWrapper = document.getElementById('AgainstListWrapper');
var StatementListDivWrapper = document.getElementById('StatementListWrapper');



//TODO Grab this dynamically using AJAX request to Java backend? Rather than Hardcoded.
//TODO For now as won't change user studies leave for later date.
var statementArray = ['Brexit will probably be a decision we regret',
    'Immigration is damaging to our British culture',
    'The Queen does so much for our country',
    'Catching terrorists should come before our right to privacy',
    'Global warming is the fault of humans',
    'Lecturers should not be striking'];
var unformattedForArguments = ['Brexit will probably be a decision we regret', 'I Agree as it means leaving the single market', 'It could be very damaging to our economy',
    'Immigration is damaging to our British culture', '+1 Agree I cant go down my high street without seeing an immigrant',
    'The Queen does so much for our country', 'Shes done our country and other nations the world of good.',
    'Catching terrorists should come before our right to privacy', 'Agree catch those damn terrorists, if you have nothing to fear you have nothing to hide',
    'Global warming is the fault of humans', 'Totally agree we should monitor how much fossil fuels we produce.',
    'Lecturers should not be striking', 'I agree they are being selfish and insensitive to the needs of their students'];
var unformattedAgainstArguments = ['Brexit will probably be a decision we regret', 'I disagree with your point, as means we can make our own rules', 'I respect your opinion but it being in the EU means no control over our borders',
    'Immigration is damaging to our British culture', 'Immigration brings loads of new culture, we should not be inwardly thinking but looking outwards for growth of culture.',
    'The Queen does so much for our country', 'In todays society, there is no place for a monarchy',
    'Catching terrorists should come before our right to privacy', 'Privacy is our right, it should not be thrown away for a minority, although despicable number of people',
    'Global warming is the fault of humans', 'I find it hard to grasp how its not just nature doing its thing, its done this in the past heated up and cooled down.',
    'Lecturers should not be striking', 'I disagree although it may be us the students who are suffering they are trying to minimise that, they are losing £10k a year from their pensions!'];
function initialiseWebPageContent() {
    var againstStatements = populateReasoningStatementArray(statementArray, unformattedAgainstArguments);
    var forStatements = populateReasoningStatementArray(statementArray, unformattedForArguments);

    populateStatementsAsUnorderedList(StatementListDiv, statementArray, false);

    populateArgumentsAsUnorderedList(AgainstListDiv, againstStatements, true);
    populateArgumentsAsUnorderedList(ForListDiv, forStatements, true);

    populateWordCloud();

    //Hardcoding this for interviews to give idea of how to interact on website and how to provide sources.
    addComment(document.getElementById("TextAreaFor-li-id-0-1-0-pArguments-1"),  "Please could you possibly provide a source to backup your statement on how it could be very damaging to our economy?", true);
    addComment(document.getElementById("TextAreaFor-li-id-0-1-0-1-pArguments-1"),  "Sure so one example of this can be seen by the report done by the director of Institute of Fiscal Studies, Paul Johnson regarding food prices /source='https://www.ifs.org.uk/publications/9562 ", true);
}



//TODO Change this surely to make an AJAX call to a Java function to handle this on server rather than client side.
function populateReasoningStatementArray(statementArray, unformattedArgumentArray) {
    var newList = [];
    var reasoningStatementList = [];
    var argumentIndex = 0;
    for (var i = 0; i < statementArray.length; i++) {
        do {
            if (isArgumentNotStatement(unformattedArgumentArray, argumentIndex, statementArray, i)) {
                newList = newList.concat(unformattedArgumentArray[argumentIndex]);
            }
            argumentIndex = argumentIndex + 1;
        } while ((isArgumentForCurrentStatement(unformattedArgumentArray, argumentIndex, statementArray, i)) && argumentIndexInBounds(argumentIndex, unformattedArgumentArray));
        reasoningStatementList.push(newList);
        newList = [];
    }
    return reasoningStatementList;
}

function populateStatementsAsUnorderedList(div, arr, hiddenValue) {
    for (var i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li');
        var paragraphItem = document.createElement('p');
        listItem.id = 'li-id-' + i;
        listItem.hidden = hiddenValue;
        listItem.setAttribute("bothSidesInteracted", "false");
        //Grab this dynamically.
        paragraphItem.innerHTML = arr[i];
        paragraphItem.id = "li-id-" + i;
        listItem.appendChild(paragraphItem);
        div.appendChild(listItem);
    }
}

function populateArgumentsAsUnorderedList(div, arr, hiddenValue) {
        var isForArguments = !div.id.match("AgainstListOL");

    for (var statementIndex = 0; statementIndex < arr.length; statementIndex++) {
        var listItem = document.createElement('li');
        listItem.setAttribute("forArgument", isForArguments.toString());
        listItem.id = getlistItemId(listItem, statementIndex);
        listItem.hidden = hiddenValue;
        for (var argumentIndex = 0; argumentIndex < arr[statementIndex].length; argumentIndex++) {
            var wrapperListItem = document.createElement('div');
            wrapperListItem.id = getWrapperListItemId(listItem, statementIndex, argumentIndex);
            wrapperListItem.appendChild(populateArgumentContent(wrapperListItem, statementIndex, argumentIndex, arr, hiddenValue));
            listItem.appendChild(wrapperListItem);
        }
        div.appendChild(listItem);
    }
}

function populateArgumentContent(originalPost, statementIndex, argumentIndex, arr, hiddenValue) {
    var replyWrapper = document.createElement('div');
    var numberOfPreviousReplies = getNumberOfPreviousReplies(originalPost.id);
    replyWrapper.id = getReplyNumber(originalPost.id, numberOfPreviousReplies);
    replyWrapper.value = "comment";
    replyWrapper.appendChild(populateArgumentStatements(statementIndex, argumentIndex, arr));
    replyWrapper.appendChild(populateButton("Thread", replyWrapper.id, argumentIndex));
    replyWrapper.appendChild(populateButton("Interactivity", replyWrapper.id, argumentIndex));
    replyWrapper.appendChild(populateButton("Like",replyWrapper.id, argumentIndex));
    replyWrapper.appendChild(populateSliderForArguments("respect", replyWrapper.id, hiddenValue, argumentIndex));
    replyWrapper.appendChild(populateSliderForArguments("relevancy", replyWrapper.id, hiddenValue, argumentIndex));
    replyWrapper.appendChild(populateTextAreaForArguments(replyWrapper.id, hiddenValue, argumentIndex));

    return replyWrapper;
}

function populateWordCloud() {
    ForListDivWrapper.hidden = "true";
    AgainstListDivWrapper.hidden = "true";

    var list=[
        ['Brexit will probably be a decision we regret',48],
        ['Immigration is damaging to our British culture', 20],
        ['The Queen does so much for our country', 25],
        ['Catching terrorists should come before our right to privacy', 24],
        ['Global warming is the fault of humans', 24],
        ['Lecturers should not be striking', 15]
    ];
    WordCloud(document.getElementById('StatementListOL'), {list: list});
}


function populateButton(buttonType, parentNodeName, j){
    var buttonToggle = document.createElement('button');

    buttonToggle.type = "button";
    buttonToggle.id = getButtonId(buttonType, parentNodeName, j);
    buttonToggle.className = getButtonClassName(parentNodeName,buttonType);
    buttonToggle.hidden = getHiddenValue(buttonType);

    buttonToggle.setAttribute("buttonType", buttonType);
    buttonToggle.setAttribute("Value", getInitialButtonValue(buttonType, j));
    buttonToggle.setAttribute("isClicked", "false");

    buttonToggle.addEventListener("click", handleButtonToggle);
    buttonToggle.addEventListener("mouseover", handleButtonHover);
    buttonToggle.addEventListener("mouseout", handleButtonUnHover);
    return buttonToggle;
}


function populateArgumentStatements(i, j, arr) {
    var textItem = document.createElement('p');
    textItem.id = 'pArguments-' + j;
    textItem.className = "pArgumentStyle";
    textItem.innerHTML = arr[i][j];
    return textItem;
}
function populateArgumentReply(textAreaText, previousReplies) {
    var textItem = document.createElement('p');
    textItem.id = 'pArguments-' + previousReplies;
    textItem.className = "pArgumentStyle";
    textItem.innerHTML = getTextExcludingSource(textAreaText);
    return textItem;
}
function populateSourceText(textAreaText, previousReplies) {
    var textItem = document.createElement('p');
    var anchorElement = document.createElement('a');
    var sourceLink = getSourceLink(textAreaText);
    anchorElement.href = sourceLink;
    anchorElement.innerHTML = sourceLink;
    textItem.id = 'pSource-' + previousReplies;
    textItem.className = "pSourceStyle";
    textItem.appendChild(anchorElement);
    return textItem;
}


function populateSliderForArguments(currentNodeName, parentNodeName, hiddenValue, j) {
    var wrapper = document.createElement('div');
    wrapper.id = currentNodeName + "SliderWrapper" + parentNodeName + "-pArguments-" + j;
    wrapper.className = getSliderWrapperClassName(currentNodeName, parentNodeName);

    wrapper.hidden = hiddenValue;

    wrapper.appendChild(populateSliderElement(currentNodeName, parentNodeName, hiddenValue, j));

    return wrapper;
}



function populateSliderElement(currentNodeName, parentNodeName, hiddenValue, j) {
    var sliderElement = document.createElement('input');
    var sliderId = currentNodeName + "Slider" + parentNodeName + "-pArguments-" + j;
    var sliderClass = getSliderClassName(currentNodeName, parentNodeName);

    sliderElement.type = "range";
    sliderElement.min = "1";
    sliderElement.max = "100";
    sliderElement.hidden = hiddenValue;
    sliderElement.background = "http://www.freeclipart.pw/uploads/2017/05/thumbs-up-in-blue-clip-art-at-clker--vector-clip-art-online--12.png";
    sliderElement.value = "50%";
    sliderElement.className = sliderClass;
    sliderElement.setAttribute("data-show-value", "true");
    sliderElement.id = sliderId;
    sliderElement.addEventListener("change", handleSliderChange);
    sliderElement.addEventListener("input", handleSliderChange);
    sliderElement.addEventListener("mouseleave", handleSliderLeave);

    return sliderElement;

}


/* Have since deprecated the SliderValue next to in favour of Tooltip, keeping in case of redo.
function populateSliderValueElement(currentNodeName, parentNodeName, j, hiddenValue) {
    var sliderElementValue = document.createElement('div');
    var sliderValueId = currentNodeName + "SliderValue" + parentNodeName + "-pArguments-" + j;
    var sliderValueClass = getSliderValueClassName(currentNodeName, parentNodeName);

    sliderElementValue.hidden = true;
    sliderElementValue.value = "50%";
    sliderElementValue.id = sliderValueId;
    sliderElementValue.className = sliderValueClass;
    sliderElementValue.innerHTML = sliderElementValue.value;

    return sliderElementValue;
}*/

function populateTextAreaForArguments(parentNodeName, hiddenValue, j) {
    var textAreaWrapper = document.createElement("div");
    textAreaWrapper.className = "TextAreaWrapper" + parentNodeName + "-pArguments-" + j;
    textAreaWrapper.id = "TextAreaWrapper" + parentNodeName.substr(0, parentNodeName.length - 4);

    textAreaWrapper.appendChild(populateTextAreaElement(parentNodeName, hiddenValue, j));
    textAreaWrapper.appendChild(populateSubmitTextAreaForArguments(parentNodeName, hiddenValue, j));

    return textAreaWrapper;
}

function populateTextAreaElement(parentNodeName, hiddenValue, j) {
    var textAreaElement = document.createElement("textarea");
    var textAreaId = "TextArea" + parentNodeName + "-pArguments-" + j;
    var textAreaClass = getTextBoxAreaClassName(parentNodeName);
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
    var textAreaSubmitId = "submitTextArea" + parentNodeName + "-pArguments-" + j;
    var textAreaSubmitClass = getSubmitTextBoxAreaClassName(parentNodeName);
    textAreaSubmit.type = "submit";
    textAreaSubmit.hidden = hiddenValue;
    textAreaSubmit.id = textAreaSubmitId;
    textAreaSubmit.className = textAreaSubmitClass;
    textAreaSubmit.addEventListener("click", handleSubmitTextArea);

    return textAreaSubmit;
}


//TODO MUTATORS

function showDiv(div) {
    div.hidden = false;
}

function hideDiv(div) {
    div.hidden = true
}



//We want all the div's to be hiddden
function hideAllReplyChildNodes(div) {
    for (var i = 0; i < div.childElementCount; i++) {
        if(div.childNodes[i].value === "reply"){
            div.childNodes[i].style.fontWeight = "";
            div.childNodes[i].hidden = true;
        }
    }
}
//We want all the divs' to be shown.
function showAllReplyChildNodes(div) {
    for (var i = 0; i < div.childElementCount; i++) {
        if(div.childNodes[i].value === "reply") {
            div.childNodes[i].hidden = false;
            div.childNodes[i].style.fontWeight = "bold";
        }
    }
}
//We want all the div's to be hiddden
function hideAllChildNodes(div) {
    for (var i = 0; i < div.childElementCount; i++) {
        div.childNodes[i].hidden = true;
    }
}
//We want all the divs' to be shown.
function showAllChildNodes(div) {
    for (var i = 0; i < div.childElementCount; i++) {
        div.childNodes[i].hidden = false;
    }
}

function showDivChildNode(div, statementId) {
    div.childNodes[statementId].hidden = false;
}

/*
function emboldenEvent(event) {
    event.target.style.fontWeight = "bold";
}*/

function deBoldAllChildNodes(StatementListDiv) {
    for (var i = 0; i < StatementListDiv.childElementCount; i++) {
        //StatementListDiv.childNodes[i].childNodes[0].style.fontWeight = "";
    }
}



function changeStatementPText(StatementListDivWrapper, selectedText,boldValue) {
    for(var i = 0; i< StatementListDivWrapper.childNodes.length; i++) {
        if (isStatementListWrapperText(StatementListDivWrapper,i)) {
            StatementListDivWrapper.childNodes[i].innerHTML = selectedText;
            StatementListDivWrapper.childNodes[i].style.fontWeight = boldValue;
        }
    }
}
function insertStatementHeaderText(StatementListDivWrapper, headerText) {
    for(var i = 0; i< StatementListDivWrapper.childNodes.length; i++) {
        if (isStatementListWrapperHeader(StatementListDivWrapper,i)) {
            StatementListDivWrapper.childNodes[i].innerHTML = headerText;
        }
    }
}

function addTitlePositioningCss() {
    var titleHeadingDiv = document.getElementById('titleHeading');
    var className = titleHeadingDiv.childNodes[1].className.toString().replace("titleText", "titleText statementsPage");

    titleHeadingDiv.childNodes[1].className = className;
}
function removeTitlePositioningCss() {
    var titleHeadingDiv = document.getElementById('titleHeading');
    var className = titleHeadingDiv.childNodes[1].className.toString().replace("statementsPage", "");
    titleHeadingDiv.childNodes[1].className = className;
}

function setUserInteracted(event) {
    // Always returns a number, returns 0 if not true, and anything else if true.
    // ~ is the bitwise inverse, This statement minus the ~ returns -1, hence in two's compliment, -1 is represented as all 1's.
    //Therefore hence the bitwise inverse is zero.
    if(~event.target.id.indexOf("For")){
        setInteractedEvent(event, "forinteracted");
    }else if(~event.target.id.indexOf("Against")){
        setInteractedEvent(event,"againstinteracted");
    }
}

function setInteractedEvent(event, interactedEventId){
    //Replaces all non-digits with blank, up until the first number, then takes that one.
    var statementValue = event.target.id.toString().replace(/^\D+|\D*$/g, "").substring(0,1);
    console.log(event.target.id);
    setStatementInteracted(statementValue, interactedEventId);
}

function setStatementInteracted(statementValue, interactedSide){
    var statementListDiv = document.getElementById("StatementListOL");
    statementListDiv.childNodes[statementValue].setAttribute(interactedSide, "true");
}


function clearTextBox(textBoxDiv, textAreaText) {
    if (!(textAreaText === "")) {
        textBoxDiv.value = "";
        console.log("AddComments and populate text");
        var relatedDiv = event.target.parentNode.classList[0];
        var relatedArgumentValue = relatedDiv.slice(relatedDiv.length - 1, relatedDiv.length);
        console.log(relatedArgumentValue);
    }
}

//TODO Add other sliders and buttons, and id to this.
function addComment(textBoxDiv, textAreaText, hiddenVal) {
    var replyWrapper = document.createElement('div');
    var originalPost = textBoxDiv.parentNode.parentNode;
    var numberOfPreviousReplies = getNumberOfPreviousReplies(originalPost.id);
    var hiddenValue = hiddenVal;

    replyWrapper.id = getReplyNumber(originalPost.id, numberOfPreviousReplies);
    replyWrapper.value = "reply";
    replyWrapper.hidden = hiddenValue;

    //Sad that inside this we do the below check as well, but maybe saves us creating two functions, which actually wouldn't be that bad.
    replyWrapper.appendChild(populateArgumentReply(textAreaText, numberOfPreviousReplies));

    if(isSourceIncluded(textAreaText)) {
        replyWrapper.appendChild(populateSourceText(textAreaText, numberOfPreviousReplies));
    }
    replyWrapper.appendChild(populateButton("Thread",replyWrapper.id, numberOfPreviousReplies));
    replyWrapper.appendChild(populateButton("Interactivity",replyWrapper.id, numberOfPreviousReplies));
    replyWrapper.appendChild(populateButton("Like",replyWrapper.id, numberOfPreviousReplies));
    replyWrapper.appendChild(populateSliderForArguments("respect", replyWrapper.id, hiddenValue, numberOfPreviousReplies));
    replyWrapper.appendChild(populateSliderForArguments("relevancy", replyWrapper.id, hiddenValue, numberOfPreviousReplies));
    replyWrapper.appendChild(populateTextAreaForArguments(replyWrapper.id, hiddenValue, numberOfPreviousReplies));

    // Inside wrapperDiv for original comment.
    textBoxDiv.parentNode.parentNode.appendChild(replyWrapper);
}




function handleButtonToggle(event) {
    console.log(event.target.id);
    var buttonDiv = document.getElementById(event.target.id.toString());

    //Note the order of className before the state change of isLiked, as in process of toggling.
    buttonDiv.className = getButtonUpdatedClassName(buttonDiv);
    buttonDiv.setAttribute("Value", getButtonValue(buttonDiv));
    buttonDiv.setAttribute("isClicked",getButtonIsClickedValue(buttonDiv));

    handleButtonInteraction(buttonDiv, event);

    $(buttonDiv).attr("data-original-title", buttonDiv.getAttribute("Value"))
        .attr("trigger", "hover")
        .tooltip('show');
}

function handleButtonInteraction(buttonDiv,event) {
    if(buttonDiv.getAttribute("buttonType") === "Thread") handleThreadInteraction(buttonDiv);
    else if(buttonDiv.getAttribute("buttonType") === "Interactivity") handleInteractivityInteraction(buttonDiv);
    else setUserInteracted(event);

}

function handleThreadInteraction(buttonDiv) {
    var parentEventId = buttonDiv.parentNode.id;

    var parentEventDiv = document.getElementById(parentEventId.toString());
    //TODO Change second check for any of them still shown, hide them.
    if (anyChildNodesShowing(parentEventDiv)){
        hideAllReplyChildNodes(parentEventDiv);
        parentEventDiv.style.fontWeight = "";

    }
    else if(!anyChildNodesShowing(parentEventDiv) && hasChildNodes(parentEventDiv)){
        showAllReplyChildNodes(parentEventDiv);
        parentEventDiv.style.fontWeight = "bold";
    }

}

//I know bit of bad practice for now.
function hasChildNodes(div) {
    for (var i = 0; i < div.childElementCount; i++) {
        if(div.childNodes[i].value === "reply"){
            return true;
        }
    }

    return false;
}
function handleInteractivityInteraction(buttonDiv) {
    var paragraphId = getRelatedParagraphId(buttonDiv);
    var paragraphDivParentId = buttonDiv.parentNode.id;
    var paragraphDivParentValue = buttonDiv.parentNode.value;

    //TODO Change second check for any of them still shown, hide them.

    if(paragraphDivParentValue === "comment") {
        toggleButtonDiv(paragraphId, paragraphDivParentId, "Like");
        toggleRespectSliderDiv(paragraphId, paragraphDivParentId);
        toggleRelevancySliderDiv(paragraphId, paragraphDivParentId);
        toggleTextArea(paragraphId, paragraphDivParentId);
    }
    else if(paragraphDivParentValue === "reply"){
        toggleButtonDiv(paragraphId, paragraphDivParentId, "Like");
        toggleRespectSliderDiv(paragraphId, paragraphDivParentId);
        toggleRelevancySliderDiv(paragraphId, paragraphDivParentId);
        toggleTextArea(paragraphId, paragraphDivParentId);

    }
}



function handleButtonHover(event) {
    var buttonDiv = document.getElementById(event.target.id.toString());
    $(buttonDiv).attr("data-original-title", buttonDiv.getAttribute("Value"))
        .attr("trigger", "hover")
        .tooltip('show');

    console.log(buttonDiv.getAttribute("Value"));
}

function handleButtonUnHover(event) {
    var buttonDiv = document.getElementById(event.target.id.toString());
    $(buttonDiv).tooltip('hide');


}

function handleSliderChange(event) {
    console.log(event.target.id);
    setUserInteracted(event);
    var sliderElement = document.getElementById(event.target.id.toString());
    var sliderText = getSliderText(sliderElement);
    $(sliderElement).attr("data-original-title", sliderText + sliderElement.value + "%")
        .attr("trigger", "hover")
        .tooltip('show');

}
function getSliderText(sliderElement){
    if(sliderElement.className.match("respect")) return "Respect: ";
    else return "Relevancy: ";
}



function handleSliderHover(event) {
    console.log(event.target.id);
    var sliderElement = document.getElementById(event.target.id.toString());
    $(sliderElement).attr("data-original-title", sliderElement.value + "%")
        .attr("trigger", "hover")
        .tooltip('show');

}

function handleSliderLeave(event) {
    console.log(event.target.id);
    var sliderElement = document.getElementById(event.target.id.toString());
    var sliderText = getSliderText(sliderElement);
    $(sliderElement).attr("data-original-title", sliderText + sliderElement.value + "%")
        .attr("trigger", "hover")
        .tooltip('hide');

}

function handleTextAreaClear(event) {
    var textAreaElement = document.getElementById(event.target.id);
    if (textAreaElement.innerHTML === "Enter reply here...") textAreaElement.innerHTML = "";
}

function handleSubmitTextArea(event) {
    var textAreaElement = document.getElementById(event.target.parentNode.childNodes[0].id);
    var textAreaText = textAreaElement.value.toString();
    //TODO fix this remember



    if(hasUserInteractedWithBothSides(event) &&textAreaText.toString() !== "") {
        clearTextBox(textAreaElement, textAreaText);
        //alert("Congrats, you have interacted with both points of view for this topic, and can now reply with your views");
        addComment(textAreaElement, textAreaText, false);
    }
    else if(textAreaText.toString() === "") alert("Please ensure you have entered text into the box.");
    else alert("You must interact (read, like or vote) with both sides before commenting");
}

function toggleButtonDiv(relatedParagraphId, parentEventId,buttonType) {
    var btnElement = "btn" + buttonType + parentEventId + "-" + relatedParagraphId;
    var btnDiv = document.getElementById(btnElement);

    if (btnDiv.hidden === false) hideDiv(btnDiv);
    else showDiv(btnDiv);

}

function toggleRespectSliderDiv(relatedparagraphId, parentEventId) {
    var respectSliderWrapperElement = "respectSliderWrapper" + parentEventId + "-" + relatedparagraphId;
    var respectSliderWrapperDiv = document.getElementById(respectSliderWrapperElement);
    var respectSliderElement = "respectSlider" + parentEventId + "-" + relatedparagraphId;
    var respectSliderDiv = document.getElementById(respectSliderElement);

    if (respectSliderDiv.hidden === false) {
        hideDiv(respectSliderDiv);
        hideDiv(respectSliderWrapperDiv);
    }
    else {
        showDiv(respectSliderDiv);
        showDiv(respectSliderWrapperDiv);
    }
}

function toggleTextArea(eventId, parentEventId) {
    var textAreaElement = "TextArea" + parentEventId + "-" + eventId;
    var submitTextAreaElement = "submitTextArea" + parentEventId + "-" + eventId;

    var textAreaDiv = document.getElementById(textAreaElement);
    var submitTextAreaDiv = document.getElementById(submitTextAreaElement);

    if (textAreaDiv.hidden === false) hideDiv(textAreaDiv);
    else showDiv(textAreaDiv);

    if (submitTextAreaDiv.hidden === false) hideDiv(submitTextAreaDiv);
    else showDiv(submitTextAreaDiv);

}

function toggleRelevancySliderDiv(eventId, parentEventId) {
    var relevancySliderWrapperElement = "relevancySliderWrapper" + parentEventId + "-" + eventId;
    var relevancySliderElement = "relevancySlider" + parentEventId + "-" + eventId;
    var relevancySliderDiv = document.getElementById(relevancySliderElement);
    var relevancySliderWrapperDiv = document.getElementById(relevancySliderWrapperElement);
    if (relevancySliderDiv.hidden === false) {
        hideDiv(relevancySliderDiv);
        hideDiv(relevancySliderWrapperDiv);
    }
    else {
        showDiv(relevancySliderDiv);
        showDiv(relevancySliderWrapperDiv);
    }
}
//TODO bad mix of Jquery and event handlers but this is not created dynamically like the rest, for now leave.
$(StatementListDiv).click(function (event) {
    var statementId = event.target.id.replace("li-id-", "");
    var selectedText = event.target.innerHTML;

    hideAllChildNodes(StatementListDiv);
    deBoldAllChildNodes(StatementListDiv);


    showDiv(backToStatementsButton);
    showDiv(ForListDivWrapper);
    showDiv(AgainstListDivWrapper);


    showDivChildNode(ForListDiv, statementId);
    showDivChildNode(AgainstListDiv, statementId);
    removeTitlePositioningCss();
    changeStatementPText(StatementListDivWrapper, selectedText, "bold");
    insertStatementHeaderText(StatementListDivWrapper, "Statement");


});
$(backToStatementsButton).click(function () {
    hideAllChildNodes(ForListDiv);
    hideAllChildNodes(AgainstListDiv);

    hideDiv(ForListDivWrapper);
    hideDiv(AgainstListDivWrapper);
    hideDiv(backToStatementsButton);

    changeStatementPText(StatementListDivWrapper, "", "");
    insertStatementHeaderText(StatementListDivWrapper, "Statements");

    addTitlePositioningCss();
    showDiv(StatementListDivWrapper);
    showAllChildNodes(StatementListDiv);
});

function getButtonId(buttonType, parentNodeName, j) {
    return "btn" + buttonType + parentNodeName + "-pArguments-" + j;
}
function getHiddenValue(buttonType) {
    return buttonType === "Like";
}
function getInitialButtonValue(buttonType, j) {
    if(buttonType === "Like") return ((11 * j) + 6).toString();
    else return "Show " + buttonType;
}


function getlistItemId(listItem, i) {
    if (listItem.getAttribute("forArgument") === "true") {
        return 'For-li-id-' + i;
    } else {
        return 'Against-li-id-' + i;
    }
}

//TODO If use this one, need to update all child nodes CSS, / id.
//TODO Perhaps could add last item.
function getWrapperListItemId(listItem, i, j) {
    if (listItem.getAttribute("forArgument") === "true") {
        return 'For-li-id-' + i + '-' + j;
    } else {
        return 'Against-li-id-' + i + '-' + j;
    }
}

function getSourceLink(textAreaText) {
    var indexOfStartOfSource = textAreaText.indexOf("/source=")+9;
    var sourceLink = textAreaText.substring(indexOfStartOfSource, textAreaText.length-1).toString();
    return sourceLink;
}
function getTextExcludingSource(textAreaText) {
    if(isSourceIncluded(textAreaText)) {
        var sourceTag = "/source";
        var indexOfStartOfSource = textAreaText.indexOf(sourceTag);
        textAreaText = textAreaText.substring(0, indexOfStartOfSource).toString();
    }
    return textAreaText.toString();
}

function getButtonClassName(parentNodeName, buttonType) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    var arrowPosition = "";
    if(buttonType !== "Like") arrowPosition = " up"; //Again horrible hardcoding, and probably better to split into two functions throughout this, for another day.
    if (parentNodeName.toString().substr(0, 1) === "A") lengthOfClassName = 13;


    return "btn" + buttonType + parentNodeName.substr(0, lengthOfClassName) + arrowPosition;

}

function getSliderWrapperClassName(currentNodeName, parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if (parentNodeName.toString().substr(0, 1) === "A") lengthOfClassName = 13;

    return currentNodeName + "SliderWrapper" + parentNodeName.substr(0, lengthOfClassName) + " override";
}

function getSliderClassName(currentNodeName, parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if (parentNodeName.toString().substr(0, 1) === "A") lengthOfClassName = 13;

    return currentNodeName + "Slider" + parentNodeName.substr(0, lengthOfClassName) + " override";
}
/* Similarly deprecated as below.
function getSliderValueClassName(currentNodeName, parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if (parentNodeName.toString().substr(0, 1) === "A") lengthOfClassName = 13;

    return currentNodeName + "SliderValue" + parentNodeName.substr(0, lengthOfClassName) + " override";
}*/

function getTextBoxAreaClassName(parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if (parentNodeName.toString().substr(0, 1) === "A") lengthOfClassName = 13;

    return "TextArea" + parentNodeName.substr(0, lengthOfClassName);
}

function getSubmitTextBoxAreaClassName(parentNodeName) {
    var lengthOfClassName = 9; //TODO Hardcoded For Value length --HORRIBLE.
    if (parentNodeName.toString().substr(0, 1) === "A") lengthOfClassName = 13;

    return "submitTextArea" + parentNodeName.substr(0, lengthOfClassName);
}




function getButtonValue(buttonDiv) {
    if (buttonDiv.getAttribute("buttonType") === "Like") return getButtonLikeValue(buttonDiv);
    else return getButtonToggleValue(buttonDiv);
}
function getButtonLikeValue(buttonDiv) {
    var currentButtonValue = parseInt(buttonDiv.getAttribute("Value"));
    if ((buttonDiv.getAttribute("isClicked") === "true") &&(buttonDiv.getAttribute("buttonType") === "Like")){
        currentButtonValue = currentButtonValue - 1;
        return currentButtonValue;
    } else if((buttonDiv.getAttribute("isClicked") === "false") &&(buttonDiv.getAttribute("buttonType") === "Like")){
        currentButtonValue = currentButtonValue + 1;

        return currentButtonValue
    }

}
function getButtonToggleValue(buttonDiv) {
    var buttonValue = "";

    if(buttonDiv.getAttribute("Value") === "Show " + buttonDiv.getAttribute("buttonType")) buttonValue = "Hide " + buttonDiv.getAttribute("buttonType");
    else buttonValue = "Show " + buttonDiv.getAttribute("buttonType");

    return buttonValue.toString();
}
function getButtonIsClickedValue(buttonDiv) {
    if(buttonDiv.getAttribute("isClicked") === "true") return "false";
    else return "true";

}
//TODO Split these functions into seperate ones, as currently doing two things.
function getButtonUpdatedClassName(buttonDiv) {
    var buttonClassName = "";
    if(buttonDiv.getAttribute("buttonType") === "Like") {
        if (buttonDiv.getAttribute("isClicked") === "true") buttonClassName = buttonDiv.className.toString().replace(" clicked", "");
        else buttonClassName = buttonDiv.className + " clicked";
    } else{
        if(buttonDiv.className.match("up")) buttonClassName = buttonDiv.className.toString().replace(" up", " down");
        else if(buttonDiv.className.match("down")) buttonClassName = buttonDiv.className.toString().replace(" down", " up");
        else buttonClassName = buttonDiv.className + " up";
    }
    return buttonClassName.toString();
}

function getRelatedParagraphId(buttonDiv) {
    return buttonDiv.parentNode.childNodes[0].id;
}



function getReplyNumber(originalPost, numberOfPreviousReplies) {
    return originalPost.toString() + "-" + numberOfPreviousReplies.toString();
}

function getNumberOfPreviousReplies(originalPostId) {
    return $('[id^=' + originalPostId + ']').length;
}



function isArgumentNotStatement(unformattedArgumentArray, argumentIndex, statementArray, i) {
    return unformattedArgumentArray[argumentIndex] != statementArray[i]
}

function isArgumentForCurrentStatement(unformattedArgumentArray, argumentIndex, statementArray, i) {
    return unformattedArgumentArray[argumentIndex] != statementArray[i + 1];
}

function argumentIndexInBounds(argumentIndex, unformattedArgumentArray) {
    return argumentIndex < unformattedArgumentArray.length;
}
function anyChildNodesShowing(div) {
    for (var i = 0; i < div.childElementCount; i++) {
        if((div.childNodes[i].value === "reply") && (div.childNodes[i].hidden === false)){
            return true;
        }
    }

    return false;
}

function isStatementListWrapperText(StatementListDivWrapper, i) {
    return StatementListDivWrapper.childNodes[i].id === "selectedStatementText";
}
function isStatementListWrapperHeader(StatementListDivWrapper, i) {
    return StatementListDivWrapper.childNodes[i].id === "headerStatement";
}


function isSourceIncluded(textAreaText) {
    // Always returns a number, returns 0 if not true, and anything else if true.
    // ~ is the bitwise inverse, This statement minus the ~ returns -1, hence in two's compliment, -1 is represented as all 1's.
    //Therefore hence the bitwise inverse is zero.
    if(~textAreaText.indexOf("\source=") || ~textAreaText.indexOf("\Source=")) return true;
    return false;
}


function hasUserInteractedWithBothSides(event) {
    var statementValue = event.target.id.toString().replace(/^\D+|\D*$/g, "").substring(0,1);
    var statementListDiv = document.getElementById("StatementListOL");

    return statementListDiv.childNodes[statementValue].getAttribute("forinteracted") === "true" && statementListDiv.childNodes[statementValue].getAttribute("againstinteracted") === "true";

}
initialiseWebPageContent();
