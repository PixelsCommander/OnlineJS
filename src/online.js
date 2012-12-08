(function (w){
    w.internetConnection = w.internetConnection || {};

    w.internetConnection.addEvent = function(obj, type, callback){
        if (window.attachEvent){
            obj.attachEvent('on' + type, callback);
        } else {
            obj.addEventListener(type, callback);
        }   
    }

    var xmlhttp = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );

    w.internetConnection.onInternetAsyncStatus = function (){
        if (xmlhttp.readyState==4){
            try {
                w.internetConnection.processXmlhttpStatus();
            } catch(err){
                w.internetConnection.fireHandlerDependOnStatus(false);
                w.onLine = false;
            }
        }
    }
    
     w.internetConnection.checkConnectionWithRequest = function (sync){
        if (xmlhttp!=null){
            xmlhttp = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
            if (sync === undefined) {
                xmlhttp.onreadystatechange = this.onInternetAsyncStatus;
            } else {
                xmlhttp.onreadystatechange = undefined;
            }

            if (sync === undefined) {
                sync = true;
            }

            var url = w.onLineCheckURL();

            xmlhttp.open("HEAD", url, sync);
            xmlhttp.send();

            if (sync === false){
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
        setInterval("window.internetConnection.checkConnectionWithRequest()",w.onLineCheckTimeout);    
    }
    
    w.internetConnection.stopCheck = function (){
        clearInterval("window.internetConnection.checkConnectionWithRequest()",w.onLineCheckTimeout);  
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

    w.internetConnection.addEvent(w, 'load', function(){
        w.internetConnection.fireHandlerDependOnStatus(w.onLine);   
    });

    w.internetConnection.addEvent(w, 'online', function(){
        window.internetConnection.checkConnectionWithRequest();
    });
    w.internetConnection.addEvent(w, 'offline', function(){
        window.internetConnection.checkConnectionWithRequest();
    });
})(window);