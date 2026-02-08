include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {
}

function render(ctx, state, pids) {
    Texture.create("Background")
        .texture("jsblock:textures/block/pids/pids_tel_bg.png")
        .size(pids.width, pids.height)
        .draw(ctx);
    
    // ─── Top Bar ───
    // Platform name on the left
    let platformName = "";
    if (pids.arrivals().platforms().size() > 0) {
        platformName = pids.arrivals().platforms().get(0).getName();
    }

    if (platformName !== "") {
        Text.create("PlatformName")
            .text("Platform " + platformName)   // add the word "Platform"
            .color(0xFFFFFF)                   // white
            .pos(5, 2)                         // left side
            .scale(0.9)
            .draw(ctx);
    } else {
        // fallback if no platform found
        Text.create("PlatformNameFallback")
            .text("- Unknown Platform -")
            .color(0xFF0000)                   // red to indicate error
            .pos(5, 2)
            .scale(0.9)
            .draw(ctx);
    }

    // Clock on the right
    Text.create("Clock")
        .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
        .color(0xFFFFFF)
        .pos(pids.width - 5, 2)  // right side
        .scale(0.9)
        .rightAlign()
        .draw(ctx);
       
    // ─── Arrivals ───
    let START_ROW = 2; // start rendering from Row 2’s Y position
    let MAX_ROWS = pids.rows - 1; // omit the last row

    for (let i = 0; i < MAX_ROWS; i++) {

        // Skip rendering Row 3 (i.e., the third arrival)
        if (i >= 2) continue;

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
                .scale(i === 0 ? 1.25 : 1.1)
                .color(i === 0 ? 0xFFFF00 : 0xFFFFFF)
                .draw(ctx);
        } else {
            let destX = 5;
            if (!pids.isPlatformNumberHidden()) {
                if (i === 0) {
                    // Row 1 special: draw Platform Circle + Number above Row 1, centered
                    const centerX = pids.width / 2;
                    const circleSize = 12;
                    const numberHeight = 9;
                    const topY = rowY - 16; // one row above

                    Texture.create("Platform Circle Top")
                        .texture("jsblock:textures/block/pids/plat_circle.png")
                        .pos(centerX - circleSize / 2, topY)
                        .size(circleSize, circleSize)
                        .color(arrival.routeColor())
                        .draw(ctx);

                    Text.create("Platform Number Top")
                        .text(arrival.platformName())
                        .pos(centerX, topY + circleSize / 2 - numberHeight / 2)
                        .size(numberHeight, numberHeight)
                        .scaleXY()
                        .centerAlign()
                        .color(0xFFFFFF)
                        .draw(ctx);

                    destX = 20; // keep Row 1’s destination aligned below
                } else {
                    // Normal handling for other rows
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
            }

            Text.create("Arrival Destination")
                .text(TextUtil.cycleString(arrival.destination()))
                .pos(destX, rowY)
                .size(i === 0 ? 60 : 50, i === 0 ? 9 : 8)
                .scaleXY()
                .scale(i === 0 ? 1.25 : 1.1)
                .color(i === 0 ? 0xFFFFFF : 0xFFFFFF)
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
