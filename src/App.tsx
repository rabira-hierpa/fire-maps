import { useState, useCallback } from "react";
import Map from "react-map-gl";
import DrawControl from "./components/draw-control";
import ControlPanel from "./components/control-panel";

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; // Set your mapbox token here

export default function App() {
  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e: { features: any }) => {
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      console.log({ newFeatures });
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e: { features: any }) => {
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  return (
    <div className="">
      <Map
        style={{
          width: "100vw",
          height: "100vh",
        }}
        initialViewState={{
          longitude: 38.763611,
          latitude: 9.0054011,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={TOKEN}
      >
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Map>
      <ControlPanel polygons={Object.values(features)} />
    </div>
  );
}
