var map, toolbar;
var aExtent, aSpatialReference, aSimpleFillSymbol, aSimpleLineSymbol, aSimpleMarkerSymbol, aDraw, aGraphic,
    aCartographicLineSymbol, aColor, ageometryEngine, aPolyline, aTextSymbol, aFont, aPoint;
var isMeasuring = false;
var nowLayers = [];
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
    "esri/dijit/BasemapGallery",
    "esri/dijit/Basemap",
    "esri/dijit/BasemapLayer",
    "esri/symbols/CartographicLineSymbol",
    "esri/geometry/geometryEngine",
    "esri/geometry/Polyline",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/geometry/Point",
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
    Print, Query, QueryTask, Extent, SpatialReference, BasemapGallery, Basemap, BasemapLayer, CartographicLineSymbol,
    geometryEngine, Polyline, TextSymbol, Font, Point
) {
        aExtent = Extent;
        aSpatialReference = SpatialReference;
        aSimpleFillSymbol = SimpleFillSymbol;
        aSimpleLineSymbol = SimpleLineSymbol;
        aSimpleMarkerSymbol = SimpleMarkerSymbol;
        aDraw = Draw;
        aGraphic = Graphic;
        aCartographicLineSymbol = CartographicLineSymbol;
        aColor = Color;
        ageometryEngine = geometryEngine;
        aPolyline = Polyline;
        aTextSymbol = TextSymbol;
        aFont = Font;
        aPoint = Point;
        aQuery = Query;
        aQueryTask = QueryTask;


        //几何服务
        esriConfig.defaults.geometryService = new GeometryService(
            "http://" + gisServerIP + ":" + gisServerPort + "/arcgis/rest/services/Utilities/Geometry/GeometryServer");

        var basemaps = [];
        var showLayers = [];
        var legendLayers = [];

        $.ajax({
            type: 'get',
            url: "http://" + serverIP + ":" + serverPort + "/layers?groupId=" + user.groupId + "&token=" + token,
            success: function (layersForGroup) {
                nowLayers = layersForGroup;
                var sonshtml = '';
                for (var i = 0; i < layersForGroup.length; i++) {
                    sonshtml += "<div class='list-group-item father' flag='0' onclick='showSons(this)' ><input type='checkbox' style='cursor:pointer'>" + "<strong>" + layersForGroup[i].father.DisplayName + "</strong><span style='cursor:pointer' class='glyphicon glyphicon-plus' aria-hidden='true'></span></div>"
                    sonshtml += "<ul class='list-group son' style='padding-left:15px;margin-bottom:3px'>"
                    for (var j = 0; j < layersForGroup[i].sons.length; j++) {
                        sonshtml += "<li class='list-group-item' flag='0' layerId='" + layersForGroup[i].sons[j].id + "' onclick='clickSon(this)' style='cursor:default'>" + "<input type='checkbox' style='cursor:pointer'>" + layersForGroup[i].sons[j].DisplayName + "</li>"
                    }
                    sonshtml += "</ul>"
                }
                $("#layerList").append(
                    "<div class='list-group' onselectstart='return false'> " + sonshtml + "</div>"
                )


                for (var i = 0; i < layersForGroup.length; i++) {

                    var item = layersForGroup[i];

                    for (var j = 0; j < item.sons.length; j++) {

                        var oneLayer = item.sons[j];
                        oneLayer.IsVisible = oneLayer.IsVisible == 1 ? true : false

                        if (oneLayer.IsVisible == 1) {
                            var el = $("[layerId='" + oneLayer.id + "']");
                            $(el.children()[0]).prop('checked', true);
                            visibleSon(el)
                        }


                        //瓦片地图服务
                        if (oneLayer.LayerType == "TiledService") {

                            var IsBasemap = oneLayer.DisplayName.indexOf('底图');
                            if (IsBasemap != -1) {
                                basemaps.push(new Basemap({
                                    layers: [new BasemapLayer({
                                        url: oneLayer.ServiceUrl
                                    })],
                                    thumbnailUrl: "http://" + serverIP + ":" + serverPort + "/" + oneLayer.DisplayName + ".PNG",
                                    title: oneLayer.DisplayName
                                }))
                            }


                            var lyr = new ArcGISTiledMapServiceLayer(oneLayer.ServiceUrl, {
                                id: "" + oneLayer.id,
                                visible: oneLayer.IsVisible,
                                opacity: oneLayer.Opacity
                            })
                            showLayers.push(lyr);
                        }
                        //要素图层
                        if (oneLayer.LayerType === "FeatureLayer" && oneLayer.ServiceUrl != null) {
                            var otf = [];
                            var ift = ""
                            var fds = oneLayer.fields;
                            for (var k = 0; k < fds.length; k++) {
                                if (fds[k].IsDisplay == 1) {
                                    otf.push(fds[k].FieldName);
                                    ift += (fds[k].FieldName + ": ${" + fds[k].FieldName + "}<br>")
                                }
                            }

                            var lyr = new FeatureLayer(oneLayer.ServiceUrl, {
                                id: "" + oneLayer.id,
                                visible: oneLayer.IsVisible,
                                outFields: otf,
                                infoTemplate: new InfoTemplate("信息", ift),
                                opacity: oneLayer.Opacity
                            });

                            if (oneLayer.IsLegend == 1) {
                                legendLayers.push(lyr);
                            };
                            showLayers.push(lyr);
                        }
                    }
                }


                map = new Map("map", {
                    basemap: basemaps[0],
                    logo: false
                });
                //底图切换控件
                var basemapGallery = new BasemapGallery({
                    showArcGISBasemaps: false,
                    map: map,
                    basemaps: basemaps
                }, "basemapToolDiv");
                basemapGallery.startup();

                //全局视图控件(homebutton)
                var homeButton = new HomeButton({
                    map: map,
                    theme: "HomeButton",
                    visible: true
                }, dom.byId('homeButton'))
                homeButton.startup();
                map.addLayers(showLayers);
                map.on('layers-add-result', mapLoaded())
            }
        })
    })