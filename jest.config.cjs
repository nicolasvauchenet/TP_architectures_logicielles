module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFiles: ["<rootDir>/tests/setup/pre-env.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/init-env.js"],
  transform: { "^.+\\.jsx?$": "babel-jest" },
  transformIgnorePatterns: ["/node_modules/"],
};
