import { useState } from 'react';
import { Scale, get as getScale, names as getScaleNames } from '@tonaljs/scale';
import { Control } from './Control';
import { Keyboard } from './display/Keyboard';
import './App.css';

export type Maybe<T> = T | undefined

const scales = getScaleNames().map(getScale)

function App() {
  const [scale, setScale] = useState<Scale>()

  return (
    <div
      style={{
        display: 'grid',
        width: '100vw',
        height: '100vh',
        rowGap: '0.5em',
        columnGap: '0.5em',
        gridTemplateAreas: `
          scale mode
        `
      }}
    >
      <Control
        area='scale'
        title='Scale'
        value={scale}
        onChange={setScale}
        options={scales}
        getKey={(v) => v.name}
      />
      <Keyboard />
    </div>
  );
}

export default App;
