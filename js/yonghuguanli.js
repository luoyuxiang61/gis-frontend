var departments = []
var layers = null

$.ajax({
    type: 'get',
    async: false,
    url: "http://" + serverIP + ":" + serverPort + "/departmentsForTree",
    success: function (departmentsForTree) {
        for (var i = 0; i < departmentsForTree.length; i++) {
            $("#departmentList").append("<li index='" + i + "' class='depa'><div><span>" + departmentsForTree[i].depa.name + "</span></div><li>")
        }
        $("li.depa").click(function () {
            $("li.depa").removeClass('active')
            this.classList.add('active')
            var grps = departmentsForTree[$(this).attr('index')].grps
            var depaId = departmentsForTree[$(this).attr('index')].depa.id


            function getUsersInDepa(depaId) {
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
                        console.log(users)
                        for (var k = 0; k < users.length; k++) {
                            var user = users[k]
                            $("#mainT").append("<tr><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.UserName + "</span></td><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.Password + "</span></td><td class='col-xs-4'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><button class='btn btn-default btn-sm userEdit'><i class='fas fa-edit'></i></button><button class='btn btn-default btn-sm userEdit'><i class='fas fa-times'></i></button></td></tr>")
                        }
                    }
                })
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
                $("#closeEdit").click(function () {
                    grayBack.hide()
                    addGrpDiv.hide()
                })
            })


            $("div.grpBtn").click(function () {
                var depaId = $(this).attr('depaId')
                if (depaId) {
                    getUsersInDepa(depaId)
                }

                else {
                    $(".grpBtn").removeClass('active')
                    this.classList.add('active')
                    $("#mainT").empty()

                    var grpId = $(this).attr('grpId')
                    $.ajax({
                        url: "http://" + serverIP + ":" + serverPort + "/usersInGroup",
                        type: 'post',
                        data: {
                            grpId: grpId
                        },
                        success: function (users) {
                            for (var k = 0; k < users.length; k++) {
                                var user = users[k]
                                $("#mainT").append("<tr><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.UserName + "</span></td><td class='col-xs-2'>" + "<span style='line-height:30px;display:inline-block;height:30px;width:auto;'>" + user.Password + "</span></td><td class='col-xs-4'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><span style='line-height:30px;display:inline-block;height:30px;width:auto;'>sss</span></td><td class='col-xs-2'><button class='btn btn-default btn-sm userEdit'><i class='fas fa-edit'></i></button><button class='btn btn-default btn-sm userEdit'><i class='fas fa-times'></i></button></td></tr>")
                            }
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


