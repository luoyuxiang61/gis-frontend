var departments = []
var layers = null
var nowUsers = []
var nowGrp = {
    name: '',
    id: null
}
var nowDepaName = null
var nowDepaId = null
var nowUser

var getUsersInGrp, getUsersInDepa

$.ajax({
    type: 'get',
    async: false,
    url: "http://" + serverIP + ":" + serverPort + "/departmentsForTree",
    success: function (departmentsForTree) {
        departments = departmentsForTree
        for (var i = 0; i < departmentsForTree.length; i++) {
            $("#departmentList").append("<li index='" + i + "' class='depa'><div><span>" + departmentsForTree[i].depa.name + "</span></div><li>")
        }
        $("li.depa").click(function () {
            nowGrp.name = ''
            nowGrp.id = null
            $("#tBar").empty()
            $("li.depa").removeClass('active')
            this.classList.add('active')
            var grps = departmentsForTree[$(this).attr('index')].grps
            var depaId = departmentsForTree[$(this).attr('index')].depa.id
            nowDepaId = depaId
            nowDepaName = departmentsForTree[$(this).attr('index')].depa.name
            getUsersInDepa = function (depaId) {
                $(".grpBtn").removeClass('active')
                $(".grpBtn.all").addClass('active')
                $("#mainT").empty()
                $.ajax({
                    url: "http://" + serverIP + ":" + serverPort + "/usersInDepa",
                    type: 'post',
                    data: {
                        depaId: depaId
                    },
                    success: function (users) {
                        nowUsers = users
                        for (var k = 0; k < users.length; k++) {
                            var user = users[k]
                            $("#mainT").append("<tr index='" + k + "'><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.UserName + "</span></td><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.Password + "</span></td><td class='col-xs-4'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><button class='btn btn-default btn-sm editUserBtn'><i class='fas fa-edit'></i></button><button class='btn btn-default btn-sm deleteUserBtn'><i class='fas fa-times'></i></button></td></tr>")
                        }
                        enableDeleteUser(depaId, null)
                        enableEditUser(depaId, null)
                    }
                })
            }

            getUsersInGrp = function (grpId) {
                $("#mainT").empty()
                $.ajax({
                    url: "http://" + serverIP + ":" + serverPort + "/usersInGroup",
                    type: 'post',
                    data: {
                        grpId: grpId
                    },
                    success: function (users) {
                        nowUsers = users
                        for (var k = 0; k < users.length; k++) {
                            var user = users[k]
                            $("#mainT").append("<tr index='" + k + "'><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.UserName + "</span></td><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.Password + "</span></td><td class='col-xs-4'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><button class='btn btn-default btn-sm userEdit'><i class='fas fa-edit'></i></button><button class='btn btn-default btn-sm deleteUserBtn'><i class='fas fa-times'></i></button></td></tr>")
                        }
                        enableDeleteUser(null, grpId)
                        enableEditUser(null, grpId)
                    }
                })
            }

            var enableDeleteUser = function (depaId, grpId) {
                var btns = document.getElementsByClassName('deleteUserBtn')
                for (var a = 0; a < btns.length; a++) {
                    btns[a].addEventListener('click', function (e) {
                        nowUser = nowUsers[e.currentTarget.parentElement.parentElement.getAttribute('index')]
                        var sure = confirm("确认要删除用户【" + nowUser.UserName + "】吗？删除后不可恢复。")
                        if (sure) {
                            $.ajax({
                                url: "http://" + serverIP + ":" + serverPort + "/deleteUser",
                                type: 'post',
                                data: {
                                    userId: nowUser.id
                                },
                                success: function (res) {
                                    if (depaId) getUsersInDepa(depaId)
                                    if (grpId) getUsersInGrp(grpId)
                                }
                            })
                        }
                    })
                }
            }

            var enableEditUser = function (depaId, grpId) {
                var btns = document.getElementsByClassName('editUserBtn')
                for (var b = 0; b < btns.length; b++) {
                    btns[b].addEventListener('click', function (e) {
                        nowUser = nowUsers[e.currentTarget.parentElement.parentElement.getAttribute('index')]

                        var grpName = departments.filter(function (x) {
                            var ye = false
                            for (var l = 0; l < x.grps.length; l++) {
                                if (x.grps[l].id === nowUser.GroupId) {
                                    ye = true
                                }
                            }
                            return ye
                        }).map(function (y) {
                            return y.grps
                        })[0].filter(function (z) {
                            return z.id === nowUser.GroupId
                        }).map(function (x) {
                            return x.name
                        })[0]


                        $("#grayBack").show()
                        $("#euname").val(nowUser.UserName)
                        $("#epwd").val(nowUser.Password)
                        $("#etheGrp").val(nowDepaName + "---" + grpName)
                        $("#editUserDiv").show()
                    })
                }
            }








            $("#mainT").empty()

            $("#grpContainer").empty()
            $("#grpContainer").append("<div depaId='" + depaId + "' class='grpBtn all'>全部</div>")
            for (var j = 0; j < grps.length; j++) {
                $("#grpContainer").append("<div class='grpBtn' grpId='" + grps[j].id + "'>" + grps[j].name + "</div>")
            }
            $("#grpContainer").append("<button title='配置权限组' class='btn btn-primary btn-sm grpCfg'><i class='fa fa-cog'></i></button> <button title='删除权限组' class='btn btn-default btn-sm grpEdit'><i class='fa fa-trash-alt'></i></button><button title='添加权限组' class='btn btn-default btn-sm grpEdit'><i class='fa fa-plus'></i></button>")
            getUsersInDepa(depaId)





            //添加权限组
            $("[title=添加权限组]").click(function () {
                var grayBack = $("#grayBack")
                var addGrpDiv = $("#addGrpDiv")

                var refreshLayers = function (layersForTree) {
                    layers = layersForTree;
                    var sonshtml = '';
                    for (var i = 0; i < layersForTree.length; i++) {
                        sonshtml += "<div class='list-group-item father'><input type='checkbox' >" + "<strong>" + layersForTree[i].father.DisplayName + "</strong></div>"
                        sonshtml += "<ul class='list-group son' style='padding-left:15px;margin-bottom:3px'>"
                        for (var j = 0; j < layersForTree[i].sons.length; j++) {
                            sonshtml += "<li layerType='" + layersForTree[i].sons[j].LayerType + "' class='list-group-item son' layerId='" + layersForTree[i].sons[j].id + "'>" + "<input type='checkbox'>" + layersForTree[i].sons[j].DisplayName + "</li>"
                        }
                        sonshtml += "</ul>"
                    }

                    $("#layerList").empty()
                    $("#layerList").append(
                        "<div class='list-group' onselectstart='return false'> " + sonshtml + "</div>"
                    )
                }

                if (!layers) {
                    $.ajax({
                        type: 'post',
                        url: "http://" + serverIP + ":" + serverPort + "/layersForTree",
                        success: refreshLayers
                    })
                } else {
                    refreshLayers(layers)
                }


                grayBack.show()
                addGrpDiv.show()
            })


            $("div.grpBtn").click(function () {
                var depaId = $(this).attr('depaId')
                if (depaId) {
                    nowGrp.name = ''
                    nowGrp.id = null
                    $("#tBar").empty()
                    getUsersInDepa(depaId)
                }

                else {

                    $("#tBar").empty()
                    $("#tBar").append("<button class='btn btn-default' title='设置权限' id='setPri'><i class='fas fa-cogs'></i></button> \
                    <button class='btn btn-default' title='添加用户' id='addU'><i class='fa fa-user-plus'></i></button>")

                    $("#setPri").click(function () {
                        console.log('sssssssset')
                    })
                    $("#addU").click(function () {
                        console.log('uuuuu')
                        $("#grayBack").show()
                        $("#uname").val('')
                        $("#pwd").val('')
                        $("#addUserDiv").show()
                        document.getElementById('theGrp').value = nowDepaName + "---" + nowGrp.name
                    })






                    $(".grpBtn").removeClass('active')
                    this.classList.add('active')
                    $("#mainT").empty()

                    var grpId = $(this).attr('grpId')
                    nowGrp.name = this.innerText
                    nowGrp.id = grpId
                    $.ajax({
                        url: "http://" + serverIP + ":" + serverPort + "/usersInGroup",
                        type: 'post',
                        data: {
                            grpId: grpId
                        },
                        success: function (users) {
                            nowUsers = users
                            for (var k = 0; k < users.length; k++) {
                                var user = users[k]
                                $("#mainT").append("<tr index='" + k + "'><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.UserName + "</span></td><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.Password + "</span></td><td class='col-xs-4'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><button class='btn btn-default btn-sm editUserBtn'><i class='fas fa-edit'></i></button><button class='btn btn-default btn-sm deleteUserBtn'><i class='fas fa-times'></i></button></td></tr>")
                            }
                            enableDeleteUser(null, grpId)
                            enableEditUser(null, grpId)
                        }
                    })
                }
            })

            $(".grpCfg").click(function () {
                $(".grpEdit").toggle(100)
            })
        })
    }
})

