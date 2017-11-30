
require(["esri/Map", "esri/views/SceneView", "esri/views/MapView",
        "esri/geometry/Point","esri/geometry/Extent","esri/geometry/SpatialReference",
        "esri/layers/FeatureLayer","esri/layers/TileLayer","esri/widgets/BasemapToggle",
        "esri/Basemap","esri/widgets/Compass","esri/widgets/Home","esri/Viewpoint",
        "esri/widgets/BasemapGallery","esri/widgets/Expand","esri/widgets/LayerList",
        "esri/widgets/Legend","esri/layers/GroupLayer","esri/widgets/Print","esri/widgets/ScaleBar",
        "esri/widgets/Sketch/SketchViewModel","esri/Graphic",
        "dojo/domReady!"], function(Map, SceneView,MapView,Point,Extent,SpatialReference,
            FeatureLayer,TileLayer,BasemapToggle,BaseMap,Compass,Home,Viewpoint,BasemapGallery,
            Expand,LayerList,Legend,GroupLayer,Print,ScaleBar,SketchViewModel,Graphic
        ) {


          
          
          var layers = []; 
          $.ajaxSetup (
            {
               async: false
            });

            $.get("http://localhost:3000/myLayers?depart="+depart,function(myLayers){
              layers = myLayers;
            })
          
            console.log(layers);
























































            //规划用地点击弹出信息模板
            var template = { //自动转变为一个PopupTemplate实例
              title: "About the feature of code: {code}",
              content: "<p>The type of this feature is {type}<p>"+
                        "<ul><li>The Shape Length of this feature is {Shape_Length}</li>"+
                        "<li>The Shape Area of this feature is {Shape_Area}</li>",
              fieldInfos: [{
                      fieldName: "Shape_Area",
                      format: {
                        digitSeparator: true, // Use a comma separator for large numbers（大数字自动加逗号）
                        places: 0 // Sets the number of decimal places to 0 and rounds up
                      }
                    }, {
                      fieldName: "Shape_Length",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    }]
            }

            //定义两个底图，用于切换
            //1、基础底图
            var jcdt = new TileLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/NTMap/MapServer",
              title:"基础底图",
            })
            var baseMap = new BaseMap({
              baseLayers:[jcdt],
              title:"基础底图",
              id:"jcdt",
              thumbnailUrl: "http://oqk89116k.bkt.clouddn.com/jcdt.PNG"
            })
            //2、影像底图
            var yxdt = new TileLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/Raster2012/MapServer",
              title:"影像底图"
            })
            var baseMap2 = new BaseMap({
              baseLayers:[yxdt],
              title:"影像底图",
              id:"yxdt",
              thumbnailUrl: "http://oqk89116k.bkt.clouddn.com/yxdt.PNG"
            })


            //新建Map，指定初始底图为基础底图
            var map = new Map({
            })
            map.basemap = baseMap;


            //***********************定义所有图层*********************
            //规划用地图
            var ghydt = new FeatureLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/NTKG/MapServer/0",
              outFields:["*"],
              popupTemplate:template,
              title:"规划用地"
            })

            //正式红线
            var zshx = new FeatureLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/Redline_ZS/MapServer/0",
              outFields:["*"],
              title:"正式红线"
            })

            //2015年影像图
            var yxt2015 = new TileLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/Raster2015/MapServer",
              title:"2015年影像图",
              visible:false

            })

            //2014年地形图
            var dxt2014 = new TileLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/NTDLG2014/MapServer",
              title:"2014年地形图",
              visible:false
            })

            //征地图
            var zdt = new FeatureLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/ZDT/MapServer/0",
              outFields:["*"],
              title:"征地图"
            })

            //土地利用规划图
            var tdlyght = new FeatureLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/TDLYGH/MapServer/0",
              outFields:["*"],
              title:"土地利用规划图"
            })

            //工程进展图
            var gcjzt = new FeatureLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/GCJZ/MapServer/0",
              outFields:["*"],
              title:"工程进展图"
            })

            //招商进展图
            var zsjzt = new FeatureLayer({
              url:"http://a.unimap.cn:6080/arcgis/rest/services/NT/NTZS/MapServer/0",
              outFields:["*"],
              title:"招商进展图"
            })




            //******************************将所有图层分组为图层组********************
            //基础信息图层组
            var jcxxgroup = new GroupLayer({
              layers:[yxt2015,dxt2014],
              title:"基础信息",
              visible:false
            })

            //土地图层组
            var tdgroup = new GroupLayer({
              layers:[zdt,tdlyght],
              title:"土地",
              visible:false,
              visibilityMode:"exclusive"
            })

            //规划图层组
            var ghgroup = new GroupLayer({
              layers:[zshx,ghydt],
              title:"规划",
              visible:false
            })

            //建设图层组
            var jsgroup = new GroupLayer({
              layers:[gcjzt],
              title:"建设",
              visible:false
            })

            //招商图层组
            var zsgroup = new GroupLayer({
              layers:[zsjzt],
              title:"招商",
              visible:false
            })


            //将图层组添加到地图
            map.addMany([jcxxgroup,tdgroup,ghgroup,jsgroup,zsgroup]);

            //实例化Mapview，显示地图
            var view  = new MapView({
                map:map,
                container:"viewDiv",
            })


            //视图加载完成之后，在这个方法里添加各种地图控件
            view.then(function(evt){

              //添加控件：图层控制列表
              // var layerList = new LayerList({
              //   view:view
              // })
              // view.ui.add(layerList,{
              //   position:"top-right"
              // })


              //添加控件：图例
              var legend = new Legend({
                view: view,
                layerInfos: [{
                  layer: tdgroup
                },
                {
                  layer:ghgroup
                },
                {
                  layer:jsgroup
                },
                {
                  layer:zsgroup
                }
              ]
              });
              view.ui.add(legend, "bottom-right");


              //添加控件：地图切换按钮
              var basemapToggle = new BasemapToggle({
                view: view,  // The view that provides access to the map's "streets" basemap
                nextBasemap: baseMap2   // Allows for toggling to the "hybrid" basemap
              });
              view.ui.add(basemapToggle,"bottom-left");

              //添加控件：HOME
              var home = new Home({
                view:view
              })
              view.ui.add(home,"top-left");

              //添加比例尺
              var scaleBar = new ScaleBar({
                view: view,
                unit: "metric"
              });
              // Add widget to the bottom left corner of the view
              view.ui.add(scaleBar, {
                position: "bottom-left"
              });


              //添加画点线面控件
              // create a new sketch view model
              var sketchViewModel = new SketchViewModel({
                view: view,
                pointSymbol: { // symbol used for points
                  type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                  style: "circle",
                  color: "#8A2BE2",
                  size: "16px",
                  outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 3 // points
                  }
                },
                polylineSymbol: { // symbol used for polylines
                  type: "simple-line", // autocasts as new SimpleMarkerSymbol()
                  color: "#8A2BE2",
                  width: "4",
                  style: "solid"
                },
                polygonSymbol: { // symbol used for polygons
                  type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
                  color: "rgba(225,0,0, 0.8)",
                  style: "solid",
                  outline: {
                    color: "white",
                    width: 1
                  }
                }
              });

              sketchViewModel.on("draw-complete", function(evt) {
                view.graphics.add(evt.graphic)
                setActiveButton();
              });

              var drawPointButton = document.getElementById("pointButton");
              drawPointButton.onclick = function() {
                // set the sketch to create a point geometry
                sketchViewModel.create("point");
                setActiveButton(this);
              };

              var drawLineButton = document.getElementById("polylineButton");
              drawLineButton.onclick = function() {
                // set the sketch to create a polyline geometry
                sketchViewModel.create("polyline");
                setActiveButton(this);
              };

              var drawPolygonButton = document.getElementById("polygonButton");
              drawPolygonButton.onclick = function() {
                // set the sketch to create a polygon geometry
                sketchViewModel.create("polygon");
                setActiveButton(this);
              };

              document.getElementById("resetBtn").onclick = function() {
                view.graphics.removeAll();
                sketchViewModel.reset();
                setActiveButton();
              };

              function setActiveButton(selectedButton) {
                // focus the view to activate keyboard shortcuts for sketching
                view.focus();
                var elements = document.getElementsByClassName("active");
                for (var i = 0; i < elements.length; i++) {
                  elements[i].classList.remove("active");
                }
                if (selectedButton) {
                  selectedButton.classList.add("active");
                }
              }



              // 添加地图打印控件
              // var print = new Print({
              //   view: view,
              //   printServiceUrl: "http://localhost:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
              // });
              // view.ui.add(print,"top-left");


              view.on('click',function(){
                console.log("map click")
              })

              //添加控件结束
            })














  });
