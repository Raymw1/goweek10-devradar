module.exports = (stringArray) =>
  stringArray?.split(",").map((tech) => tech.trim());
