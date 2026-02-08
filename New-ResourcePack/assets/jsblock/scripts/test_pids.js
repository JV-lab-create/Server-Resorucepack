include(Resources.id("jsblock:scripts/pids_util.js"));
var eta;

function create(ctx, state, pids) {
    print("Hello World ^^");
}

function render(ctx, state, pids) {
	Text.create()
        .text("type: " + pids.type)
        .color(0xFFFFFF)
	.pos(0,0)
        .draw(ctx);

	Text.create()
        .text("width: " + pids.width)
        .color(0xFFFFFF)
	.pos(0,9)
        .draw(ctx);

	Text.create()
        .text("height: " + pids.height)
        .color(0xFFFFFF)
	.pos(0,18)
        .draw(ctx);
}

function dispose(ctx, state, pids) {
    print("Goodbye World ^^;");
}