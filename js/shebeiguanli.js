function getDevices(os, type) {

    var args = Array.prototype.slice(arguments)
    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/allDevices",
        type: 'get',
        success: function (devices) {
            var mt = $("#mainT")
            mt.empty()
            for (var i = 0; i < devices.length; i++) {
                var de = devices[i]
                var users = de.Users.map(function (x) { return x.UserName }).join(",")
                console.log(users)
                mt.append("<tr><td class='col-xs-3'>" + de.uuid + "</td><td class='col-xs-2'>" + de.model + (de.deviceType === 0 ? '(手机)' : '平板') + "</td><td class='col-xs-2'>" + de.os + de.osVersion + "</td>\
                <td class='col-xs-2'>"+ users + "</td><td class='col-xs-1'><i class='fas fa-check'></i></td><td class='col-xs-1'><i class='fas fa-check'></i></td><td class='col-xs-1'><i class='fas fa-edit fa-1x editDevice'></i></td></tr>")
            }

            $("i.editDevice").click(function () {
                console.log('asdadasd')
            })
        }
    })
}

getDevices()





$("#deviceType li").click(function (e) {
    $("#deviceType li").removeClass('active')
    e.currentTarget.classList.add('active')
})

$("#syncDevices").click(function () {
    console.log('shuaxin')
})