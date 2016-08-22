// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import PureRenderComponent from '../../pure-render-component';
import {POSITION, getTicksTotalFromSize} from '../../utils/axis-utils';
import AxisLine from './axis-line';
import AxisTicks from './axis-ticks';
import AxisTitle from './axis-title';

const {LEFT, RIGHT, TOP, BOTTOM} = POSITION;

const propTypes = {
  position: React.PropTypes.oneOf([
    LEFT, RIGHT, TOP, BOTTOM
  ]),
  attr: React.PropTypes.string.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  top: React.PropTypes.number,
  left: React.PropTypes.number,

  tickSize: React.PropTypes.number,
  tickSizeInner: React.PropTypes.number,
  tickSizeOuter: React.PropTypes.number,
  tickPadding: React.PropTypes.number,
  tickValues: React.PropTypes.array,
  tickFormat: React.PropTypes.func,
  tickTotal: React.PropTypes.number,

  // Not expected to be used by the users.
  // TODO: Add underscore to these properties later.
  marginTop: React.PropTypes.number,
  marginBottom: React.PropTypes.number,
  marginLeft: React.PropTypes.number,
  marginRight: React.PropTypes.number,
  innerWidth: React.PropTypes.number,
  innerHeight: React.PropTypes.number
};

const defaultProps = {
  tickSize: 6,
  tickPadding: 8,
  position: BOTTOM
};

class Axis extends PureRenderComponent {

  /**
   * Define the default values depending on the data passed from the outside.
   * @returns {*} Object of default properties.
   * @private
   */
  _getDefaultAxisProps() {
    const {
      innerWidth,
      innerHeight,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      position
    } = this.props;
    if (position === BOTTOM) {
      return {
        tickTotal: getTicksTotalFromSize(innerWidth),
        top: innerHeight + marginTop,
        left: marginLeft,
        width: innerWidth,
        height: marginBottom
      };
    } else if (position === TOP) {
      return {
        tickTotal: getTicksTotalFromSize(innerWidth),
        top: 0,
        left: marginLeft,
        width: innerWidth,
        height: marginTop
      };
    } else if (position === LEFT) {
      return {
        tickTotal: getTicksTotalFromSize(innerHeight),
        top: marginTop,
        left: 0,
        width: marginLeft,
        height: innerHeight
      };
    }
    return {
      tickTotal: getTicksTotalFromSize(innerHeight),
      top: 0,
      left: marginLeft + innerWidth,
      width: marginRight,
      height: innerHeight
    };
  }

  render() {
    const props = {
      ...this._getDefaultAxisProps(),
      ...this.props
    };

    const {
      left,
      top,
      width,
      height,
      position,
      title
    } = props;

    return (
      <g
        transform={`translate(${left},${top})`}
        className="rv-xy-plot__axis">
        <AxisLine
          height={height}
          width={width}
          position={position}/>
        <AxisTicks {...props} />
        {title ?
          <AxisTitle
            title={title}
            height={height}
            width={width}
            position={position}/> :
          null}
      </g>
    );
  }
}

Axis.displayName = 'Axis';
Axis.propTypes = propTypes;
Axis.defaultProps = defaultProps;
Axis.requiresSVG = true;

export default Axis;
