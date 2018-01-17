'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _THREEElementDescriptor = require('../THREEElementDescriptor');

var _THREEElementDescriptor2 = _interopRequireDefault(_THREEElementDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InterleavedBufferAttributeDescriptor = function (_THREEElementDescript) {
  _inherits(InterleavedBufferAttributeDescriptor, _THREEElementDescript);

  function InterleavedBufferAttributeDescriptor(react3RendererInstance) {
    _classCallCheck(this, InterleavedBufferAttributeDescriptor);

    var _this = _possibleConstructorReturn(this, (InterleavedBufferAttributeDescriptor.__proto__ || Object.getPrototypeOf(InterleavedBufferAttributeDescriptor)).call(this, react3RendererInstance));

    _this.hasProp('id', {
      type: _propTypes2.default.string,
      update: function update(threeObject, id) {
        threeObject.id = id;
      },

      updateInitial: true,
      default: ''
    });
    _this.hasProp('size', {
      type: _propTypes2.default.number,
      update: function update(threeObject, size) {
        threeObject.size = size;
      },

      updateInitial: true,
      default: 1
    });
    _this.hasProp('type', {
      type: _propTypes2.default.number,
      update: function update(threeObject, type) {
        threeObject.type = type;
      },

      updateInitial: true,
      default: 1
    });
    return _this;
  }

  _createClass(InterleavedBufferAttributeDescriptor, [{
    key: 'construct',
    value: function construct() {
      return { userData: {} };
    }
  }, {
    key: 'applyInitialProps',
    value: function applyInitialProps(threeObject, props) {
      _get(InterleavedBufferAttributeDescriptor.prototype.__proto__ || Object.getPrototypeOf(InterleavedBufferAttributeDescriptor.prototype), 'applyInitialProps', this).call(this, threeObject, props);
      threeObject.id = props.id;
      threeObject.size = props.size;
      threeObject.type = props.type;
    }
  }]);

  return InterleavedBufferAttributeDescriptor;
}(_THREEElementDescriptor2.default);

module.exports = InterleavedBufferAttributeDescriptor;