function saveUser() {
    var uname = $("#uname").val().trim()
    var pwd = $("#pwd").val().trim()

    if (uname.indexOf(' ') !== -1 || pwd.indexOf(' ') !== -1) {
        alert('用户名和密码不能含有空格！')
        return
    }

    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/addUser",
        type: 'post',
        data: {
            userName: uname,
            password: pwd,
            grpId: nowGrp.id
        },
        success: function (res) {
            if (res !== 'err') {
                getUsersInGrp(nowGrp.id)
                $("#addUserDiv").hide()
                $("#grayBack").hide()
            } else {
                alert("添加用户失败！")
            }
        }
    })
}

$("#saveUser").click(function () {
    saveUser()
})
$("#pwd").on('keydown', function (e) {
    if (e.keyCode === 13) {
        saveUser()
    }
})
$("#noSaveUser").click(function () {
    $("#addUserDiv").hide()
    $("#grayBack").hide()
})

$("#editUser").click(function () {
    var euname = $("#euname").val()
    var epwd = $("#epwd").val()
    console.log(euname, epwd, nowUser.id)
    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/editUser",
        type: 'post',
        data: {
            userId: nowUser.id,
            change: JSON.stringify({
                UserName: euname,
                Password: epwd
            })
        },
        success: function (res) {
            if (res !== 'err') {
                console.log(nowDepaId, nowGrp)
                if (!nowGrp.id) {
                    getUsersInDepa(nowDepaId)
                } else {
                    getUsersInGrp(nowGrp.id)
                }
                $("#editUserDiv").hide()
                $("#grayBack").hide()
            } else {
                alert("修改用户失败！")
            }
        }
    })
})

$("#noEditUser").click(function () {
    $("#editUserDiv").hide()
    $("#grayBack").hide()
})

$("#closeEdit").click(function () {
    $(".top").hide()
    $("#grayBack").hide()
})




