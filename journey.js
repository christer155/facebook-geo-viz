
// Draws a path between two points 
function drawpath (canvas, pathstr, duration, attr, callback)
{
    var guide_path = canvas.path(pathstr).attr( { stroke: "none", fill: "none" } );
    var path = canvas.path( guide_path.getSubpath( 0, 1 ) ).attr( attr );
    var total_length = guide_path.getTotalLength( guide_path );
    var last_point = guide_path.getPointAtLength( 0 );
    var start_time = new Date().getTime();
    var interval_length = 50;
    var result = path; 
    var interval_id = setInterval( function()
        {
            var elapsed_time = new Date().getTime() - start_time;
            var this_length = elapsed_time / duration * total_length;
            var subpathstr = guide_path.getSubpath( 0, this_length );
            attr.path = subpathstr;
            path.animate( attr, interval_length );
            if ( elapsed_time >= duration )
            {
                clearInterval( interval_id );
                if ( callback != undefined ) callback();
                    guide_path.remove();
            }
         }, interval_length );
     return result;
 }


 window.onload = function () {

 	// TODO: 
 	// circle zoom out animation 
 	// have map fill up entire page, high opacity for middle 
 	// put down all my friends locations with marker being their faces? 
 	// Zoom in and out
 	// Don't recenter when next point still in bounds 
 	// timeline -- switch
 	// pause button 

 	// Create dictionary from locations 
 	var locations_map = {};
 	for (var i = 0; i < locations.length; i++) {
 		locations_map[locations[i].date] = i;
 	}

 	 // Initial map configuration, start off zoomed out
	var mapOptions = {
		center : {lat : 30, lng : -40},
		zoom : 2
	};

	// Create the map element
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	// Store location points 
	var points = [];
	
	// Animation object 
	var animation = function (locations) {
		var obj = {};

		// Index of location 
		obj.i = 0;

		obj.update = function (date) {
			this.i = locations_map[date];
		};

		var title = $("#slider-title");

		var line, pos, prev;
		obj.step = function () {
			if (obj.i < locations.length) {
				obj.i += 1;

				// Recenter
				map.setCenter({lat: locations[obj.i].lat, lng: locations[obj.i].lng});
				
				// Put down marker 
				pos = new google.maps.LatLng(locations[obj.i].lat, locations[obj.i].lng);
				points.push(new google.maps.Marker({
					map : map,
					position : pos,
					animation : google.maps.Animation.DROP,
					title: locations[obj.i].date
					//icon : "robotics_presentation/images/pink_MarkerH.png"
				}));

				title.text("Start journey from: " + locations[obj.i].date);

				// Add line 
				if (i > 0) {
					prev = {lat: locations[obj.i - 1].lat, lng: locations[obj.i - 1].lng};
					line = new google.maps.Polyline({
						path : [prev, pos],
						geodesic : true,
						strokeColor : "black",
						strokeOpacity : 0,
						strokeWeight : 1,
						icons: [{
						    icon: {path: 'M 0,-1 0,1', strokeWeight: 1.2, strokeOpacity: 1, scale: 4},
						    offset: '0',
						    repeat: '20px'
					  	}],
					});
					line.setMap(map);	
				}

				// Advance the animation 
				setTimeout(obj.step, 3000);
			}
		}; 

		return obj;
	}(locations);

	// Create date slider 
	$(function() {
	    var select = $("#slider-area");
	    var title = $("#slider-title");
	    var slider_length = locations.length;

	    // Add date options 
	    for (var i = 0; i < locations.length; i++) {
	    	select.append($("<option id=" + i + "> " + locations[i].date + "</option>"));
	    }

	    var sliderdiv = $("<div id='slider'></div>").insertAfter(select);
	    var slider = sliderdiv.slider({
	    	max: slider_length,
	    	slide: function (event, ui) {
	    		// Update text 
	      		title.text("Start journey from: " + locations[ui.value].date);
	      		// Restart animation 
	      		animation.update(locations[ui.value].date);
	      	}
	    });
	    //sliderdiv.css({"position": "absolute", "z-index": "99"});
	    select.hide();
	});

	// Zoom in to where first marker is
	setTimeout(function () {
		map.setCenter({lat: locations[0].lat, lng: locations[0].lng});
		map.setZoom(18);
	}, 1000);

	// Start the animation 
	setTimeout(animation.step, 1500);

 }

