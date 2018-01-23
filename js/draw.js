function startDraw(el) {
    var shape = $(el).attr('shape').toUpperCase().replace(/ /g, "_");
    activateTool(shape);
}


function activateTool(shape) {
    toolbar.activate(aDraw[shape]);
    map.hideZoomSlider();
}

function createToolbar(themap) {
    toolbar = new aDraw(map);
    toolbar.on("draw-end", addToMap);
}

function addToMap(evt) {
    var symbol;
    toolbar.deactivate();
    map.showZoomSlider();
    switch (evt.geometry.type) {
        case "point":
        case "multipoint":
            symbol = new aSimpleMarkerSymbol();
            break;
        case "polyline":
            symbol = new aSimpleLineSymbol();
            break;
        default:
            symbol = new aSimpleFillSymbol();
            break;
    }
    var graphic = new aGraphic(evt.geometry, symbol);
    map.graphics.add(graphic);
}