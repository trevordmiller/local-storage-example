import inputStorage from '../input-storage/input-storage';

let feedback = {
	init() {
		inputStorage.restore('userFeedback', '.feedback__textarea');
		inputStorage.save('userFeedback', '.feedback__textarea');
	}
};

export default feedback;
