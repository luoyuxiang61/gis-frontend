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
        }
    } else {
        $(el).next().toggle()
    }
}


//点击子图层
function clickSon(el) {
    var sonCheckFlag = $(el).attr('flag')
    var sonChecked = $($(el).children()[0]).prop('checked');
    var fatherCheckbox = $($($(el).parent().prev()).children()[0]);

    if (sonChecked) {
        fatherCheckbox.prop('checked', true);
        $(el).attr('flag', '1');
    } else {
        fatherCheckbox.prop('checked', false);
        $(el).attr('flag', '0');

        var sonLis1 = $(el).parent().children()
        console.log(sonLis1);
        for (var i = 0; i < sonLis1.length; i++) {
            if ($($(sonLis1[i]).children()[0]).prop('checked')) {
                fatherCheckbox.prop('checked', true);
                $(el).attr('flag', '1');
            }
            // console.log($($(sonLis1[i]).children()[0]).prop('checked'));
        }
    }
}