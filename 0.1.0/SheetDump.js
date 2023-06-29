on("chat:message", function(msg) {
    // Exit if not an api command
    if (msg.type != "api") {
        return;
    }

    if (msg.content.indexOf('!dump') != -1) {
        Dump(msg.playerId);
    }
});


var Dump = function(playerId) {
    var sheets = findObjs({_type: "character"});

    if (sheets.length == 0) {
            sendChat('sheetdump', "No sheets found");
            return;
    }
    
    var headerSheet = sheets[0];
    var headerAttributes = findObjs({
            type: 'attribute',
            characterid: headerSheet.get('_id'),        
    })
    
    var header = '';
    headerAttributes.forEach((attr) => {
        header += attr.get('name') + ',';
    });
    header = header.replace(/,$/, '') + "\n";

    var rows = '';    
    sheets.forEach((sheet) => {
        var attribute = findObjs({
            type: 'attribute',
            characterid: sheet.get('_id'),
        });
        
        var row = '';
        attribute.forEach((attr) => {
            var value = attr.get('current') + '';
            value = value.replace(/,/g, '\\,').replace(/"/g, '\\"');
            row += value + ',';
        });
        
        rows += row.replace(/,$/, '') + "\n";
    });
    
    sendChat('sheetdump', header + rows);            
}
