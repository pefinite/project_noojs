var theMouseMoveCastingForNooJS = {x: 0, y: 0};

(function (theArgument){
    window.noo = theArgument;
    theArgument.element = function (elementName, numberOfElement = 1){
        let theElements = [];
        for(let x = 0; x  < numberOfElement; x++) {
            theElements.push(document.createElement(elementName));
        }
        return {
            classes: function (){
                for(let x = 0; x < theElements.length; x++) {
                    for(let y = 0; y < arguments.length; y++) {
                        theElements[x].classList.add(arguments[y]);
                    }
                }
                return this;
            },
            data: function (dataName, value) {
                for(let x = 0; x < theElements.length; x++) {
                    theElements[x].setAttribute("data-" + dataName, value);
                }
                return this;
            },
            theAllElements: function () {
                return theElements;
            }
        };
    };
    noo.alert = function (theMessage) {
        window.alert(theMessage);
    };
    theArgument.http = function(theRequestUrl, theData = null) {
        let theRequest = new XMLHttpRequest();
        return {
            get: function (theFunction) {
                if (typeof theFunction == 'function') {
                    theRequest.onload = function (){
                        theFunction(theRequest.responseText);
                    }
                }
                theRequest.open("GET", theRequestUrl);
                theRequest.send();
            },
            syncGet: function (theFunction){
                if (typeof theFunction == 'function') {
                    theRequest.onload = function (){
                        theFunction(theRequest.responseText);
                    }
                }
                theRequest.open("GET", theRequestUrl, false);
                theRequest.send();

            },
            post: function (theFunction){
                if (typeof theFunction == 'function') {
                    theRequest.onload = function (){
                        theFunction(theRequest.responseText);
                    }
                }
                theRequest.open("POST", theRequestUrl);
                theRequest.send(theData);

            },
            syncPost: function (theFunction) {
                if (typeof theFunction == 'function') {
                    theRequest.onload = function (){
                        theFunction(theRequest.responseText);
                    }
                }
                theRequest.open("POST", theRequestUrl, false);
                theRequest.send(theData);

            },
            start: function (theListenerFunction) {
                theRequest.addEventListener("loadstart", theListenerFunction);
                return this;
            },
            progress: function (theListenerFunction) {
                theRequest.addEventListener("progress", function (e){
                    theListenerFunction(e.loaded);
                });
                return this;
            },
            loaded: function (theListenerFunction) {
                theRequest.addEventListener("load", function (e){
                    theListenerFunction(e.loaded);
                });
                return this;
            },
            error: function (theListenerFunction){
                theRequest.addEventListener("error", function (e){
                    theListenerFunction(theRequest.statusText);
                });
                return this;
            }

        }
    };
    window.theFunctionsThoseAreWaitingToExecute = [];
    theArgument.ready = function () {
        for(let x = 0; x < arguments.length; x++) {
            window.theFunctionsThoseAreWaitingToExecute.push(arguments[x]);
        }
    };

    window.onload = function () {
        for (let  x= 0; x < window.theFunctionsThoseAreWaitingToExecute.length; x++) {
            window.theFunctionsThoseAreWaitingToExecute[x]();
        }
        window.theFunctionsThoseAreWaitingToExecute = [];
    };
})(function noo(){
    let theSelectedElements = [];
    for(let  x = 0; x < arguments.length; x++) {
        let elements = document.querySelectorAll(arguments[x]);
        for(let y = 0; y < elements.length; y++) {
            theSelectedElements.push(elements[y]);
        }
    }
    return {
        appendChild: function (theElementObject) {
            let theElements = theElementObject.theAllElements();
            for(let  x= 0; x < theSelectedElements.length; x++) {
                for (let y = 0; y < theElements.length; y++) {
                    theSelectedElements[x].appendChild(theElements[y].cloneNode(true));
                }
            }
            return this;
        },
        touchstart: function (callback) {
            this.setEvent("touchstart", callback);
            return this;
        },
        touchmove: function (callback) {
            this.setEvent("touchmove", callback);
            return this;
        },
        click: function (theFunction) {
            this.setEvent("click", theFunction);
            return this;
        },
        swipe: function (theCallback) {
            this.touchstart(function (evt){
                theMouseMoveCastingForNooJS.x = evt.touches[0].clientX;
                theMouseMoveCastingForNooJS.y = evt.touches[0].clientY;
            });
            this.touchmove(function (evt) {
                let x = evt.touches[0].clientX;
                let y = evt.touches[0].clientY;
                let xDiff = x - theMouseMoveCastingForNooJS.x;
                let yDiff = y - theMouseMoveCastingForNooJS.y;
                if (Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                    if ( xDiff < 0 ) {
                        theCallback(1, x, y);
                    } else {
                        theCallback(2, x, y);
                    }
                } else {
                    if ( yDiff < 0 ) {
                        theCallback(3, x, y);
                    } else {
                        theCallback(4, x, y);
                    }
                }
                theMouseMoveCastingForNooJS.x = x;
                theMouseMoveCastingForNooJS.y = y;
            });
            return this;
        },

        setEvent: function (eventName, theFunction){
            for(let x = 0; x < theSelectedElements.length; x++) {
                theSelectedElements[x].addEventListener(eventName, theFunction);
            }
        }

    };
});