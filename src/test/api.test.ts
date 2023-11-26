import { beforeAll, afterAll, describe } from "@jest/globals";
import { setup, teardown } from "./testSetup";
import userTest from "./userTest";
import restaurantTest from "./restaurantTest";

beforeAll(setup);
afterAll(teardown);

describe("API tests", () => {
  userTest();
  restaurantTest();
});
