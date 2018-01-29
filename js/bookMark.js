var nowBookmarks;
function gotoStar(el) {
    var nowBookmark = nowBookmarks[parseInt($(el).attr('index'))];
    map.setExtent(new aExtent(nowBookmark.xmin, nowBookmark.ymin, nowBookmark.xmax, nowBookmark.ymax, new aSpatialReference(nowBookmark.wkid)))
}

function getBookmarks() {
    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/bookmarks",
        type: 'post',
        data: {
            userId: user.userId
        },
        success: function (res) {
            nowBookmarks = res;
            for (var i = 0; i < res.length; i++) {
                $("#starToolDiv").append("<div class='list-group-item'>" + "<div class='star-container'>" + "<span index='"+ i +"' onclick='gotoStar(this)'>" + res[i].name + "书签"  +"</span>"  + "<div class='edit'><input type='text'><button type='button' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-ok'></span></button></div>"+ "<button title='取消收藏' type='button' class='btn btn-default btn-sm'><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button>" + "<button type='button' title='修改名称' class='btn btn-default btn-sm'><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></button>" +"</div></div>")
            }
        }
    })
}



