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
    if (e.parameter != undefined && e.parameter.page != undefined){ page = e.parameter.page; }
 //   Logger.log(e);
  
  var temp = HtmlService.createTemplateFromFile(page);
  if (e.parameter != undefined && e.parameter.page == 'member' && e.parameter.name != undefined){
    temp.data = e.parameter.name;
  }
    return temp.evaluate()
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function test_getMember()
{
  getMember(0);
}

function getMemberByName(member_name)
{
  Logger.log('getMemberByName(' + member_name + ')');
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    var sheet = ss.getSheetByName(PropertiesService.getScriptProperties().getProperty('SHEET_NAME'));   
    var range = sheet.getRange(PropertiesService.getScriptProperties().getProperty('MEMBER_RANGE'));
    var num_rows = range.getNumRows();
    
    var members = [];
    
    for ( var i =0; i < num_rows; ++i )
    {
        name = range.getValues()[i][0];
        if (name == ''){ continue; }
        members.push({ name: name, row: (range.getRowIndex() + i) });
    }
  
    var entries = [];
    
    var entries_range = sheet.getRange(PropertiesService.getScriptProperties().getProperty('ENTRY_RANGE'));
    var entries_num = entries_range.getNumColumns();
    for ( var i = 0; i < entries_num; ++i )
    {
        var entry = {};
        entry['name'] = entries_range.getValues()[2][i];
        entry['column'] = entries_range.getColumn() + i;
        entry['date'] = entries_range.getValues()[0][i]
        entries.push(entry);
    }
    
    var target_member;  
    for (var i=0; i<members.length; ++i)
    {
      if (members[i]['name'] === member_name)
      {
        target_member = members[i];
        break;
      }
    }

    target_member['attendances'] = [];
    entries.forEach(function(entry){
        var r = target_member['row'];
        var c = entry['column'];      
        target_member['attendances'].push({ entry_name: entry['name'], entry_date: entry['date'], response: sheet.getRange(r,c).getValue()});
    });  
    
    return target_member;
}
                       
function getMember(n)
{
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    var sheet = ss.getSheetByName(PropertiesService.getScriptProperties().getProperty('SHEET_NAME'));   
    var range = sheet.getRange(PropertiesService.getScriptProperties().getProperty('MEMBER_RANGE'));
    var num_rows = range.getNumRows();
    
    var members = [];
    
    for ( var i =0; i < num_rows; ++i )
    {
        name = range.getValues()[i][0];
        if (name == ''){ continue; }
        members.push({ name: name, row: (range.getRowIndex() + i) });
    }
  
    var entries = [];
    
    var entries_range = sheet.getRange(PropertiesService.getScriptProperties().getProperty('ENTRY_RANGE'));
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
    var sheet = ss.getSheetByName(PropertiesService.getScriptProperties().getProperty('SHEET_NAME'));   
    var entries =[];
    
    var entries_range = sheet.getRange(PropertiesService.getScriptProperties().getProperty('ENTRY_RANGE'));
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
    var sheet = ss.getSheetByName(PropertiesService.getScriptProperties().getProperty('SHEET_NAME'));
    var range = sheet.getRange(PropertiesService.getScriptProperties().getProperty('MEMBER_RANGE'));
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
    
    var entries_range = sheet.getRange(PropertiesService.getScriptProperties().getProperty('ENTRY_RANGE'));
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
            if ( attendance['entry_date'] == entry['date'] &&  attendance['entry_name'] == entry['name'])             
            {    
                member_response = attendance['response'];                      
            }
        });            
        entry.members.push({name: member_name, response: member_response } );
    }); 

    // sort して返す
    entry.members.sort(function(a,b){
      if (a['response'] < b['response'] ){ return 1; }
      if (a['response'] == b['response'] ){ return 0; }
      return -1;
    });
   
    // URL を渡す
    entry['url'] = ScriptApp.getService().getUrl(); 

    return entry;
}