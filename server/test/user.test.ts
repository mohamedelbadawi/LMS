import request from "supertest";
import { app } from "../../app";
import connection from "../utils/db";
import { expect } from "chai";
import { describe } from "mocha";
describe("update user", () => {
  it("should get update successfully ", (done) => {
    const accessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2RiZTdmZDhiNDRkOGUxZDliYTljYSIsImlhdCI6MTcwMjc0MDg3MiwiZXhwIjoxNzAyNzQxMTcyfQ.M5wzgguvWweHWnxZ7zxsA06N1UmWbRazu39_kwULKwA";

    request(app)
      .put("/api/v1/user/update-user")
      .set("Cookie", `accessToken=${accessToken}`)
      .send({
        name: "mo",
        email: "mohamed.reda.elbadawi@gmail.com",
      })
      .expect(200)
      .expect((res) => {
        expect(res.message).to.equal("User data updated successfully");
      });
    done();
  });

  it("should update password and get updated", (done) => {
    const accessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2RiZTdmZDhiNDRkOGUxZDliYTljYSIsImlhdCI6MTcwMjc0MDg3MiwiZXhwIjoxNzAyNzQxMTcyfQ.M5wzgguvWweHWnxZ7zxsA06N1UmWbRazu39_kwULKwA";

    request(app)
      .put("/api/v1/user/update-user")
      .set("Cookie", `accessToken=${accessToken}`)
      .send({
        currentPassword: "1234567789Mm@",
        newPassword: "1234567789Mm!",
      })
      .expect(200)
      .expect((res) => {
        expect(res.success).to.equal(true);
      });
    done();
  });
});
