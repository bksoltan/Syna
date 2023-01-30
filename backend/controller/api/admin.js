const service = require("../../service/admin");

const reportSubscription = (req, res, next) => {
  service
    .reportSubscription(req.body)
    .then((data) => res.json(data))
    .catch(next);
};

module.exports = { reportSubscription };
