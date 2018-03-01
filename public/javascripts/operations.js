$(function() {
    $('#page2xls').hide();
   
    $("#jsGrid").jsGrid({
        height: "400px",
        width: "100%",
        filtering: true,
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 7,
        pageButtonCount: 5,
        loadIndication: true,
        loadIndicationDelay: 500,
        loadMessage: "Por favor, aguarde...",
        loadShading: true,
        noDataContent: "Sem registros",
        deleteConfirm: "Realmente deseja deletar esta operação?",
        pagerFormat: "Páginas: {first} {prev} {pages} {next} {last}    {pageIndex} de {pageCount}",
        pagePrevText: "Anterior",
        pageNextText: "Próxima",
        pageFirstText: "Primeira",
        pageLastText: "Útima",
        pageNavigatorNextText: "...",
        pageNavigatorPrevText: "...",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "/report/operations",
                    data: filter
                  });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "/report/operations",
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "/report/operations",
                    data: item
                });
            }
        },
        fields: [
            { name: "dtso", title: "Mês. Pedido", type: "text", width: 75 },
            { name: "description",title: "Medidas", type: "text", width: 150 },
            { name: "invoice",title: "Invoice", type: "text", width: 100 },
            { name: "cntr",title: "Conteiner", type: "text", width: 100 },
            { name: "dtinvoice",title: "Data", type: "text", width: 75 },
            { name: "dtdeparture",title: "Saída ", type: "text", width: 75 },
            { name: "dtarrival",title: "Chegada", type: "text", width: 75 },
            { name: "dtdemurrage",title: "Demurrage", type: "text", width: 95 },
            { name: "suppliername",title: "EXPORT", type: "text", width: 200 },
            { name: "customername",title: "Cliente", type: "text", width: 200 },
            { name: "statusname",title: "Status", type: "text", width: 225 },
            { 
                type: "control",
                editButton: false,
                deleteButton: false,
                headerTemplate: function() {
                    return $("<a>").attr("type", "button").text("Excel").addClass("btn btn-success btn-sm").attr('href','/report/exportxls');                       
                }
            }
        ]
    }); 

    $("#jsGrid").jsGrid("option", "height", 600);
  });