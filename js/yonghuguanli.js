var departments = []
var layers = null
var allFunctions = null
var nowUsers = []
var nowGrp = {
    name: '',
    id: null
}

var newGrp = null
var nowDepaName = null
var nowDepaId = null
var nowUser

var getUsersInGrp, getUsersInDepa

var grpClick
var reloadGrps
var NewGrp
var refreshLayers, refreshFunctions, refreshFields
var initSetPri

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
            $("#grpContainer").append("<button title='添加权限组' class='btn btn-default btn-sm grpEdit'><i class='fa fa-plus'></i></button>")
            getUsersInDepa(depaId)




            grpClick = function () {
                //删除权限组
                // $("[title=删除权限组]").click(function () {
                //     if (!nowGrp.id) {
                //         alert('请先选中一个权限组。')
                //         return
                //     } else {
                //         if (confirm("确定要删除【" + nowDepaName + "】的权限组【" + nowGrp.name + "】吗？")) {
                //             $.ajax({
                //                 url: "http://" + serverIP + ":" + serverPort + "/deleteGroup",
                //                 type: 'post',
                //                 data: {
                //                     grpId: nowGrp.id
                //                 },
                //                 success: function (res) {
                //                     setTimeout(reloadGrps, 1000)
                //                 }
                //             })
                //         }
                //     }
                // })



                NewGrp = function (nLayers, nFields, nFunctions) {
                    this.nDepaId = nowDepaId;
                    this.nLayers = nLayers || [];
                    this.nFields = nFields || [];
                    this.nFunctions = nFunctions || [];
                }

                NewGrp.prototype = {
                    addLayer: function (lid) {
                        if (this.nLayers.indexOf(lid) !== -1) {
                            return
                        } else {
                            this.nLayers.push(lid)
                        }
                    },
                    removeLayer: function (lid) {
                        this.nLayers.splice(this.nLayers.indexOf(lid), 1)
                    },
                    addField: function (fid) {
                        if (this.nFields.indexOf(fid) !== -1) {
                            return
                        } else {
                            this.nFields.push(fid)
                        }
                    },
                    removeField: function (fid) {
                        this.nFields.splice(this.nFields.indexOf(fid), 1)
                    },
                    addFun: function (funid) {
                        if (this.nFunctions.indexOf(funid) !== -1) {
                            return
                        } else {
                            this.nFunctions.push(funid)
                        }
                    },
                    removeFun: function (funid) {
                        this.nFunctions.splice(this.nFunctions.indexOf(funid), 1)
                    }
                }



                initSetPri = function (xGrp) {
                    var lids = xGrp.nLayers
                    for (var l = 0; l < lids.length; l++) {
                        $("[layerId=" + lids[l] + "] input")[0].checked = true
                    }

                    for (var l = 0; l < xGrp.nFunctions.length; l++) {
                        $("[funid=" + xGrp.nFunctions[l] + "] input")[0].checked = true
                    }
                }

                refreshFields = function (fds) {
                    var fieldList = $("#fieldList")
                    fieldList.empty()
                    for (var f = 0; f < fds.length; f++) {
                        fieldList.append("<li class='list-group-item' fdid='" + fds[f].id + "'><input type='checkbox'>" + fds[f].DisplayName + "</li>")
                    }
                    $("li[fdid]").click(function (e) {
                        console.log(+ e.currentTarget.getAttribute('fdid'))
                    })




                }



                refreshLayers = function (layersForTree) {
                    layers = layersForTree;
                    var sonshtml = "<div class='list-group-item father' ><input class='changeAllLayers' type='checkbox'>全选</div>";

                    for (var i = 0; i < layersForTree.length; i++) {
                        sonshtml += "<div class='list-group-item father grp' layerId='" + layersForTree[i].father.id + "'><input class='changeGrpLayer' type='checkbox' >" + "<strong>" + layersForTree[i].father.DisplayName + "</strong></div>"
                        sonshtml += "<ul class='list-group son' style='padding-left:15px;margin-bottom:3px'>"
                        for (var j = 0; j < layersForTree[i].sons.length; j++) {
                            sonshtml += "<li layerType='" + layersForTree[i].sons[j].LayerType + "' class='list-group-item son changeLayer' layerId='" + layersForTree[i].sons[j].id + "'>" + "<input class='changeLayer' type='checkbox'>" + layersForTree[i].sons[j].DisplayName + "</li>"
                        }
                        sonshtml += "</ul>"
                    }

                    $("#layerList").empty()
                    $("#layerList").append(
                        "<div class='list-group' onselectstart='return false'> " + sonshtml + "</div>"
                    )

                    $(".changeAllLayers").click(function (e) {
                        var checked = e.currentTarget.checked
                        var allLI = $("[layerId] input")
                        if (checked) {
                            for (var k = 0; k < allLI.length; k++) {
                                allLI[k].checked = true
                            }

                            for (var a = 0; a < layers.length; a++) {
                                newGrp.addLayer(layers[a].father.id)
                                for (var b = 0; b < layers[a].sons.length; b++) {
                                    newGrp.addLayer(layers[a].sons[b].id)
                                }
                            }
                        } else {
                            for (var k = 0; k < allLI.length; k++) {
                                allLI[k].checked = false
                            }

                            for (var a = 0; a < layers.length; a++) {
                                newGrp.removeLayer(layers[a].father.id)
                                for (var b = 0; b < layers[a].sons.length; b++) {
                                    newGrp.removeLayer(layers[a].sons[b].id)
                                }
                            }
                        }

                    })


                    $(".changeGrpLayer").click(function (e) {
                        var el = e.currentTarget
                        var lid = parseInt(el.parentElement.getAttribute("layerId"))
                        var checked = e.currentTarget.checked
                        var sons = layers.filter(function (x) {
                            return x.father.id === lid
                        })[0].sons.map(function (x) {
                            return x.id
                        })

                        if (checked) {
                            newGrp.addLayer(lid)
                            for (var k = 0; k < sons.length; k++) {
                                newGrp.addLayer(sons[k])
                                $("li.son[layerId=" + sons[k] + "] input")[0].checked = true
                            }
                        } else {
                            newGrp.removeLayer(lid)
                            for (var k = 0; k < sons.length; k++) {
                                newGrp.removeLayer(sons[k])
                                $("li.son[layerId=" + sons[k] + "] input")[0].checked = false
                            }
                        }

                    })

                    $(".changeLayer").click(function (e) {
                        var el = e.target.tagName === 'INPUT' ? e.target : e.target.children[0]

                        if (e.target.tagName !== 'INPUT') {
                            $("#fieldList").empty()
                            if (e.target.getAttribute('layerType') === 'FeatureLayer') {
                                var flid = + e.target.getAttribute('layerId')
                                $.ajax({
                                    type: 'post',
                                    url: "http://" + serverIP + ":" + serverPort + "/fieldsInLayer",
                                    data: {
                                        baseMapLayerId: flid
                                    },
                                    success: function (fds) {
                                        refreshFields(fds)
                                    }
                                })
                            }
                        }

                        var siblings = el.parentElement.parentElement.children
                        var lid = + el.parentElement.getAttribute("layerId")
                        var gl = el.parentElement.parentElement.previousElementSibling
                        var glid = + el.parentElement.parentElement.previousElementSibling.getAttribute('layerId')
                        var checked = el.checked
                        if (checked) {
                            gl.children[0].checked = true
                            newGrp.addLayer(glid)
                            newGrp.addLayer(lid)
                        } else {
                            $("input.changeAllLayers")[0].checked = false
                            var ns = true
                            for (var k = 0; k < siblings.length; k++) {
                                if (siblings[k].children[0].checked) {
                                    ns = false
                                }
                            }
                            if (ns) {
                                gl.children[0].checked = false
                                newGrp.removeLayer(glid)
                            }

                            newGrp.removeLayer(lid)
                        }
                    })

                    $("div.father.grp").click(function (e) {
                        if (e.target.tagName !== 'INPUT') {
                            e.currentTarget.nextElementSibling.style.display = e.currentTarget.nextElementSibling.style.display === 'block' ? 'none' : 'block'
                        }
                    })
                }

                refreshFunctions = function () {
                    $("#funList").empty()
                    function changeFunc(e) {
                        var el = e.target
                        var elp = e.target.parentElement
                        var elc = e.target.children[0]
                        if (el.tagName === 'INPUT') {
                            if (el.checked === true) {
                                newGrp.addFun(+ elp.getAttribute('funid'))
                            } else {
                                newGrp.removeFun(+ elp.getAttribute('funid'))
                            }
                        } else if (el.tagName === 'LI') {
                            if (elc.checked) {
                                elc.checked = false
                                newGrp.removeFun(+ el.getAttribute('funid'))
                            } else {
                                elc.checked = true
                                newGrp.addFun(+ el.getAttribute('funid'))
                            }
                        }

                    }

                    function changeAllFuncs(e) {
                        if (e.target.tagName === 'INPUT') {
                            if (e.target.checked) {
                                for (var f = 0; f < $("[funid]").length; f++) {
                                    $("[funid] input")[f].checked = true
                                    newGrp.addFun(+ $("[funid]")[f].getAttribute('funid'))
                                }
                            } else {
                                for (var ff = 0; ff < $("[funid]").length; ff++) {
                                    $("[funid] input")[ff].checked = false
                                    newGrp.removeFun(+ $("[funid]")[ff].getAttribute('funid'))
                                }
                            }
                        } else if (e.target.tagName === 'LI') {
                            if (e.target.children[0].checked) {
                                e.target.children[0].checked = false
                                for (var g = 0; g < $("[funid]").length; g++) {
                                    $("[funid] input")[g].checked = false
                                    newGrp.removeFun(+ $("[funid]")[g].getAttribute('funid'))
                                }
                            } else {
                                e.target.children[0].checked = true
                                for (var gg = 0; gg < $("[funid]").length; gg++) {
                                    $("[funid] input")[gg].checked = true
                                    newGrp.addFun(+ $("[funid]")[gg].getAttribute('funid'))
                                }
                            }
                        }

                        console.log(newGrp)
                    }

                    if (!allFunctions) {
                        $.ajax({
                            type: 'get',
                            url: "http://" + serverIP + ":" + serverPort + "/allFunctions",
                            success: function (res) {
                                allFunctions = res
                                $("#funList").append("<li class='list-group-item changeAllFunctions'><input type='checkbox'>全选</li>")
                                for (var j = 0; j < allFunctions.length; j++) {
                                    $("#funList").append("<li class='list-group-item changeFunction' funid='" + allFunctions[j].id + "'><input type='checkbox'>" + allFunctions[j].name + "</li>")
                                }

                                $(".changeAllFunctions").click(function (e) {
                                    changeAllFuncs(e)
                                })
                                $(".changeFunction").click(function (e) {
                                    changeFunc(e)
                                })

                                initSetPri(newGrp)
                            }
                        })
                    } else {

                        $("#funList").append("<li class='list-group-item changeAllFunctions'><input type='checkbox'>全选</li>")
                        for (var j = 0; j < allFunctions.length; j++) {
                            $("#funList").append("<li class='list-group-item changeFunction' funid='" + allFunctions[j].id + "'><input type='checkbox'>" + allFunctions[j].name + "</li>")
                        }

                        $(".changeAllFunctions").click(function (e) {
                            changeAllFuncs(e)
                        })

                        $(".changeFunction").click(function (e) {
                            changeFunc(e)
                        })

                        initSetPri(newGrp)
                    }
                }

                //添加权限组
                $("[title=添加权限组]").click(function () {
                    newGrp = new NewGrp()
                    newGrp.type = 'add'

                    var grayBack = $("#grayBack")
                    var addGrpDiv = $("#addGrpDiv")

                    if (!layers) {
                        $.ajax({
                            type: 'post',
                            url: "http://" + serverIP + ":" + serverPort + "/layersForTree",
                            success: function (layersForTree) {
                                refreshLayers(layersForTree)
                                refreshFunctions()
                            }
                        })
                    } else {
                        refreshLayers(layers)
                        refreshFunctions()
                    }
                    grayBack.show()
                    $("#grpName").val('')
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


                        // 配置权限组
                        $("#setPri").click(function () {
                            newGrp = new NewGrp()
                            newGrp.type = 'update'
                            newGrp.id = nowGrp.id
                            $.ajax({
                                type: 'post',
                                url: "http://" + serverIP + ":" + serverPort + "/quanxianForGroup",
                                data: { grpId: nowGrp.id },
                                success: function (quanxian) {
                                    var qx = JSON.parse(quanxian)
                                    for (var r = 0; r < qx.layers.length; r++) {
                                        newGrp.addLayer(qx.layers[r].id)
                                    }

                                    for (var r = 0; r < qx.fields.length; r++) {
                                        newGrp.addField(qx.fields[r].id)
                                    }

                                    for (var r = 0; r < qx.functions.length; r++) {
                                        newGrp.addFun(qx.functions[r].id)
                                    }

                                    if (!layers) {
                                        $.ajax({
                                            type: 'post',
                                            url: "http://" + serverIP + ":" + serverPort + "/layersForTree",
                                            success: function (layersForTree) {
                                                refreshLayers(layersForTree)
                                                refreshFunctions()

                                            }
                                        })
                                    } else {
                                        refreshLayers(layers)
                                        refreshFunctions()

                                    }
                                    $("#grpName")[0].value = nowGrp.name
                                    $("#addGrpDiv").show()
                                    $("#grayBack").show()
                                }
                            })


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
            }

            grpClick()

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


function editUser() {
    var euname = $("#euname").val()
    var epwd = $("#epwd").val()
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
}


$("#epwd,#euname").keydown(function (e) {
    if (e.keyCode === 13) {
        editUser()
    }
})

$("#editUser").click(function () {
    editUser()
})

$("#noEditUser").click(function () {
    $("#editUserDiv").hide()
    $("#grayBack").hide()
})


reloadGrps = function () {
    $.ajax({
        url: "http://" + serverIP + ":" + serverPort + "/grpsInDepa",
        type: 'post',
        data: { depaId: nowDepaId },
        success: function (res) {
            for (var p = 0; p < departments.length; p++) {
                if (departments[p].depa.id === nowDepaId) {
                    departments[p].grps = res
                }
            }
            $("#grpContainer").empty()
            $("#grpContainer").append("<div depaId='" + nowDepaId + "' class='grpBtn all'>全部</div>")
            for (var j = 0; j < res.length; j++) {
                $("#grpContainer").append("<div class='grpBtn' grpId='" + res[j].id + "'>" + res[j].name + "</div>")
            }
            $("#grpContainer").append("<button title='添加权限组' class='btn btn-default btn-sm grpEdit'><i class='fa fa-plus'></i></button>")
            nowGrp.name = ''
            nowGrp.id = null
            grpClick()
            $("#mainT").empty()
        }
    })
}

// 点击保存权限组
$("#saveGrp").click(function (e) {
    newGrp.name = document.getElementById("grpName").value.trim()
    if (!newGrp.name) {
        alert('请输入权限组名！')
        return
    }

    if (newGrp.type === 'add') {
        $.ajax({
            url: "http://" + serverIP + ":" + serverPort + "/addGroup",
            type: 'post',
            data: { newGrp: JSON.stringify(newGrp) },
            success: function (res) {
                if (res === 'ok') {
                    $("#addGrpDiv").hide()
                    $("#grayBack").hide()
                    reloadGrps()
                } else {
                    alert("发生错误！")
                }
            }
        })
    }

    if (newGrp.type === 'update') {
        $.ajax({
            url: "http://" + serverIP + ":" + serverPort + "/updateGroup",
            type: 'post',
            data: { newGrp: JSON.stringify(newGrp) },
            success: function (res) {
                console.log(res)
                if (res === 'ok') {
                    $("#addGrpDiv").hide()
                    $("#grayBack").hide()
                    $(".grpBtn[grpId=" + nowGrp.id + "]")[0].innerText = newGrp.name
                }
                else {
                    alert("发生错误！")
                }
            }
        })
    }


})


$("#closeEdit").click(function () {
    $(".top").hide()
    $("#grayBack").hide()
})

$("#logOut").click(function () {
    $.removeCookie('user');
    console.log('hahahah')
    window.location.href = 'login.html'
})




