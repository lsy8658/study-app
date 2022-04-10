import Seo from "../components/Seo";
import Home from "./Home/index";
import { connect } from "react-redux";
import { useEffect } from "react";
const index = ({ user }) => {
  return (
    <div>
      <Seo title={"Studyapp - home"} />
      <Home />
    </div>
  );
};

export const getState = ({ userReducer }) => {
  return {
    user: userReducer,
  };
};

export default connect(getState)(index);
