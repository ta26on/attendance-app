function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSpreadsheet()
{
    return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
}

function getSheetByName(ss, name)

{
    return ss.getSheetByName(name);
}

function doGet(e)
{
    var page = 'entry';
    if (e.parameter['member'] != ''){ page = 'member';}
    Logger.log(e);
    return HtmlService.createTemplateFromFile(page).evaluate();
}

function test_getMember()
{
  getMember(0);
}
                       

function getMember(n)
{
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    var sheet = ss.getSheetByName('鳴り物');   
    var range = sheet.getRange('A7:A37');
    var num_rows = range.getNumRows();
    
    var members = [];
    
    for ( var i =0; i < num_rows; ++i )
    {
        name = range.getValues()[i][0];
        if (name == ''){ continue; }
        members.push({ name: name, row: (range.getRowIndex() + i) });
    }
  
    var entries = [];
    
    var entries_range = sheet.getRange('D2:K4');
    var entries_num = entries_range.getNumColumns();
    for ( var i = 0; i < entries_num; ++i )
    {
        var entry = {};
        entry['name'] = entries_range.getValues()[2][i];
        entry['column'] = entries_range.getColumn() + i;
        entry['date'] = entries_range.getValues()[0][i]
        entries.push(entry);
    }
    
    var target_member = members[n];

    target_member['attendances'] = [];
    entries.forEach(function(entry){
        var r = target_member['row'];
        var c = entry['column'];      
        target_member['attendances'].push({ entry_name: entry['name'], entry_date: entry['date'], response: sheet.getRange(r,c).getValue()});
    });  
    
    return target_member;
}

function getAllEntries()
{
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    var sheet = ss.getSheetByName('鳴り物');         
    var entries =[];
    
    var entries_range = sheet.getRange('D2:K4');
    var entries_num = entries_range.getNumColumns();
    for ( var i = 0; i < entries_num; ++i )
    {
        var entry = {};
        entry['name'] = entries_range.getValues()[2][i];
        entry['column'] = entries_range.getColumn() + i;
        entry['date'] = entries_range.getValues()[0][i]
        entries.push(entry);
    }

    return entries;    
}

function getEntry(n)
{  
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    var sheet = ss.getSheetByName('鳴り物');
    var range = sheet.getRange('A7:A37');
    var num_rows = range.getNumRows();
    
    var members = [];
    
    for ( var i =0; i < num_rows; ++i )
    {
        member = {};
        name = range.getValues()[i][0];
        if (name == ''){ continue; }
        member['name'] = name;
        member['row'] = range.getRowIndex() + i; 
        members.push(member);
    }
        
    var entries =[];
    
    var entries_range = sheet.getRange('D2:K4');
    var entries_num = entries_range.getNumColumns();
    for ( var i = 0; i < entries_num; ++i )
    {
        var entry = {};
        entry['name'] = entries_range.getValues()[2][i];
        entry['column'] = entries_range.getColumn() + i;
        entry['date'] = entries_range.getValues()[0][i]
        entries.push(entry);
    }
    
    members.forEach(function(member){
        member['attendances'] = [];
        entries.forEach(function(entry){
            var r = member['row'];
            var c = entry['column'];      
            member['attendances'].push({ entry_name: entry['name'], entry_date: entry['date'], response: sheet.getRange(r,c).getValue()});
        });  
    });
 
    var entry = entries[n];
    entry.members = [];
    members.forEach(function(member){
        var member_name = member['name'];
        var member_response;
        
        member['attendances'].forEach(function(attendance){
            if ( attendance['entry_name'] == entry['name'] )             
            {    
                member_response = attendance['response'];                      
            }
        });            
        entry.members.push({name: member_name, response: member_response } );
    }); 
    return entry;
}