import getModlets from "./get_modlets";
import Modlet from "src/helpers/modlet-class";
import mock_fs from "mock-fs";
import createMockModlet from "src/test_helpers/mock_modlet";

const mockModlet = createMockModlet();
const mockModletState = {
  modlet: mockModlet,
  validated: false,
  errors: []
};

jest.genMockFromModule("src/helpers/modlet-class");
jest.mock("src/helpers/modlet-class");

Modlet.mockImplementation(() => mockModlet);

beforeAll(() => {
  mock_fs({
    "/foo/bar/baz": {
      "ModInfo.xml": `<?xml version="1.0" encoding="UTF-8" ?>
<xml>
  <ModInfo>
    <Name value="test name" />
    <Description value="test description" />
    <Author value="test author" />
    <Version value="Test 0.0.1" compat="N/A" />
  </ModInfo>
</xml>`
    }
  });
});

afterAll(() => mock_fs.restore());

it("returns an empty array when no searchFolder provided", () => expect(getModlets(null)).toEqual([]));

it("returns an array of Modlet instances", () => {
  expect(getModlets("/foo/bar")).toEqual([mockModletState]);
});
