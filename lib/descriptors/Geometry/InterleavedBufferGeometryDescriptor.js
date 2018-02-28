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
      type: _propTypes2.default.instanceOf(ArrayBuffer),
      update: function update(threeObject, vbo) {
        threeObject.userData.vbo = vbo;
        threeObject.userData.updated = true;
      },

      updateInitial: true,
      default: new Float32Array()
    });
    _this.hasProp('count', {
      type: _propTypes2.default.number,
      update: function update(threeObject, count) {
        threeObject.userData.count = count;
        threeObject.userData.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    _this.hasProp('offset', {
      type: _propTypes2.default.number,
      update: function update(threeObject, offset) {
        threeObject.userData.offset = offset;
        threeObject.userData.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    _this.hasProp('indexCount', {
      type: _propTypes2.default.number,
      update: function update(threeObject, indexCount) {
        threeObject.userData.indexCount = indexCount;
        threeObject.userData.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    _this.hasProp('groupCount', {
      type: _propTypes2.default.number,
      update: function update(threeObject, groupCount) {
        threeObject.userData.groupCount = groupCount;
        threeObject.userData.updated = true;
      },

      updateInitial: true,
      default: 0
    });
    return _this;
  }

  _createClass(InterleavedBufferGeometryDescriptor, [{
    key: 'construct',
    value: function construct() {
      //this.children = [];
      return new THREE.BufferGeometry();
    }
  }, {
    key: 'applyInitialProps',
    value: function applyInitialProps(threeObject, props) {
      _get(InterleavedBufferGeometryDescriptor.prototype.__proto__ || Object.getPrototypeOf(InterleavedBufferGeometryDescriptor.prototype), 'applyInitialProps', this).call(this, threeObject, props);
      threeObject.userData.children = [];
      threeObject.userData.names = [];
      threeObject.userData.vbo = props.vbo;
      threeObject.userData.count = props.count;
      threeObject.userData.offset = props.offset;
      threeObject.userData.indexCount = props.indexCount;
      threeObject.userData.groupCount = props.groupCount;
      threeObject.userData.updated = true;
    }
  }, {
    key: 'recalculate',
    value: function recalculate(threeObject) {
      var vertexOffset = threeObject.userData.offset;

      // setup index, if necessary
      threeObject.index = null;
      threeObject.clearGroups();
      if (threeObject.userData.indexCount) {
        var index = new Uint32Array(threeObject.userData.vbo, threeObject.userData.offset, threeObject.userData.indexCount);
        vertexOffset += 4 * threeObject.userData.indexCount;
        threeObject.setIndex(new THREE.BufferAttribute(index, 1));
      } else if (threeObject.userData.groupCount) {
        var _index = new Uint32Array(threeObject.userData.count);
        for (var i = 0; i < threeObject.userData.count; i++) {
          _index[i] = i;
        }
        threeObject.setIndex(new THREE.BufferAttribute(_index, 1));
        var groups = new Uint32Array(threeObject.userData.vbo, threeObject.userData.offset, threeObject.userData.groupCount);
        var ix = 0;
        Array.from(groups).forEach(function (i) {
          if (i !== 0) {
            threeObject.addGroup(ix, i - ix);
            ix = i;
          }
        });
        threeObject.addGroup(ix, threeObject.userData.count - ix);
        vertexOffset += 4 * threeObject.userData.groupCount;
      }

      // attribute data
      threeObject.userData.names.forEach(function (name) {
        return threeObject.removeAttribute(name);
      });
      threeObject.userData.names = [];
      var stride = 0;
      threeObject.userData.children.forEach(function (child) {
        stride += child.size;
      });
      var fv;
      try {
        fv = new Float32Array(threeObject.userData.vbo, vertexOffset, stride * threeObject.userData.count);
      } catch (err) {
        // threeObject gets reused, which leads to some unwelcome behavior
        // specifically, the properties get updated (and thus call recalculate)
        // before the children get updated (which are used for calculating the
        // stride).  I don't know of a way to entirely avoid that condition
        // but we can at least guard against the vbo being too short too
        // accomodate the expected number of attributes (which is briefly
        // incorrect)
        fv = new Float32Array();
      }
      var fbuf = new THREE.InterleavedBuffer(fv, stride);
      var attrOffset = 0;
      var names = [];
      threeObject.userData.children.forEach(function (child) {
        var bufattr = new THREE.InterleavedBufferAttribute(fbuf, child.size, attrOffset);
        attrOffset += child.size;
        threeObject.addAttribute(child.id, bufattr);
        names.push(child.id);
      });
      threeObject.userData.names = names;
      threeObject.userData.updated = false;
    }
  }, {
    key: 'completePropertyUpdates',
    value: function completePropertyUpdates(threeObject) {
      if (threeObject.userData.updated) {
        this.recalculate(threeObject);
      }
    }
  }, {
    key: 'completeChildUpdates',
    value: function completeChildUpdates(threeObject) {
      if (threeObject.userData.updated) {
        this.recalculate(threeObject);
      }
    }
  }, {
    key: 'addChildren',
    value: function addChildren(threeObject, children) {
      if (!threeObject.userData.children) {
        threeObject.userData.children = children;
      } else {
        threeObject.userData.children = threeObject.userData.children.concat(children);
      }
      threeObject.userData.updated = true;
      this.recalculate(threeObject);
    }
  }, {
    key: 'addChild',
    value: function addChild(threeObject, child, mountIndex) {
      if (!threeObject.userData.children) {
        threeObject.userData.children = [child];
      } else {
        threeObject.userData.children.splice(mountIndex, 0, child);
      }
      threeObject.userData.updated = true;
      this.recalculate(threeObject);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(threeObject, child) {
      if (threeObject.userData.children) {
        threeObject.userData.children = threeObject.userData.children.filter(function (x) {
          return x !== child;
        });
        threeObject.userData.updated = true;
        this.recalculate(threeObject);
      }
    }
  }, {
    key: 'moveChild',
    value: function moveChild(threeObject, childObject, toIndex) {
      if (threeObject.userData.children) {
        var idx = threeObject.userData.children.indexOf(childObject);
        if (idx !== -1) {
          threeObject.userData.children.splice(toIndex, 0, threeObject.userData.children.splice(idx, 1)[0]);
        }
        threeObject.userData.updated = true;
        this.recalculate(threeObject);
      }
    }
  }]);

  return InterleavedBufferGeometryDescriptor;
}(_GeometryDescriptorBase2.default);

module.exports = InterleavedBufferGeometryDescriptor;