$.ajax({
    type: 'post',
    async: false,
    url: "http://" + serverIP + ":" + serverPort + "/layersForTree",
    success: function (layersForTree) {
        for (var i = 0; i < layersForTree.length; i++) {
            $("#layerGroupList").append("<li index='" + i + "' class='layerGroup'><div><span>" + layersForTree[i].father.DisplayName + "</span><span class='badge' style='float:right;'>" + layersForTree[i].sons.length + "</span></div><li>")
        }

        $(".layerGroup").on('click', function (e) {
            var sort = []
            $(".layerGroup").removeClass('active')
            this.classList.add('active')
            var index = this.getAttribute('index')
            var sons = layersForTree[index].sons
            $("#mainT").empty()
            for (var j = 0; j < sons.length; j++) {
                son = sons[j]
                var isVisible = son.IsVisible == 1 ? '是' : '--'
                $("#mainT").append("<tr lid='" + son.id + "' class='oneLayer'><td class='col-xs-1'>" + son.DisplayName +
                    "</td><td class='col-xs-5'><a target='_blank' href='" + son.ServiceUrl + "'>" + son.ServiceUrl
                    + "</a></td><td class='col=xs-1'>" + son.LayerType
                    + "</td><td class='col-xs-1'>" + isVisible
                    + "</td><td index='" + j + "' lid='" + son.id + "' title='桌面端配置' class='col-xs-1 desktop'><i lid='" + son.id + "' class='fa fa-laptop desktop'></i></td><td index='" + j + "' lid='" + son.id + "' class='col-xs-1 mobile'><i lid='" + son.id + "' class='fa fa-mobile-alt'></i></td>"
                    + "<td class='col-xs-1 up'><i class='fas fa-arrow-up up'></i></td><td class='col-xs-1 down'><i class='fas fa-arrow-down down'></i></td>"
                    + "</tr>")
            }

            $("i.up").click(function (e) {
                var mt = document.getElementById('mainT')
                var nowTr = e.currentTarget.parentElement.parentElement
                var preTr = nowTr.previousElementSibling
                if (preTr) {
                    mt.insertBefore(nowTr, preTr)
                } else {
                    mt.appendChild(nowTr)
                }
                nowTr.style.backgroundColor = 'greenyellow'
                setTimeout(function () {
                    nowTr.style.backgroundColor = ''
                }, 600)

                sort = Array.prototype.slice.call(document.getElementsByClassName('oneLayer'))
                    .map(function (x) {
                        return + x.getAttribute('lid')
                    })

                console.log(sort)
            })

            $("i.down").click(function (e) {
                var mt = document.getElementById('mainT')
                var nowTr = e.currentTarget.parentElement.parentElement
                var nextTr = nowTr.nextElementSibling
                if (nextTr) {
                    mt.insertBefore(nextTr, nowTr)
                } else {
                    mt.insertBefore(nowTr, mt.firstElementChild)
                }

                nowTr.style.backgroundColor = 'greenyellow'
                setTimeout(function () {
                    nowTr.style.backgroundColor = ''
                }, 600)

                sort = Array.prototype.slice.call(document.getElementsByClassName('oneLayer'))
                    .map(function (x) {
                        return + x.getAttribute('lid')
                    })

                console.log(sort)

            })






            $("td.desktop").click(function (e) {
                $("#editHeader i").addClass('fas fa-laptop')
                $("#editHeader i").removeClass('fa fa-mobile-alt')
                var layerId = e.target.getAttribute('lid')
                $("#fieldsContainer").hide()
                $("#goService").hide()
                $("#serviceContainer").show()
                $("#goFields").show()

                $("#editContainer").fadeIn(500)
                $("#grayBack").fadeIn(500)
                $("#service>tbody").empty();
                $("#fields #tbd").empty();


                $.get("http://" + serverIP + ":" + serverPort + "/oneLayer?layerId=" + layerId, function (oneLayer) {
                    if (oneLayer.LayerType !== 'FeatureLayer') $("#goFields").hide()
                    var lt = 0;
                    switch (oneLayer.LayerType) {
                        case 'GroupLayer':
                            lt = 0;
                            break;
                        case 'TiledService':
                            lt = 1;
                            break;
                        case 'FeatureLayer':
                            lt = 2;
                            break;
                        case 'GeometryService':
                            lt = 3
                            break;
                        default:
                            lt = 0;
                    }

                    $("#service>tbody").append("<tr><td>" + "服务名称" +
                        "</td><td><a href='#' id='LayerName' data-type='text'  class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.LayerName + "</a></td></tr>" +
                        "<tr><td>" + "显示名称" +
                        "</td><td><a href='#' id='DisplayName' data-type='text'  class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.DisplayName + "</a></td></tr>" +
                        "<tr><td>" + "服务url" +
                        "</td><td><a href='#' id='ServiceUrl' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.ServiceUrl + "</a></td></tr>" +
                        "<tr><td>" + "图层类型" + "</td><td><a href='#' id='LayerType' data-type='select' data-value='" + lt +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/layerType'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.LayerType + "</td></tr>" +
                        "<tr><td>" + "TokenUserName" +
                        "</td><td><a href='#' id='TokenUserName' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.TokenUserName + "</a></td></tr>" +
                        "<tr><td>" + "TokenPassword" +
                        "</td><td><a href='#' id='TokenPassword' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.TokenPassword + "</a></td></tr>" +
                        "<tr><td>" + "TokenURL" +
                        "</td><td><a href='#' id='TokenURL' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.TokenURL + "</a></td></tr>" +
                        "<tr><td>" + "是否显示" + "</td><td><a href='#' id='IsVisible' data-type='select' data-value='" +
                        oneLayer.IsVisible +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + "</td></tr>" +
                        "<tr><td>" + "透明度" + "</td><td><a href='#' id='Opacity' data-type='number' data-value='" + oneLayer.Opacity
                        + "' class='editable' data-pk='" + oneLayer.id + "'> " + "</a></td></tr>" +
                        "<tr><td>" + "服务序号" + "</td><td><a href='#' id='SortCode' data-type='number' data-value='" +
                        parseInt(oneLayer.SortCode) + "' class='editable editable-click' data-pk='" + oneLayer.id + "'> " +
                        "</a></td></tr>" +
                        "<tr><td>" + "显示图例" + "</td><td><a href='#' id='IsLegend' data-type='select' data-value='" +
                        oneLayer.IsLegend +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + "</td></tr>" +
                        "<tr><td>" + "CacheName" +
                        "</td><td><a href='#' id='CacheName' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.CacheName + "</a></td></tr>" +
                        "<tr><td>" + "移动端服务url" +
                        "</td><td><a href='#' id='MobileServiceUrl' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.MobileServiceUrl + "</a></td></tr>" +
                        "<tr><td>" + "是否在移动端显示" +
                        "</td><td><a href='#' id='IsShowInMobile' data-type='select' data-value='" + oneLayer.IsShowInMobile +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + "</td></tr>"
                    )


                    if (oneLayer.LayerType == 'FeatureLayer') {

                        $.get("http://" + serverIP + ":" + serverPort + "/fields?id=" + oneLayer.id, function (fields) {

                            for (var i = 0; i < fields.length; i++) {
                                var field = fields[i];
                                var un = 4;
                                switch (field.UnitName) {
                                    case 'm':
                                        un = 0;
                                        break;
                                    case '米':
                                        un = 0;
                                        break;
                                    case '㎡':
                                        un = 2;
                                        break;
                                    case '平方米':
                                        un = 2;
                                        break;
                                    case 'km':
                                        un = 1;
                                        break;
                                    case '千米':
                                        un = 1;
                                        break;
                                    case 'k㎡':
                                        un = 3;
                                        break;
                                    case '平方千米':
                                        un = 3;
                                        break;
                                    default:
                                        un = 4;
                                        break;
                                }

                                var tomu = field.IsShowMuFormSquareMeters == 1 ? 1 : 0
                                $("#fields #tbd").append(
                                    "<tr>" +
                                    "<td class='col-xs-2'><a href='#' id='FieldName' data-type='text'  class='editable editable-click' data-pk='" +
                                    field.id + "'> " + field.FieldName + "</a></td>" +
                                    "<td class='col-xs-1'><a href='#' id='SortCode' data-type='number' data-value='" + parseInt(field.SortCode) +
                                    "' class='editable editable-click' data-pk='" + field.id + "'> " + "</a></td>" +
                                    "<td class='col-xs-3'><a href='#' id='DisplayName' data-type='text'  class='editable editable-click' data-pk='" +
                                    field.id + "'> " + field.DisplayName + "</a></td>" +
                                    "<td class='col-xs-1'><a href='#' id='UnitName' data-type='select' data-value='" + un +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/unitName'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "' data-value='" + un + "'> " + "</td>" +
                                    "<td class='col-xs-1'><a href='#' id='IsDisplay' data-type='select' data-value='" + field.IsDisplay +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>" +
                                    "<td class='col-xs-1'><a href='#' id='IsSearch' data-type='select' data-value='" + field.IsSearch +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>" +
                                    "<td class='col-xs-1'><a href='#' id='IsLabel' data-type='select' data-value='" + field.IsLabel +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>" +
                                    "<td class='col-xs-2'><a href='#' id='IsShowMuFormSquareMeters' data-type='select' data-value='" + tomu +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>"
                                )
                            }

                            $("#fields #tbd .editable.editable-click").editable({
                                showbuttons: true,
                                url: "http://" + serverIP + ":" + serverPort + "/updateField",
                                ajaxOptions: {
                                    dataType: 'json'
                                },
                                success: function (response) {
                                    if (!(response[0] == 1)) {
                                        return "发生错误";
                                    }
                                    if (response.success === false) {
                                        return response.msg;
                                    }
                                }
                            })
                        })
                    }

                    $.fn.editable.defaults.mode = 'inline';
                    var original = $.fn.editableutils.setCursorPosition;
                    $.fn.editableutils.setCursorPosition = function () {
                        try {
                            original.apply(this, Array.prototype.slice.call(arguments));
                        } catch (e) { /* noop */ }
                    };


                    $("#service>tbody #Opacity").editable({
                        step: 0.1,
                        showbuttons: true,
                        url: "http://" + serverIP + ":" + serverPort + "/updateLayer",
                        ajaxOptions: {
                            dataType: 'json'
                        },
                        success: function (response) {
                            if (!(response[0] == 1)) {
                                return "发生错误";
                            }

                            if (response.success === false) {
                                return response.msg;
                            }
                        }
                    })

                    $('#service>tbody .editable.editable-click').editable({
                        showbuttons: true,
                        url: "http://" + serverIP + ":" + serverPort + "/updateLayer",
                        ajaxOptions: {
                            dataType: 'json'
                        },
                        success: function (response) {
                            if (!(response[0] == 1)) {
                                return "发生错误";
                            }
                            if (response.success === false) {
                                return response.msg;
                            }
                        }

                    })
                })
            })


            $("td.mobile").click(function (e) {
                $("#editHeader i").removeClass('fas fa-laptop')
                $("#editHeader i").addClass('fa fa-mobile-alt')
                var layerId = e.target.getAttribute('lid')
                $("#fieldsContainer").hide()
                $("#goService").hide()
                $("#serviceContainer").show()
                $("#goFields").show()

                $("#editContainer").fadeIn(500)
                $("#grayBack").fadeIn(500)
                $("#service>tbody").empty();
                $("#fields #tbd").empty();


                $.get("http://" + serverIP + ":" + serverPort + "/oneLayer?layerId=" + layerId, function (oneLayer) {
                    if (oneLayer.LayerType !== 'FeatureLayer') $("#goFields").hide()
                    var lt = 0;
                    switch (oneLayer.LayerType) {
                        case 'GroupLayer':
                            lt = 0;
                            break;
                        case 'TiledService':
                            lt = 1;
                            break;
                        case 'FeatureLayer':
                            lt = 2;
                            break;
                        case 'GeometryService':
                            lt = 3
                            break;
                        default:
                            lt = 0;
                    }

                    $("#service>tbody").append("<tr><td>" + "服务名称" +
                        "</td><td><a href='#' id='LayerName' data-type='text'  class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.LayerName + "</a></td></tr>" +
                        "<tr><td>" + "显示名称" +
                        "</td><td><a href='#' id='DisplayName' data-type='text'  class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.DisplayName + "</a></td></tr>" +
                        "<tr><td>" + "服务url" +
                        "</td><td><a href='#' id='ServiceUrl' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.ServiceUrl + "</a></td></tr>" +
                        "<tr><td>" + "图层类型" + "</td><td><a href='#' id='LayerType' data-type='select' data-value='" + lt +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/layerType'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.LayerType + "</td></tr>" +
                        "<tr><td>" + "TokenUserName" +
                        "</td><td><a href='#' id='TokenUserName' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.TokenUserName + "</a></td></tr>" +
                        "<tr><td>" + "TokenPassword" +
                        "</td><td><a href='#' id='TokenPassword' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.TokenPassword + "</a></td></tr>" +
                        "<tr><td>" + "TokenURL" +
                        "</td><td><a href='#' id='TokenURL' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.TokenURL + "</a></td></tr>" +
                        "<tr><td>" + "是否显示" + "</td><td><a href='#' id='IsVisible' data-type='select' data-value='" +
                        oneLayer.IsVisible +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + "</td></tr>" +
                        "<tr><td>" + "透明度" + "</td><td><a href='#' id='Opacity' data-type='number' data-value='" + oneLayer.Opacity
                        + "' class='editable' data-pk='" + oneLayer.id + "'> " + "</a></td></tr>" +
                        "<tr><td>" + "服务序号" + "</td><td><a href='#' id='SortCode' data-type='number' data-value='" +
                        parseInt(oneLayer.SortCode) + "' class='editable editable-click' data-pk='" + oneLayer.id + "'> " +
                        "</a></td></tr>" +
                        "<tr><td>" + "显示图例" + "</td><td><a href='#' id='IsLegend' data-type='select' data-value='" +
                        oneLayer.IsLegend +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + "</td></tr>" +
                        "<tr><td>" + "CacheName" +
                        "</td><td><a href='#' id='CacheName' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.CacheName + "</a></td></tr>" +
                        "<tr><td>" + "移动端服务url" +
                        "</td><td><a href='#' id='MobileServiceUrl' data-type='text' class='editable editable-click' data-pk='" +
                        oneLayer.id + "'> " + oneLayer.MobileServiceUrl + "</a></td></tr>" +
                        "<tr><td>" + "是否在移动端显示" +
                        "</td><td><a href='#' id='IsShowInMobile' data-type='select' data-value='" + oneLayer.IsShowInMobile +
                        "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                        oneLayer.id + "'> " + "</td></tr>"
                    )


                    if (oneLayer.LayerType == 'FeatureLayer') {

                        $.get("http://" + serverIP + ":" + serverPort + "/fields?id=" + oneLayer.id, function (fields) {

                            for (var i = 0; i < fields.length; i++) {
                                var field = fields[i];
                                var un = 4;
                                switch (field.UnitName) {
                                    case 'm':
                                        un = 0;
                                        break;
                                    case '米':
                                        un = 0;
                                        break;
                                    case '㎡':
                                        un = 2;
                                        break;
                                    case '平方米':
                                        un = 2;
                                        break;
                                    case 'km':
                                        un = 1;
                                        break;
                                    case '千米':
                                        un = 1;
                                        break;
                                    case 'k㎡':
                                        un = 3;
                                        break;
                                    case '平方千米':
                                        un = 3;
                                        break;
                                    default:
                                        un = 4;
                                        break;
                                }

                                var tomu = field.IsShowMuFormSquareMeters == 1 ? 1 : 0
                                $("#fields #tbd").append(
                                    "<tr>" +
                                    "<td class='col-xs-2'><a href='#' id='FieldName' data-type='text'  class='editable editable-click' data-pk='" +
                                    field.id + "'> " + field.FieldName + "</a></td>" +
                                    "<td class='col-xs-1'><a href='#' id='SortCode' data-type='number' data-value='" + parseInt(field.SortCode) +
                                    "' class='editable editable-click' data-pk='" + field.id + "'> " + "</a></td>" +
                                    "<td class='col-xs-3'><a href='#' id='DisplayName' data-type='text'  class='editable editable-click' data-pk='" +
                                    field.id + "'> " + field.DisplayName + "</a></td>" +
                                    "<td class='col-xs-1'><a href='#' id='UnitName' data-type='select' data-value='" + un +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/unitName'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "' data-value='" + un + "'> " + "</td>" +
                                    "<td class='col-xs-1'><a href='#' id='IsDisplay' data-type='select' data-value='" + field.IsDisplay +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>" +
                                    "<td class='col-xs-1'><a href='#' id='IsSearch' data-type='select' data-value='" + field.IsSearch +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>" +
                                    "<td class='col-xs-1'><a href='#' id='IsLabel' data-type='select' data-value='" + field.IsLabel +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>" +
                                    "<td class='col-xs-2'><a href='#' id='IsShowMuFormSquareMeters' data-type='select' data-value='" + tomu +
                                    "'  data-source='http://" + serverIP + ":" + serverPort + "/yesno'  class='editable editable-click editable-open' data-pk='" +
                                    field.id + "'> " + "</td>"
                                )
                            }

                            $("#fields #tbd .editable.editable-click").editable({
                                showbuttons: true,
                                url: "http://" + serverIP + ":" + serverPort + "/updateField",
                                ajaxOptions: {
                                    dataType: 'json'
                                },
                                success: function (response) {
                                    if (!(response[0] == 1)) {
                                        return "发生错误";
                                    }
                                    if (response.success === false) {
                                        return response.msg;
                                    }
                                }
                            })
                        })
                    }

                    $.fn.editable.defaults.mode = 'inline';
                    var original = $.fn.editableutils.setCursorPosition;
                    $.fn.editableutils.setCursorPosition = function () {
                        try {
                            original.apply(this, Array.prototype.slice.call(arguments));
                        } catch (e) { /* noop */ }
                    };


                    $("#service>tbody #Opacity").editable({
                        step: 0.1,
                        showbuttons: true,
                        url: "http://" + serverIP + ":" + serverPort + "/updateLayer",
                        ajaxOptions: {
                            dataType: 'json'
                        },
                        success: function (response) {
                            if (!(response[0] == 1)) {
                                return "发生错误";
                            }

                            if (response.success === false) {
                                return response.msg;
                            }
                        }
                    })

                    $('#service>tbody .editable.editable-click').editable({
                        showbuttons: true,
                        url: "http://" + serverIP + ":" + serverPort + "/updateLayer",
                        ajaxOptions: {
                            dataType: 'json'
                        },
                        success: function (response) {
                            if (!(response[0] == 1)) {
                                return "发生错误";
                            }
                            if (response.success === false) {
                                return response.msg;
                            }
                        }

                    })
                })
            })





        })
    }
})

$("#closeEdit").click(function () {
    var gb = document.getElementById('grayBack');
    var ec = document.getElementById('editContainer');
    gb.style.display = 'none';
    ec.style.display = 'none';
})

$("#goFields button").click(function () {
    $("#fieldsContainer").show()
    $("#goService").show()
    $("#serviceContainer").hide()
    $("#goFields").hide()
})

$("#goService button").click(function () {
    $("#fieldsContainer").hide()
    $("#goService").hide()
    $("#serviceContainer").show()
    $("#goFields").show()
})

$("#logOut").click(function () {
    $.removeCookie('user');
    console.log('hahahah')
    window.location.href = 'login.html'
})