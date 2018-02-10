var nowSearchUrl = '';
document.getElementById('selectLayerBtn').addEventListener('click', function (e) {
    $("#layersToSelect").toggle()
    $("#searchResultList").empty()
    var searchLayers = nowLayers.map(function (item) {
        item.sons = item.sons.filter(function (son) {
            return son.LayerType === 'FeatureLayer'
        })
        return item;
    })

    var father = $("#grpFather")
    father.empty()
    for (var i = 0; i < searchLayers.length; i++) {
        if (searchLayers[i].sons.length !== 0) {
            father.append("<li class='faLi' index='" + i + "'>" + searchLayers[i].father.DisplayName + "</li>")
        }
    }

    var faLis = $(".faLi")
    faLis.on('click', function (e) {
        var sons = $("#grpSons>ul")
        var index = e.target.getAttribute('index')
        sons.empty()
        var nowSons = searchLayers[index].sons
        for (var j = 0; j < nowSons.length; j++) {
            sons.append("<li class='sonLi' url='" + nowSons[j].ServiceUrl + "'>" + nowSons[j].DisplayName + "</li>")
        }

        var sonLis = $(".sonLi")
        sonLis.on('click', function (e) {
            nowSearchUrl = e.target.getAttribute('url')
            $("#layersToSelect").hide()
            document.getElementById('selectLayerBtn').innerHTML = e.target.innerText + "<span class='glyphicon glyphicon-menu-down'><span>"
        })
    })
})

document.getElementById('searchButton').addEventListener('click', function (e) {
    console.log(nowSearchUrl)
    var queryTask = new aQueryTask(nowSearchUrl)
    var query = new aQuery()
    // query.where = "1 = 1"
    query.where = "redlinetype like '%预划%'"
    query.outFields = ["*"]
    query.returnGeometry = true
    queryTask.execute(query, function (result) {
        console.log(result)
        var features = result.features;
        for (var i = 0; i < features.length; i++) {
            $("#searchResultList").append("<li class='geo' index='" + i + "'>" + i + "</li>")
        }
        var nowGeos = document.getElementsByClassName('geo')
        for (var j = 0; j < nowGeos.length; j++) {
            nowGeos[j].addEventListener('click', function (e) {
                var geo = features[e.target.getAttribute('index')].geometry
                if (geo.type === 'polygon') {
                    var extent = geo.getExtent()
                    map.setExtent(extent)
                }

            })
        }
    })
})