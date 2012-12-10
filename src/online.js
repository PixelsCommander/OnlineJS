(function (w){
    w.internetConnection = w.internetConnection || {};

    w.internetConnection.addEvent = function(obj, type, callback){
        if (window.attachEvent){
            obj.attachEvent('on' + type, callback);
        } else {
            obj.addEventListener(type, callback);
        }   
    }

    var xmlhttp = new XMLHttpRequest();

    w.internetConnection.isXMLHttp = function(){
        return "withCredentials" in xmlhttp;
    }

    w.internetConnection.isXDomain = function(){
        return typeof XDomainRequest != "undefined";   
    }

    //For IE we use XDomainRequest and sometimes it uses a bit different logic, so adding decorator for this
    w.internetConnection.XDomainLogic = {
        init: function(){
            xmlhttp = new XDomainRequest();
            xmlhttp.onerror = function(){
                xmlhttp.status = 404;
                w.internetConnection.processXmlhttpStatus();
            }
            xmlhttp.ontimeout = function(){
                xmlhttp.status = 404;
                w.internetConnection.processXmlhttpStatus();
            }
        },
        onInternetAsyncStatus: function(){
            try {
                xmlhttp.status = 200;
                w.internetConnection.processXmlhttpStatus();
            } catch(err){
                w.internetConnection.fireHandlerDependOnStatus(false);
                w.onLine = false;
            }
        },
        checkConnectionWithRequest: function(async){
            xmlhttp.onload = w.internetConnection.logic.onInternetAsyncStatus;

            var url = w.onLineCheckURL();

            xmlhttp.open("GET", url);
            xmlhttp.send();
        }
    }

    //Another case for decoration is XMLHttpRequest
    w.internetConnection.XMLHttpLogic = {
        init: function(){

        },
        onInternetAsyncStatus: function(){
            if (xmlhttp.readyState === 4){
                try {
                    w.internetConnection.processXmlhttpStatus();
                } catch(err){
                    w.internetConnection.fireHandlerDependOnStatus(false);
                    w.onLine = false;
                }
            }
        },
        checkConnectionWithRequest: function(async){
            if (async) {
                xmlhttp.onreadystatechange = w.internetConnection.logic.onInternetAsyncStatus;
            } else {
                xmlhttp.onreadystatechange = undefined;
            }

            var url = w.onLineCheckURL();
            xmlhttp.open("HEAD", url, async);    
            xmlhttp.send();

            if (async === false) {
                w.internetConnection.processXmlhttpStatus();
                return w.onLine;
            }    
        }
    }

    if (w.internetConnection.isXDomain()) {
        w.internetConnection.logic = w.internetConnection.XDomainLogic;
    } else {
        w.internetConnection.logic = w.internetConnection.XMLHttpLogic;
    }

    w.internetConnection.logic.init();

    w.internetConnection.processXmlhttpStatus = function(){
        var tempOnLine = w.internetConnection.verifyStatus(xmlhttp.status);
        w.internetConnection.fireHandlerDependOnStatus(tempOnLine);
        w.onLine = tempOnLine;  
    }

    w.internetConnection.verifyStatus = function(status){
        return ( status >= 200 && status < 300 || status === 304 )  
    }

    w.internetConnection.fireHandlerDependOnStatus = function (newStatus){
        if (newStatus === true && w.onLineHandler !== undefined && (w.onLine !== true || w.internetConnection.handlerFired === false)){
            w.onLineHandler();  
        }
        if (newStatus === false && w.offLineHandler !== undefined && (w.onLine !== false || w.internetConnection.handlerFired === false)){
            w.offLineHandler(); 
        }
        w.internetConnection.handlerFired = true;
    }
    
    w.internetConnection.startCheck = function (){
        setInterval("window.internetConnection.logic.checkConnectionWithRequest(true)",w.onLineCheckTimeout);    
    }
    
    w.internetConnection.stopCheck = function (){
        clearInterval("window.internetConnection.logic.checkConnectionWithRequest(true)",w.onLineCheckTimeout);  
    }

    w.checkOnLine = function(){
        w.internetConnection.logic.checkConnectionWithRequest(false);
    }
    
    w.onLineCheckURL = function(){
        return "http://www.pixelsresearch.com/online.php?r=" + Math.random();
    }

    w.onLineCheckTimeout = 5000;
    w.checkOnLine();
    w.internetConnection.startCheck();
    w.internetConnection.handlerFired = false;

    w.internetConnection.addEvent(w, 'load', function(){
        w.internetConnection.fireHandlerDependOnStatus(w.onLine);   
    });

    w.internetConnection.addEvent(w, 'online', function(){
        window.internetConnection.logic.checkConnectionWithRequest(true);
    });
    w.internetConnection.addEvent(w, 'offline', function(){
        window.internetConnection.logic.checkConnectionWithRequest(true);
    });
})(window);