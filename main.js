//import Signal from "/signal.js";

const body = document.getElementById("body");
const ChoicePrompt = document.getElementById("ChoicePrompt");
let RunningDialog;

let Time = 0;

function GetSpecefic(Dom,Attr,Name) {
	for (let i = 0; i < Dom.children.length; i ++) {
		let Element = Dom.children[i];

		if (Element.getAttribute(Attr) == Name) {
			return Element;
		}
	}
}

function ChoicePopup(c1,c2) { //c format: {Callback: Function,Text: String}
	$("#ChoicePrompt").show();

	let ChoiceContainer1 = GetSpecefic(ChoicePrompt.children[1],"id","ChoiceContainer1");
	let ChoiceContainer2 = GetSpecefic(ChoicePrompt.children[1],"id","ChoiceContainer2");

	$(ChoiceContainer1).text(c1.Text);
	ChoiceContainer2.textContent = c2.Text;
}

const Locations = {
	Test: {
		Children: ["RedRoom","GreenRoom","Game"]
	},
	RedRoom: {
		Children: ["Test"]
	},
	GreenRoom: {
		Children: ["Test"]
	},
	Game: {
		Children: ["Test","Home"]
	},
	FHome: {
		Children: ["Game"]
	},


	Hallway: {
		Children: ["Kitchen","LivingRoom","Outside"]
	},
	Kitchen: {
		Children: ['Hallway']
	},
	LivingRoom: {
		Children: ['Hallway']
	},
	Outside: {
		Children: ['Hallway',"Garage"]
	},
	Computer: {
		Children: ["BedRoom"],
	},
	Garage: {
		Children: ["Outside"]
	},
}

const ItemCallbacks = {
	Test: function(div) {
		alert("Ate apple");
	},
}

const LocationCallbacks = {
	Computer: function(div) {
//		let game = document.ad
//		div.setAttribute("src","https://wordrace-4inrow.coolmathgames.com/fourinarow");
	},
	Garage: function(div) {
		ChoicePopup(
			{Text: "Drive to work"},
			{Text: "Take the bus"}
		);
	},
	Outside: function(div) {
		$("body").css("background","lightblue")
	},
	Hallway: function(div) {
		$("body").css("background","grey")
	},
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
					if (LocationCallbacks[cls.Point]) {
						LocationCallbacks[cls.Point]();
					}

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
		this.Nav = Nav;

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
		if (LocationCallbacks[StartPoint]) {
			LocationCallbacks[StartPoint]();
		}
	}

	ChangeLocation(Location) {
		LoadNodes(Locations[Location],this,this.Nav,Location);
	}
}

for (const [key,value] of Object.entries(Locations)) {
	$("."+key).hide();
}



//Story 
let Ticket0 = 0;
function YieldEvent(Dom,EventListener,Callback) {
	Dom.addEventListener(Ticket0)
}

function YieldF(Callback,time) {
	setTimeout(Callback, time);
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}

function Intro() {
	$("#ChoicePrompt").hide();
	let IntroMonolog = new Dialog("");
	IntroMonolog.Activate(document.getElementById("DialogContainer"));

	IntroMonolog.ChangeText("My interview is today",50);
	setTimeout(function() {
		IntroMonolog.ChangeText("I can't be late",50);
		let Fade = document.getElementById("Fade")
		Fade.setAttribute("class","FadeAnim")
	},4000)

	setTimeout(function() {
		IntroMonolog.Disable();
	},8000)

}

function InitNavigator() {
	let Navigate = new Navigator("Hallway"); //add secret areas


	$(".Item").click(function(j) {
	let Div = j.target;
	let ItemType = Div.getAttribute("ItemType")

	ItemCallbacks[ItemType](Div);
});
}


Intro();
setTimeout(InitNavigator,5000)

//
//let NewDialog = new Dialog("Prompt test")
//let Navigate = new Navigator("Test");


//$(".Item").click(function(j) {
//	let Div = j.target;
//	let ItemType = Div.getAttribute("ItemType")
//
//	ItemCallbacks[ItemType](Div);
//});


//$("#cre").click(function() {
//	NewDialog.Activate(document.getElementById("DialogContainer"));
//	setTimeout(() => {NewDialog.ChangeText("Dialog class test",50);},1000)
//}); 

//$("#rem").click(function() {
//	NewDialog.Disable();
//});
