const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./app");

test("GET / returns health message", async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Employee Management Backend is Running/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});