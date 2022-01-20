//
//import Signal from "lib/signal.js"

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
}


class Dialog {
	constructor(InitialText,Color) {
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
		this.Prompt.Dom.innerHTML = "";
		for (let i = 0; i < Text.length; i ++) {
			setTimeout(() => {this.Prompt.Dom.innerHTML = this.Prompt.Dom.innerHTML + Text[i]},Speed * i);
		}
	}
}


let TestSignal = new Signal();

TestSignal.Connect(function(res) {
	console.log(res[0]);
});

TestSignal.Fire("Signals are working");

let NewDialog = new Dialog("Prompt test")


$("#cre").click(function() {
	NewDialog.Activate(document.getElementById("DialogContainer"));
	setTimeout(() => {NewDialog.ChangeText("Dialog class test",50);},4000)
}); 

$("#rem").click(function() {
	NewDialog.Disable();
});
