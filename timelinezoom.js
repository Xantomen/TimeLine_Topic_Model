Zoomer = {};

Zoomer.Zoom = function(config)
{
var self = this;
this.div = "body";

this.zoom = 1;


this.init_wheel = function()
	{
		
	$(self.div).bind('mousewheel', function(event, delta) {
		
		/*if(delta > 0) self.zoom_in(delta);
		else self.zoom_out(delta);*/
		tm.updateZoom(delta);

	});
			
	}


/*this.zoom_in = function(speed)
	{

	self.zoom += 0.1;

	var scale = 'scale(' + self.zoom + ',' + self.zoom + ')';	
	$(testbed.div).css('transform', scale);
		
	}


this.zoom_out = function(speed)
	{
	console.log("Zoom Out");	
	
	self.zoom -= 0.1;
	var scale = 'scale(' + self.zoom + ',' + self.zoom + ')';	
	$(testbed.div).css('transform', scale);
	
	
	// $(testbed.div).css('transform', 'translate(50px, 30px) scale(0.5,0.5)');
	

	}



this.zoom_event = function(event)
	{
	// now event.clientX and event.clientY are absolute screen positions
	alert("x, " + event.clientX + " y: " + event.clientY);
	
	// they have to be converted to relative positions, relating to the div
	
	var pos = $(self.div).position();
	var x = event.clientX - pos.left;
	var y = event.clientY - pos.top;	
	
	alert("x, " + x + " y: " + y);	
	}*/


this.init = function()
	{
	if (config.div) self.div = "#" + config.div;
	if (config.wheel) self.init_wheel();
	
		
	/*$(self.div).dblclick(function(event){
			
		self.zoom_event(event);	
		});	
		*/
	}
	
self.init();	
}






var testbed;

$(document).ready(function () {
	
 config = {};
 config.div = "timeline";	
 config.wheel = true;	
	
	
		
 testbed = new Zoomer.Zoom(config);	

	
});	