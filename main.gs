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
  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  var sheet = ss.getSheetByName('鳴り物');
    Logger.log(sheet.getName());

  var range = sheet.getRange('A7:A37');
  var num_rows = range.getNumRows();
  
  members = [];
  
  Logger.log(range.getValue());
  Logger.log(range.getRowIndex());
    Logger.log(range.getRow());

    
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
  Logger.log(entries);
  
  
  members.forEach(function(member){
    member['attendances'] = [];
      entries.forEach(function(entry){
        var r = member['row'];
        var c = entry['column'];      
        member['attendances'].push({ entry_name: entry['name'], entry_date: entry['date'], response: sheet.getRange(r,c).getValue()});
    });  
  });
    
  var content =JSON.stringify(members);
  Logger.log(content);
//  var output = ContentService.createTextOutput(content);
//  output.setMimeType(ContentService.MimeType.JSON);
//  return output;
  
  // 出演ごと
  if ( e.parameter['entry_name'] != '')
  {
    var temp = HtmlService.createTemplateFromFile('entry'); 
    
    entries.forEach( function(entry){
        if (entry['name'] === e.parameter['entry_name']){
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
            temp.data = entry;           
        }
    });       
    Logger.log(temp);
    return temp.evaluate();    
  }
  
  // メンバーごと
  if ( e.parameter['member_name'])
  {
     var temp = HtmlService.createTemplateFromFile('member');  
     members.forEach( function(member){
     if (member['name'] === e.parameter['member_name']){
      temp.data = member;
     }});
     return temp.evaluate(); 
  }  
}