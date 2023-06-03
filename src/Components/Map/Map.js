import React, { useState, useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "ol-contextmenu/ol-contextmenu.css";
import "ol/ol.css";
import {
  Attribution,
  defaults,
  FullScreen,
  Rotate,
  ScaleLine,
} from "ol/control";
import OSM from "ol/source/OSM";
import { fromLonLat, transform } from "ol/proj";
import { Feature } from "ol";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import { Point } from "ol/geom";
import OriginIcon from "../../assets/origin.png";

function MapShow(props) {
  // set intial state - used to track references to OpenLayers
  //  objects for use in hooks, event handlers, etc.
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect(() => {
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
    });

    const iconOrigin = new Feature({
      geometry: new Point(fromLonLat(props.originCoordinate)),
      name: "Origin",
      population: 4000,
      rainfall: 500,
    });

    const iconDestination = new Feature({
      geometry: new Point(fromLonLat(props.destinationCoordinate)),
      name: "Destination",
      population: 4000,
      rainfall: 500,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "https://openlayers.org/en/v3.20.1/examples/data/icon.png",
      }),
    });

    const iconStyleOrigin = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: OriginIcon,
      }),
    });

    iconOrigin.setStyle(iconStyleOrigin);
    iconDestination.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconOrigin, iconDestination],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // create map
    const initialMap = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat(props.originCoordinate),
        zoom: 10,
      }),
      controls: defaults({ attribution: false }).extend([
        new Attribution({
          collapsed: true,
          collapsible: true,
        }),
        // Add a fullscreen button control to the map.
        new FullScreen(),
        // Add scale line control to the map.
        new ScaleLine(),
        // Add a reset rotation button control to the map.
        new Rotate(),
      ]),
    });

    // save map and vector layer references to state
    setMap(initialMap);
    setFeaturesLayer(initalFeaturesLayer);
    initialMap.getView().fit(vectorSource.getExtent(), {zoom: -12});
  }, []);

  return (
    <div className="relative">
      <div id="map" className="map-container w-full h-96 mb-5"></div>
    </div>
  );
}

export default React.memo(MapShow);
