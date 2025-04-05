module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/**/*.test.js"],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["<rootDir>/src/components**/*.{js,jsx}"
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
