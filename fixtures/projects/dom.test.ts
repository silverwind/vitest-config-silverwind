test("web storage is happy-dom's", () => {
  localStorage.setItem("k", "v");
  expect(localStorage.getItem("k")).toEqual("v");
});
