import models from '../models';

const User = models.User;

module.exports = {
  create(req, res) {
    return User
      .create({
        title: req.body,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
};
