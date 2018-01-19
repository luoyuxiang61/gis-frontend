var map;
console.log(user);
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
        //几何服务
        esriConfig.defaults.geometryService = new GeometryService(
            "http://" + gisServerIP + ":" + gisServerPort + "/arcgis/rest/services/Utilities/Geometry/GeometryServer");



        /*底图部分*/
        //基础底图
        esriBasemaps.jcdt = {
            baseMapLayers: [{
                url: ""
            }],
            thumbnailUrl: "https://js.arcgis.com/3.15/esri/images/basemap/streets.jpg",
            title: "基础底图"
        };
        //影像底图
        esriBasemaps.yxdt = {
            baseMapLayers: [{
                url: ""
            }],
            thumbnailUrl: "https://js.arcgis.com/3.15/esri/images/basemap/satellite.jpg",
            title: "影像底图"
        };




        /*瓦片图层、要素图层*/
        var showLayers = [];
        var legendLayers = [];

        $.ajax({
            type: 'post',
            url: "http://" + serverIP + ":" + serverPort + "/layersForGroup",
            data: { groupId: user.groupId },
            success: function (layersForGroup) {
                var sonshtml = '';
                for (var i = 0; i < layersForGroup.length; i++) {
                    sonshtml += "<div class='list-group-item father' flag='0' onclick='showSons(this)' style='cursor:pointer'><input type='checkbox' style='cursor:pointer'>" + "<strong>" + layersForGroup[i].father.DisplayName + "</strong></div>"
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
                            if (oneLayer.DisplayName === "基础底图") {
                                esriBasemaps.jcdt.baseMapLayers[0].url = oneLayer.ServiceUrl;
                            }
                            if (oneLayer.DisplayName === "影像底图") {
                                esriBasemaps.yxdt.baseMapLayers[0].url = oneLayer.ServiceUrl;
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
                    basemap: "jcdt",
                    logo: false
                });


                map.addLayers(showLayers);
                map.on('layers-add-result', mapLoaded())



            }
        })



    })