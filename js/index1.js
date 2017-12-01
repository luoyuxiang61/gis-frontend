require(["esri/map","esri/dijit/OverviewMap","dojo/parser",
"esri/dijit/BasemapToggle","esri/dijit/HomeButton","esri/dijit/Scalebar","dojo/dom",
"esri/dijit/BasemapLayer","esri/dijit/Basemap","esri/basemaps","esri/dijit/Legend",
"esri/dijit/LayerList","esri/layers/FeatureLayer","esri/InfoTemplate","esri/layers/ArcGISDynamicMapServiceLayer",
"esri/dijit/Measurement", "esri/units",
"dijit/layout/BorderContainer", "dijit/layout/ContentPane","dojo/domReady!"],
 function(Map,OverviewMap,parser,BasemapToggle,HomeButton,Scalebar,dom,BasemapLayer,Basemap,esriBasemaps,
          Legend,LayerList,FeatureLayer,InfoTemplate,ArcGISDynamicMapServiceLayer,Measurement, Units

) {


    //基础底图
    esriBasemaps.jcdt = {
      baseMapLayers: [{url: "http://a.unimap.cn:6080/arcgis/rest/services/NT/NTMap/MapServer"}
      ],
      thumbnailUrl: "https://js.arcgis.com/3.15/esri/images/basemap/streets.jpg",
      title: "基础底图"
    };
    //影像底图
    esriBasemaps.yxdt = {
      baseMapLayers: [{url: "http://a.unimap.cn:6080/arcgis/rest/services/NT/Raster2012/MapServer"}
      ],
      thumbnailUrl: "https://js.arcgis.com/3.15/esri/images/basemap/satellite.jpg",
      title: "影像底图"
    };



    //地图
    var map = new Map("map", {
      showAttribution:false,
      basemap: "jcdt",
      logo:false
    });


    var infoTemplate = new InfoTemplate("属性", "${*}");
    var fl1 = new FeatureLayer("http://a.unimap.cn:6080/arcgis/rest/services/NT/Redline_ZS/MapServer/0",{
      visible:false,
      id:"正式红线",
      infoTemplate:infoTemplate,
      outFields:["*"]
    });
    var fl2 = new FeatureLayer("http://a.unimap.cn:6080/arcgis/rest/services/NT/NTKG/MapServer/0",{
      visible:false,
      id:"规划用地图",
      infoTemplate:infoTemplate,
      outFields:["*"]
    })
    map.addLayers([fl2,fl1]);


    //鹰眼视图
    var overviewMapDijit = new OverviewMap({
        map: map,
        attachTo: "bottom-right",
        color:" #D84E13",
        opacity: .40,
        visible:false
      });
      overviewMapDijit.startup();


    //底图切换按钮
    var toggle = new BasemapToggle({
      map: map,
      basemap:"yxdt"
    }, "basemapToggle");
    toggle.startup();

    //全局视图
    var home = new HomeButton({
      map: map
    }, "homeButton");
    home.startup();

    //比例尺
    var scalebar = new Scalebar({
      map: map,
      scalebarUnit: "metric"
    });

    //图层控制
    var layerList = new LayerList({
      map: map,
      showLegend: true,
      showSubLayers: true,
      showOpacitySlider: false 
    },"layerList");
    console.log(map);
    layerList.startup();
   

  });