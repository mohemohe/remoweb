const { writeFileSync, mkdirSync } = require("fs");
const { resolve } = require("path");

const baseUrl = process.env.API_BASE_URL || "https://api.nature.global/";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
};

try {
  mkdirSync(resolve(__dirname, "mocks/1/users"), { recursive: true });
} catch (e) {
  console.warn(e);
}

fetch(`${baseUrl}1/users/me`, { headers })
  .then((res) => res.text())
  .then((body) => {
    writeFileSync(resolve(__dirname, "mocks/1/users/me"), body);
  });

fetch(`${baseUrl}1/appliances`, { headers })
  .then((res) => res.text())
  .then((body) => {
    writeFileSync(resolve(__dirname, "mocks/1/appliances"), body);
  });

fetch(`${baseUrl}1/devices`, { headers })
  .then((res) => res.text())
  .then((body) => {
    writeFileSync(resolve(__dirname, "mocks/1/devices"), body);
  });
