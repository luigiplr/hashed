var Field = require('./field').Field;



/**
 * Create a new schema.  A schema is a collection of field definitions.
 * @param {Object} config Keys are field names, values are field configs.
 * @constructor
 */
var Schema = exports.Schema = function(config) {
  var fields = {};
  var offsets = {};
  var offset = 0;
  for (var key in config) {
    fields[key] = new Field(config[key]);
    offsets[key] = offset;
    ++offset;
  }
  this._fields = fields;
  this._offsets = offsets;
  this._length = offset;
};


/**
 * Get number of fields in the schema.
 * @return {number} The number of fields.
 */
Schema.prototype.getLength = function() {
  return this._length;
};


/**
 * Get the offset for a field with the given key.
 * @param {string} key The field key.
 * @return {number} The field offset.
 */
Schema.prototype.getOffset = function(key) {
  if (!(key in this._offsets)) {
    throw new Error('Invalid key: ' + key);
  }
  return this._offsets[key];
};


/**
 * Call a function for each field.
 * @param {function(string, number)} callback Called with the field key and
 *     offset.
 * @param {Object} thisArg This argument for the callback.
 */
Schema.prototype.forEachKey = function(callback, thisArg) {
  for (var key in this._offsets) {
    callback.call(thisArg, key, this._offsets[key]);
  }
};


/**
 * Serialize a value.
 * @param {string} key The key or field name.
 * @param {*} value The value to serialize.
 * @return {string} The serialized value.
 */
Schema.prototype.serialize = function(key, value) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].serialize(value);
};


/**
 * Deserialize a value.
 * @param {string} key The key or field name.
 * @param {string} str The serialized value.
 * @return {*} The deserialized value.
 */
Schema.prototype.deserialize = function(key, str) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].deserialize(str);
};


/**
 * Get the default value for a particular field.
 * @param {string} key The key or field name.
 * @return {*} The default value.
 */
Schema.prototype.getDefault = function(key) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].init;
};