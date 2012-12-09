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

    if (w.internetConnection.isXDomain()) {
        xmlhttp = new XDomainRequest();
        xmlhttp.onerror = function(){
            xmlhttp.status = 404;
            w.internetConnection.processXmlhttpStatus();
        }
        xmlhttp.ontimeout = function(){
            xmlhttp.status = 404;
            w.internetConnection.processXmlhttpStatus();
        }
    }

    w.internetConnection.onInternetAsyncStatus = function (){
        try {
            if (w.internetConnection.isXDomain()){
                xmlhttp.status = 200;
            }
            w.internetConnection.processXmlhttpStatus();
        } catch(err){
            w.internetConnection.fireHandlerDependOnStatus(false);
            w.onLine = false;
        }
    }
    
     w.internetConnection.checkConnectionWithRequest = function (async){
        if (xmlhttp!=null){

            if (async) {
                xmlhttp.onload = w.internetConnection.onInternetAsyncStatus;
            } else {
                xmlhttp.onload = undefined;
            }

            var url = w.onLineCheckURL();

            if (w.internetConnection.isXDomain()){
                xmlhttp.open("GET", url);
            } else {
                xmlhttp.open("HEAD", url, async);    
            }

            xmlhttp.send();

            if (async === false && !w.internetConnection.isXDomain()){
                w.internetConnection.processXmlhttpStatus();
                return w.onLine;
            }
        }
    }

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
        setInterval("window.internetConnection.checkConnectionWithRequest(true)",w.onLineCheckTimeout);    
    }
    
    w.internetConnection.stopCheck = function (){
        clearInterval("window.internetConnection.checkConnectionWithRequest(true)",w.onLineCheckTimeout);  
    }

    w.checkOnLine = function(){
        w.internetConnection.checkConnectionWithRequest(false);
    }
    
    w.onLineCheckURL = function(){
        return "http://www.pixelsresearch.com/online.php?r=" + Math.random();
    }

    w.onLineCheckTimeout = 5000;
    w.checkOnLine();
    w.internetConnection.startCheck();
    w.internetConnection.handlerFired = false;

    xmlhttp.onload = w.internetConnection.onInternetAsyncStatus;

    w.internetConnection.addEvent(w, 'load', function(){
        w.internetConnection.fireHandlerDependOnStatus(w.onLine);   
    });

    w.internetConnection.addEvent(w, 'online', function(){
        window.internetConnection.checkConnectionWithRequest(true);
    });
    w.internetConnection.addEvent(w, 'offline', function(){
        window.internetConnection.checkConnectionWithRequest(true);
    });
})(window);