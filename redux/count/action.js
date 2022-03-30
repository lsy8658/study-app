import { COUNT_ADD, COUNT_MIN } from "../type";

export const countAdd = (pay) => {
  return { type: COUNT_ADD, payload: pay };
};

export const countMin = () => {
  return { type: COUNT_MIN };
};
