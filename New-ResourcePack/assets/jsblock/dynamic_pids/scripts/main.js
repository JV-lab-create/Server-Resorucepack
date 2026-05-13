importPackage(java.awt);
importPackage(java.awt.geom);
include("jsblock:dynamic_pids/scripts/settings.js");
include(Resources.id("jsblock:scripts/pids_util.js"));




const HEADER_HEIGHT = 14;

function create(ctx, state, pids) {
    // Your custom logic here...
}

function render(ctx, state, pids) {
    // let g = page.graphics;
    let firstArrival = pids.arrivals().get(0)
    let weatherImg;
    let langCycle = TextUtil.cycleString("中國人||English");
    if (firstArrival == null) {
        Texture.create("Background")
            .texture("jsblock:dynamic_pids/textures/no_service.png")
            .size(pids.width, pids.height)
            .draw(ctx);
    } else {
        Texture.create("Background")
            .texture("jsblock:textures/block/pids/rv_default.png")
            .size(pids.width, pids.height)
            .draw(ctx);
    }
    /* Text.create()
        .text("Hello World")
        .color(0xFFFFFF)
        .draw(ctx);8*/



    if (MinecraftClient.worldIsThundering()) {
        weatherImg = "jsblock:textures/block/pids/weather_thunder.png";
    } else if (MinecraftClient.worldIsRaining()) {
        weatherImg = "jsblock:textures/block/pids/weather_raining.png";
    } else {
        weatherImg = "jsblock:textures/block/pids/weather_sunny.png";
    }
    Texture.create("Weather Icon")
        .texture(weatherImg)
        .pos(5, 0)
        .size(10, 10)
        .draw(ctx);

    Text.create("Clock")
        .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true)) // Note this here!
        .color(0xFFFFFF)
        .pos(pids.width - 5, 2)
        .scale(0.9)
        .rightAlign()
        .draw(ctx);

    // Arrivals
    for (let i = 0; i < pids.rows; i++) {
        let rowY = HEADER_HEIGHT + (i * 16.75);
        
        let customMsg = pids.getCustomMessage(i);
        if (customMsg != "") {
            Text.create("Custom Text")
                .text(TextUtil.cycleString(customMsg))
                .scale(1.25)
                .size(pids.width - (5 * 2), 9)
                .stretchXY()
                .pos(5, rowY)
                .draw(ctx);
        } else {
            let arrival = pids.arrivals().get(i);
            
            if (arrival != null && !pids.isRowHidden(i)) {
            let eta = TextUtil.cycleString(PIDSUtil.getETAText(arrival.arrivalTime()))
            Text.create("ETA Text")
                .text(eta)
                .scale(1.25)
                .size(30, 9)
                .stretchXY()
                .rightAlign()
                .pos(pids.width - 8, rowY)
                .draw(ctx);
                let langCycle = TextUtil.cycleString(arrival.destination());
                let CURRENTLINE = arrival.routeName();
                let lineCH = "local_ch.png";
                let lineEN = "local_en.png";
                let lnMatch = LINES.find(ln => CURRENTLINE.includes(ln.key));
                if (lnMatch) {
                    lineCH = lnMatch.ch;
                    lineEN = lnMatch.en;
                }
                
                if (TextUtil.isCjk(langCycle)) {
                    Texture.create("Line")
                        .texture("jsblock:dynamic_pids/textures/operators/" + lineCH)
                        .pos(3, rowY - 2)
                        .size(17, 11)
                        .draw(ctx);
                } else {
                    Texture.create("Line")
                        .texture("jsblock:dynamic_pids/textures/operators/" + lineEN)
                        .pos(3, rowY - 2)
                        .size(17, 11)
                        .draw(ctx);
                }
                let arrivalDestination;
                if (arrival.terminating()) {
                    arrivalDestination = TextUtil.cycleString("不載客|Not in service")
                } else {
                    arrivalDestination = TextUtil.cycleString(arrival.destination())
                }

                Text.create("Arrival Destination")
                    .text(arrivalDestination)
                    .scale(1.25)
                    .size(36, 9)
                    .stretchXY()
                    .pos(25, rowY - 1)
                    .draw(ctx);

                if (!pids.isPlatformNumberHidden()) {

                    if (TextUtil.isCjk(langCycle) != true) {
                        let trainCarNumber = arrival.carCount();
                        let currentColorforCars;
                        if (carColorPalette.has(trainCarNumber)) {
                            currentColorforCars = carColorPalette.get(trainCarNumber);
                        } else {
                            currentColorforCars = carColorPalette.get(0);
                        }
                        Texture.create("Car Square")
                            .texture("jsblock:dynamic_pids/textures/cars.png")
                            .pos(79, rowY - 3)
                            .size(10.5, 13.5)
                            .color(currentColorforCars)
                            .draw(ctx);
                        Text.create("Train Cars")
                            .text(arrival.carCount())
                            .pos(84, rowY - 1)
                            .size(9, 9)
                            .scaleXY()
                            .scale(0.9)
                            .centerAlign()
                            .draw(ctx);
                    } else {
                        Texture.create("Platform Circle")
                        .texture("jsblock:textures/block/pids/plat_circle.png")
                        .pos(79, rowY - 1)
                        .size(10.5, 10.5)
                        .color(arrival.routeColor())
                        .draw(ctx);
                    Text.create("Platform Circle Text")
                        .text(arrival.platformName())
                        .pos(84, rowY + 1)
                        .size(9, 9)
                        .scaleXY()
                        .scale(0.9)
                        .centerAlign()
                        .color(0xFFFFFF)
                        .draw(ctx);
                    }
                }
            }
        }

    }
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}


/*    Text.create("Custom Text")
            .text("My Custom Text!!")
            .scale(1.25)
            .color(0xFFFFFF)
            .size(pids.width - (5*2), 9)
            .stretchXY()
            .pos(5, rowY)
            .draw(ctx);
    Background(ctx, "no_service.png")

    // This will check if there is even a runing service
    if (arrivalsChecker == null) {
        Background(ctx, "no_service.png")
        Weather(ctx, 97, 1.5, 7);
        Weather(ctx, 5, 0);
        Clock(ctx, pids.width - 5, 2)
    }*/