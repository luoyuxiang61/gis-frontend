document.getElementById('selectLayerBtn').addEventListener('click', function (e) {
    $("#layersToSelect").toggle()

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
        console.log(nowSons)
        for (var j = 0; j < nowSons.length; j++) {
            sons.append("<li class='sonLi' url='" + nowSons[j].ServiceUrl + "'>" + nowSons[j].DisplayName + "</li>")
        }

        var sonLis = $(".sonLi")
        sonLis.on('click', function (e) {
            console.log(e.target.getAttribute('url'))
            console.log(e.target.innerText)
            $("#layersToSelect").hide()
            document.getElementById('selectLayerBtn').innerHTML = e.target.innerText + "<span class='glyphicon glyphicon-menu-down'><span>"
        })

    })




})