importPackage(java.awt);

function create(ctx, state, pids) {
    state.tex = new GraphicsTexture(pids.width, pids.height);
}

function render(ctx, state, pids) {
    let g = state.tex.graphics;
    g.setColor(Color.RED);
    g.fillRect(0, 0, pids.width, pids.height);
    g.setColor(Color.GREEN);
    g.fillRect(0, 0, Math.abs(Math.sin(Timing.elapsed())) * pids.width, pids.height);

    state.tex.upload();

    Texture.create("Dynamic Texture")
    .texture(state.tex.identifier)
    .size(pids.width, pids.height)
    .draw(ctx);
}

function dispose(ctx, state, pids) {
    state.tex.close();
}