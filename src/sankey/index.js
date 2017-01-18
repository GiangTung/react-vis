import React, {PropTypes, Component} from 'react';
import {voronoi} from 'd3-voronoi';
import {sankey} from 'd3-sankey-align';

import {DISCRETE_COLOR_RANGE} from 'theme';

const NOOP = f => f;

const DEFAULT_LINK_COLOR = DISCRETE_COLOR_RANGE[1];
const DEFAULT_LINK_OPACITY = 0.7;
const DEFAULT_NODE_COLOR = DISCRETE_COLOR_RANGE[0];
const DEFAULT_NODE_OPACITY = 1;

class Sankey extends Component {

  static defaultProps = {
    align: 'justify',
    className: '',
    hasVoronoi: false,
    layout: 50,
    margin: 20,
    nodePadding: 10,
    nodeWidth: 10,
    onBlur: NOOP,
    onClick: NOOP,
    onHover: NOOP
  }

  static propTypes = {
    align: PropTypes.oneOf(['justify', 'left', 'right', 'center']),
    className: PropTypes.string,
    hasVoronoi: PropTypes.bool,
    height: PropTypes.number.isRequired,
    layout: PropTypes.number,
    links: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.number.isRequired,
      target: PropTypes.number.isRequired
    })).isRequired,
    margin: PropTypes.number,
    nodePadding: PropTypes.number,
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    nodeWidth: PropTypes.number,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onHover: PropTypes.func,
    width: PropTypes.number.isRequired
  }

  render() {

    const {
      align,
      className,
      hasVoronoi,
      height,
      layout,
      links,
      margin,
      nodePadding,
      nodes,
      nodeWidth,
      onBlur,
      onClick,
      onHover,
      width
    } = this.props;

    const sankeyInstance = sankey()
      .size([width, height])
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .nodes(nodes)
      .links(links)
      .align(align)
      .layout(layout);

    const nWidth = sankeyInstance.nodeWidth();
    const path = sankeyInstance.link();

    // Create a voronoi with each node center points
    const voronoiInstance = hasVoronoi ?
      voronoi()
        .x(d => d.x + d.dx / 2)
        .y(d => d.y + d.dy / 2)
        .extent([[-margin, -margin], [width + margin, height + margin]]) :
      null;

    return (
      <svg height={height + margin} width={width + margin} className={`rv-sankey ${className}`}>
        <g transform={`translate(${margin / 2}, ${margin / 2})`}>

          {links.map((link, i) => (
            <path
              d={path(link)}
              className="rv-sankey__link"
              opacity={Number.isFinite(link.opacity) ? link.opacity : DEFAULT_LINK_OPACITY}
              stroke={link.color || DEFAULT_LINK_COLOR}
              strokeWidth={Math.max(1, link.dy)}
              fill="none"
              key={link.id || link.key || `link-${i}`} />
          ))}

          {nodes.map((node, i) => (
            <g
              transform={`translate(${node.x}, ${node.y})`}
              className="rv-sankey__node"
              opacity={Number.isFinite(node.opacity) ? node.opacity : DEFAULT_NODE_OPACITY}
              key={node.id || node.key || `node-${i}`}>
              <rect
                onClick={() => onClick(node)}
                onMouseOver={() => onHover(node)}
                onMouseOut={() => onBlur(node)}
                fill={node.color || DEFAULT_NODE_COLOR}
                height={node.dy}
                width={nWidth} />
            </g>
          ))}

          {hasVoronoi && (
            <g className="rv-sankey__voronoi">
              {voronoiInstance.polygons(nodes).map((d, i) => (
                <path
                  d={`M${d.join('L')}Z`}
                  onClick={() => onClick(d.data)}
                  onMouseOver={() => onHover(d.data)}
                  onMouseOut={() => onBlur(d.data)}
                  fill="none"
                  style={{pointerEvents: 'all'}}
                  key={i} />
              ))}
            </g>
          )}

        </g>
      </svg>
    );
  }

}

export default Sankey;
