include(Resources.id("jsblock:scripts/pids_util.js"));

const HEADER_HEIGHT = 13;



function create(ctx, state, pids) {
    // Your custom logic here...
}


function render(ctx, state, pids) {
    // Background Image
    Texture.create("Background")
        .texture("jsblock:textures/topia.png")
        .size(pids.width, pids.height)
        .draw(ctx);

    // Time
    Text.create("Clock") 
        .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
        .color(0xFFFFFF)
        .pos(pids.width - 5, 2)
        .scale(0.9)
        .rightAlign()
        .draw(ctx);

   let firstRowY = HEADER_HEIGHT // + ( i * 16.75);
   let secondRowY = HEADER_HEIGHT + ( 16.75);
   let thirdRowY = HEADER_HEIGHT + ( 2 * 16.75);
   let fourthRowY = HEADER_HEIGHT + (3 * 16.75);
   let arrival = pids.arrivals().get(1);

   Text.create("Destination Header")
        .text(TextUtil.cycleString("目的地|Destination"))
        .color(0x02fceb) // #02fceb
        .pos(4, firstRowY)
        .stretchXY()
        .draw(ctx);

    Text.create("Train Linet Header")
        .text(TextUtil.cycleString("火車|Boat"))
        .color(0x02fceb) // #02fceb
        .pos(pids.width - 4, firstRowY)
        .stretchXY()
        .rightAlign()
        .draw(ctx);
    Text.create("Line Name Text")
        .text(TextUtil.cycleString(TextUtil.getNonExtraParts(arrival.routeName())))
        .rightAlign()
        .stretchXY()
        .scale(0.9)
        .size(45, 9)
        .pos(pids.width - 4, secondRowY)
        .color(0xFFFFFF)
        .draw(ctx);



    Text.create("Arrival destination")
        .text(TextUtil.cycleString(arrival.destination()))
        .color(0xFFFFFf) 
        .pos(4, secondRowY)
        .size(45, 9)
        .stretchXY()
        .scale(0.9)
        .draw(ctx);
            
    Text.create("Cars Header")
        .text(TextUtil.cycleString("平台|Platform"))
        .color(0x02fceb) // #02fceb
        .pos(4, thirdRowY)
        .stretchXY()
        .draw(ctx);

    Text.create("ETA Header")
        .text(arrival.destination())
        .text(TextUtil.cycleString("登機|Boarding in"))
        .color(0x02fceb) // #02fceb
        .pos(pids.width - 4, thirdRowY)
        .stretchXY()
        .rightAlign()
        .draw(ctx);

    Text.create("Arrival ETA Text")
        .text(TextUtil.cycleString(PIDSUtil.getETAText(arrival.arrivalTime())))
        //.stretchXY()
        .scale(0.9)
        .rightAlign()
        .size(34, 9)
        .pos(pids.width - 4, fourthRowY)
        .color(0xFFFFFF)
        .draw(ctx);

    Text.create("Arrival destination")
        .text(arrival.platformName())
        .color(0xFFFFFf) 
        .pos(4, fourthRowY)
        .size(60, 9)
        .stretchXY()
        .scale(1.25)
        .draw(ctx);

}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}