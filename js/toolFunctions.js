var pts = [];
var nowMeasure = null;
var distance = 0;
var nowPageX,nowPageY;

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
        tools.css('color','unset');
        clickedTool.css('color','red');
        ems.css('background-position', '-13px -17px');
        em.css('background-position', '-12px -177px');

        toolDivs.css('display', 'none');
        clickedToolDiv.css('display', 'block');
        toolGround.hide();
        toolGround.slideDown(250);
    } else {
        tools.attr('show', '0');
        tools.css('color','unset');
        ems.css('background-position', '-13px -17px');
        toolDivs.css('display', 'none');
        toolGround.hide(50)
    }


    //如果是点击的量测工具就开启量测状态
    if(toolName === 'distanceTool') {
        if (isShow) {
            deactivateTool();
            clearGra();
            isMeasuring = false;
            map.showZoomSlider();
        }else{
            clearGra();
            $(clickedToolDiv[0]).empty();
            isMeasuring = true;
            nowMeasure = 'distance';
            distance = 0;
            pts = [];
            startMeasure('polyline');

        }
    }else if(toolName === 'areaTool'){
        if (isShow) {
            deactivateTool();
            clearGra();
            isMeasuring = false;
            map.showZoomSlider();
        }else{
            clearGra();
            $(clickedToolDiv[0]).empty();
            isMeasuring = true;
            nowMeasure = 'area';
            pts = [];
            startMeasure('polygon')
        }
    }else {
        deactivateTool();
    }

});




//地图加载完成后调用的方法，主要是为了监听量测状态下的鼠标点击事件
function enableMeasure() {
    map.on('click', function (e) {
        if(isMeasuring && nowMeasure === 'distance') {
            pts.push(e.mapPoint);
            if (pts.length>=2) {
                var line = new aPolyline(new aSpatialReference({ wkid: 2437 }));
                line.addPath([pts[pts.length - 1], pts[pts.length - 2]]);

                distance += ageometryEngine.planarLength(line,'meters')
                var toast =  $("#toast");
                toast[0].innerText = "总长度" + distance.toFixed(2).toString()+"米";
                toast.css('left', (e.pageX+5) +"px")
                toast.css('top', (e.pageY+5) +"px")

            }
        }
    });

    map.on('dbl-click',function (e) {
        if(isMeasuring && nowMeasure === 'distance')  {
            isMeasuring = false;
            pts = [];
        }else if(isMeasuring && nowMeasure === 'area') {
            isMeasuring = false;
            nowPageX = (e.pageX+5) +"px";
            nowPageY = (e.pageY+5) +"px"
        }
    })
}

function showArea() {
    var toast =  $("#toast");
    toast[0].innerText = "总面积" + area.toFixed(2).toString()+"平方米";
    toast.css('left', nowPageX)
    toast.css('top', nowPageY)
}