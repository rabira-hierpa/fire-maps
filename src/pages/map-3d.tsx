import React from "react";
import KeplerGL from "kepler.gl";
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider } from "react-redux";
import { TOKEN } from "../utils/db";
const reducer = combineReducers({
  // <-- mount kepler.gl reducer in your app
  keplerGl: keplerGlReducer,
});

// create store
const store = createStore(reducer, {}, applyMiddleware(taskMiddleware));

const Map3D = () => {
  return (
    <Provider store={store}>
      <div className="flex justify-center align-middle text-9xl">Map3D</div>
      <KeplerGL
        id="foo"
        mapboxApiAccessToken={TOKEN}
        width={"100vw"}
        height={"100vh"}
      />
    </Provider>
  );
};

export default Map3D;
