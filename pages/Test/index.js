import React, { useEffect } from "react";
import { connect } from "react-redux";

import { countAdd, countMin } from "../../redux";
const index = ({ count, pay, countAdd, countMin }) => {
  useEffect(() => {
    console.log(pay);
  }, [pay]);
  return (
    <div>
      {count}
      <button
        onClick={() => {
          countAdd({ pay: 10 });
        }}
      >
        plus
      </button>

      <button
        onClick={() => {
          countMin();
        }}
      >
        minor
      </button>
    </div>
  );
};
const studyStateProps = ({ countReducer }) => {
  return {
    count: countReducer.count,
    pay: countReducer.pay,
  };
};
const studyDispatchProps = {
  countAdd,
  countMin,
};

export default connect(studyStateProps, studyDispatchProps)(index);
