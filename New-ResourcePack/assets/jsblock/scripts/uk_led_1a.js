var AMBER = 0xf7a014;
var AMBER_DIM = 0xf7a014;

var ROW_H = 16.5;
var LEFT_PAD = 10;
var RIGHT_PAD = 12;

var VERTICAL_OFFSET = 0;

var TIME_SCALE = 1.25;
var DEST_SCALE = 1.20;
var STATUS_SCALE = 1.05;

var DEST_X = LEFT_PAD + 34;
var DEST_Y_OFFSET_LATIN = 0;
var DEST_Y_OFFSET_CJK = -0.5;
function hasCJK(s) {
  s = toJsStr(s);
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (
      // chinese (hanja/kanji)
      (c >= 0x2E80 && c <= 0x9FFF) || (c >= 0xF900 && c <= 0xFAFF) ||
      // hiragana & katakana
      (c >= 0x3040 && c <= 0x30FF) ||
      // hangul
      (c >= 0x1100 && c <= 0x11FF) || (c >= 0x3130 && c <= 0x318F) || (c >= 0xAC00 && c <= 0xD7AF)
    ) return true;
  }
  return false;
}

var DEST_BASE_UNITS = 19.0;
var CPS_WIDTH_UNITS = 32;
var CPS_UNITS_PER_SEC = 10.5;
var CJK_UNIT = 1.6;

var LANG_SWITCH_MS = 1500;

var BULLET = "   •   ";

// status flippy thresholds (in milliseconds)
var DUE_THRESHOLD_MS = 45000;
var ARRIVED_PRE_MS = 250;
var ARRIVED_DWELL_HOLDMS = 20000;

// the shrinkage variables of pain and suffering
var DEST_GAP_PX_LATIN = 2;      
var DEST_GAP_PX_CJK = 7;        
var STATUS_EXTRA_PAD_CJK = 2;   
var DEST_MIN_SHRINK = 0.70;      // MAXIMUM SHRINKAGE THRESHOLD (floor) !!!!!!
var EST_UNIT_PX = 4.9;          
var STATUS_UNIT_PX = 5.2;       
var STATUS_PAD_PX = 4;          
var STATUS_CHAR_FALLBACK_PX = 6.0;

function toJsStr(s) { return s == null ? "" : ("" + s); }

function trimStr(s) {
  s = toJsStr(s);
  var i = 0;
  while (i < s.length && s.charCodeAt(i) <= 32) i++;
  var j = s.length - 1;
  while (j >= i && s.charCodeAt(j) <= 32) j--;
  return s.substring(i, j + 1);
}

function pad2(n) { n = Math.floor(n); return (n < 10 ? "0" : "") + n; }
function nowMs() { return (new Date().getTime()); }

function fmtHHMM(t) {
  var d = new Date(t);
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes());
}

function fmtClock() {
  var d = new Date();
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
}

function cycleLang(s) {
  var parts = toJsStr(s).split("|");
  if (parts.length <= 1) return trimStr(parts[0] || "");
  var idx = Math.floor(nowMs() / LANG_SWITCH_MS) % parts.length;
  return trimStr(parts[idx]);
}

function bothLang(s) {
  var parts = toJsStr(s).split("|");
  if (parts.length <= 1) return trimStr(parts[0] || "");
  var left = trimStr(parts[0]);
  var right = trimStr(parts.slice(1).join(" | "));
  return (left && right) ? (left + " | " + right) : (left || right);
}

// james’s fancy fix!
function callingpoint_filter_out_lines(s) {
  var t = toJsStr(s).replace(/\|/g, " ");
  t = t.replace(/\s\s+/g, " ");
  return trimStr(t);
}

function charUnits(ch) {
  var c = ch.charCodeAt(0);
  if (ch === " " || ch === "\u3000") return 0.6;
  if (",.;:!?'’‘“”()[]{}".indexOf(ch) >= 0) return 0.6;

  if (
     // chinese (hanja/kanji)
    (c >= 0x2E80 && c <= 0x9FFF) || (c >= 0xF900 && c <= 0xFAFF) ||
    // hiragana & katakana
    (c >= 0x3040 && c <= 0x30FF) ||
    // hangul
    (c >= 0x1100 && c <= 0x11FF) || (c >= 0x3130 && c <= 0x318F) || (c >= 0xAC00 && c <= 0xD7AF)
  ) return CJK_UNIT;

  return 1.0;
}

