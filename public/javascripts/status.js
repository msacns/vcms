$(function() {

  $.ajax({
    type: "GET",
    url: "/report/pivot/operations",
    dataType: "json",
    contentType: "application/json; charset=UTF-8" 
  }).done(function ( operdata ) {  
    console.log(operdata);
    $("#output").pivotUI(operdata, {
      rows: ["Descrição"],
      cols: ["Fornecedor"],
      aggregatorName: "Count",
      vals: ["status"],
      rendererName: "Table",
      rendererOptions: {
          table: {
              clickCallback: function(e, value, filters, pivotData){
                  var names = [];
                  pivotData.forEachMatchingRecord(filters,
                      function(record){ names.push(record.Name); });
                  alert(names.join("\n"));
              }
          }
      }
    });   
  });
  
   
 });