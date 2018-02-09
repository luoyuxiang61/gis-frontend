document.getElementById('selectLayerBtn').addEventListener('click', function (e) {
    $("#layersToSelect").toggle()

    console.log(nowLayers)

    var searchLayers = nowLayers.map(function (item) {
        item.sons = item.sons.filter(function (son) {
            son.LayerType == 'FeatureLayer'
        })

        return item;
    })

    console.log(searchLayers)

    var father = $("#grpFather")
    father.empty()
    for (var i = 0; i < nowLayers.length; i++) {
        father.append("<li >" + nowLayers[i].father.DisplayName + "</li>")
    }



})