test("runs in a real browser", () => {
  localStorage.setItem("k", "v");
  expect(localStorage.getItem("k")).toEqual("v");
  expect(navigator.userAgent).toContain("Chrome");
});
