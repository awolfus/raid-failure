$('#failchanceform').change(processRaidForm);
processRaidForm();

function processRaidForm() {
    var type = $('#raidtype option:selected').text();
    var count = parseInt($('#drivecount option:selected').text());
    var size = parseFloat($('#drivesize option:selected').val());
    var ure = parseFloat($('#ureaverage option:selected').val());
    var chance = calculateRaidFailureChance(type, count, size, ure);

    var percent = (chance * 100).toFixed(2);
    $("#resultspan").text(percent.toString() + "%");
}

function calculateRaidFailureChance(type, diskCount, disksizeGB, ure) {
    var successChance = 1 - Math.pow(10, -ure);
    if (type == "RAID 5") {
        return calculateRaid5FailureChance(diskCount, disksizeGB, successChance);
    } else if (type == "RAID 6") {
        return calculateRaid6FailureChance(diskCount, disksizeGB, successChance);
    }
}

function calculateRaid5FailureChance(diskCount, disksizeGB, successChance) {
    var readSize = gigabytesToBits((diskCount - 1) * disksizeGB);
    return Math.pow(successChance, readSize);
}

function calculateRaid6FailureChance(diskCount, disksizeGB, successChance) {
    var chance1 = 1 - calculateRaid5FailureChance(diskCount, disksizeGB, successChance);
    var chance2 = 1 - calculateRaid5FailureChance(diskCount - 2, disksizeGB, successChance);
    return 1 - (chance1 * chance2);
}

function gigabytesToBits(gigs) {
    return gigs * 1000 * 1000 * 1000 * 8;
}