function measureUnits(s) {
  s = toJsStr(s);
  var acc = 0.0;
  for (var i = 0; i < s.length; i++) acc += charUnits(s.charAt(i));
  return acc;
}

function truncToUnits(s, maxUnits) {
  s = toJsStr(s);
  var acc = 0.0, out = "";
  for (var i = 0; i < s.length; i++) {
    var w = charUnits(s.charAt(i));
    if (acc + w > maxUnits) { out += "…"; return out; }
    out += s.charAt(i);
    acc += w;
  }
  return out;
}

function statusFor(msUntil) {
  if (msUntil < -ARRIVED_DWELL_HOLDMS) return { label: "", hide: true };
  if (msUntil <= ARRIVED_PRE_MS && msUntil >= -ARRIVED_PRE_MS) return { label: "Arrived", hide: false };
  if (msUntil < 0) return { label: "Arrived", hide: false };
  if (msUntil < DUE_THRESHOLD_MS) return { label: "Due", hide: false };
  var s = Math.round(msUntil / 1000), m = Math.floor(s / 60);
  return { label: (m <= 1 ? "1 min" : (m + " mins")), hide: false };
}

function callingPointsList(pids, arrival) {
  try {
    if (!pids.station() || !arrival || !arrival.route()) return [];
    var platforms = arrival.route().getPlatforms();

    var names = [], nm;
    if (platforms && platforms.toArray) {
      var arr = platforms.toArray();
      for (var i = 0; i < arr.length; i++) {
        nm = bothLang(arr[i].stationName);
        if (nm) nm = callingpoint_filter_out_lines(nm);
        if (nm) names.push(nm);
      }
    } else if (platforms && platforms.iterator) {
      var it = platforms.iterator();
      while (it.hasNext()) {
        nm = bothLang(it.next().stationName);
        if (nm) nm = callingpoint_filter_out_lines(nm);
        if (nm) names.push(nm);
      }
    }

    var here = callingpoint_filter_out_lines(bothLang(pids.station().getName()));
    var dest = callingpoint_filter_out_lines(bothLang(arrival.destination()));

    var start = -1;
    for (var j = 0; j < names.length; j++) {
      if (names[j] === here) { start = j + 1; break; }
    }
    if (start < 0) start = 0;

    var out = [];
    for (var k = start; k < names.length; k++) {
      var s = names[k];
      if (!s) continue;
      if (s === dest) break;
      out.push(s);
    }
    if (out.length === 0) {
      for (var m = start; m < names.length; m++) if (names[m]) out.push(names[m]);
    }
    return out;
  } catch (e) { return []; }
}

// marquee scroll scroll text
function marqueeUnits(text, visibleUnits, unitsPerSec) {
  if (!text) return "";
  var src = toJsStr(text);
  var spacer = BULLET;
  var loop = src + spacer + src + spacer;

  var units = [];
  var totalU = 0.0;
  for (var i = 0; i < loop.length; i++) {
    var w = charUnits(loop.charAt(i));
    units.push(w);
    totalU += w;
  }
  if (totalU <= 0) return "";

  var t = nowMs() / 1000.0;
  var startU = (t * unitsPerSec) % totalU;

  var iStart = 0, acc = 0.0;
  while (iStart < units.length && acc + units[iStart] <= startU) {
    acc += units[iStart++];
  }

  var out = "", need = visibleUnits, idx = iStart, guard = 0;
  while (need > 0 && guard < loop.length * 2) {
    if (idx >= loop.length) idx = 0;
    var ch = loop.charAt(idx);
    var w = units[idx];
    if (need - w < -1e-6) break;
    out += ch;
    need -= w;
    idx++; guard++;
  }
  return out;
}

