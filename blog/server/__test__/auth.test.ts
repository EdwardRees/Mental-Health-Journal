import axios from "axios";

describe("auth", () => {
  it("should return 200", async () => {
    const response = await axios.get(`http://localhost:8081/api/auth/`);
    expect(response.status).toBe(200);
  });
  it("should return Auth Endpoint", async () => {
    const response = await axios.get(`http://localhost:8081/api/auth/`);
    expect(response.data).toBe("Authentication route");
  });
});

describe("auth/register", () => {
  let createdUser: any;
  it("Should return 200 with a new account", async () => {
    const response = await axios.post(
      `http://localhost:8081/api/auth/register`,
      {
        username: "test",
        password: "password",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
      }
    );
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("token");
    expect(response.data).toHaveProperty("user");
    createdUser = response.data.user;
  });
  it("Should return 400 with User already exists", async () => {
    try {
      let res = await axios.post(`http://localhost:8081/api/auth/register`, {
        username: "test1",
        password: "password",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
      });
    } catch (err: any) {
      expect(err.response.status).toBe(400);
      expect(err.response.data).toHaveProperty("error");
      expect(err.response.data.error).toBe("User already exists!");
    }
  });
  it("Should return 400 with Username already exists", async () => {
    try {
      let res = await axios.post(`http://localhost:8081/api/auth/register`, {
        username: "test",
        password: "password",
        email: "test1@test.com",
        firstName: "John",
        lastName: "Doe",
      });
    } catch (err: any) {
      expect(err.response.status).toBe(400);
      expect(err.response.data).toHaveProperty("error");
      expect(err.response.data.error).toBe("Username already exists!");
    }
  });
  it("Should remove the user", async () => {
    const response = await axios.delete(
      `http://localhost:8081/api/user/${createdUser.id}`,
      {
        headers: {
          "x-admin-token": true,
        },
      }
    );
    expect(response.status).toBe(200);
    expect(response.data).toBe("User deleted");
  });
});

describe("auth/login", () => {
  let createdUser: any;
  it("should successfully create the account", async () => {
    const response = await axios.post(
      `http://localhost:8081/api/auth/register`,
      {
        username: "test",
        password: "password",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
      }
    );
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("token");
    expect(response.data).toHaveProperty("user");
    createdUser = response.data.user;
  });
  it("should successfully log in", async () => {
    const response = await axios.post(`http://localhost:8081/api/auth/login`, {
      email: "test@test.com",
      password: "password",
    });
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("token");
    expect(response.data).toHaveProperty("user");
  });
  it("Should remove the user", async () => {
    const response = await axios.delete(
      `http://localhost:8081/api/user/${createdUser.id}`,
      {
        headers: {
          "x-admin-token": true,
        },
      }
    );
    expect(response.status).toBe(200);
    expect(response.data).toBe("User deleted");
  });
});
