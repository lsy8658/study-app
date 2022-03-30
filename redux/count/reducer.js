import { COUNT_ADD, COUNT_MIN } from "../type";

const initialState = {
  count: 0,
  pay: {},
};

const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case COUNT_ADD:
      return {
        ...state,
        count: state.count + 1,
        pay: action.payload,
      };
    case COUNT_MIN:
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
};

export default countReducer;
