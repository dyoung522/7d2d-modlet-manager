import React from "react";
import { shallow } from "enzyme";
import Modlets from ".";
import mock_state from "test_helpers/mock_state";

it("renders without crashing", () => {
  shallow(<Modlets state={mock_state} />);
});
