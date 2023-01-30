const service = require("../../service/user");

const getPoint = (req, res, next) => {
  const { address } = req.params;
  service
    .getPoint(address)
    .then((data) => res.json(data))
    .catch(next);
};

const mate = (req, res, next) => {
  service
    .usePoint4Mate(req.body)
    .then((data) => res.json(data))
    .catch(next);
};

const auction = (req, res, next) => {
  service
    .usePoint4Auction(req.body)
    .then((data) => res.json(data))
    .catch(next);
};

module.exports = { getPoint, mate, auction };
