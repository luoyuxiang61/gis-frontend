var area = 0;

function startMeasure(shape) {
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
            symbol = new aSimpleMarkerSymbol(aSimpleMarkerSymbol.STYLE_CIRCLE, 20,
                new aSimpleLineSymbol(aSimpleLineSymbol.STYLE_SOLID,
                    new aColor([255, 0, 0]), 1),
                new aColor([255, 0, 0, 0.9]));
            break;
        case "polyline":
            symbol = new aCartographicLineSymbol(
                aCartographicLineSymbol.STYLE_SOLID,
                new aColor([255, 0, 0, 0.7]), 2,
                aCartographicLineSymbol.CAP_ROUND,
                aCartographicLineSymbol.JOIN_MITER, 2
            );
            break;
        default:
            symbol = new aSimpleFillSymbol();
            break;
    }
    var graphic = new aGraphic(evt.geometry, symbol);
    map.graphics.add(graphic);

    if (nowMeasure === 'area') {
        console.log(ageometryEngine.planarArea(evt.geometry, 'square-kilometers'))
        area = ageometryEngine.planarArea(evt.geometry, 'square-kilometers');
        showArea();
    }
}

function clearGra() {
    map.graphics.clear();
}