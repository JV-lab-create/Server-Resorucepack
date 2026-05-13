include(Resources.id("jsblock:scripts/pids_util.js"));

const HEADER_HEIGHT = 18;



function create(ctx, state, pids) {
    // Your custom logic here...
}


function render(ctx, state, pids) {
    // Time Text
    Text.create("Time Text") 
        .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
        .color(0xfc9700)
        .pos((pids.width / 2) - 15, 50)
        .scale(1)
        .draw(ctx);

    let firstRowArrival = pids.arrivals().get(0);
    let secondRowArrival = pids.arrivals().get(1);
    let customMsg = pids.getCustomMessage(0);
    if(firstRowArrival != null) {
        Text.create("First Arrival Destination Text") 
            .text(TextUtil.cycleString(firstRowArrival.destination()))
            .color(0xfc9700)
            .pos(12, 10)
            .scale(1)
            .draw(ctx);

        // Arrival ETA
        Text.create("Arrival ETA")
            .pos(pids.width - 12, 10)
            .color(0xfc9700)
            .scale(1)
            .rightAlign()
            .text(TextUtil.cycleString(PIDSUtil.getETAText(firstRowArrival.arrivalTime())))
            .size(30, 9)
            .scaleXY()
            .draw(ctx);
    }
    if (customMsg == "") {
        Text.create("First Arrival Destination Text") 
            .text(`The train ${TextUtil.getNonCjkAndExtraParts(TextUtil.getNonExtraParts(firstRowArrival.routeName()))} terminates at ${TextUtil.getNonCjkAndExtraParts(firstRowArrival.destination())}, with ${firstRowArrival.carCount()} cars, will arrive in ${TextUtil.getNonCjkAndExtraParts(PIDSUtil.getETAText(firstRowArrival.arrivalTime()))} `)    
            .color(0xfc9700)
            .pos(12, 23)
            .size(pids.width - 20, 20)
            .marquee()
            .scale(1)
            .draw(ctx);
    } else {
        Text.create("First Arrival Destination Text") 
            .text(customMsg)
            .color(0xfc9700)
            .pos(12, 23)
            .size(pids.width - 20, 20)
            .marquee()
            .scale(1)
            .draw(ctx);
    }

    if(secondRowArrival != null) {
        Text.create("First Arrival Destination Text") 
            .text(TextUtil.cycleString(secondRowArrival.destination()))
            .color(0xfc9700)
            .pos(12, 35)
            .scale(1)
            .draw(ctx);

        // Arrival ETA
        Text.create("Arrival ETA")
            .pos(pids.width - 12, 35)
            .color(0xfc9700)
            .scale(1)
            .rightAlign()
            .text(TextUtil.cycleString(PIDSUtil.getETAText(secondRowArrival.arrivalTime())))
            .size(30, 9)
            .scaleXY()
            .draw(ctx);
    }
    // Arrivals
    /* for(let i = 0; i < 3; i++) { // Set i to 0. i++ if i < pids.rows, otherwise don't run this anymore
        let rowY = HEADER_HEIGHT + (i*16.75);
        let arrival = pids.arrivals().get(i); // <---- Obtain nth row arrival

        if(arrival != null) {

            // Arrival destination
            Text.create("Arrival destination")
                .text(arrival.destination())
                .text(TextUtil.cycleString(arrival.destination()))
                .color(0xFFFFFF)
                .pos(14, rowY)
                .size(45, 9)
                .stretchXY()
                .scale(1.25)
                .draw(ctx);

            // Platform Circle
            Texture.create("Platform Circle") // Draw our circle texture
                .texture("jsblock:textures/block/pids/plat_circle.png") // Built-in to JCM
                .pos(2, rowY - 1)
                .size(10.5, 10.5)
                .color(arrival.routeColor())
                .draw(ctx);

            // Platform Circle Text
            Text.create("Platform Circle Text") // Draw the text
                .text(arrival.routeNumber())
                .pos(6.3, rowY + 1)
                .scale(0.9)
                .centerAlign()
                .color(0xFFFFFF)
                .draw(ctx);

            // Arrival ETA
            Text.create("Arrival ETA")
                .pos(pids.width - 8, rowY)
                .scale(1.25)
                .rightAlign()
                .text(TextUtil.cycleString(PIDSUtil.getETAText(arrival.arrivalTime())))
                .size(30, 9)
                .scaleXY()
                .color(0xFFFFFF)
                .draw(ctx);
                
        }
    }*/

    
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}