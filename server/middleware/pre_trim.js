export const pre_save_trim = function(next){
  var paths = this.schema.paths;
  Object.keys(paths).forEach(function (field) {
    if (paths[field].instance != 'String') {
      return;
    }

    var value = this[field];

    if (!value) {
      return;
    }

    var trimmedValue = value.trim();

    if (trimmedValue != value) {
      this[field] = trimmedValue;
    }
  }, this);

  next();
}
