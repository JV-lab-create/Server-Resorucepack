include(Resources.id("jsblock:scripts/pids_util.js"));

const HEADER_HEIGHT = 18;



function create(ctx, state, pids) {
    // Your custom logic here...
}


function render(ctx, state, pids) {
    // Background Image
    Texture.create("Background")
        .texture("jsblock:textures/la.png")
        .size(pids.width, pids.height)
        .draw(ctx);

    // Time Text
    Text.create("Time Text") 
        .text("Arrival")
        .color(0x000000)
        .pos(pids.width - 5, 2)
        .scale(1.5)
        .rightAlign()
        .draw(ctx);

    // Dest Text
    Text.create("Dest Text") 
        .text("Dest")
        .color(0x000000)
        .pos(5, 2)
        .scale(1.5)
        .draw(ctx);

    // Arrivals
    for(let i = 0; i < 3; i++) { // Set i to 0. i++ if i < pids.rows, otherwise don't run this anymore
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
    }

    
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}