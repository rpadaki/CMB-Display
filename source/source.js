$(document).ready(function(){
	var dispWindow;
	dispWindow = window.open("display.html");
	$(dispWindow).ready(function(){
		$("table td").click(function(){
	    	var pos = [$(this).parent("tr")[0].rowIndex, this.cellIndex];
	    	var data = "data/" + pos[0] + pos[1] + ".xml";
	    	var xhttp = new XMLHttpRequest();
	    	xhttp.onreadystatechange = function() {
	    		if (xhttp.readyState == 4 && xhttp.status == 200) {
	    			insert(xhttp, dispWindow);
	    		}
	    	}
	    	xhttp.open("GET", data, true);
	    	xhttp.send();
		});
	});
});

function insert(xml, dispWindow) {
	var xmlDoc = xml.responseXML;
	var title = $(dispWindow.document).contents().find("#page-title");
	var text = $(dispWindow.document).contents().find("#text");
	var image = $(dispWindow.document).contents().find("#image");
	var expl = $(dispWindow.document).contents().find("#explanation");
	var mapDisp = $(dispWindow.document).contents().find("#map");
	var doMap = typeof(xmlDoc.getElementsByTagName("map")[0].childNodes[0]) != 'undefined';
	var doImg = typeof(xmlDoc.getElementsByTagName("image")[0].childNodes[0]) != 'undefined';
	$(title).addClass("clear");
	$(text).addClass("clear");
	$(expl).addClass("clear");
	setTimeout(function(){
		$(title).html(xmlDoc.getElementsByTagName("question")[0].childNodes[0].nodeValue);
		$(text).html(xmlDoc.getElementsByTagName("answer")[0].childNodes[0].nodeValue).fadeIn();
		$(expl).html(xmlDoc.getElementsByTagName("explanation")[0].childNodes[0].nodeValue).fadeIn();
		$(title).removeClass("clear");
		$(text).removeClass("clear");
		$(expl).removeClass("clear");
	}, 1000);
	if (!doMap && !doImg) {
		$(mapDisp).css("flex-grow", 0);
		$(image).css("flex-grow",0);
		setTimeout(function(){
			$(mapDisp).css("display","none");
			$(image).css("display","none");
		}, 1000);
	}
	else if (!doMap && doImg) {
		$(mapDisp).css("flex-grow","0");
		$(image).css("display","inline");
		setTimeout(function(){
			$(mapDisp).css("display","none");
			$(image).css("flex-grow", 1);
		},1000);
		setTimeout(function(){
			var imgUrl = xmlDoc.getElementsByTagName("image")[0].childNodes[0].nodeValue;
			$(image).html("<img src='"+imgUrl+"'>");
		}, 2000);
	}
	else if (doMap && !doImg) {
		$(mapDisp).css("display","inline");
		$(image).css("flex-grow",0);
		setTimeout(function(){
			$(mapDisp).css("flex-grow", 0.6);
			$(image).css("display","none");
		},1000);
		setTimeout(function(){
			var coords = xmlDoc.getElementsByTagName("map")[0].childNodes[0].nodeValue.split(";");
			var centr, zm;
			switch (coords[0]) {
				case "India":
					centr = {lat: 21.131, lng: 78.134};
					zm = 4;
					break;
				case "USA":
					centr = {lat: 37.6, lng: -95.66};
					zm = 3;
					break;
				case "Malaysia":
					centr = {lat: 3.139, lng: 101.687};
					zm = 4;
					break;
				case "World":
					centr = {lat: 0.000, lng: -3.500};
					zm = Math.ceil(Math.log2($(mapDisp).width())) - 8;
					break;
			}

			var map = new google.maps.Map(dispWindow.document.getElementById("map"), {
				center: centr,
	        	zoom: zm
			});
			for (var i = 1; i < coords.length; i++) {
				console.log("MARKER " + i);
				new google.maps.Marker({
					position: {lat: parseFloat(coords[i].split(",")[0]), lng: parseFloat(coords[i].split(",")[1])},
					map: map
				});
			}
		}, 2000);
	}
	else if (doMap && doImg) {
		$(mapDisp).css("display","inline");
		$(image).css("display","inline");
		setTimeout(function(){
			$(mapDisp).css("flex-grow", 1);
			$(image).css("flex-grow", 1);
		},1000);
		setTimeout(function(){
			var imgUrl = xmlDoc.getElementsByTagName("image")[0].childNodes[0].nodeValue;
			$(image).html("<img src='"+imgUrl+"'>");
			var coords = xmlDoc.getElementsByTagName("map")[0].childNodes[0].nodeValue.split(";");
			var centr, zm;
			switch (coords[0]) {
				case "India":
					centr = {lat: 21.131, lng: 78.134};
					zm = 4;
					break;
				case "USA":
					centr = {lat: 37.6, lng: -95.66};
					zm = 3;
					break;
				case "Malaysia":
					centr = {lat: 3.139, lng: 101.687};
					zm = 4;
					break;
				case "World":
					centr = {lat: 0.000, lng: -3.500};
					zm = Math.ceil(Math.log2($(mapDisp).width())) - 8;
					break;
			}

			var map = new google.maps.Map(dispWindow.document.getElementById("map"), {
				center: centr,
	        	zoom: zm
			});
			for (var i = 1; i < coords.length; i++) {
				new google.maps.Marker({
					position: {lat: parseFloat(coords[i].split(",")[0]), lng: parseFloat(coords[i].split(",")[1])},
					map: map
				});
			}
		}, 2000);
	}
}