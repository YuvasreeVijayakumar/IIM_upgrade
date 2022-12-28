import React, { useState } from 'react';

import { css } from '@emotion/react';
import BeatLoader from 'react-spinners/BeatLoader';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

// Can be a string as well. Need to ensure each key-value pair ends with ;

export function AppKpi() {
  // eslint-disable-next-line no-unused-vars
  let [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  let [color, setColor] = useState('#ffffff');

  return (
    <div className="clip-loader">
      <BeatLoader css={override} loading={loading} color={color} size={15} />
    </div>
  );
}
