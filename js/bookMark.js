var nowBookmarks;

function getBookmarks() {
    $("#starToolDiv").empty();

    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/bookmarks?userId=" + user.userId,
        type: 'get',
        success: function (res) {
            nowBookmarks = res;
            for (var i = 0; i < res.length; i++) {
                $("#starToolDiv").append("<div index='" + i + "' class='list-group-item bookmarkItem goto'>" + "<div index='" + i + "' class='star-container goto'>" + "<span class='goto' index='" + i + "' >" + res[i].name + "</span>" + "<div class='edit'><input type='text'><button type='button' onclick='editOver(this)' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-ok'></span></button></div>" + "<button title='取消收藏' type='button' onclick='removeBookmark(this)' class='btn btn-default btn-sm'><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button>" + "<button type='button' title='修改名称' class='btn btn-default btn-sm' onclick='editName(this)'><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></button>" + "</div></div>")
            }
            $("#starToolDiv").append("<div style='text-align:center'><button id='starBtn' class='btn btn-primary' onclick='starHere()'><span class='glyphicon glyphicon-star-empty'></span>收藏当前位置</button></div>")
            var bookmarkItems = document.getElementsByClassName('bookmarkItem')
            for (var j = 0; j < bookmarkItems.length; j++) {
                bookmarkItems[j].addEventListener('click', function (e) {
                    if (e.target.className.indexOf('goto') != -1) {
                        var nowBookmark = nowBookmarks[e.target.getAttribute('index')]
                        map.setExtent(new aExtent(nowBookmark.xmin, nowBookmark.ymin, nowBookmark.xmax, nowBookmark.ymax, new aSpatialReference(nowBookmark.wkid)))
                    }

                })
            }
        }
    })
}

function editName(el) {
    var starContainer = $(el).parent().children();
    $(starContainer[0]).css('display', 'none');
    $(starContainer[1]).css('display', 'inline-block');
    var oldName = $(starContainer[0])[0].innerText;
    $($(starContainer[1]).children()[0]).val(oldName);
}

function editOver(el) {
    var newName = $(el).prev().val();
    var index = $($(el).parent().prev()[0]).attr('index');

    var bookmarkId = nowBookmarks[index].id;

    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/bookmarks/" + bookmarkId,
        type: 'put',
        data: {
            newName: newName
        },
        success: function (res) {
            if (res === 'ok') {
                getBookmarks();
            } else {
                alert('发生未知错误！')
            }

        }

    })
}

function removeBookmark(el) {

    var sure = confirm("确认要删除该收藏吗？");
    if (sure) {
        var index = $($(el).parent().children()[0]).attr('index');
        var bookmarkId = nowBookmarks[index].id;

        $.ajax({
            url: "http://" + serverIP + ":" + serverPort + "/bookmarks/" + bookmarkId,
            type: 'delete',
            success: function (res) {
                getBookmarks();
            }
        })
    } else {
        return false;
    }
}

function starHere() {

    var name = prompt("请输入该收藏的名称：").trim();
    var ext = map.extent;
    if (name === '' || name === null) {
        alert('名称不能为空！')
        return false;
    }

    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/bookmarks",
        type: 'post',
        data: {
            mark: JSON.stringify({
                wkid: ext.spatialReference.wkid,
                xmin: ext.xmin,
                ymin: ext.ymin,
                xmax: ext.xmax,
                ymax: ext.ymax
            }),
            name: name,
            userId: user.userId
        },
        success: function (res) {
            console.log(res);
            getBookmarks();
        }
    })
}