function routeDisplayName(raw) {
  var core = toJsStr(raw).split("||")[0];
  var parts = core.split("|");
  var left = trimStr(parts[0] || "");
  var right = trimStr(parts.length > 1 ? parts[parts.length - 1] : "");
  if (left && right && left !== right) return left + " " + right;
  return left || right;
}

function buildRouteLabel(arrival) {
  try {
    var name = (arrival && arrival.routeName) ? routeDisplayName(arrival.routeName()) : "";
    var num = (arrival && arrival.routeNumber) ? trimStr(arrival.routeNumber()) : "";
    return name ? (num ? (name + " (" + num + ")") : name) : "";
  } catch (e) { return ""; }
}

function buildServicePhrase(arrival) {
  try {
    if (!arrival) return "";
    var label = buildRouteLabel(arrival);
    var cars = (arrival.carCount && typeof arrival.carCount === "function") ? arrival.carCount() : 0;
    var carsText = (cars > 0) ? (cars + " carriage" + (cars === 1 ? "" : "s")) : "unknown number of carriages";
    var prefix = label ? (label + " service ") : "A service ";
    return prefix + "formed of " + carsText + ".";
  } catch (e) { return ""; }
}

function estimateStatusWidthPx(label) {
  label = toJsStr(label);
  if (!label) return 0;

  var u = measureUnits(label);

  var byUnits = (u * STATUS_UNIT_PX * STATUS_SCALE) + STATUS_PAD_PX;
  var byChars = (label.length * STATUS_CHAR_FALLBACK_PX * STATUS_SCALE) + STATUS_PAD_PX;

  if (label === "Arrived") {
    byChars -= (6 * STATUS_SCALE);
  }

  return Math.max(byUnits, byChars);
}

function drawDestinationFit(ctx, pids, yy, destText, statusLabel) {
  destText = toJsStr(destText);
  statusLabel = toJsStr(statusLabel);

  var isCJK = hasCJK(destText);
  var gapPx = isCJK ? DEST_GAP_PX_CJK : DEST_GAP_PX_LATIN;
  var yOff = isCJK ? DEST_Y_OFFSET_CJK : DEST_Y_OFFSET_LATIN;

  function shrinkYComp(rawShrink) {
    if (rawShrink >= 0.999) return 0;
    return (1.0 - rawShrink) * 4.0;
  }

  var statusW = estimateStatusWidthPx(statusLabel) + (isCJK ? STATUS_EXTRA_PAD_CJK : 0);
  var rightEdge = pids.width - RIGHT_PAD - statusW - gapPx;
  var boxW = rightEdge - DEST_X;

  if (boxW < 18) boxW = 18;

  var boxUnitsAtBase = boxW / (EST_UNIT_PX * DEST_SCALE);
  var needUnits = measureUnits(destText);

  if (needUnits <= boxUnitsAtBase) {
    Text.create("dest")
      .text(destText)
      .pos(DEST_X, yy + yOff)
      .scale(DEST_SCALE)
      .color(AMBER)
      .draw(ctx);
    return;
  }

  var rawShrink = boxUnitsAtBase / needUnits;

  var SHRINK_PREFER_THRESHOLD = 0.86;

  if (rawShrink >= SHRINK_PREFER_THRESHOLD) {
    // tiny shrink only
    Text.create("dest")
      .text(destText)
      .pos(DEST_X, yy + yOff + shrinkYComp(rawShrink))
      .scale(DEST_SCALE * rawShrink)
      .color(AMBER)
      .draw(ctx);
    return;
  }

  if (rawShrink >= DEST_MIN_SHRINK) {
    Text.create("dest")
      .text(destText)
      .pos(DEST_X, yy + yOff + shrinkYComp(rawShrink))
      .scale(DEST_SCALE * rawShrink)
      .color(AMBER)
      .draw(ctx);
    return;
  }

  var minScale = DEST_SCALE * DEST_MIN_SHRINK;
  var boxUnitsAtMin = boxW / (EST_UNIT_PX * minScale);
  var clipped = truncToUnits(destText, boxUnitsAtMin);

  Text.create("dest")
    .text(clipped)
    .pos(DEST_X, yy + yOff + shrinkYComp(DEST_MIN_SHRINK))
    .scale(minScale)
    .color(AMBER)
    .draw(ctx);
}

