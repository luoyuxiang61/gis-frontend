var pts = [];
var nowMeasure = null;
var distance = 0;
var areaPoint;
$("#toolContainer>div").click(function (e) {

    //tool容器
    var toolGround = $("#toolGround");
    //每个tool对应的Div
    var toolDivs = $($("#toolGround>div"))
    //工具栏被点击的div
    var clickedTool = $(e.currentTarget);
    //被点击的工具名
    var toolName = $(clickedTool).attr('id');
    //被点击的工具对应的展示这个工具的div
    var clickedToolDiv = $($("#" + clickedTool[0].id + "Div"))

    //被点击的工具当前的显示状态
    var isShow = clickedTool.attr('show') == '1' ? true : false;
    //被点击的工具用于提示是否在显示的倒三角图标
    var em = $(clickedTool.children()[2]);

    //所有的倒三角图标
    var ems = $($("#toolContainer em"));
    //工具栏中所有的工具
    var tools = $($("#toolContainer>div"));




    //如果该tool没有显示，就关闭其他的tool显示这个
    if (!isShow) {
        clearGra();
        isMeasuring = false;
        nowMeasure = null;
        tools.attr('show', '0');
        clickedTool.attr('show', '1');
        tools.css('color', 'black');
        clickedTool.css('color', 'red');
        ems.css('background-position', '-13px -17px');
        em.css('background-position', '-12px -177px');

        toolDivs.css('display', 'none');
        clickedToolDiv.css('display', 'block');
        toolGround.hide();
        toolGround.slideDown(250);
    } else {
        tools.attr('show', '0');
        tools.css('color', 'black');
        ems.css('background-position', '-13px -17px');
        toolDivs.css('display', 'none');
        toolGround.hide(50)
    }


    if (toolName !== 'drawTool' && toolName !== 'distanceTool' && toolName !== 'areaTool') {
        map.setInfoWindowOnClick(true)
    }

    // //点击的搜索工具
    // if (toolName === 'searchTool') {

    //     for (var i = 0; i < searchLayers.length; i++) {
    //         $("#searchToolDiv").append("<p>" + searchLayers[i].DisplayName + "</p>");
    //     }
    // }


    if (toolName === 'drawTool') {
        if (isShow) {
            map.setInfoWindowOnClick(true)
        } else {
            map.setInfoWindowOnClick(false)
        }
    }

    //如果是点击的量测工具就开启量测状态
    if (toolName === 'distanceTool') {
        if (isShow) {
            map.setInfoWindowOnClick(true)
            deactivateTool();
            clearGra();
            isMeasuring = false;
            map.showZoomSlider();
        } else {
            map.setInfoWindowOnClick(false)
            clearGra();
            $(clickedToolDiv[0]).empty();
            isMeasuring = true;
            nowMeasure = 'distance';
            distance = 0;
            pts = [];
            startMeasure('polyline');
        }
    } else if (toolName === 'areaTool') {
        if (isShow) {
            map.setInfoWindowOnClick(true)
            deactivateTool();
            clearGra();
            isMeasuring = false;
            map.showZoomSlider();
        } else {
            map.setInfoWindowOnClick(false)
            clearGra();
            $(clickedToolDiv[0]).empty();
            isMeasuring = true;
            nowMeasure = 'area';
            pts = [];
            startMeasure('polygon')
        }
    } else {
        deactivateTool();
    }

});




//地图加载完成后调用的方法，主要是为了监听量测状态下的鼠标点击事件
function enableMeasure() {
    map.on('click', function (e) {
        if (isMeasuring && nowMeasure === 'distance') {

            pts.push({
                pageP: { left: e.pageX, top: e.pageY },
                mapP: e.mapPoint
            });



            if (pts.length >= 2) {
                console.log(pts)


                var line = new aPolyline(new aSpatialReference({ wkid: 2437 }));
                var p1 = pts[pts.length - 1].mapP;
                var p2 = pts[pts.length - 2].mapP;
                line.addPath([p1, p2]);
                var d0 = parseFloat(ageometryEngine.planarLength(line, 'kilometers').toFixed(2));

                console.log(p1)
                var d0P = new aPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, new aSpatialReference({ wkid: 2437 }));
                var font = new aFont("20px", aFont.STYLE_NORMAL, aFont.VARIANT_NORMAL, aFont.WEIGHT_BOLDER)
                var dSymbol = new aTextSymbol(d0, font, new aColor([0, 255, 0]))
                var dGra = new aGraphic(d0P, dSymbol);
                map.graphics.add(dGra);

                distance += d0;


            }
        }
    });

    map.on('dbl-click', function (e) {

        if (isMeasuring && nowMeasure === 'distance') {
            isMeasuring = false;
            pts = [];
            var font = new aFont("35px", aFont.STYLE_NORMAL, aFont.VARIANT_NORMAL, aFont.WEIGHT_BOLDER)
            var disSymbol = new aTextSymbol("总长度：" + distance.toFixed(2) + "千米", font, new aColor([62, 214, 251]))
            var disGra = new aGraphic(e.mapPoint, disSymbol);
            map.graphics.add(disGra);
        } else if (isMeasuring && nowMeasure === 'area') {
            isMeasuring = false;
            areaPoint = e.mapPoint;
        }
    })
}

function showArea() {
    var font = new aFont("35px", aFont.STYLE_NORMAL, aFont.VARIANT_NORMAL, aFont.WEIGHT_BOLDER)
    var areaSymbol = new aTextSymbol("总面积：" + area.toFixed(2) + "平方米", font, new aColor([62, 214, 251]))
    var areaGra = new aGraphic(areaPoint, areaSymbol);
    map.graphics.add(areaGra);
}