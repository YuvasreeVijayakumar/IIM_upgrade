import React, { useState } from "react";

// import ClipLoader from "react-spinners/ClipLoader";
// import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

import BarLoader from "react-spinners/BarLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

// Can be a string as well. Need to ensure each key-value pair ends with ;

export function Barloaderjs() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  return (
    <div className="clip-loader">
      <BarLoader
        css={override}
        loading={loading}
        color={color}
        height={5}
        width="100%"
      />
      {/* <ClipLoader
        //  color={color}
        loading={loading}
        // size={60}
      /> */}
    </div>
  );
}
