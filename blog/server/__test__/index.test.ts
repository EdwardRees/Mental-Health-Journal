import axios from "axios";

describe("Main endpoint", () => {
  it("should return 200", async () => {
    const response = await axios.get(`http://localhost:8081/api/`);
    expect(response.status).toBe(200);
  });
  it("should return Welcome to the Mental Health Blog API", async () => {
    const response = await axios.get(`http://localhost:8081/api/`);
    expect(response.data).toBe("Welcome to the Mental Health Blog API");
  });
});
