test("runs without a dom", () => {
  expect(typeof document).toEqual("undefined");
});
