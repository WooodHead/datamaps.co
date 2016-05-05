import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import d3 from 'd3'

import style from './MapElements.css'
import Title from '../Title/Title'
import Datamap from '../Datamap/Datamap'
import MapLegend from '../MapLegend/MapLegend'

export default class MapElements extends Component {
  linearScale(min, max) {
    const { mapUi } = this.props

    return function _linearScale() {
      const startColor = mapUi.getIn(['linear', 'startColor'])
      const endColor = mapUi.getIn(['linear', 'endColor'])

      return d3.scale.linear()
        .domain([min, max])
        .range([startColor, endColor])
        .interpolate(d3.interpolateLab)
    }
  }

  equidistantScale(min, max) {
    const { mapUi } = this.props

    return function _equidistantScale() {
      const colorPallete = mapUi.getIn(['equidistant', 'pallete'])

      return d3.scale.quantize().domain([min, max]).range(colorPallete)
    }
  }

  colorScale() {
    const { extremeValues } = this.props
    const min = extremeValues.get('customMin') || extremeValues.get('min')
    const max = extremeValues.get('customMax') || extremeValues.get('max')

    const scales = {
      linear: this.linearScale(min, max),
      equidistant: this.equidistantScale(min, max),
    }

    const dataClassification = this.props.mapUi.get('dataClassification')
    return scales[dataClassification]()
  }

  renderMapElements(svgWidth, svgHeight) {
    const { mapUi, extremeValues } = this.props
    const noDataColor = mapUi.get('noDataColor')
    const colorScale = this.colorScale()
    const legendTitleCoords = { x: svgWidth - 20, y: svgHeight - 85 }

    return (
      <svg className={style.svg}>
        <Title
          text={this.props.mapUi.get('title')}
          className="map-title"
          coords={{ x: 30, y: 40 }}
        />

        <Datamap
          regionData={this.props.regionData}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          colorScale={colorScale}
          noDataColor={noDataColor}
          mouseMoveOnDatamap={this.props.mouseMoveOnDatamap}
          mouseEnterOnDatamap={this.props.mouseEnterOnDatamap}
          mouseLeaveDatamap={this.props.mouseLeaveDatamap}
          mouseEnterOnSubunit={this.props.mouseEnterOnSubunit}
        />

        <Title
          text={this.props.mapUi.get('legendTitle')}
          className="legend-title"
          coords={legendTitleCoords}
        />

        <MapLegend
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          extremeValues={extremeValues}
          mapUi={mapUi}
        />
      </svg>
    )
  }

  render() {
    const { svgWidth, svgHeight } = this.props

    return (
      <div>
        {svgWidth && svgHeight && this.renderMapElements(svgWidth, svgHeight)}
      </div>
    )
  }
}

MapElements.propTypes = {
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  mouseMoveOnDatamap: PropTypes.func.isRequired,
  mouseEnterOnDatamap: PropTypes.func.isRequired,
  mouseLeaveDatamap: PropTypes.func.isRequired,
  mouseEnterOnSubunit: PropTypes.func.isRequired,
  regionData: PropTypes.instanceOf(Map).isRequired,
  extremeValues: PropTypes.instanceOf(Map).isRequired,
  mapUi: PropTypes.instanceOf(Map).isRequired,
}
