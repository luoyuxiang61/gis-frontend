var departments = []

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
                            $("#mainT").append("<tr><td class='col-xs-2'>" + user.UserName + "</td><td class='col-xs-2'>" + user.Password + "</td><td class='col-xs-4'>123456@qq.com</td><td class='col-xs-2'>13309933322</td><td class='col-xs-2'>yes</td></tr>")
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
            getUsersInDepa(depaId)

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
                            console.log(users)
                            for (var k = 0; k < users.length; k++) {
                                var user = users[k]
                                $("#mainT").append("<tr><td class='col-xs-2'>" + user.UserName + "</td><td class='col-xs-2'>" + user.Password + "</td><td class='col-xs-4'>123456@qq.com</td><td class='col-xs-2'>13309933322</td><td class='col-xs-2'>yes</td></tr>")
                            }
                        }
                    })
                }

            })
        })
    }
})


