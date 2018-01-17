'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GeometryDescriptorBase = require('./GeometryDescriptorBase');

var _GeometryDescriptorBase2 = _interopRequireDefault(_GeometryDescriptorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InterleavedBufferGeometryDescriptor = function (_GeometryDescriptorBa) {
  _inherits(InterleavedBufferGeometryDescriptor, _GeometryDescriptorBa);

  function InterleavedBufferGeometryDescriptor(react3RendererInstance) {
    _classCallCheck(this, InterleavedBufferGeometryDescriptor);

    var _this = _possibleConstructorReturn(this, (InterleavedBufferGeometryDescriptor.__proto__ || Object.getPrototypeOf(InterleavedBufferGeometryDescriptor)).call(this, react3RendererInstance));

    var self = _this;
    _this.hasProp('vbo', {
      type: _propTypes2.default.instanceOf(Float32Array),
      update: function update(threeObject, vbo) {
        self.vbo = vbo;
        self.updated = true;
      },

      updateInitial: true,
      default: new Float32Array()
    });
    _this.hasProp('count', {
      type: _propTypes2.default.number,
      update: function update(threeObject, count) {
        self.count = count;
        self.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    _this.hasProp('offset', {
      type: _propTypes2.default.number,
      update: function update(threeObject, offset) {
        self.offset = offset;
        self.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    _this.hasProp('indexCount', {
      type: _propTypes2.default.number,
      update: function update(threeObject, indexCount) {
        self.indexCount = indexCount;
        self.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    _this.hasProp('groupCount', {
      type: _propTypes2.default.number,
      update: function update(threeObject, groupCount) {
        self.groupCount = groupCount;
        self.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    return _this;
  }

  _createClass(InterleavedBufferGeometryDescriptor, [{
    key: 'construct',
    value: function construct() {
      this.children = [];
      return new THREE.BufferGeometry();
    }
  }, {
    key: 'applyInitialProps',
    value: function applyInitialProps(threeObject, props) {
      _get(InterleavedBufferGeometryDescriptor.prototype.__proto__ || Object.getPrototypeOf(InterleavedBufferGeometryDescriptor.prototype), 'applyInitialProps', this).call(this, threeObject, props);
      this.names = [];
      this.vbo = props.vbo;
      this.count = props.count;
      this.offset = props.offset;
      this.indexCount = props.indexCount;
      this.groupCount = props.groupCount;
      this.updated = true;
    }
  }, {
    key: 'recalculate',
    value: function recalculate(threeObject) {
      this.attrOffset = this.offset;

      // setup index, if necessary
      threeObject.index = null;
      threeObject.clearGroups();
      if (this.indexCount) {
        var index = new Uint32Array(this.vbo, this.offset, this.indexCount);
        this.attrOffset += 4 * this.indexCount;
        threeObject.setIndex(new THREE.BufferAttribute(index, 1));
      } else if (this.groupCount) {
        var _index = new Uint32Array(this.count);
        for (var i = 0; i < this.count; i++) {
          _index[i] = i;
        }
        threeObject.setIndex(new THREE.BufferAttribute(_index, 1));
        var groups = new Uint32Array(this.vbo, this.offset, this.groupCount);
        var ix = 0;
        Array.from(groups).forEach(function (i) {
          if (i !== 0) {
            threeObject.addGroup(ix, i - ix);
            ix = i;
          }
        });
        threeObject.addGroup(ix, this.count - ix);
        this.attrOffset += 4 * this.groupCount;
      }

      // attribute data
      this.names.forEach(function (name) {
        return threeObject.removeAttribute(name);
      });
      this.names = [];
      var stride = 0;
      this.children.forEach(function (child) {
        stride += child.size;
      });
      var fv = new Float32Array(this.vbo, this.attrOffset, stride * this.count);
      var fbuf = new THREE.InterleavedBuffer(fv, stride);
      var attrOffset = 0;
      var names = [];
      this.children.forEach(function (child) {
        var bufattr = new THREE.InterleavedBufferAttribute(fbuf, child.size, attrOffset);
        attrOffset += child.size;
        threeObject.addAttribute(child.id, bufattr);
        names.push(child.id);
      });
      this.names = names;
      this.updated = false;
    }
  }, {
    key: 'completePropertyUpdates',
    value: function completePropertyUpdates(threeObject) {
      if (this.updated) {
        this.recalculate(threeObject);
      }
    }
  }, {
    key: 'completeChildUpdates',
    value: function completeChildUpdates(threeObject) {
      if (this.updated) {
        this.recalculate(threeObject);
      }
    }
  }, {
    key: 'addChildren',
    value: function addChildren(threeObject, children) {
      this.children = this.children.concat(children);
      this.updated = true;
      this.recalculate(threeObject);
    }
  }, {
    key: 'addChild',
    value: function addChild(threeObject, child, mountIndex) {
      this.children.splice(mountIndex, 0, child);
      this.updated = true;
      this.recalculate(threeObject);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(threeObject, child) {
      this.children = this.children.filter(function (x) {
        return x !== child;
      });
      this.updated = true;
      this.recalculate(threeObject);
    }
  }, {
    key: 'moveChild',
    value: function moveChild(threeObject, childObject, toIndex) {
      var idx = this.children.indexOf(childObject);
      if (idx !== -1) {
        this.children.splice(toIndex, 0, this.children.splice(idx, 1)[0]);
      }
      this.updated = true;
      this.recalculate(threeObject);
    }
  }]);

  return InterleavedBufferGeometryDescriptor;
}(_GeometryDescriptorBase2.default);

module.exports = InterleavedBufferGeometryDescriptor;