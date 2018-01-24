function  startMeasure(shape) {
    activateTool(shape.toUpperCase().replace(/ /g, "_"))
}

function startDraw(el) {
    var shape = $(el).attr('shape').toUpperCase().replace(/ /g, "_");
    activateTool(shape);
}

function activateTool(shape) {
    toolbar.activate(aDraw[shape]);
    map.hideZoomSlider();
}

function deactivateTool() {
    toolbar.deactivate();
}

function createToolbar() {
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
                new aColor([255, 0, 0]), 5,
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

    if(nowMeasure === 'area') {
        console.log(evt.geometry)
    }
}

function clearGra() {
    map.graphics.clear();
}