import request from "supertest";
import { app } from "../../app";
import connection from "../utils/db";
import { expect } from "chai";
const chai = require("chai");

before(async () => {
  connection();
});

describe("register", () => {
  it("check password strength", (done) => {
    request(app)
      .post("/api/v1/register")
      .send({
        email: "mohamed@gmail.com",
        password: "123456789",
        name: "Mohamed",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.errors[0].msg === "Please provide a valid password";
      })
      .end((err: any) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it("check empty fields  for register", (done) => {
    request(app)
      .post("/api/v1/register")
      .send({ name: "", email: "", password: "" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.errors.length == 3);
      })
      .end((err: any) => {
        if (err) return done(err);
        done();
      });
  });
  it("check token after register ", (done) => {
    request(app)
      .post("/api/v1/register")
      .send({
        name: "mohamed",
        email: "mohamed@gmail.com",
        password: "123456789@mM",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.success == true;
        res.body.token.length > 1;
      })
      .end((err: any) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Authentication Controller", () => {
  describe("Login Endpoint", () => {
    it("should return a success message with valid credentials", (done) => {
      request(app)
        .post("/api/v1/login")
        .send({
          email: "mohamed.reda.elbadawi@gmail.com",
          password: "1234567789Mm!",
        })
        .expect((res) => {
          expect(res.status).to.equal(200);
          expect(res.type).to.equal("application/json");
          expect(res.body.success).to.equal(true);
          expect(res.headers).to.have.property("set-cookie");
        });
      done();
    });

    it("should return an error with invalid credentials", (done) => {
      request(app)
        .post("/api/v1/login")
        .send({
          email: "invalid@example.com",
          password: "invalidpassword",
        })
        .expect((res) => {
          expect(res.status).to.equal(400);
          expect(res.type).to.equal("application/json");
          expect(res.body.message).to.equal("Invalid Credentials");
        });
      done();
    });
  });
});

describe("Auth User Endpoint", () => {
  it("should return user information with a valid access token", async () => {
    // You'll need to obtain a valid access token to use in the request
    const validAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M2Mzc4ZjRiMzU1ODg2YzA0ZjUyYiIsImlhdCI6MTcwMjY1ODY3NywiZXhwIjoxNzAyNjU4NzA3fQ.ScOFjK3LeanwjcPFz3qp7d3GkFIKf3os1ksxyQ4VNOY";

    request(app)
      .get("/api/v1/auth-user")
      .set("Cookie", `accessToken=${validAccessToken}`);
    expect((res) => {
      expect(res.status).to.equal(200);
      expect(res.type).to.equal("application/json");
      expect(res.body.user).to.exist;
      expect(res.body.success).to.equal(true);
    });
  });

  it("should return an error with an invalid access token", async () => {
    request(app)
      .get("/api/v1/auth-user")
      .set("Cookie", "accessToken=invalidtoken");
    expect((res) => {
      expect(res.status).to.equal(400);
      expect(res.type).to.equal("application/json");
      expect(res.body.message).to.equal("UnAuth user");
    });
  });
});

describe("Refresh Endpoint", () => {
  it("should return a success message with a valid refresh token", async () => {
    // You'll need to obtain a valid refresh token to use in the request
    const validRefreshToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M2Mzc4ZjRiMzU1ODg2YzA0ZjUyYiIsImlhdCI6MTcwMjY1ODY3NywiZXhwIjoxNzAzMjYzNDc3fQ.9bqRp__y7H4d_grZdcNsc_awcvvfE7fCNJPBaWe7lrM";

    request(app)
      .post("/api/v1/refresh")
      .set("Cookie", `refreshToken=${validRefreshToken}`);
    expect((res) => {
      expect(res.status).to.equal(200);
      expect(res.type).to.equal("application/json");
      expect(res.body.success).to.equal(true);
    });
  });

  it("should return an error with an invalid refresh token", async () => {
    request(app)
      .post("/api/v1/refresh")
      .set("Cookie", "refreshToken=invalidtoken");
    expect((res) => {
      expect(res.status).to.equal(400);
      expect(res.type).to.equal("application/json");
      expect(res.body.message).to.equal("UnAuth user");
    });
  });
});

describe("logout endpoint", () => {
  it("should log out and delete the tokens from the cookeis", (done) => {
    request(app)
      .post("/api/v1/logout")
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.equal(true);
      });
    done();
  });
});
