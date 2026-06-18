include(Resources.id("jsblock:scripts/pids_util.js"));

const HEADER_HEIGHT = 13;



function create(ctx, state, pids) {
    // Your custom logic here...
}


function render(ctx, state, pids) {
    // Background Image
    Texture.create("Background")
        .texture("jsblock:res/fluent.png")
        .size(pids.width, pids.height)
        .draw(ctx);

    // Weather
    let weatherImage;
    let weather;

    if (MinecraftClient.worldIsThundering()) {
        weatherImg = "jsblock:textures/block/pids/weather_thunder.png";
        weather = "Thundering"
    } else if(MinecraftClient.worldIsRaining()) {
        weatherImg = "jsblock:textures/block/pids/weather_raining.png";
        weather = "Raining"
    } else {
        weatherImg = "jsblock:textures/block/pids/weather_sunny.png";
        weather = "Sunny"
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
    Text.create("Arrival destination")
                .text(`Time: ${PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true)}`)
                .color(0xFFFFFF)
                .pos(30, 29.75)
                .size(pids.width, 9)
                .stretchXY()
                .scale(1.25)
                .draw(ctx);

    Text.create("Arrival destination")
                .text(`Weather: ${weather}`)
                .color(0xFFFFFF)
                .pos(30, 46.5)
                .size(pids.width, 9)
                .stretchXY()
                .scale(1.25)
                .draw(ctx);

    Text.create("Arrival destination")
                .text(`Day: {day}`)
                .color(0xFFFFFF)
                .pos(30, 63.25)
                .size(pids.width, 9)
                .stretchXY()
                .scale(1.25)
                .draw(ctx);

    
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}