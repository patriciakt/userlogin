const pinDrop = require("../map-features/pinDrop");

exports.getAllPins = (req, res) => {
  const pins = pinService.getAllPins();
  res.json(pins); //mongodb?
};

// add latitude  and longtitude - coordinates for place, do wee need error for this?
exports.addPin = (req, res) => {
  const { latitude, longitude, photo, text, user } = req.body;

  //we need new post
  const newPin = {
    latitude,
    longitude,
    photo,
    text,
    user,
  };

  // post with service
  pinDrop.addPin(newPin);

  res.json({ message: "new pin added", pin: newPin });
};
