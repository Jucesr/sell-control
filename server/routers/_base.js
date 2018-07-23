'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getByID = exports.getAll = exports.update = exports.remove = exports.add = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _mongodb = require('mongodb');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var add = exports.add = function add(Model, fieldsToExclude) {

  return function (req, res, next) {

    //Don't ever let user assign _id
    delete req.body._id;

    if (fieldsToExclude) {
      fieldsToExclude.map(function (field) {
        delete req.body[field];
      });
    }

    //No need to validate because I used authenticate and validate_company middleware.
    var entity = new Model((0, _extends3.default)({}, req.body));

    console.log(req.user.username);
    console.log(req.body.company_id);

    entity.save().then(function (doc) {
      res.send(doc);
      (0, _helpers.log)(Model.modelName + ' was saved');
    }).catch(function (e) {
      return next(e);
    });
  };
};

var remove = exports.remove = function remove(Model) {

  return function (req, res, next) {
    var id = req.params.id;

    if (!_mongodb.ObjectID.isValid(id)) {
      return next({
        message: 'ID has invalid format',
        html_code: 400
      });
    }

    // Model.findByIdAndRemove(id).then(
    //   doc => {
    //     if(!doc)
    //       return next({
    //         message: `${Model.modelName} was not found`,
    //         html_code: 404
    //       });
    //
    //     res.status(200).send(doc);
    //     log(`${Model.modelName} was removed`);
    //
    // }).catch( e => next(e) );

    Model.findById(id).then(function (doc) {
      if (!doc) return next({
        message: Model.modelName + ' was not found',
        html_code: 404
      });
      return doc.remove();
    }).then(function (doc) {
      res.status(200).send(doc);
      (0, _helpers.log)(Model.modelName + ' was removed');
    }).catch(function (e) {
      return next(e);
    });
  };
};

var update = exports.update = function update(Model, fieldsToExclude) {

  return function (req, res, next) {

    var id = req.params.id;

    if (!_mongodb.ObjectID.isValid(id)) return next({
      message: 'ID has invalid format',
      html_code: 400
    });

    if (fieldsToExclude) {
      fieldsToExclude.map(function (field) {
        delete req.body[field];
      });
    }

    Model.findOne({
      _id: id,
      company_id: req.user.selected_company_id
    }).then(function (doc) {
      if (!doc) return next({
        error: Model.modelName + ' was not found',
        html_code: 404
      });
      doc.set((0, _extends3.default)({}, req.body));
      return doc.save();
    }).then(function (doc) {
      res.status(200).send(doc);
      (0, _helpers.log)(Model.modelName + ' was updated');
    }).catch(function (e) {
      return next(e);
    });
  };
};

var getAll = exports.getAll = function getAll(Model) {

  return function (req, res, next) {
    var filter_id = Model.modelName == 'Company' ? req.user._id : req.user.selected_company_id;
    Model.getAll(filter_id).then(function (entities) {
      res.send(entities);
      (0, _helpers.log)(Model.modelName + ' were sent');
    }, function (e) {
      return next(e);
    });
  };
};

var getByID = exports.getByID = function getByID(Model) {

  return function (req, res, next) {

    var id = req.params.id;

    if (!_mongodb.ObjectID.isValid(id)) return next({
      message: 'ID has invalid format',
      html_code: 400
    });

    Model.findById(id).then(function (doc) {
      if (!doc) return next({
        message: Model.modelName + ' was not found',
        html_code: 404
      });

      res.status(200).send(doc);
      (0, _helpers.log)(Model.modelName + ' was sent');
    }).catch(function (e) {
      return next(e);
    });
  };
};
//# sourceMappingURL=_base.js.map