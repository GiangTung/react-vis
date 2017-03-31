// Copyright (c) 2017 Uber Technologies, Inc.
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

import React, {PropTypes} from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  makeWidthFlexible,
  LineSeries,
  VerticalBarSeries,
  DiscreteColorLegend,
  Crosshair
} from 'react-vis';

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

const totalValues = Math.random() * 50;

/**
 * Get the array of x and y pairs.
 * The function tries to avoid too large changes of the chart.
 * @param {number} total Total number of values.
 * @returns {Array} Array of data.
 * @private
 */
function getRandomSeriesData(total) {
  const result = [];
  let lastY = Math.random() * 40 - 20;
  let y;
  const firstY = lastY;
  for (let i = 0; i < total; i++) {
    y = Math.random() * firstY - firstY / 2 + lastY;
    result.push({
      x: i,
      y
    });
    lastY = y;
  }
  return result;
}

class Example extends React.Component {

  state = {
    crosshairValues: [],
    series: [
      {
        title: 'Apples',
        disabled: false,
        data: getRandomSeriesData(totalValues)
      },
      {
        title: 'Bananas',
        disabled: false,
        data: getRandomSeriesData(totalValues)
      }
    ]
  }

  _updateButtonClicked = () => {
    const {series} = this.state;
    series.forEach(s => {
      s.data = getRandomSeriesData(Math.random() * 50 + 5);
    });
    this.setState({series});
  }

  /**
   * Event handler for onNearestX.
   * @param {Object} value Selected value.
   * @param {number} index Index of the series.
   * @private
   */
  _nearestXHandler = (value, {index}) => {
    const {series} = this.state;
    this.setState({
      crosshairValues: series.map(s => s.data[index])
    });
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _mouseLeaveHandler = () => {
    this.setState({crosshairValues: []});
  }

  /**
   * Format the title line of the crosshair.
   * @param {Array} values Array of values.
   * @returns {Object} The caption and the value of the title.
   * @private
   */
  _formatCrosshairTitle = (values) => {
    return {
      title: 'X',
      value: values[0].x
    };
  }

  /**
   * A callback to format the crosshair items.
   * @param {Object} values Array of values.
   * @returns {Array<Object>} Array of objects with titles and values.
   * @private
   */
  _formatCrosshairItems = (values) => {
    const {series} = this.state;
    return values.map((v, i) => {
      return {
        title: series[i].title,
        value: v.y
      };
    });
  }

  /**
   * Click handler for the legend.
   * @param {Object} item Clicked item of the legend.
   * @param {number} i Index of the legend.
   * @private
   */
  _legendClickHandler = (item, i) => {
    const {series} = this.state;
    series[i].disabled = !series[i].disabled;
    this.setState({series});
  }

  render() {
    const {forFrontPage} = this.props;
    const {series, crosshairValues} = this.state;
    return (
      <div className={!forFrontPage ? 'example-with-click-me' : ''} >
        {!forFrontPage && (<div className="legend">
          <DiscreteColorLegend
            onItemClick={this._legendClickHandler}
            width={180}
            items={series}/>
        </div>)}

        <div className="chart">
          <FlexibleXYPlot
            animation
            onMouseLeave={this._mouseLeaveHandler}
            height={300}>
            <HorizontalGridLines />
            <YAxis className="cool-custom-name"/>
            <XAxis className="even-cooler-custom-name"/>
            <VerticalBarSeries
              data={series[0].data}
              onNearestX={this._nearestXHandler}
              {...(series[0].disabled ? {opacity: 0.2} : null)}/>
            <LineSeries
              data={series[1].data}
              curve="curveMonotoneX"
              {...(series[1].disabled ? {opacity: 0.2} : null)}/>
            <Crosshair
              itemsFormat={this._formatCrosshairItems}
              titleFormat={this._formatCrosshairTitle}
              values={crosshairValues}/>
          </FlexibleXYPlot>
        </div>

        {!forFrontPage && (<button className="click-me" onClick={this._updateButtonClicked}>
          Click to update
        </button>)}
      </div>
    );
  }
}
Example.propTypes = {
  forFrontPage: PropTypes.bool
};

export default Example;
