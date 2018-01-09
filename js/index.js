var map, tb;
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
  Print, Query, QueryTask


) {
  parser.parse();
  //This sample may require a proxy page to handle communications with the ArcGIS Server services. You will need to
  //replace the url below with the location of a proxy on your machine. See the 'Using the proxy page' help topic
  //for details on setting up a proxy page.
  esriConfig.defaults.io.proxyUrl = "/proxy/";
  esriConfig.defaults.io.alwaysUseProxy = false;

  //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
  esriConfig.defaults.geometryService = new GeometryService(
    "http://localhost:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");


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





  /*数据图层部分*/
  var infoTemplate = new InfoTemplate("属性", "${*}");
  var myLayers = [];
  var showLayers = [];
  var legendLayers = [];

  $.ajax({
    url: "http://localhost:3000/layersForTree?depart=" + depart,
    async: false,
    success: function (layersForTree) {
      myLayers = layersForTree;
      console.log(myLayers)
    }
  })


  for (var i = 0; i < myLayers.length; i++) {
    var item = myLayers[i];
    var nowGroup = item.father.DisplayName;
    $("#layerList").append("<li class='layerListItem groupLayer " + nowGroup +
      "'><input class='inputItem groupLayer' type='checkbox'><label class='labelItem groupLayer'><strong>" +
      item.father.DisplayName + "</strong></label></li>");



    for (var j = 0; j < item.sons.length; j++) {

      var oneLayer = item.sons[j];

      //瓦片地图服务
      if (oneLayer.LayerType == "TiledService") {
        if (oneLayer.DisplayName === "基础底图") {
          esriBasemaps.jcdt.baseMapLayers[0].url = oneLayer.ServiceUrl;
        }
        if (oneLayer.DisplayName === "影像底图") {
          esriBasemaps.yxdt.baseMapLayers[0].url = oneLayer.ServiceUrl;
        }
        $("#layerList").append("<li class='layerListItem layer " + nowGroup +
          "' style='padding-left:8px;display:none;'><input class='inputItem layer' type='checkbox'><label class='labelItem layer'>" +
          oneLayer.DisplayName + "</label></li>");
        var lyr = new ArcGISTiledMapServiceLayer(oneLayer.ServiceUrl, {
          id: oneLayer.DisplayName,
          visible: false
        })
        showLayers.push(lyr);
      }
      //要素图层
      if (oneLayer.LayerType === "FeatureLayer" && oneLayer.ServiceUrl != null) {
        $("#layerList").append("<li class='layerListItem layer " + nowGroup +
          "' style='padding-left:8px;display:none'><input class='inputItem layer' type='checkbox'><label class='labelItem layer'>" +
          oneLayer.DisplayName + "</label></li>");
        var lyr = new FeatureLayer(oneLayer.ServiceUrl, {
          id: oneLayer.DisplayName,
          visible: false,
          outFields: ["*"],
          infoTemplate: infoTemplate
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







  //画图工具
  map.on("load", initToolBar);
  // markerSymbol is used for point and multipoint, see http://raphaeljs.com/icons/#talkq for more examples
  var markerSymbol = new SimpleMarkerSymbol();
  markerSymbol.setPath(
    "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z"
  );
  markerSymbol.setColor(new Color("#00FFFF"));

  // lineSymbol used for freehand polyline, polyline and line. 
  var lineSymbol = new CartographicLineSymbol(
    CartographicLineSymbol.STYLE_SOLID,
    new Color([255, 0, 0]), 10,
    CartographicLineSymbol.CAP_ROUND,
    CartographicLineSymbol.JOIN_MITER, 5
  );

  // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
  // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
  var fillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
      new Color([255, 0, 0]), 2), new Color([255, 0, 0, 0.25])
  );

  function initToolBar() {




    tb = new Draw(map);
    tb.on("draw-end", addGraphic);

    // event delegation so a click handler is not
    // needed for each individual button
    on(dom.byId("draw"), "click", function (evt) {
      if (evt.target.id === "draw" || evt.target.id === "") {
        return;
      }

      if (evt.target.id === "clear") {
        map.graphics.clear();
        return;
      }
      var tool = evt.target.id.toLowerCase();
      map.disableMapNavigation();
      tb.activate(tool);
    });
  }

  function addGraphic(evt) {
    //deactivate the toolbar and clear existing graphics 
    tb.deactivate();
    map.enableMapNavigation();

    // figure out which symbol to use
    var symbol;
    if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
      symbol = markerSymbol;
    } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
      symbol = lineSymbol;
    } else {
      symbol = fillSymbol;
    }

    map.graphics.add(new Graphic(evt.geometry, symbol));
  }


  //量测工具
  var measurement = new Measurement({
    map: map,
    defaultAreaUnit: Units.SQUARE_KILOMETERS,
    defaultLengthUnit: Units.KILOMETERS
  }, dom.byId("measurementDiv"));
  measurement.startup();

  var nowXy = new Object();
  map.on('click', function (evt) {
    nowXy.x = evt.pageX;
    nowXy.y = evt.pageY;
  })
  map.on("dbl-click", function (evt) {
    nowXy.x = evt.pageX;
    nowXy.y = evt.pageY;
  })

  var mUnit;
  measurement.on('measure-start', function (evt) {

  })

  measurement.on("measure", function (evt) {
    $("#onMeasure").empty();
    $("#onMeasure").show();

    $("#onMeasure").append("<p>" + evt.values.toFixed(2) + "千米" + "</p>");
    $("#onMeasure").css("left", nowXy.x + 10 + "px");
    $("#onMeasure").css("top", nowXy.y + 10 + "px");
  })



  measurement.on('measure-end', function (evt) {
    $("#onMeasure").empty();
    $("#onMeasure").show();
    $("#onMeasure").append("<p>" + evt.values.toFixed(2) + "千米" + "</p>");
    $("#onMeasure").css("left", nowXy.x - 10 + "px");
    $("#onMeasure").css("top", nowXy.y - 10 + "px");
    setTimeout(function () {
      $("#onMeasure").hide(100);
    }, 1200)
  })






  //底图切换按钮
  var toggle = new BasemapToggle({
    map: map,
    basemap: "yxdt"
  }, dom.byId("basemapToggleDiv"));
  toggle.startup();


  //鹰眼视图
  var overviewMapDijit = new OverviewMap({
    map: map,
    visible: false,
    attachTo: "bottom-left"
  });
  overviewMapDijit.startup();

  //书签
  var bookmarks = new Bookmarks({
    map: map,
    bookmarks: [],
    editable: true
  }, "bookmarksDiv");


  //比例尺
  var scalebar = new Scalebar({
    map: map,
    scalebarUnit: "metric"
  }, dom.byId("scaleBarDiv"));


  //全局视图home
  var homeButton = new HomeButton({
    theme: "HomeButton",
    map: map,
    extent: null,
    visible: true
  }, dom.byId("homeButtonDiv"));
  homeButton.startup();


  //打印
  var printer = new Print({
    map: map,
    url: "http://localhost:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
  }, dom.byId("print"));
  printer.startup();


  var layerInfos = [];
  for (var i = 0; i < legendLayers.length; i++) {
    layerInfos[i] = {
      layer: legendLayers[i],
      title: legendLayers[i].id
    }
  }


  //图例
  var legendDijit = new Legend({
    map: map,
    layerInfos: layerInfos
  }, "legendDiv");
  legendDijit.startup();


  //图层控制点击之后
  //非图层组（点击前面的checkbox)
  $(".inputItem.layer").click(function () {
    var liCheckbox = $(this);
    var groupLayerName = liCheckbox.parent().attr('class').substr(20, 10).trim();
    var checked = liCheckbox.prop('checked');
    var liLabel = liCheckbox.next();
    var layerName = liLabel.text();
    if (checked) {
      liCheckbox.prop('checked', true);
      map.getLayer(layerName).setVisibility(true);
      var groupLi = $(".layerListItem.groupLayer." + groupLayerName);
      $(groupLi.children()[0]).prop('checked', true);
    } else {
      liCheckbox.prop('checked', false);
      map.getLayer(layerName).setVisibility(false);
      var subLayers = $(".layerListItem.layer." + groupLayerName);

      var groupLi = $(".layerListItem.groupLayer." + groupLayerName);
      $(groupLi.children()[0]).prop('checked', false);

      for (var i = 0; i < subLayers.length; i++) {
        var checked = $($(subLayers[i]).children()[0]).prop('checked');
        if (checked) $(groupLi.children()[0]).prop('checked', true);
      }


    }
  })
  //非图层组（点击后面的label)
  $(".labelItem.layer").click(function () {
    var label = $(this);
    var groupLayerName = label.parent().attr('class').substr(20, 10).trim();
    var layerName = label.text();
    var checkbox = label.prev();
    var checked = checkbox.prop('checked');

    if (!checked) {
      checkbox.prop('checked', true);
      map.getLayer(layerName).setVisibility(true);
      var groupLi = $(".layerListItem.groupLayer." + groupLayerName);
      $(groupLi.children()[0]).prop('checked', true);

    } else {
      checkbox.prop('checked', false);
      map.getLayer(layerName).setVisibility(false);
      var subLayers = $(".layerListItem.layer." + groupLayerName);
      var groupLi = $(".layerListItem.groupLayer." + groupLayerName);
      $(groupLi.children()[0]).prop('checked', false);
      for (var i = 0; i < subLayers.length; i++) {
        var checked = $($(subLayers[i]).children()[0]).prop('checked');
        if (checked) $(groupLi.children()[0]).prop('checked', true);
      }
    }
  })





  //图层组
  //点击前面的checkbox
  $(".inputItem.groupLayer").click(function () {
    var liCheckbox = $(this);
    var checked = liCheckbox.prop('checked');
    var liLabel = liCheckbox.next();
    var layerName = liLabel.text();

    if (checked) {
      $(".layerListItem.layer." + layerName).show(200);
      var subLayers = $($(".layerListItem.layer." + layerName));
      for (var i = 0; i < subLayers.length; i++) {
        var checkbox = $(subLayers[i]).children()[0];
        var label = $(subLayers[i]).children()[1];
        $(checkbox).prop('checked', true);
        var sLayerName = $(label).text();
        map.getLayer(sLayerName).setVisibility(true);
      }



    } else {
      $(".layerListItem.layer." + layerName).hide(200);
      var subLayers = $($(".layerListItem.layer." + layerName));
      for (var i = 0; i < subLayers.length; i++) {
        var checkbox = $(subLayers[i]).children()[0];
        var label = $(subLayers[i]).children()[1];
        $(checkbox).prop('checked', false);
        var sLayerName = $(label).text();
        map.getLayer(sLayerName).setVisibility(false);
      }
    };
  })
  //点击后面的label
  $(".labelItem.groupLayer").click(function () {
    var label = $(this);
    var layerName = label.text();



    var display = $(".layerListItem.layer." + layerName).css("display");

    if (display == "none") $(".layerListItem.layer." + layerName).show(150);
    else $(".layerListItem.layer." + layerName).hide(150);

  })





  // toobar点击
  var toolId0 = "xx";
  $(".icon").click(function () {

    var toolId = $(this).prop("alt");



    if (toolId != toolId0) {
      $(".tool").hide();
      $("#tool").show();
      $("#" + toolId).show();
    } else {
      if ($("#tool").css("display") == "none") {
        $("#tool").show();
      } else $("#tool").hide(200);
    }
    toolId0 = toolId;
  })
  //关闭tool
  $("#closeTool").click(function () {
    $("#tool").hide(200);
  })


  //图层控制toggle
  $("#layersToggle").click(function () {
    $("#layerListDiv").toggle(150);
  })

});