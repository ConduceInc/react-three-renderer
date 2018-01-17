import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import THREEElementDescriptor from '../THREEElementDescriptor';

class InterleavedBufferAttributeDescriptor extends THREEElementDescriptor {
  constructor(react3RendererInstance) {
    super(react3RendererInstance);
    this.hasProp('id', {
      type: PropTypes.string,
      update(threeObject, id) {
        threeObject.id = id;
      },
      updateInitial: true,
      default: '',
    });
    this.hasProp('size', {
      type: PropTypes.number,
      update(threeObject, size) {
        threeObject.size = size;
      },
      updateInitial: true,
      default: 1,
    });
    this.hasProp('type', {
      type: PropTypes.number,
      update(threeObject, type) {
        threeObject.type = type;
      },
      updateInitial: true,
      default: 1,
    });
  }

  construct() {
    return { userData: {}, uuid: uuidv4() };
  }

  applyInitialProps(threeObject, props) {
    super.applyInitialProps(threeObject, props);
    threeObject.id = props.id;
    threeObject.size = props.size;
    threeObject.type = props.type;
  }

}

module.exports = InterleavedBufferAttributeDescriptor;

