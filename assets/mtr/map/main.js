include(Resources.id("mtrsteamloco:scripts/display_helper.js"));

const mapImage = Resources.readBufferedImage(Resources.idr("texture.png"));

const texWidth = mapImage.getWidth();
const texHeight = mapImage.getHeight();

let slotCfg = {
    "version": 1,
    "texSize": [texWidth, texHeight],
    "slots": [
        {
            "name": "map_left",
            "texArea": [0, 0, texWidth, texHeight],
            "pos": [
                [[0.812, 2.108, -0.564], [0.874, 2.00, -0.564], [0.874, 2.00, 0.564], [0.812, 2.108, 0.564]]
            ],
            "offsets": [[0, 0, -8], [0, 0, -4], [0, 0, 0], [0, 0, 4], [0, 0, 8]]
        },
        {
            "name": "map_right",
            "texArea": [0, 0, texWidth, texHeight],
            "pos": [
                [[-0.812, 2.108, 0.564], [-0.874, 2.00, 0.564], [-0.874, 2.00, -0.564], [-0.812, 2.108, -0.564]]
            ],
            "offsets": [[0, 0, -8], [0, 0, -4], [0, 0, 0], [0, 0, 4], [0, 0, 8]]
        }
    ]
};
var dhBase = new DisplayHelper(slotCfg);

function create(ctx, state, train) {
    state.dh = dhBase.create();
    
    let g = state.dh.graphicsFor("map_left");
    g.drawImage(mapImage, 0, 0, texWidth, texHeight, 0, 0, texWidth, texHeight, null);
    state.dh.upload();
}

function dispose(ctx, state, train) {
    state.dh.close();
}

function render(ctx, state, train) {
    for (let i = 0; i < train.trainCars(); i++) {
        ctx.drawCarModel(state.dh.model, i, null);
    }
}