function drawRow(ctx, pids, y, timeText, destText, statusText) {
  var yy = y + VERTICAL_OFFSET;

  Text.create("time")
    .text(toJsStr(timeText))
    .pos(LEFT_PAD, yy)
    .scale(TIME_SCALE)
    .color(AMBER)
    .draw(ctx);

  Text.create("status")
    .text(toJsStr(statusText))
    .pos(pids.width - RIGHT_PAD, yy)
    .rightAlign()
    .scale(STATUS_SCALE)
    .color(AMBER)
    .draw(ctx);

  drawDestinationFit(ctx, pids, yy, destText, statusText);
}

function create(ctx, state, pids) {}

function render(ctx, state, pids) {
  Texture.create("Background")
    .texture("jsblock:textures/black.png")
    .size(pids.width, pids.height)
    .draw(ctx);

  var raw0 = pids.arrivals().get(0);
  var raw1 = pids.arrivals().get(1);
  var raw2 = pids.arrivals().get(2);

  var a0 = raw0, a1 = raw1, s0 = null;
  if (a0) {
    s0 = statusFor(a0.arrivalTime() - nowMs());
    if (s0.hide) {
      a0 = raw1;
      a1 = raw2;
      s0 = a0 ? statusFor(a0.arrivalTime() - nowMs()) : null;
    }
  }

  // row 1 (soonest departure)
  if (a0) {
    var hhmm0 = fmtHHMM(a0.arrivalTime());
    var d0flip = cycleLang(a0.destination());
    var stat0 = s0 ? s0.label : "";

    drawRow(ctx, pids, 11, hhmm0, d0flip, stat0);

    var cps = callingPointsList(pids, a0);
    if (cps.length > 0) {
      var cpsList = cps.join(", ");
      var servicePhrase = buildServicePhrase(a0);
      var cpsCore = "Calling at: " + cpsList + BULLET + servicePhrase;

      var vis = marqueeUnits(cpsCore, CPS_WIDTH_UNITS, CPS_UNITS_PER_SEC);
      Text.create("cps0")
        .text(vis)
        .pos(LEFT_PAD, 12 + ROW_H - 4 + VERTICAL_OFFSET)
        .scale(1.0)
        .color(AMBER_DIM)
        .draw(ctx);
    }
  } else {
    var rawName = toJsStr(pids.station().getName());
    var parts = rawName.split("|");
    var nameCJK = trimStr(parts[0] || "");
    var nameEN = trimStr(parts.length > 1 ? parts[parts.length - 1] : (parts[0] || ""));

    var showCJK = ((Math.floor(nowMs() / 5000) % 2) === 0);

    var line1 = showCJK ? ("歡迎來到" + (nameCJK || nameEN) + "。") : ("Welcome to " + (nameEN || nameCJK) + ".");
    var line2 = showCJK ? "本月台暫無列車服務。" : "No services scheduled from this platform.";

    var baseY = 14 + VERTICAL_OFFSET;

    Text.create("welcome_line1")
      .text(line1)
      .pos(pids.width / 2, baseY)
      .centerAlign()
      .scale(0.70)
      .color(AMBER)
      .draw(ctx);

    Text.create("welcome_line2")
      .text(line2)
      .pos(pids.width / 2, baseY + ROW_H - 0.5)
      .centerAlign()
      .scale(0.62)
      .color(AMBER_DIM)
      .draw(ctx);
  }

  // row 2 (following departure)
  if (a1) {
    var hhmm1 = fmtHHMM(a1.arrivalTime());
    var d1flip = cycleLang(a1.destination());
    var stat1 = statusFor(a1.arrivalTime() - nowMs()).label;

    drawRow(ctx, pids, 12 + ROW_H + 8, hhmm1, d1flip, stat1);
  }

  Text.create("clock")
    .text(fmtClock())
    .pos(pids.width / 2, pids.height - 10 + VERTICAL_OFFSET)
    .scale(1.0)
    .color(AMBER)
    .centerAlign()
    .draw(ctx);
}

function dispose(ctx, state, pids) {}