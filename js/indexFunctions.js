//地图加载完成后
function mapLoaded() {
    //取消loading画面
    $("#loading").hide();



    //获取书签
    getBookmarks()

    //初始化绘图工具
    createToolbar()

    //允许量测
    enableMeasure()
}


//点击图层组
function showSons(el) {
    var span = $($(el).children()[2])
    var checkFlag = $(el).attr('flag') == '1' ? true : false

    var checked = $($(el).children()[0]).prop('checked');
    if (checkFlag != checked) {
        if (checked) {
            $(el).next().show()
            span.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        } else {
            $(el).next().hide()
            span.removeClass('glyphicon-minus').addClass('glyphicon-plus');
        }
        $(el).attr('flag', checked == true ? '1' : '0');
        var sonLis = $($(el).next().children());
        for (var i = 0; i < sonLis.length; i++) {
            $(sonLis[i].children[0]).prop('checked', checked);
            $(sonLis[i]).attr('flag', checked ? '1' : '0');

            map.getLayer($(sonLis[i]).attr('layerId')).setVisibility(checked)
        }
    } else {
        $(el).next().toggle()
        if (span.hasClass('glyphicon-plus')) {
            span.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        } else {
            span.removeClass('glyphicon-minus').addClass('glyphicon-plus');
        }
    }
}





//点击子图层
function clickSon(el) {

    var layerId = $(el).attr('layerId')
    var layer = map.getLayer(layerId)

    var sonCheckFlag = $(el).attr('flag') == '1' ? true : false;
    var sonChecked = $($(el).children()[0]).prop('checked');
    var fatherCheckbox = $($($(el).parent().prev()).children()[0]);



    if (sonChecked != sonCheckFlag) {
        if (sonChecked) {
            layer.setVisibility(true)
            $(el).attr('flag', '1');
            fatherCheckbox.parent().attr('flag', '1');
            fatherCheckbox.prop('checked', true);
        } else {
            layer.setVisibility(false)
            $(el).attr('flag', '0');
            fatherCheckbox.parent().attr('flag', '0');
            fatherCheckbox.prop('checked', false);


            var sonLis1 = $(el).parent().children()
            for (var i = 0; i < sonLis1.length; i++) {
                if ($($(sonLis1[i]).children()[0]).prop('checked')) {
                    fatherCheckbox.parent().attr('flag', '1');
                    fatherCheckbox.prop('checked', true);
                }
            }
        }
    } else {
        if (sonChecked) {
            layer.setVisibility(false)
            $(el).attr('flag', '0');
            $($(el).children()[0]).prop('checked', false)
            fatherCheckbox.parent().attr('flag', '0');
            fatherCheckbox.prop('checked', false);
            var sonLis1 = $(el).parent().children()
            for (var i = 0; i < sonLis1.length; i++) {
                if ($($(sonLis1[i]).children()[0]).prop('checked')) {
                    fatherCheckbox.parent().attr('flag', '1');
                    fatherCheckbox.prop('checked', true);
                }
            }
        } else {
            layer.setVisibility(true)
            $(el).attr('flag', '1');
            $($(el).children()[0]).prop('checked', true)
            fatherCheckbox.parent().attr('flag', '1');
            fatherCheckbox.prop('checked', true);
        }

    }

}






//选中默认显示的子图层
function visibleSon(el) {
    var sonCheckFlag = $(el).attr('flag') == '1' ? true : false;
    var sonChecked = $($(el).children()[0]).prop('checked');
    var fatherCheckbox = $($($(el).parent().prev()).children()[0]);

    if (sonChecked != sonCheckFlag) {
        if (sonChecked) {
            $(el).attr('flag', '1');
            fatherCheckbox.parent().attr('flag', '1');
            fatherCheckbox.prop('checked', true);
        } else {
            $(el).attr('flag', '0');
            fatherCheckbox.parent().attr('flag', '0');
            fatherCheckbox.prop('checked', false);


            var sonLis1 = $(el).parent().children()
            for (var i = 0; i < sonLis1.length; i++) {
                if ($($(sonLis1[i]).children()[0]).prop('checked')) {
                    fatherCheckbox.parent().attr('flag', '1');
                    fatherCheckbox.prop('checked', true);
                }
            }
        }
    } else {
        if (sonChecked) {
            $(el).attr('flag', '0');
            $($(el).children()[0]).prop('checked', false)
            fatherCheckbox.parent().attr('flag', '0');
            fatherCheckbox.prop('checked', false);
            var sonLis1 = $(el).parent().children()
            for (var i = 0; i < sonLis1.length; i++) {
                if ($($(sonLis1[i]).children()[0]).prop('checked')) {
                    fatherCheckbox.parent().attr('flag', '1');
                    fatherCheckbox.prop('checked', true);
                }
            }
        } else {
            $(el).attr('flag', '1');
            $($(el).children()[0]).prop('checked', true)
            fatherCheckbox.parent().attr('flag', '1');
            fatherCheckbox.prop('checked', true);
        }

    }

}

function toggleLayerList() {
    $("#layerList").toggle(150)
}

$("#logOut").click(function () {
    $.removeCookie('user');
    window.location.href = 'login.html'
})



