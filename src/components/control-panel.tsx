import * as React from "react";
import area from "@turf/area";
import { Timestamp } from "firebase/firestore";

type IControlProps = {
  polygons: any;
  handleDelete: (id: string) => void;
};

function ControlPanel(props: IControlProps) {
  const { polygons, handleDelete } = props;

  return (
    <>
      {polygons.length && (
        <div className="control-panel h-1/2">
          <h3>Polygons</h3>
          <ul>
            {polygons.map((polygon: any) => {
              // const date = new;
              return (
                <li key={polygon.id}>
                  <div className="flex flex-col">
                    <p className="flex justify-between space-x-10 font-sm ">
                      <span>ID: {String(polygon.id).slice(0, 4)}</span>
                      <span>
                        {new Timestamp(
                          polygon.created.seconds,
                          polygon.created.nanoseconds
                        )
                          .toDate()
                          .toLocaleTimeString()}
                      </span>
                    </p>
                    <p className="flex justify-between font-sm">
                      <span>{polygon.type}</span>{" "}
                      <button
                        onClick={() => handleDelete(polygon?.docId)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </p>
                  </div>
                  <div className="border-y-2"></div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default React.memo(ControlPanel);
