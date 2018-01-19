//点击图层组
function showSons(el) {

    var checkFlag = $(el).attr('flag') == '1' ? true : false

    var checked = $($(el).children()[0]).prop('checked');
    if (checkFlag != checked) {
        if (checked) {
            $(el).next().show()
        } else {
            $(el).next().hide()
        }
        $(el).attr('flag', checked == true ? '1' : '0');
        var sonLis = $($(el).next().children());
        for (var i = 0; i < sonLis.length; i++) {
            $(sonLis[i].children[0]).prop('checked', checked);
            $(sonLis[i]).attr('flag', checked ? '1' : '0');
        }
    } else {
        $(el).next().toggle()
    }
}


//点击子图层
function clickSon(el) {

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
        console.log('nothing');


    }

}

function mapLoaded() {
    $("#loading").hide();
    var flIds = map.graphicsLayerIds;
    for (var i = 0; i < flIds.length; i++) {
        var flId = flIds[i];
        var fl = map.getLayer(flId);

        $.ajax({
            url: "http://" + serverIP + ":" + serverPort + "/fieldsForGroupInLayer",
            type: "post",
            data: { groupId: user.groupId, baseMapLayerId: flId },
            success: function (res) {

            }
        })

    }
}



