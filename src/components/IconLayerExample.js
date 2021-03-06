/* global window */
import React, {Component} from 'react';
import {PhongMaterial} from '@luma.gl/core';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from 'deck.gl';
import {scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic'
import { rgb } from 'd3-color'
import {IconLayer} from 'deck.gl';
import IconLayerExample from './IconLayerExample.css'

const COLOR_SCALE = scaleOrdinal(schemeCategory10);
const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 32, height: 32, mask: true}
};
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const DATA_URL_GEO = 'data/uk-vlow.geo.json'; // eslint-disable-line
const DATA_URL_ICONS =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json'; // eslint-disable-line

// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = new PhongMaterial({
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
});

export const INITIAL_VIEW_STATE = {
  longitude: -1.4157267858730052,
  latitude: 52.232395363869415,
  zoom: 6.6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const elevationScale = {min: 1, max: 50};

/* eslint-disable react/no-deprecated */
export class App extends Component {
  static get defaultColorRange() {
    return colorRange;
  }

  constructor(props) {
    super(props);
    this.state = {
      elevationScale: elevationScale.min
    };

    this.startAnimationTimer = null;
    this.intervalTimer = null;

    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);
  }

  componentDidMount() {
    this._animate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data && nextProps.data.length !== this.props.data.length) {
      this._animate();
    }
  }

  componentWillUnmount() {
    this._stopAnimate();
  }

  _animate() {
    this._stopAnimate();

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    if (this.state.elevationScale === elevationScale.max) {
      this._stopAnimate();
    } else {
      this.setState({elevationScale: this.state.elevationScale + 1});
    }
  }

  _renderLayers() {
    const {data, radius = 5000, upperPercentile = 100, coverage = 0.7, viewState} = this.props;
    
    const layerProps = {
      data: DATA_URL_ICONS,
      pickable: true,
      wrapLongitude: true,
      iconAtlas:  'data/icon-atlas.png',
      iconMapping: ICON_MAPPING,
      onHover: this._onHover,
      onClick: this._onClick,
      sizeScale: 60,
      getPosition: d => d.coordinates
    };

    const size = viewState ? Math.min(Math.pow(1.5, viewState.zoom - 10), 1) : 1;

    return [
      new GeoJsonLayer({
        id: 'geojson',
        data: DATA_URL_GEO,
        opacity: 0.8,
        stroked: true,
        filled: true,
        extruded: false,
        wireframe: true,
        fp64: true,
        getFillColor: f => {
          const color = rgb(COLOR_SCALE(+f.properties.EER13CDO))
          return [
            color.r,
            color.g,
            color.b
          ]
        },
        getLineColor: [255, 255, 255],
        pickable: true,
      }),

      new IconLayer({
          ...layerProps,
          id: 'icon',
          getIcon: d => 'marker',
          getSize: size,
          elevationRange: [100, 3000],
      })
    ];
  }

  render() {
    debugger
    const {viewState, controller = true, baseMap = true} = this.props;
    return (
      <DeckGL
        layers={this._renderLayers()}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
      >
      </DeckGL>
    );
  }
}

class BaseExample extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
    require('d3-request').csv(DATA_URL, (error, response) => {
      if (!error) {
        const data = response.map(d => [Number(d.lng), Number(d.lat)]);
        this.setState({ data })
      }
    });

  }

  render() {
    if (!this.state.data) return "Base Example Loading"
    return (
      <App data={this.state.data} />
    )
  }
}

export default () => <BaseExample/>