import {
	MY_OWN_PLACE,
	MY_OWN_DIRECTION
} from './mutation-types.js';

export default {
	[MY_OWN_PLACE] (state, info) {
		state.myPlace.x = info.x;
		state.myPlace.y = info.y;
		state.myPlace.type = info.type;
		state.myPlace.group_id = info.group_id;
	},
	[MY_OWN_DIRECTION] (state, info) {
		state.myPlace.direction = info;
	}
};
