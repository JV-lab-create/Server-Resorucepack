include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {}

function render(ctx, state, pids) {
    Texture.create("Background")
        .texture("jsblock:textures/block/pids/pids_dtl_bg.png")
        .size(pids.width, pids.height)
        .draw(ctx);

    // ─── Arrivals ───
    let MAX_ROWS = Math.min(pids.rows, 2); // only draw first 2 arrivals

    for (let i = 0; i < MAX_ROWS; i++) {
        let rowY = HEADER_HEIGHT + (i === 1 ? 16.75 * 3 : 16.75 * i);

        let customMsg = pids.getCustomMessage(i);
        let arrival = pids.arrivals().get(i);

        if ((arrival == null || pids.isRowHidden(i)) && customMsg === "") continue;

        // ─── Row 3: Static Car Image ───
        if (i === 1) { // only for the second arrival
            const carRowY = HEADER_HEIGHT + 16.75 * 2; // third row
            const carHeight = 12; // fits row
            const carWidth = pids.width * 0.5; // scale to half screen width
            const startX = (pids.width - carWidth) / 2;

            Texture.create("CarImage")
                .texture("jsblock:textures/block/pids/dtl_misc/car_block.png")
                .pos(startX, carRowY)
                .size(carWidth, carHeight)
                .draw(ctx);
        }

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
            let destX = 20;

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
            }

            // ─── ETA Text ───
            let etaText = TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrival.arrivalTime()));

            // Show "Arrived" for first row if ETA <= 0
            if (i === 0 && arrival.arrivalTime() <= 0) {
                etaText = "Arrived";
            }

            Text.create("ETA Text")
                .text(etaText)
                .scale(1.25)
                .size(25, 8)
                .scaleXY()
                .rightAlign()
                .pos(pids.width - 8, rowY)
                .color(0xFFFFFF)
                .draw(ctx);

            Text.create("Arrival Destination")
                .text(TextUtil.cycleString(arrival.destination()))
                .pos(destX, rowY)
                .size(i === 0 ? 60 : 50, i === 0 ? 9 : 8)
                .scaleXY()
                .scale(i === 0 ? 1.25 : 1.1)
                .color(0xFFFFFF)
                .draw(ctx);
        }
    }
}

function dispose(ctx, state, pids) {}
