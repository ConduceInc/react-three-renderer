import * as THREE from 'three';
import PropTypes from 'prop-types';

import GeometryDescriptorBase from './GeometryDescriptorBase';

class InterleavedBufferGeometryDescriptor extends GeometryDescriptorBase {
  constructor(react3RendererInstance) {
    super(react3RendererInstance);
    const self = this;
    this.hasProp('vbo', {
      type: PropTypes.instanceOf(ArrayBuffer),
      update(threeObject, vbo) {
        threeObject.userData.vbo = vbo;
        threeObject.userData.updated = true;
      },
      updateInitial: true,
      default: new Float32Array(),
    });
    this.hasProp('count', {
      type: PropTypes.number,
      update(threeObject, count) {
        threeObject.userData.count = count;
        threeObject.userData.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
    this.hasProp('offset', {
      type: PropTypes.number,
      update(threeObject, offset) {
        threeObject.userData.offset = offset;
        threeObject.userData.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
    this.hasProp('indexCount', {
      type: PropTypes.number,
      update(threeObject, indexCount) {
        threeObject.userData.indexCount = indexCount;
        threeObject.userData.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
    this.hasProp('groupCount', {
      type: PropTypes.number,
      update(threeObject, groupCount) {
        threeObject.userData.groupCount = groupCount;
        threeObject.userData.updated = true;
      },
      updateInitial: true,
      default: 0,
    });
  }

  construct() {
    //this.children = [];
    return new THREE.BufferGeometry();
  }

  applyInitialProps(threeObject, props) {
    super.applyInitialProps(threeObject, props);
    threeObject.userData.children = [];
    threeObject.userData.names = [];
    threeObject.userData.vbo = props.vbo;
    threeObject.userData.count = props.count;
    threeObject.userData.offset = props.offset;
    threeObject.userData.indexCount = props.indexCount;
    threeObject.userData.groupCount = props.groupCount;
    threeObject.userData.updated = true;
  }

  recalculate(threeObject) {
    var vertexOffset = threeObject.userData.offset;

    // setup index, if necessary
    threeObject.index = null;
    threeObject.clearGroups();
    if (threeObject.userData.indexCount) {
      const index = new Uint32Array(threeObject.userData.vbo, threeObject.userData.offset, threeObject.userData.indexCount);
      vertexOffset += 4 * threeObject.userData.indexCount;
      threeObject.setIndex(new THREE.BufferAttribute(index, 1));
    } else if (threeObject.userData.groupCount) {
      const index = new Uint32Array(threeObject.userData.count);
      for (let i = 0; i < threeObject.userData.count; i++) {
        index[i] = i;
      }
      threeObject.setIndex(new THREE.BufferAttribute(index, 1));
      const groups = new Uint32Array(threeObject.userData.vbo, threeObject.userData.offset, threeObject.userData.groupCount);
      let ix = 0;
      Array.from(groups).forEach((i) => {
        if (i !== 0) {
          threeObject.addGroup(ix, i - ix);
          ix = i;
        }
      });
      threeObject.addGroup(ix, threeObject.userData.count - ix);
      vertexOffset += 4 * threeObject.userData.groupCount;
    }

    // attribute data
    threeObject.userData.names.forEach(name => threeObject.removeAttribute(name));
    threeObject.userData.names = [];
    let stride = 0;
    threeObject.userData.children.forEach((child) => {
      stride += child.size;
    });
    const fv = new Float32Array(threeObject.userData.vbo, vertexOffset, stride * threeObject.userData.count);
    const fbuf = new THREE.InterleavedBuffer(fv, stride);
    let attrOffset = 0;
    const names = [];
    threeObject.userData.children.forEach((child) => {
      const bufattr = new THREE.InterleavedBufferAttribute(fbuf, child.size, attrOffset);
      attrOffset += child.size;
      threeObject.addAttribute(child.id, bufattr);
      names.push(child.id);
    });
    threeObject.userData.names = names;
    threeObject.userData.updated = false;
  }

  completePropertyUpdates(threeObject) {
    if (threeObject.userData.updated) {
        this.recalculate(threeObject);
    }
  }

  completeChildUpdates(threeObject) {
    if (threeObject.userData.updated) {
        this.recalculate(threeObject);
    }
  }

  addChildren(threeObject, children) {
    if (!threeObject.userData.children) {
      threeObject.userData.children = children;
    } else {
      threeObject.userData.children = threeObject.userData.children.concat(children);
    }
    threeObject.userData.updated = true;
    this.recalculate(threeObject);
  }

  addChild(threeObject, child, mountIndex) {
    if (!threeObject.userData.children) {
      threeObject.userData.children = [child];
    } else {
      threeObject.userData.children.splice(mountIndex, 0, child);
    }
    threeObject.userData.updated = true;
    this.recalculate(threeObject);
  }

  removeChild(threeObject, child) {
    if (threeObject.userData.children) {
      threeObject.userData.children = threeObject.userData.children.filter(x => x !== child);
      threeObject.userData.updated = true;
      this.recalculate(threeObject);
    }
  }

  moveChild(threeObject, childObject, toIndex) {
    if (threeObject.userData.children) {
      const idx = threeObject.userData.children.indexOf(childObject);
      if (idx !== -1) {
        threeObject.userData.children.splice(toIndex, 0, threeObject.userData.children.splice(idx, 1)[0]);
      }
      threeObject.userData.updated = true;
      this.recalculate(threeObject);
    }
  }

}

module.exports = InterleavedBufferGeometryDescriptor;
