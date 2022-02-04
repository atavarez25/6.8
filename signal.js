//
export default class Signal {
	constructor() {
		this.Callbacks = [];
	}

	Connect(func) {
		this.Callbacks[this.Callbacks.length] = func;
	}

	Fire() {
		for (i = 0; i < this.Callbacks.length; i ++) {
			this.Callbacks[i](arguments);
		}
	}
}

