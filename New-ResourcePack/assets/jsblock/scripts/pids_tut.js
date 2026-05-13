include(Resources.id("jsblock:scripts/pids_util.js"));

const HEADER_HEIGHT = 13;



function create(ctx, state, pids) {
    // Your custom logic here...
}


function render(ctx, state, pids) {
    // Background Image
    Texture.create("Background")
        .texture("jsblock:textures/block/pids/rv_default.png")
        .size(pids.width, pids.height)
        .draw(ctx);

    // Weather
    let weatherImage;

    if (MinecraftClient.worldIsThundering()) {
        weatherImg = "jsblock:textures/block/pids/weather_thunder.png";
    } else if(MinecraftClient.worldIsRaining()) {
        weatherImg = "jsblock:textures/block/pids/weather_raining.png";
    } else {
        weatherImg = "jsblock:textures/block/pids/weather_sunny.png";
    }

    Texture.create("Weather Icon")
        .texture(weatherImg)
        .pos(5, 0)
        .size(10, 10)
        .draw(ctx);

    // Time
    Text.create("Clock") 
        .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
        .color(0xFFFFFF)
        .pos(pids.width - 5, 2)
        .scale(0.9)
        .rightAlign()
        .draw(ctx);

    // Arrivals
    for(let i = 0; i < pids.rows; i++) { // Set i to 0. i++ if i < pids.rows, otherwise don't run this anymore
        let rowY = HEADER_HEIGHT + (i*16.75);
        let arrival = pids.arrivals().get(i); // <---- Obtain nth row arrival

        if(arrival != null) {
            // LRT Circle White
            Texture.create("LRT Circle White")
                .texture("mtr:textures/block/white.png")
                .pos(7.5, rowY+1.5)
                .size(18, 6)
                .draw(ctx);

            // LRT Circle Colored
            Texture.create("LRT Circle Colored") 
                .texture("jsblock:textures/lrr.png")
                .color(arrival.routeColor())
                .pos(5, rowY)
                .size(23, 10)
                .draw(ctx);

            // LRT Number Text
            Text.create("LRT Number Text")
                .text(arrival.routeNumber())
                .scale(0.55)
                .centerAlign()
                .pos(16.5, rowY+3)
                .size(26, 9)
                .scaleXY()
                .draw(ctx)

            // Arrival destination
            Text.create("Arrival destination")
                .text(arrival.destination())
                .text(TextUtil.cycleString(arrival.destination()))
                .color(0x000000)
                .pos(30, rowY)
                .size(36, 9)
                .stretchXY()
                .scale(1.25)
                .draw(ctx);

            // Platform Circle
            Texture.create("Platform Circle") // Draw our circle texture
                .texture("jsblock:textures/block/pids/plat_circle.png") // Built-in to JCM
                .pos(79, rowY - 1)
                .size(10.5, 10.5)
                .color(0xD2A808) // #D2A808 is color for HK LRT Network
                .draw(ctx);

            // Platform Circle Text
            Text.create("Platform Circle Text") // Draw the text
                .text(arrival.platformName())
                .pos(84, rowY + 1)
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
                .draw(ctx);
                
        }
    }

    
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}