// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
// import '@testing-library/jest-dom/extend-expect';  // if you are using Testing Library
jest.mock("bootstrap/dist/css/bootstrap.min.css", () => {});
global.console.warn = jest.fn();
