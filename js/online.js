(
	function (w){
		
	     var OnLine = function(w){
	     	
	    	if (w.XMLHttpRequest){
		        var xmlhttp=new XMLHttpRequest()
		    } else if (w.ActiveXObject){
		        var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
		    }
		    
		    this.onInternetStatus = function (){
		    	if (xmlhttp.readyState==4){
			        try {
			            if (xmlhttp.status==200){
				            if (w.onlineHandler !== undefined && w.online !== true){
				            	w.onlineHandler();	
				            }
				            w.online = true;
				            return;
				        } else {
				          	if (w.offlineHandler !== undefined && w.online !== false){
				            	w.offlineHandler();	
				            }
				            w.online = false;
				        }
				    } catch(err){
				    	if (w.offlineHandler !== undefined && w.online !== false){
			            	w.offlineHandler();	
			            }
			            w.online = false;
				    }
			  	}
		    }
		    
		     this.checkOnLine = function (){
		    	if (xmlhttp!=null){
			        xmlhttp.onreadystatechange=this.onInternetStatus;
			        xmlhttp.open("GET",w.onlineCheckURL,true);
			        xmlhttp.send(null);
			    }
		    }
		    
		    this.startCheck = function (){
		    	window.internetConnection.checkOnLine();
		    	setInterval("window.internetConnection.checkOnLine()",w.onlineCheckTimeout);	
		    }
		    
		    this.stopCheck = function (){
		    	clearInterval("window.internetConnection.checkOnLine()",w.onlineCheckTimeout);	
		    }
		    return this;	
	    }
	    
		w.onlineCheckURL = "http://www.pixelsresearch.com/online.php";
	    w.onlineCheckTimeout = 5000;
	    w.internetConnection = new OnLine(window);
	    w.internetConnection.startCheck();
	} 
)(window);
