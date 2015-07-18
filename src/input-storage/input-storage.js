let inputStorage = {
	restore(key, inputSelector) {
		if(localStorage[key]) {
			document.querySelector(inputSelector).value = localStorage[key];
		}
	},

	save(key, inputSelector) {
		let inputElement = document.querySelector(inputSelector);
		inputElement.addEventListener('input', () => {
			localStorage[key] = inputElement.value;
		});
	}
};

export default inputStorage;
