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
            symbol = new aCartographicLineSymbol(
                aCartographicLineSymbol.STYLE_SOLID,
                new aColor([255, 0, 0]), 10,
                aCartographicLineSymbol.CAP_ROUND,
                aCartographicLineSymbol.JOIN_MITER, 5
            );
            break;
        default:
            symbol = new aSimpleFillSymbol();
            break;
    }
    var graphic = new aGraphic(evt.geometry, symbol);
    map.graphics.add(graphic);
}

function clearGra() {
    map.graphics.clear();
}