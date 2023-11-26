import { beforeAll, afterAll, describe, jest } from "@jest/globals";
import { setup, teardown } from "./testSetup";
import userTest from "./userTest";
import restaurantTest from "./restaurantTest";

beforeAll(setup);
afterAll(teardown);

jest.setTimeout(30000);

describe("API tests", () => {
  userTest();
  restaurantTest();
});
