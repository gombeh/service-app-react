import React, { useState, useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import ContextMenu from "ol-contextmenu";
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
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { Point } from "ol/geom";
import OriginIcon from "../../assets/origin.png";

function MapWrapper(props) {
  // set intial state - used to track references to OpenLayers
  //  objects for use in hooks, event handlers, etc.
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const originCoordinate = props.originCoordinate;
  const destinationCoordinate = props.destinationCoordinate;
  const [originMarker, setOriginMarker] = useState();
  const [destinationMarker, setDestinationMarker] = useState();

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect(() => {
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
    });

    // create map
    const initialMap = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat([51.392884, 35.709539]),
        zoom: 11,
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
  }, []);

  useEffect(() => {
    if (map) {
      const contextmenu = new ContextMenu({
        width: 170,
        defaultItems: false, // defaultItems are (for now) Zoom In/Zoom Out
        items: [
          {
            text: "Origin",
            classname: `!mb-2`, // add some CSS rules
            callback: setOriginHandler, // `center` is your callback function
          },
          "-",
          {
            text: "Destination",
            classname: `!mt-2 !mb-2`, // you can add this icon with a CSS class
            callback: setDestinationHandler, // `center` is your callback function
          },

          "-",
          {
            text: "Cancel",
            classname: `!mt-2 `, // you can add this icon with a CSS class
            callback: cancelHandler, // `center` is your callback function
          },
        ],
      });

      map.addControl(contextmenu);
      return () => {
        map.removeControl(contextmenu);
      };
    }
  }, [map, originCoordinate, destinationCoordinate]);

  const setOriginHandler = (event) => {
    map.removeLayer(originMarker);

    // transform coord to EPSG 4326 standard Lat Long
    const transormedCoord = transform(
      event.coordinate,
      "EPSG:3857",
      "EPSG:4326"
    );
    props.setOriginCoordinate(transormedCoord);

    const iconOrigin = new Feature({
      geometry: new Point(event.coordinate),
      name: "Destination",
      population: 4000,
      rainfall: 500,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        scale: 1,
        src: OriginIcon,
      }),
    });

    iconOrigin.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconOrigin],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    setOriginMarker(vectorLayer);
    map.addLayer(vectorLayer);
  };

  const setDestinationHandler = (event) => {
    map.removeLayer(destinationMarker);

    // transform coord to EPSG 4326 standard Lat Long
    const transormedCoord = transform(
      event.coordinate,
      "EPSG:3857",
      "EPSG:4326"
    );
    props.setDestinationCoordinate(transormedCoord);

    const iconDestination = new Feature({
      geometry: new Point(event.coordinate),
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

    iconDestination.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconDestination],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    setDestinationMarker(vectorLayer);
    map.addLayer(vectorLayer);
  };

  const cancelHandler = () => {
    if (destinationCoordinate) {
      props.setDestinationCoordinate();
      map.removeLayer(destinationMarker);
    } else if (originCoordinate) {
      props.setOriginCoordinate();
      props.setDestinationCoordinate();
      map.removeLayer(originMarker);
      map.removeLayer(destinationMarker);
    }
  };

  return (
    <div className="relative">
      <div id="map" className="map-container w-full h-96 mb-5"></div>
    </div>
  );
}

export default MapWrapper;
