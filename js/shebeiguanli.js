function getDevices() {
    var args = Array.prototype.slice.call(arguments)
    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/devices?os=" + args[0] + "&type=" + args[1] + "&token=" + token,
        type: 'get',
        success: function (devices) {
            var mt = $("#mainT")
            mt.empty()
            for (var i = 0; i < devices.length; i++) {
                var de = devices[i]
                var users = de.Users.map(function (x) { return x.UserName }).join("  ,  ")
                mt.append("<tr><td class='col-xs-3'>" + de.uuid + "</td><td class='col-xs-2'>" + de.model + (de.deviceType === 0 ? '(手机)' : '(平板)') + "</td><td class='col-xs-2'>" + (de.os === 0 ? "android " : "ios ") + de.osVersion + "</td>\
                <td class='col-xs-2'>"+ users + "</td><td class='col-xs-1'><i class='" + (de.online === 1 ? "fas fa-check" : "") + "'></i></td><td class='col-xs-1'><i class='" + (de.offline === 1 ? "fas fa-check" : "") + "'></i></td><td class='col-xs-1'><i class='fas fa-edit fa-1x editDeviceBtn'></i></td></tr>")
            }

            $("i.editDeviceBtn").click(function () {
                $("#editDeviceDiv").css('display', 'block')
                $("#grayBack").show()
            })

        }
    })
}

getDevices()


$("#deviceType li").click(function (e) {
    $("#deviceType li").removeClass('active')
    e.currentTarget.classList.add('active')

    var ii = + e.currentTarget.getAttribute('index')
    switch (ii) {
        case 1:
            getDevices(0, 0);
            break;
        case 2:
            getDevices(0, 1);
            break;
        case 3:
            getDevices(1, 0);
            break;
        case 4:
            getDevices(1, 1);
            break;
    }
})

$("#syncDevices").click(function () {
    console.log('shuaxin')
})

$("#closeEdit").click(function () {
    $(".top").hide()
    $("#grayBack").hide()
})