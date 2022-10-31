import type { FunctionComponent } from "react";

import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

import App from "./components";

import "modern-normalize";
import "./styles/globals.css";

const Application: FunctionComponent = () => {
  const [refresh_token, setRefresh_token] = useState<string>();
  const [contents, setContents] = useState(["", "", "", ""]);
  const [progressbar, setProgressbar] = useState<string>();
  const [margin, setMargin] = useState([0, 0, 0, 0]);
  const [audioArray, setAudioArray] = useState<number[]>([]);

  const updateContents = (index: number, value?: string) => {
    setContents((contents) => {
      const new_contents = [...contents];
      new_contents[index] = value ?? "";
      return new_contents;
    });
  };

  const updateMargin = (index: number, value?: string) => {
    setMargin((margin) => {
      const new_margin = [...margin];
      new_margin[index] = parseInt(value ?? "") || 0;
      return new_margin;
    });
  };

  useEffect(() => {
    window.wallpaperPropertyListener = {
      applyUserProperties: (properties: any) => {
        if (properties["refresh_token"])
          setRefresh_token(properties["refresh_token"].value);

        if (properties["topleft"])
          updateContents(0, properties["topleft"].value);
        if (properties["topright"])
          updateContents(1, properties["topright"].value);
        if (properties["bottomleft"])
          updateContents(2, properties["bottomleft"].value);
        if (properties["bottomright"])
          updateContents(3, properties["bottomright"].value);

        if (properties["progressbar"])
          setProgressbar(properties["progressbar"].value);

        if (properties["margintop"])
          updateMargin(0, properties["margintop"].value);
        if (properties["marginright"])
          updateMargin(1, properties["marginright"].value);
        if (properties["marginbottom"])
          updateMargin(2, properties["marginbottom"].value);
        if (properties["marginleft"])
          updateMargin(3, properties["marginleft"].value);
      },
    };
    window.wallpaperRegisterAudioListener?.((array: number[]) => {
      setAudioArray(array.map((a) => Math.min(a, 1)));
    });
  }, []);

  return (
    <App
      refresh_token={refresh_token}
      contents={contents}
      progressbar={progressbar}
      margin={margin}
      audioArray={audioArray}
      domain={"https://secchanu.com"}
    />
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Application />);
