include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {
}

function render(ctx, state, pids) {
    Texture.create("Background")
    .texture("jsblock:textures/block/pids/pids_nsewl_bg.png")
    .size(pids.width, pids.height)
    .draw(ctx);
    
    // Top Bar
	// Clock on the left (replacing weather)
	Text.create("Clock")
  	  .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
   	 .color(0xFFFFFF)
    	.pos(5, 2) // old weather position
    	.scale(0.9)
    	.draw(ctx);

	// Station name on the right (old clock position)
if (pids.station() != null) {
    Text.create("StationName")
        .text(pids.station().getName())   // Station object → getName()
        .color(0xFFFF00)                  // yellow
        .pos(pids.width - 5, 2)           // old clock position
        .scale(0.9)
        .rightAlign()
        .draw(ctx);
} else {
    // fallback if no station found
    Text.create("StationNameFallback")
        .text("- Unknown Station -")
        .color(0xFFFF00)                  // red to indicate error
        .pos(pids.width - 5, 2)
        .scale(0.9)
        .rightAlign()
        .draw(ctx);
}
       
   // Arrivals
let START_ROW = 1; // start rendering from Row 2’s Y position
let MAX_ROWS = pids.rows - 1; // omit the last row

for (let i = 0; i < MAX_ROWS; i++) {
    let rowY = HEADER_HEIGHT + ((i + START_ROW) * 16.75); // shift down by 1 row
    let customMsg = pids.getCustomMessage(i);
    let arrival = pids.arrivals().get(i);

    if ((arrival == null || pids.isRowHidden(i)) && customMsg === "") continue;

    if (customMsg != "") {
        Text.create(TextUtil.cycleString("Custom Text"))
            .text(customMsg)
            .scale(1.25)
            .size(pids.width - 10, 9)
            .scaleXY()
            .pos(20, rowY)
	    .scale(i === 0 ? 1.25 : 1.1) // slightly smaller scale
	    .color(i === 0 ? 0xFFFF00 : 0xFFFFFF) // yellow for first visible row, white otherwise
            .draw(ctx);
    } else {
        let destX = 5;
        if (!pids.isPlatformNumberHidden()) {
            Texture.create("Platform Circle")
                .texture("jsblock:textures/block/pids/plat_circle.png")
                .pos(5, rowY - 1)
                .size(10.5, 10.5)
                .color(arrival.routeColor())
                .draw(ctx);

            Text.create("Platform Circle Text")
                .text(arrival.platformName())
                .pos(10, rowY + 1)
                .size(9, 9)
                .scaleXY()
                .scale(0.9)
                .centerAlign()
                .color(0xFFFFFF)
                .draw(ctx);

            destX = 20;
        }

        Text.create("Arrival Destination")
	   .text(TextUtil.cycleString(arrival.destination()))
	   .pos(20, rowY)
	   .size(i === 0 ? 60 : 50, i === 0 ? 9 : 8) // smaller for 2nd & 3rd row
	   .scaleXY()
	   .scale(i === 0 ? 1.25 : 1.1) // slightly smaller scale
	   .color(i === 0 ? 0xFFFF00 : 0xFFFFFF) // yellow for first visible row, white otherwise
	   .draw(ctx);

        Text.create("ETA Text")
            .text(TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrival.arrivalTime())))
            .scale(1.25)
            .size(25, 8)
            .scaleXY()
            .rightAlign()
            .pos(pids.width - 8, rowY)
            .color(0xFFFFFF)
            .draw(ctx);
  	  }
	}
}


function dispose(ctx, state, pids) {
}
