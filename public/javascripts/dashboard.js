$(function() {    
      moment.locale('pt-BR');  
      var groups = new vis.DataSet();
      $.ajax({
        type: "GET",
        url: "/dashboard/timelinegroups",
        dataType: "json",
        contentType: "application/json; charset=UTF-8" 
      }).done(function ( contrs ) { 
        $.each(contrs, function(index, value) {            
            groups.add({id: value.id, content: value.group});
        }); 
      });
      
      $.ajax({
        type: "GET",
        url: "/dashboard/timeline",
        dataType: "json",
        contentType: "application/json; charset=UTF-8" 
      }).done(function ( data ) {  
        
        // hide the "loading..." message
        document.getElementById('loading').style.display = 'none';
      
        // DOM element where the Timeline will be attached
        var container = document.getElementById('visualization');

        // Create a DataSet (allows two way data-binding)
        var items = new vis.DataSet(data);

        // Configuration for the Timeline
        var options = {
           locales:{
                ctmlocale:{
                    January:'Janeiro',
                    February:'Fevereiro',
                    March: 'Março',
                    April: 'Abril',
                    May:'Maio',
                    June:'Junho',
                    July:'Julho',
                    August:'Agosto',
                    September:'Setembro',
                    October:'Outubro',
                    November:'Novembro',
                    December:'Dezembro',
                    current:'atual',
                    time:'hora'
                }
            },
            locale: 'ctmlocale'
        };
        
        // Create a Timeline
        var timeline = new vis.Timeline(container, items );  
        timeline.setOptions(options);
        timeline.setGroups(groups)
      });    
});