$("#toolContainer>div").click(function (e) {

    //tool容器
    var toolGround = $("#toolGround");
    //每个tool对应的Div
    var toolDivs = $($("#toolGround>div"))
    //工具栏被点击的div
    var clickedTool = $(e.currentTarget);
    //被点击的工具对应的展示这个工具的div
    var clickedToolDiv = $($("#" + clickedTool[0].id + "Div"))

    //被点击的工具当前的显示状态
    var isShow = clickedTool.attr('show') == '1' ? true : false;
    //被点击的工具用于提示是否在显示的倒三角图标
    var em = $(clickedTool.children()[2]);

    //所有的倒三角图标
    var ems = $($("#toolContainer em"))
    //工具栏中所有的工具
    var tools = $($("#toolContainer>div"))

    //如果该tool没有显示，就关闭其他的tool显示这个
    if (!isShow) {
        tools.attr('show', '0')
        clickedTool.attr('show', '1')
        ems.css('background-position', '-13px -17px');
        em.css('background-position', '-12px -177px');

        toolDivs.css('display', 'none')
        clickedToolDiv.css('display', 'block')
        toolGround.show();
    } else {
        tools.attr('show', '0')
        ems.css('background-position', '-13px -17px');
        toolDivs.css('display', 'none')
        toolGround.hide()
    }

})