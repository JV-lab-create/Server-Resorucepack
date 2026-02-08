include(Resources.id("jsblock:scripts/pids_util.js"));
var eta;

function create(ctx, state, pids) {
    print("Hello World ^^");
}

function render(ctx, state, pids) {
	Text.create()
        .text("LN  CAR       DEST       MIN")
        .color(0xFF0000)
        .scale(1.25)
        .draw(ctx);
    for(let i = 0; i < pids.rows; i++) {
        let arrival = pids.arrivals().get(i);
        if(arrival != null) {

            Text.create("Arrival route")
            .text(TextUtil.cycleString(arrival.routeNumber()))
            .color(0xFFFF00)
            .pos(0, i*16.75+15.5)
            .scale(1.25)
            .draw(ctx);

            Text.create("Arrival length")
            .text(TextUtil.cycleString(arrival.carCount()))
            .color(0xFFFF00)
            .pos(27, i*16.75+15.5)
            .scale(1.25)
            .draw(ctx);

            Text.create("Arrival destination")
            .text(TextUtil.cycleString(arrival.destination()))
            .color(0xFFFF00)
            .pos(48, i*16.75+15.5)
            .scale(1.25)
            .draw(ctx);

if (TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrival.arrivalTime())).replace(" sec","s").replace("mins","").replace(" min","") == "") {
            Text.create("Arrival time")
            .text("BRD")
            .color(0xFFFF00)
            .pos(135, i*16.75+15.5)
            .rightAlign()
            .scale(1.25)
            .draw(ctx);
} else {
            Text.create("Arrival time")
            .text(TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrival.arrivalTime())).replace(" sec","s").replace("mins","").replace(" min",""))
            .color(0xFFFF00)
            .pos(135, i*16.75+15.5)
            .rightAlign()
            .scale(1.25)
            .draw(ctx);
}

        }
    }
}

function dispose(ctx, state, pids) {
    print("Goodbye World ^^;");
}