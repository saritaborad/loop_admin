import * as ActionTypes from '../ActionTypes';

const ContextReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.ROLE_UPDATE:
            return {
                ...state,
                role: action.payload
            }
        default:
            return state;
    }
}

export default ContextReducer;