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
                $("#starToolDiv").append("<div class='list-group-item' index='" + i + "' onclick='gotoStar(this)' >" + res[i].name + "书签" + "</div>")
            }
        }
    })
}



