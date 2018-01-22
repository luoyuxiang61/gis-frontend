//获取、刷新书签
var nowBookmarks;
function showBookmarks() {

    $("#starToolDiv").empty()

    $.get("http://" + serverIP + ":" + serverPort + "/bookmarks", function (marks) {
        nowBookmarks = marks;
        for (var i = marks.length - 1; i >= 0; i--) {
            var mark = marks[i]
            $("#bookmarkul").append("<li index='" + i + "' onclick='gotoMark(this)'>" + mark.name + "</li>")
        }
    })
}

gotoMark = function (ele) {
    var nowBookmark = nowBookmarks[$(ele).attr('index')]



    if (typeof (nowBookmark.xmin == String)) {
        map.setExtent(new Extent(parseFloat(nowBookmark.xmin), parseFloat(nowBookmark.ymin), parseFloat(nowBookmark.xmax), parseFloat(nowBookmark.ymax), new SpatialReference(nowBookmark.wkid)))
    } else {
        map.setExtent(new Extent(nowBookmark.xmin, nowBookmark.ymin, nowBookmark.xmax, nowBookmark.ymax, new SpatialReference(nowBookmark.wkid)))
    }

}

showBookmarks()


//添加书签
addBookmark = function () {

    var mark = {};
    mark.xmin = parseFloat(map.extent.xmin).toFixed(3);
    mark.ymin = parseFloat(map.extent.ymin).toFixed(3);
    mark.xmax = parseFloat(map.extent.xmax).toFixed(3);
    mark.ymax = parseFloat(map.extent.ymax).toFixed(3);
    mark.wkid = map.extent.spatialReference.wkid;
    mark.name = document.getElementById('markName').value.trim()
    if (mark.name == '') {
        alert('请输入书签名！')
        return false
    }
    $.ajax({
        type: 'post',
        url: "http://" + serverIP + ":" + serverPort + "/addBookmark",
        data: mark,
        success: function (res) {

            $("#markName").val('')
            showBookmarks()
        }
    })
}