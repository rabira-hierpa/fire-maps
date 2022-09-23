export interface IFeature {
  id: string;
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Geometry {
  coordinates: Array<Array<number[]>>;
  type: string;
}

export interface Properties {}
