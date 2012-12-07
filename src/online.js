(
	function (w){
	     	
	    w.internetConnection = w.internetConnection || {};

	    var xmlhttp = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );

	    w.internetConnection.onInternetStatus = function (){
	    	if (xmlhttp.readyState==4){
		        try {
		            if (xmlhttp.status==200){
			            if (w.onLineHandler !== undefined && w.onLine !== true){
			            	w.onLineHandler();	
			            }
			            w.onLine = true;
			            return;
			        } else {
			          	if (w.offLineHandler !== undefined && w.onLine !== false){
			            	w.offLineHandler();	
			            }
			            w.onLine = false;
			        }
			    } catch(err){
			    	if (w.offLineHandler !== undefined && w.onLine !== false){
		            	w.offLineHandler();	
		            }
		            w.onLine = false;
			    }
		  	}
	    }
	    
	     w.internetConnection.checkonLine = function (){
	    	if (xmlhttp!=null){
		        xmlhttp.onreadystatechange=this.onInternetStatus;
		        xmlhttp.open("HEAD",w.onLineCheckURL,true);
		        xmlhttp.send();
		    }
	    }
	    
	    w.internetConnection.startCheck = function (){
	    	w.internetConnection.checkonLine();
	    	setInterval("window.internetConnection.checkonLine()",w.onLineCheckTimeout);	
	    }
	    
	    w.internetConnection.stopCheck = function (){
	    	clearInterval("window.internetConnection.checkonLine()",w.onLineCheckTimeout);	
	    }
	    return this;	
	    
		w.onLineCheckURL = "http://www.pixelsresearch.com/onLine.php?r=" + Math.random();
	    w.onLineCheckTimeout = 5000;
	    w.internetConnection.startCheck();
	} 
)(window);