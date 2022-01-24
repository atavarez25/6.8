//
//import Signal from "lib/signal.js"
const body = document.getElementById("body");
let RunningDialog;

const Locations = {
	Test: {
		Children: ["RedRoom","GreenRoom"]
	},
	RedRoom: {
		Children: ["Test"]
	},
	GreenRoom: {
		Children: ["Test"]
	}
}

const LocationCallbacks = {
	Test: function() {
		$("body").css("background","rgb(0,64,128)");
		console.log('s');
	},

	RedRoom: function() {
		$("body").css("background","rgb(200,32,0)");
	},

	GreenRoom: function() {
		$("body").css("background","rgb(0,200,32)");
	},
}

function Clear(Dom) {
	let i = 0;
	while (Dom.firstChild) {
		i ++
		Dom.firstChild.remove();

		if (i > 25) {
			break
		}
	}
}

class Signal {
	constructor() {
		this.Callbacks = [];
	}

	Connect(func) {
		this.Callbacks[this.Callbacks.length] = func;
	}

	Fire() {
		for (let i = 0; i < this.Callbacks.length; i ++) {
			this.Callbacks[i](arguments);
		}
	}
}


class Prompt {
	constructor(tag,inner) {
		this.Html = [tag,inner];
		this.Activated = new Signal();
		this.Disabled = new Signal();

		this.Dom = null;
		this.Enabled = false;
	}

	Activate(Parent) {
		if (!this.Enabled) {
			this.Enabled = true;
			this.Dom = document.createElement(this.Html[0]);
			this.Dom.innerHTML = this.Html[1];

			Parent.appendChild(this.Dom);
			this.Activated.Fire(this.Dom);
		}
	}

	Disable() {
		if (this.Enabled) {
			this.Enabled = false;
			this.Dom.remove();
			this.Disabled.Fire();
		}
	}

	Set(attrs) {
		for (let i = 0; i < attrs.length; i ++) {
			this.Dom.setAttribute(attrs[i][0],attrs[i][1]);
		}
	}

	GetDom() {
		console.log(this.Dom);
		return this.Dom;
	}
}


class Dialog {
	constructor(InitialText,Color) {
		this.DialogRunning = false;
		this.Prompt = new Prompt("p",InitialText);
		$("#Dialog").css("Color",Color);

		this.Prompt.Activated.Connect(function(Prompt2) {
			Prompt2[0].setAttribute("id","Dialog");
		});
	}

	Activate(Parent) {
		this.Prompt.Activate(Parent);
	}

	Disable() {
		this.Prompt.Disable()
	}

	ChangeText(Text,Speed) {
		if (!this.DialogRunning) {
			this.DialogRunning = true;
			setTimeout(() => {this.DialogRunning = false;},Speed * Text.length);

			this.Prompt.Dom.innerHTML = "";
			for (let i = 0; i < Text.length; i ++) {
				setTimeout(() => {this.Prompt.Dom.innerHTML = this.Prompt.Dom.innerHTML + Text[i]},Speed * i);
			}
		}
	}
}
function LoadNodes(Location,cls,Nav,Point) {
	$("."+Point).show();
	
	for (let i = 0; i < Location.Children.length; i ++) {
			let Li = document.createElement("button");
			Li.innerHTML = Location.Children[i];
			console.log(Nav);
			Nav.appendChild(Li);

//			if (Locations[Location.Children[i]]) {
				Li.onclick = function() {
					$("."+Point).hide();
					cls.Pressed.Fire(Point);
					Clear(Nav);
					cls.Point = Li.innerHTML;
					LocationCallbacks[cls.Point]();

					LoadNodes(Locations[Li.innerHTML],cls,Nav,Li.innerHTML);
				}
//			}
		}
}


class Navigator {
	constructor(StartPoint) {
		this.Prompt = new Prompt("div","");
		this.Pressed = new Signal();
		this.Point = StartPoint;
		this.Prompt.Activate(document.getElementById("body"));
		this.Dom = this.Prompt.GetDom();

		let Nav = document.createElement("div");
		this.Dom.setAttribute("id","Navigator");
		Nav.setAttribute("id","NavUL");

		let Location = Locations[StartPoint];
		

		this.Update = function(Point) {
			this.Pressed.Fire(Point);
			Clear(this.Dom);
		}



//`		for (let i = 0; i < Location.Children.length; i ++) {
//			let Li = document.createElement("button");
//			Li.innerHTML = Location.Children[i];
//
//			if (Locations[Location.Children[i]]) {
//				Li.onclick = function() {
//					this.Pressed.Fire(Point);
//					Clear(this.Dom);
//					this.Point
//				}
//			}

//			Nav.appendChild(Li);
//		}

		LoadNodes(Location,this,Nav,StartPoint)

		this.Dom.appendChild(Nav);
		document.getElementById("body").appendChild(this.Dom);
		LocationCallbacks[StartPoint]();
	}
}

for (const [key,value] of Object.entries(Locations)) {
	$("."+key).hide();
}

let NewDialog = new Dialog("Prompt test")
let Navigate = new Navigator("Test");



$("#cre").click(function() {
	NewDialog.Activate(document.getElementById("DialogContainer"));
	setTimeout(() => {NewDialog.ChangeText("Dialog class test",50);},1000)
}); 

$("#rem").click(function() {
	NewDialog.Disable();
});
