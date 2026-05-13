// Utiliteds for the PIDS

// Renders the background
function Background(ctx, background, sizeX, sizeY) {
    Texture.create("Background")
        .texture("jsblock:dynamic/textures/" + background)
        .size(sizeX, sizeY)
        .draw(ctx);
}

function Weather(ctx, x, y, size) {
    let weatherIcon
    if (MinecraftClient.worldIsThundering()) { // Thunder
        weatherIcon = "jsblock:textures/block/pids/weather_thunder.png";
    }
    else if (MinecraftClient.worldIsRaining()) { // Rainy
        weatherIcon = "jsblock:textures/block/pids/weather_raining.png";
    }
    else { // Sunny
        weatherIcon = "jsblock:textures/block/pids/weather_sunny.png";
    }

    Texture.create("Weather")
        .texture(weatherIcon)
        .pos(x, y)
        .size(size, size)
        .draw(ctx)
}


function CreateClock(ctx, x, y) {
    Text.create("Clock")
    .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
    .color(0xFFFFFF)
    .pos(x, y)
    .scale(0.9)
    .rightAlign()
    .draw(ctx);
}

function RenderLine(ctx, line, x, y, sizeX, sizeY) {
    Texture.create("Lines")
        .texture("jsblock:dynamic/textures/operators/" + line)
        .pos(x, y)
        .size(sizeX, sizeY)
        .draw(ctx);
}

function RenderDestination(ctx, pids, index, x, y, sizeX, sizeY, scale, color = 0x000000) {
    let arrival = pids.arrivals().get(index - 1);
    Text.create("Arrival Destination")
        .text(TextUtil.cycleString(arrival.destination()))
        .scale(scale)
        .size(sizeX, sizeY)
        .scaleXY()
        .pos(x, y)
        .draw(ctx);
}

function RenderETA(ctx, pids, index, x, y, sizeX, sizeY, scale, color = 0x000000) {
    let arrival = pids.arrivals().get(index - 1);
    Text.create("ETA Text")
        .text(TextUtil.cycleString(PIDSUtil.getETAText(arrival.arrivalTime())))
        .scale(scale)
        .size(sizeX, sizeY)
        .scaleXY()
        .rightAlign()
        .pos(x, y)
        .draw(ctx);
}

function RenderPlatform(ctx, pids, index, x, y, scale, color = 0xD2A808) {
    let arrival = pids.arrivals().get(index - 1);
        Texture.create("Platform Circle")
            .texture("jsblock:textures/block/pids/plat_circle.png")
            .pos(x, y)
            .size(10.5, 10.5)
            .color(color) // Hong Kong LRT Network Color
            .draw(ctx);

        Text.create("Platform Circle Text")
            .text(arrival.platformName())
            .pos(x, y)
            .size(9, 9)
            .scaleXY()
            .scale(0.9)
            .centerAlign()
            .color(0xFFFFFF)
            .draw(ctx);
    }