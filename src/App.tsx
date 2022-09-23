import { useState, useCallback, useEffect } from "react";
import Map, { FillLayer, Layer, LayerProps, Source } from "react-map-gl";
import DrawControl from "./components/draw-control";
import ControlPanel from "./components/control-panel";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { IFeature } from "./utils/types/polygon.types";
import { DB_COLLECTION } from "./utils/db";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function App() {
  const [features, setFeatures] = useState({});
  const [geoData, setGeoData] = useState<any>({});

  const onUpdate = useCallback((e: { features: any }) => {
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      saveFeaturesToDb(e.features);
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

  const saveFeaturesToDb = async (newFeature: IFeature[]) => {
    if (!newFeature.length) return;
    try {
      const newPolygon = newFeature[0];
      const newData = {
        id: newPolygon.id,
        type: newPolygon.type,
        properties: newPolygon.properties,
        geometry: {
          ...newPolygon.geometry,
          coordinates: newPolygon.geometry.coordinates[0].map((cords) =>
            cords.join(", ")
          ),
        },
        created: Timestamp.now(),
      };
      await addDoc(collection(db, DB_COLLECTION), newData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFeatureFromDb = async (id: string) => {
    if (!id) return;
    const featureRef = doc(db, DB_COLLECTION, id);
    try {
      const docSnap = await getDoc(featureRef);
      if (!docSnap.exists()) {
        toast.error("Unable to find feature doc!");
        return;
      }
      await deleteDoc(featureRef);
      toast.success("Feature Removed");
    } catch (err) {
      alert(err);
    } finally {
      fetchPolygons();
    }
  };

  const fetchPolygons = () => {
    const q = query(collection(db, DB_COLLECTION), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      let response = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      if (!response.length) return;
      response = response.map((data: any) => ({
        ...data,
        geometry: {
          ...data.geometry,
          coordinates: data.geometry.coordinates.map((cords: any) =>
            cords.split(",").map(Number)
          ),
        },
      }));
      const allFeatures: any = {};
      response.forEach((_response) => {
        allFeatures[_response.docId] = _response;
      });
      setFeatures(allFeatures);
    });
  };

  const layerStyle: FillLayer = {
    id: "polygonData",
    type: "fill",
    paint: {
      "fill-color": "#d4896a",
      "fill-outline-color": "#503c52",
      "fill-opacity": 0.5,
    },
  };

  useEffect(() => {
    fetchPolygons();
  }, []);

  useEffect(() => {
    if (Object.keys(features).length) {
      const geojson = {
        type: "FeatureCollection",
        features: Object.values(features).map((feature: any) => ({
          type: feature.type,
          geometry: {
            ...feature.geometry,
            coordinates: [feature.geometry.coordinates],
          },
        })),
      };
      setGeoData(geojson);
    }
  }, [features]);

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
          zoom: 14,
        }}
        mapStyle="mapbox://styles/rzcodes/cl8ema9at001414nvx23r8u34"
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
        {!!Object.keys(geoData).length && (
          <Source id="polygonData" type="geojson" data={geoData}>
            <Layer {...layerStyle} />
          </Source>
        )}
      </Map>
      <ControlPanel
        handleDelete={deleteFeatureFromDb}
        polygons={Object.values(features)}
      />
      {}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
