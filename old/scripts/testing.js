var requestMethod;
var requestUrl;
var requestHeaders;
var requestBody;
var responseStatusCode;
var responseStatusText;
var responseBody;
var sendButton;
var clearButton;

window.onload = function() {
    requestMethod = document.getElementById("requestMethod");
    requestUrl = document.getElementById("requestUrl");
    requestHeaders = document.getElementById("requestHeaders");
    requestBody = document.getElementById("requestBody");

    responseStatusCode = document.getElementById("responseStatusCode");
    responseStatusText = document.getElementById("responseStatusText");
    responseHeaders = document.getElementById("responseHeaders");
    responseBody = document.getElementById("responseBody");

    sendButton = document.getElementById("sendButton");
    clearButton = document.getElementById("clearButton");

    sendButton.addEventListener("click", sendRequest, false);
    clearButton.addEventListener("click", clearRequest, false);

    loadRequest();
    loadResponse();
}

/**
 * This will send an appropriate request
 */
function sendRequest() {
    var request = getRequestFromUi();
    saveRequest();
    transmitRequest(request);
}

function transmitRequest(request) {
    try {
        assertRequestIsValid(request);
        console.log(request);
        var xmlHttpRequest = new XMLHttpRequest()
        xmlHttpRequest.open(request.method, request.url, true);
        var parsedHeaders = JSON.parse(request.headers);
        xmlHttpRequest.headers = parsedHeaders;
        xmlHttpRequest.onreadystatechange = function () {
            if (xmlHttpRequest.readyState == XMLHttpRequest.DONE) {
                onResponse(xmlHttpRequest);
            }
        }
        xmlHttpRequest.body = request.body;
        xmlHttpRequest.send();
    } catch (error) {
        alert(error);
    }
}

/**
 * This method is called when the request reaches it's ready state
 * @param xmlHttpRequest
 */
function onResponse(xmlHttpRequest) {
    var response = {
        statusCode: xmlHttpRequest.statusCode,
        statusText: xmlHttpRequest.statusText,
        headers: xmlHttpRequest.getAllResponseHeaders(),
        body: xmlHttpRequest.responseText
    };
    updateResponseUi(response);
    saveResponse();
}

function clearRequest() {
    updateResponseUi(
        {
            statusCode: "",
            statusText: "",
            headers: "",
            body: ""
        }
    );
    updateRequestUi(
        {
            method: "",
            url: "",
            headers: "",
            body: ""
        }
    );
    saveResponse();
}

function saveRequest() {
    var request = getRequestFromUi();
    if (request) {
        localStorage.setItem("REQUEST", toJson(request));
        console.log(request);
    }
}

function loadRequest() {
    var request = localStorage.getItem("REQUEST");
    if (request) {
        var parsed = JSON.parse(request);
        console.log(parsed);
        updateRequestUi(parsed);
    }
}

function saveResponse() {
    var response = getResponseFromUi();
    if (response) {
        localStorage.setItem("RESPONSE", toJson(response));
        console.log(response);
    }
}

function loadResponse() {
    var response = localStorage.getItem("RESPONSE");
    if (response) {
        var parsed = JSON.parse(response);
        console.log(parsed);
        updateResponseUi(parsed);
    }
}

function getRequestFromUi() {
    return {
        method: requestMethod.value,
        url: requestUrl.value,
        headers: requestHeaders.value,
        body: requestBody.value
    };
}

function updateRequestUi(request) {
    if (request) {
        requestMethod.value = request.method;
        requestUrl.value = request.url;
        requestHeaders.value = request.headers;
        requestBody.value = request.body;
    } else {
        alert("Failed to display the request data!");
        console.log(request);
    }
}


function getResponseFromUi() {
    var response =  {
        statusCode: responseStatusCode.innerHTML,
        statusText: responseStatusText.innerHTML,
        headers: responseHeaders.innerHTML,
        body: responseBody.innerHTML
    };
    return response;
}

function updateResponseUi(response) {
    if (response) {
        console.log(response);
        responseStatusCode.innerHTML = response.statusCode;
        responseStatusText.innerHTML = response.statusText;
        responseHeaders.innerHTML = response.headers;
        responseBody.innerHTML = response.body;
    } else {
        alert("Failed to display the response data!");
        console.log(response);
    }
}

function randomResponse() {
    theStatusText = randomText("statusText");
    theStatusCode = randomText("statusCode");
    theHeaders = randomText("headers");
    theBody = randomText("body");

    return {
        statusText: theStatusText,
        statusCode: theStatusCode,
        headers: theHeaders,
        body: theBody
    };
}

function assertRequestIsValid(request) {
    assertExists("Request: ", request);
    assertExists("Request method: ", request.method);
    assertExists("Request url: ", request.url);
    assertExists("Request headers: ", request.headers);
}

/**
 * This is used to generate random text with the prefix to help identify what it's for.
 * @param prefix
 * @returns {string}
 */
function randomText(/* string */ prefix) {
    var token = Math.random().toString(36).substring(7);
    return prefix + "_" + token;
}
