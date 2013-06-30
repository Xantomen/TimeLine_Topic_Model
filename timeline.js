Timeline = {};

$(document).ready(function () {

	tm = new Timeline.Bar();
	
	$('body').click(function(){
	
	
	//tm.actual_Zoom+=1;
	
	//tm.deleteDateUnits();
	//tm.calculateNumberAndSizeUnits();
	//tm.createDateUnits(tm.number_Units);
	//tm.moveDateUnits(-3);
	
	});
	
	
});		





Timeline.Range = function(from, to)
{
	var self = this;
	
	this.from 	= from;
	this.to 	= to;
	this.center = null;


	this.init = function()
	{
		self.center = (( self.from + (self.to - self.from)/2) );	
	}
	
	
	
	self.init();
	
	

}


Timeline.Bar = function()
{
	var self = this;
	var mmToMonth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");	
	
	
	this.actual_Zoom = 0;
	
	//this.number_Units = 0;
	//this.size_Units = 0;
	
	this.dateUnitsLeftArray = [];
	this.dateUnitsRightArray = [];
	
	
	this.left_bar 	= null;
	this.right_bar	= null;
	
	this.paper      = null;
	
	this.atomic_Unit = 1000*60*60*24;
	
	this.number_Visible_Units = 10;
	
	this.number_Total_Units = 3*self.number_Visible_Units;
	
	this.pixels_Per_Unit = 0;
	
	this.originalPositionLeftBar = 0;
	this.originalPositionRightBar = 0;
	
	this.actualPositionLeftBar = 0;
	this.actualPositionRightBar = 0;
	
	this.zoom_Value = 1;
	
	this.date_Center_Number = 0;

	/*this.rangeFrom = 0;
	this.rangeTo = 0;*/
	this.rangeCenter = 0;
	
	this.movs_Per_Click = 1;

	this.dateformat = function (timestamp)
	{
		var dt = new Date(timestamp);
		var mm = mmToMonth[dt.getMonth()];
		
		var hours = dt.getHours();
		if (hours < 10) hours = "0" + hours; 
		
		var minutes = dt.getMinutes();
		if (minutes < 10) minutes = "0" + minutes;
		
		return dt.getDate() + "-" + mm /*+ "-" + dt.getFullYear()*/;
	}, 	



	this.paint_bars = function()
	{
		
		var g = document.getElementById("leftbar");
	    var w = $("#leftbar").width();
	    var h = $("#leftbar").height(); 
	    
	    
	    /*var sw = $("#actual_date").width();
	    var sh = $("#actual_date").height();    
	    
	    var bar_width = w*0.5 - sw*0.5;*/
	    
	    self.leftpaper = Raphael(g, w, h);
	    
	    
	   	self.left_bar = self.leftpaper.rect(0, 0, w, h);
	    self.left_bar.attr("fill", "yellow");
	    //self.left_bar.node.id = "leftbar";
	    
	   
	    
	    g = document.getElementById("rightbar");
	    w = $("#rightbar").width();
	    h = $("#rightbar").height(); 
	    
	    self.rightpaper = Raphael(g, w, h);
	    	
	    self.right_bar = self.rightpaper.rect(0, 0, w, h);
	    self.right_bar.attr("fill", "orange");
	    //self.right_bar.node.id = "rightbar";
	    
		
	},

	this.paint_timeline = function()
	{
		var d = self.range.center;
		var date_str = self.dateformat(d);	
			
			
		var s = '<div id = "timeline">';
		
		 	s += '<div id = "leftbar_container">';
		 		s += '<div id = "leftbar"></div>';
		 	s += '</div>';
		 	s += '<div id = "rightbar_container">';
			 s += '<div id = "rightbar"></div>';
		 	s += '</div>';
			s += '<div id = "actual_date">';
				
				s += '<div id = "leftarrow"> << </div>';
				s += '<div id = "rightarrow"> >> </div>';
				
				s += '<div id = "actual_date_text">' + date_str + '</div>';
		 
		 	s += '</div>';
		s += '</div>';
		
		$("body").append(s);	
		
		
		
		var w =parseFloat($('#leftbar_container').css("width"))*3;//window.innerWidth*1.5;
		
		
		
		
		$('#leftbar').css("width",w);
		$('#rightbar').css("width",w);
		
			
		
		$('#leftbar').draggable({

	        axis : "x",
	
	        start : function(event, ui) {
	        },
	
	        drag : function(event, ui){
	
	        	console.log("Dragging");
	
	        },
	
	
	        stop : function(event, ui) {
	
	        	console.log("Stopped");
        	}
    	});
    	
    	$('#rightbar').draggable({

	        axis : "x",
	
	        start : function(event, ui) {
	        },
	
	        drag : function(event, ui){
	
	        	console.log("Dragging");
	
	        },
	
	
	        stop : function(event, ui) {
	
	        	console.log("Stopped");
        	}
    	});
		
		
		
		$('#leftarrow').click(function(){
			
			
			self.moveBars(0,0,"left");
			
		});
		
		$('#rightarrow').click(function(){
			
			
			self.moveBars(0,0,"right");
			
		});
		
		
	}

	this.createBarRanges = function() {
		
		
		
		self.LeftRange.range = self.number_Total_Units*self.atomic_Unit;
		
		self.LeftRange.from = self.range.center - 2* self.number_Visible_Units * self.atomic_Unit;
		
		self.LeftRange.to = self.range.center + self.number_Visible_Units * self.atomic_Unit;
		
		
		
		self.RightRange.range = (self.number_Total_Units+1)*self.atomic_Unit ;
		
		self.RightRange.from = self.range.center - self.number_Visible_Units * self.atomic_Unit;
		
		self.RightRange.to = self.range.center + ((2 * self.number_Visible_Units)+1) * self.atomic_Unit;
		
		
		//self.moveBars(self.LeftRange.from,self.RightRange.from,0);
		
		self.setOriginalPositionBars();
		
	}

	
	this.moveBars = function(tsleft,tsright,direction) {
		
				
		//var amount = //self.pixels_Per_Unit * self.zoom_Value;
		
				
		var tsunits = 0;
				
		switch(direction)
		{
			
			
			case "left":
			
				
				tsunits = - self.atomic_Unit * self.movs_Per_Click;
				
				
				//tsunits = - self.atomicUnit * self.zoom_Value;/*tsunits= self.date_Center_Number - self.atomic_Unit * self.zoom_Value;				
				//tsunits= tsunits - self.date_Center_Number;
				self.moveDistance(tsunits);
				
			break;
			
			case "right":
				
				tsunits = + self.atomic_Unit * self.movs_Per_Click;
				//self.date_Center_Number = self.date_Center_Number + self.atomic_Unit * self.zoom_Value;
				//tsunits=self.date_Center_Number;
				self.moveDistance(tsunits);
				
			break;
			
			default:
				
				
				
					
			 break;
		}
		
	}

	this.setOriginalPositionBars = function() {
		
		$('#leftbar').css("left",self.originalPositionLeftBar);
		$('#rightbar').css("left",self.originalPositionRightBar);
		self.actualPositionLeftBar = self.originalPositionLeftBar;
		self.actualPositionRightBar = self.originalPositionRightBar;
	}

	this.moveDistance = function(tsunits) {
		
			
			//$('#leftbar').css("left",parseFloat($('#leftbar').css("left"))+distance);
			//$('#rightbar').css("left",parseFloat($('#rightbar').css("left"))+distance);
			
			//self.actualPositionLeftBar += distance;
			//self.actualPositionRightBar += distance;
			
			self.updateRangeValues(tsunits);
			
			$("#actual_date_text").text(self.dateformat(self.range.center));
						
			
			//alert($("#leftbar_container").css("width"));
			//alert(parseInt($("#leftbar_container").css("width"))/self.number_Visible_Units);
			//alert(distance);
			self.resetBars();
			/*alert( moveL - oriL);
			alert(distance); 
			*/
	}
	/*this.calculateNumberAndSizeUnits = function()
	{
		
		var actualzoom=self.actual_Zoom;
				
		switch(actualzoom)
		{
			
			case 0:
				self.number_Units = 4;
				self.size_Units = $('#leftbar').attr("width")/self.number_Units;
				
			break;
			
			case 1:
				self.number_Units = 5;
				self.size_Units = $('#leftbar').attr("width")/self.number_Units;
				
			break;
			
			case 2:
				self.number_Units = 6;
				self.size_Units = $('#leftbar').attr("width")/self.number_Units;
				
			break;
			
			default:
				self.number_Units = 7;
				self.size_Units = $('#leftbar').attr("width")/self.number_Units;
				
			break;	
				
		}
		
		
	}*/
	
	
	this.createDateUnits = function(numberunits)
	{
		
		
		var w = $("#leftbar").width();
	    var h = $("#leftbar").height(); 
	       
	    //var sw = $("#actual_date").width();
	   // var sh = $("#actual_date").height();    
	    
		
		var actualPositionLeft=0;//self.actualPositionLeftBar;
		var actualPositionRight=0;//self.actualPositionRightBar;

		var left_unit;
		var right_unit;

		var actualDateLeft= self.LeftRange.from;
		var actualDateRight= self.RightRange.from+self.atomic_Unit;

							
		for(i=1; i<numberunits+1; i++,actualDateLeft+=self.atomic_Unit,actualDateRight+=self.atomic_Unit,actualPositionRight+=self.pixels_Per_Unit,actualPositionLeft+=self.pixels_Per_Unit)
		{
			
						
			left_unit = self.leftpaper.rect(actualPositionLeft, 0, self.pixels_Per_Unit, h);
	    	left_unit.attr("fill", "purple");
	    	left_unit.node.id = "left_date_unit"+i;
	    	 	
	    	self.dateUnitsLeftArray.push(left_unit);
	    	    	
	    	left_unit = self.leftpaper.text(actualPositionLeft+30, 25, self.dateformat(actualDateLeft)).attr({fill: '#000000'});
	       	left_unit.node.id = "left_text_unit"+i;
	    	
	    	
	    		$("#left_text_unit"+i).css("font-size", "20px");
	    		    	
	    	right_unit = self.rightpaper.rect(actualPositionRight, 0, self.pixels_Per_Unit, h);
	    	right_unit.attr("fill", "red");
	    	right_unit.node.id = "right_date_unit"+i;
	    	
	    	self.dateUnitsRightArray.push(right_unit);
	    	
	    
	    	
	    	right_unit = self.rightpaper.text(actualPositionRight+30, 25, self.dateformat(actualDateRight)).attr({fill: '#000000'});
	        right_unit.node.id = "right_text_unit"+i;
	        
	        	$("#right_text_unit"+i).css("font-size", "20px");
		}
		
		
	}
		
	this.deleteDateUnits = function() 
	{
		
		if(self.dateUnitsLeftArray&&self.dateUnitsRightArray)
		{
			
			for (i=self.dateUnitsLeftArray.length; i>0; i--)
			{
				self.dateUnitsLeftArray[i-1].remove();
				self.dateUnitsRightArray[i-1].remove();
			}
			
			self.dateUnitsLeftArray.splice(0,self.dateUnitsLeftArray.length);
			self.dateUnitsRightArray.splice(0,self.dateUnitsRightArray.length);
		}
		
		
	}
	
	
		
	this.resetBars = function()
	{
		self.deleteDateUnits();
		
		//alert(self.rangeFrom + "eeee   " + self.rangeTo + "   ggg " + self.rangeCenter);
		
		
		//self.paint_timeline();	
		
		
		self.updatePixels_Per_Unit();
		
		
		//self.updateOriginalPositionBars();
			
		self.createBarRanges();
		
		self.paint_bars();	
		
		
		self.createDateUnits(self.number_Total_Units);
		
	}
	
	/*this.moveDateUnits = function(direction) 
	{
		
		if(self.dateUnitsArray)
		{
			
			for (i=self.dateUnitsArray.length; i>0; i--)
			{
				self.dateUnitsArray[i-1].attr("x",self.dateUnitsArray[i-1].attr("x")-self.dateUnitsArray[i-1].attr("width"));
			}
		
				
		}
		
		
	}*/

	this.updateZoom = function()
	{
		
		
		switch(self.zoom_Value)
		{
			case 1:
				self.number_Visible_Units = 4;
				
				break;
			case 2:
				self.number_Visible_Units = 8;
				break;
			case 3:
				self.number_Visible_Units = 10;
				break;
			case 4:
				self.number_Visible_Units = 12;
				break;
			default:
				self.number_Visible_Units = 14;
				self.zoom_Value = 0;
				break;
			
		}
		
		self.zoom_Value +=1;
		self.number_Total_Units = self.number_Visible_Units * 3;
		self.moveBars(0,0,0);
		
		
	}

	this.updatePixels_Per_Unit = function() 
	{
		
		
		self.pixels_Per_Unit = (parseFloat($('#leftbar').css("width"))/self.number_Total_Units);
				
	}
	
	this.updateOriginalPositionBars = function()
	{
		self.originalPositionLeftBar=parseFloat($('#leftbar').css("left"))-parseFloat($('#leftbar').css("width"))*1/3;
		self.originalPositionRightBar=parseFloat($('#rightbar').css("left"))-parseFloat($('#leftbar').css("width"))*1/3;

		
	}

	this.updateRangeValues = function(tsunits)
	{
			
		self.range.from += tsunits;	
		self.range.to += tsunits;
		self.range.center += tsunits;//(self.range.from + ((self.range.to - self.range.from)*0.5) );	

	}

	this.init = function()
	{
		
		self.LeftRange = {};
		self.RightRange = {};
		
		var from = new Date("2013/01/01");
		var to = new Date("2013/07/01");
		
		from 	= (from.getTime());	
		to 	= (to.getTime());	
		
		// yyyy/MM/dd
		self.range = new Timeline.Range(from, to  );
	
		self.rangeFrom = self.range.from;
		self.rangeTo = self.range.to;
		
		self.rangeCenter = self.range.center;
	
		self.paint_timeline();	
		
		self.updatePixels_Per_Unit();
		
		self.updateOriginalPositionBars();
				
		self.createBarRanges();
		
		self.paint_bars();	
		
		//self.calculateNumberAndSizeUnits();
		
		self.createDateUnits(self.number_Total_Units);
		
		$('#actual_date_text').click(self.updateZoom);
				
		tm = this;
	
	}


	self.init();	
}

Timeline.DateUnit = function()
{
	var self = this;
	
	
	this.changeTextValue = function()
	{
		
		
		
	}
	
	
	this.init = function(){
		
		
	}
	
	self.init();

}

var tm;