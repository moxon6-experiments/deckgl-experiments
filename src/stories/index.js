import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import HexagonLayerExample from '../components/HexagonLayerExample'
import GeoJsonLayerExample from '../components/GeoJsonLayerExample'
import HexagonGeoJSON from '../components/HexagonGeoJSON'
import IconLayerExample from '../components/IconLayerExample'
import IconLayerBase from '../components/IconLayerBase'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

  storiesOf('DeckGL', module)
    .add('Hexagon Layer Example', HexagonLayerExample)
    .add('GeoJson Layer Example', GeoJsonLayerExample)
    .add('Hexagon GeoJson Layer Example', HexagonGeoJSON)
    .add('Icon Layer Example', IconLayerExample)
    .add('Icon Layer Base', IconLayerBase)