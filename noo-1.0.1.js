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
    noo.browser = {
        footprint: function () {

                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                // https://www.browserleaks.com/canvas#how-does-it-work
                let txt = 'CANVAS_FINGERPRINT';
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125,1,62,20);
                ctx.fillStyle = "#069";
                ctx.fillText(txt, 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText(txt, 4, 17);
                return noo.string(canvas.toDataURL()).hash();

        }
    };
    noo.string = function (string) {
        return {
            hash: function () {
                let hs = 0;

                if (string.length === 0) return hs;

                for (i = 0; i < string.length; i++) {
                    let char = string.charCodeAt(i);
                    hs = ((hs << 5) - hs) + char;
                    hs = hs & hs;
                }
                return hs;
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
        if(typeof arguments[x] === 'object') {
            theSelectedElements.push(arguments[x]);
        } else {
            let elements = document.querySelectorAll(arguments[x]);
            for(let y = 0; y < elements.length; y++) {
                theSelectedElements.push(elements[y]);
            }
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
        dblclick: function (callback) {
            this.setEvent("dblclick", callback);
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
        swipe: function () {
            let theCallback = arguments;
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
                        theCallback[0](x, y);
                    } else {
                        theCallback[1](x, y);
                    }
                } else {
                    if ( yDiff < 0 ) {
                        theCallback[3](x, y);
                    } else {
                        theCallback[4](x, y);
                    }
                }
                theMouseMoveCastingForNooJS.x = x;
                theMouseMoveCastingForNooJS.y = y;
            });
            return this;
        },
        scrollLeft: function() {
            for(let x = 0; x < theSelectedElements.length; x++) {
                theSelectedElements[x].scrollBy({
                    top: 0,
                    left: 350,
                    behavior: "smooth"
                });
            }
        },
        scrollRight: function () {
            for(let x = 0; x < theSelectedElements.length; x++) {
                theSelectedElements[x].scrollBy({
                    top: 0,
                    left: -350,
                    behavior: "smooth"
                });
            }
        },
        scrollUp: function () {
            for(let x = 0; x < theSelectedElements.length; x++) {
                theSelectedElements[x].scrollBy({
                    top: 350,
                    left: 0,
                    behavior: "smooth"
                });
            }
        },
        scrollDown: function () {
            for(let x = 0; x < theSelectedElements.length; x++) {
                theSelectedElements[x].scrollBy({
                    top: -350,
                    left: 0,
                    behavior: "smooth"
                });
            }
        },
        setEvent: function (eventName, theFunction){
            for(let x = 0; x < theSelectedElements.length; x++) {
                theSelectedElements[x].addEventListener(eventName, theFunction);
            }
        }

    };
});