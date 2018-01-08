import * as THREE from 'three';
import PropTypes from 'prop-types';

import GeometryDescriptorBase from './GeometryDescriptorBase';

class InterleavedBufferGeometryDescriptor extends GeometryDescriptorBase {
  constructor(react3RendererInstance) {
    super(react3RendererInstance);
    const self = this;
    this.hasProp('vbo', {
      type: PropTypes.instanceOf(Float32Array),
      update(threeObject, vbo) {
        self.vbo = vbo;
        self.updated = true;
      },
      updateInitial: true,
      default: new Float32Array(),
    });
    this.hasProp('count', {
      type: PropTypes.number,
      update(threeObject, count) {
        self.count = count;
        self.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
    this.hasProp('offset', {
      type: PropTypes.number,
      update(threeObject, offset) {
        self.offset = offset;
        self.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
    this.hasProp('indexCount', {
      type: PropTypes.number,
      update(threeObject, indexCount) {
        self.indexCount = indexCount;
        self.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
    this.hasProp('groupCount', {
      type: PropTypes.number,
      update(threeObject, groupCount) {
        self.groupCount = groupCount;
        self.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
  }

  construct() {
    this.children = [];
    return new THREE.BufferGeometry();
  }

  applyInitialProps(threeObject, props) {
    super.applyInitialProps(threeObject, props);
    this.names = [];
    this.vbo = props.vbo;
    this.count = props.count;
    this.offset = props.offset;
    this.indexCount = props.indexCount;
    this.groupCount = props.groupCount;
    this.updated = true;
  }

  recalculate(threeObject) {
    this.attrOffset = this.offset;

    // setup index, if necessary
    threeObject.index = null;
    threeObject.clearGroups();
    if (this.indexCount) {
      const index = new Uint32Array(this.vbo, this.offset, this.indexCount);
      this.attrOffset += 4 * this.indexCount;
      threeObject.setIndex(new THREE.BufferAttribute(index, 1));
    } else if (this.groupCount) {
      const index = new Uint32Array(this.count);
      for (let i = 0; i < this.count; i++) {
        index[i] = i;
      }
      threeObject.setIndex(new THREE.BufferAttribute(index, 1));
      const groups = new Uint32Array(this.vbo, this.offset, this.groupCount);
      let ix = 0;
      Array.from(groups).forEach((i) => {
        if (i !== 0) {
          threeObject.addGroup(ix, i - ix);
          ix = i;
        }
      });
      threeObject.addGroup(ix, this.count - ix);
      this.attrOffset += 4 * this.groupCount;
    }

    // attribute data
    this.names.forEach(name => threeObject.removeAttribute(name));
    this.names = [];
    let stride = 0;
    this.children.forEach((child) => {
      stride += child.size;
    });
    const fv = new Float32Array(this.vbo, this.attrOffset, stride * this.count);
    const fbuf = new THREE.InterleavedBuffer(fv, stride);
    let attrOffset = 0;
    const names = [];
    this.children.forEach((child) => {
      const bufattr = new THREE.InterleavedBufferAttribute(fbuf, child.size, attrOffset);
      attrOffset += child.size;
      threeObject.addAttribute(child.id, bufattr);
      names.push(child.id);
    });
    this.names = names;
    this.updated = false;
  }

  completePropertyUpdates(threeObject) {
    if (this.updated) {
        this.recalculate(threeObject);
    }
  }

  completeChildUpdates(threeObject) {
    if (this.updated) {
        this.recalculate(threeObject);
    }
  }

  addChildren(threeObject, children) {
    this.children = this.children.concat(children);
    this.updated = true;
    this.recalculate(threeObject);
  }

  addChild(threeObject, child, mountIndex) {
    this.children.splice(mountIndex, 0, child);
    this.updated = true;
    this.recalculate(threeObject);
  }

  removeChild(threeObject, child) {
    this.children = this.children.filter(x => x !== child);
    this.updated = true;
    this.recalculate(threeObject);
  }

  moveChild(threeObject, childObject, toIndex) {
    const idx = this.children.indexOf(childObject);
    if (idx !== -1) {
      this.children.splice(toIndex, 0, this.children.splice(idx, 1)[0]);
    }
    this.updated = true;
    this.recalculate(threeObject);
  }

}

module.exports = InterleavedBufferGeometryDescriptor;
