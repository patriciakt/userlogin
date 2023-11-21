// array for pins
let pins = [];

function getAllPins() {
  return pins;
}

function addPin(pin) {
  pins.push(pin);
}

module.exports = {
  getAllPins,
  addPin,
};
