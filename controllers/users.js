const usersModel = require('../models/users');
const errorHandler = require('../errorHandler');
const validation = require('../validation');

module.exports = {
  get: function (req, res, next) {
    const emailToFind = req.params.email || req.body.email;
    if (emailToFind) {
      if (!validation.validateEmail(emailToFind)) {
        errorHandler.badRequest(req, res, next);
        return;
      }
      usersModel.findOne({ email: emailToFind }).exec(function (err, result){
        if (err)
          errorHandler.internalError(err, req, res, next);
        else {
          result
            ? res.status(200).json(result)
            : errorHandler.notFound(req, res, next);
        }
      });
    }
    else {
      usersModel.find().exec((err, result) => {
        err
          ? errorHandler.internalError(err, req, res, next)
          : res.status(result ? 200 : 204).json(result);
      });
    }
  },
  add: function (req, res, next) {
    const usersmodel = new usersModel({
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
    });
    if (!validation.validateEmail(usersmodel.email)) {
      errorHandler.badRequest(req, res, next);
      return;
    }
    usersmodel.setPassword(req.body.password);
    usersmodel.save(function (err) {
      if (err) {
        err.code == '11000'
          ? res.status(409).json()
          : errorHandler.internalError(err, req, res, next);
      }
      else res.status(201).json(usersmodel);
    });
  },
  testauth: function (req, res, next) {
    let emailToAuth = req.body.email;
    if (!validation.validateEmail(emailToAuth)) {
      errorHandler.badRequest(req, res, next);
      return;
    }
    usersModel.findOne({ email: emailToAuth }, function (err, user) {
      if (err)
        errorHandler.internalError(err, req, res, next);
      else {
        if (user) {
          const result = user.validatePassword(req.body.password);
          res.json(result);
        }
        else
          res.json(false);
      }
    });
  },
  delete: function (req, res, next) {
    let emailToDelete = req.params.email || req.body.email;
    if (!validation.validateEmail(emailToDelete)) {
      errorHandler.badRequest(req, res, next);
      return;
    }
    usersModel.deleteOne({ email: emailToDelete }, function (err, result) {
      if (err)
        errorHandler.internalError(err, req, res, next);
      else {
        if (result && result.n) {
          res.status(204).json();
        }
        else {
          errorHandler.notFound(req, res, next);
        }
      }
    });
  },
}