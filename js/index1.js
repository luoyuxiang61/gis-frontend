
require([
    "dojo/dom",
    "dojo/on",
    "esri/Color",
    "dojo/keys",
    "dojo/parser",
    "dojo/_base/array",
    "esri/config",
    "esri/sniff",
    "esri/map",
    "esri/SnappingManager",
    "esri/dijit/Measurement",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/tasks/GeometryService",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/PictureFillSymbol",
    "esri/symbols/CartographicLineSymbol",
    "esri/basemaps",
    "esri/dijit/BasemapToggle",
    "esri/InfoTemplate",
    "esri/units",
    "esri/dijit/OverviewMap",
    "esri/dijit/Bookmarks",
    "esri/dijit/Scalebar",
    "esri/dijit/HomeButton",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/dijit/LayerList",
    "esri/dijit/Legend",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/dijit/Print",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/TitlePane",
    "dijit/form/CheckBox",
    "dojo/domReady!"
], function (
    dom, on, Color, keys, parser, arrayUtils,
    esriConfig, has, Map, SnappingManager, Measurement, FeatureLayer, SimpleRenderer, GeometryService,
    SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureFillSymbol,
    CartographicLineSymbol, esriBasemaps, BasemapToggle, InfoTemplate, Units, OverviewMap, Bookmarks, Scalebar,
    HomeButton, Draw, Graphic, LayerList, Legend, ArcGISTiledMapServiceLayer,
    Print, Query, QueryTask, Extent, SpatialReference


) {
        var map = new Map("map", {
            center: [-118, 34.5],
            zoom: 8,
            basemap: "topo"
        })






    })