$("#toolContainer>div").click(function (e) {
    var toolGround = $("#toolGround");
    var clickedTool = $(e.currentTarget);
    var isShow = clickedTool.attr('show') == '1' ? true : false;
    var em = $(clickedTool.children()[2]);

    var ems = $($("#toolContainer em"))
    var tools = $($("#toolContainer>div"))


    if (!isShow) {
        tools.attr('show', '0')
        clickedTool.attr('show', '1')
        ems.css('background-position', '-13px -17px');
        em.css('background-position', '-12px -177px');
        toolGround.show();
    } else {
        tools.attr('show', '0')
        ems.css('background-position', '-13px -17px');
        toolGround.hide()
    }

})