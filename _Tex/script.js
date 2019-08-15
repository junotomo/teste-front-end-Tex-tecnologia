$(document).ready(function () {
  function editar(){
    var vendido = $(".custom-control-input").is(":checked") ? true : false;
    var ano =parseInt($(".inputAno").val());
    var marca = $(".inputMarca").val();
    var modelo = $(".inputModelo").val();
    var descricao =$(".textDescricao").val();
    var id = $(".inputId").val();
    $.ajax({url: "https://api.nimble.com.br/veiculoQL/v1/gql",
                     contentType: "application/json",
                     type:'POST',
                     data: JSON.stringify({ query:`mutation UpdateVeiculo($data: VeiculoInput!, $id: ID!) {
                                                    updateVeiculo(data: $data, id: $id)
                                                  }`,
                        variables:{
                          "data": {
                            "marca": marca,
                            "modelo": modelo,
                            "descricao": descricao,
                            "ano_fabricacao": ano,
                            "vendido": vendido
                        },
                        "id":id
                      }
                     }),
                     success: function(result) {
                       console.log(result);
                       }
          });
  }
  function adicionarVeiculo(){
    var vendido = $(".custom-control-input").is(":checked") ? true : false;
    var ano =parseInt($(".inputAno").val());
    var marca = $(".inputMarca").val();
    var modelo = $(".inputModelo").val();
    var descricao =$(".textDescricao").val();
    $.ajax({url: "https://api.nimble.com.br/veiculoQL/v1/gql",
                     contentType: "application/json",
                     type:'POST',
                     data: JSON.stringify({ query:`mutation CreateVeiculo($data: VeiculoInput!) {
                                createVeiculo(data: $data)
                              }`,
                        variables:{
                          "data": {
                            "marca": marca,
                            "modelo": modelo,
                            "descricao": descricao,
                            "ano_fabricacao": ano,
                            "vendido": vendido
                        }
                      }
                     }),
                     success: function(result) {
                       console.log(result);
                       }
          });
  }
  function pesquisar(){
    var keyword = $("#pesquisaVeiculo").val()
    if (keyword =="") {
      keyword = "FIAT";
    }
    $.ajax({url: "https://api.nimble.com.br/veiculoQL/v1/gql",
                     contentType: "application/json",
                     type:'POST',
                     data: JSON.stringify
                     ({ query:`{
                                buscaVeiculo(query: "`+keyword+`") {
                                  edges {
                                    node {
                                      _id
                                      marca
                                      modelo
                                      descricao
                                      ano_fabricacao
                                      vendido
                                    }
                                  }
                                }
                              }`
                     }),
                     success: function(result) {
                       $(".veiculos").find("h5").remove();
                       $(".veiculos").find(".carrosDiv").remove();
                       $(".veiculos").append('<h5>Lista de veículos</h5>')
                       for(var k in result['data']['buscaVeiculo']['edges']) {
                         $(".veiculos").append(
                             '<div class="carrosDiv"><p>'
                             +result['data']['buscaVeiculo']['edges'][k]['node']['marca'] +'</p><p>'+
                             result['data']['buscaVeiculo']['edges'][k]['node']['modelo']+'</p><p>'+
                             result['data']['buscaVeiculo']['edges'][k]['node']['ano_fabricacao']+'</p><img src="icons/tag.svg" alt=""><input type="hidden" class="marca" value="'
                             +result['data']['buscaVeiculo']['edges'][k]['node']['descricao']+'"><input type="hidden" class="id" value="'
                             +result['data']['buscaVeiculo']['edges'][k]['node']['_id']+'"></div>'
                         )
                       }
                     }
          });
  }
//fim da função pesquisar
//atualização da div de detalhes
              $(".veiculos").on("click", ".carrosDiv", function() {
                $(".informacoes").find("#detalhes").remove();
                $(".informacoes").append(
                  '<div id="detalhes"><h5>Detalhes</h5>'+
                  '<h4 class="modeloDetalhe">'+$(this).find("p:nth-of-type(2)").text()+'</h4>'+
                  '<div class="row"><div class="col-6"><h5>Marca</h5><p class="marcaDetalhe">'+$(this).find("p:first-of-type").text()+'</p></div>'+
                  '<div class="col-6"><h5>Ano</h5><p class="anoDetalhe>'+$(this).find("p:last-of-type").text()+'</p></div>'+
                  '<div class="col-6 descricaoDetalhes"><p>'+$(this).find("input").val()+'</p></div>'+
                  '</div>'+
                  '<input type="hidden" class="idDetalhes" value="'+$(this).find(".id").val()+'">'+
                  '<div class="col-12 editarDiv"><button type="button" name="button" class="editar"><img src="icons/edit.svg" alt="">Editar</button>  <img class="svg" src="icons/tag.svg"></div>'+
                  '</div>'
                )
              });
              $(".veiculos").on("mouseover", ".carrosDiv", function() {
                  $(this).find("p").css("color","white");
                  $(this).find("img").css("filter","invert(100%) sepia(100%) saturate(1%) hue-rotate(24deg) brightness(105%) contrast(101%)");
              });
              $(".veiculos").on("mouseout", ".carrosDiv", function() {
                  $(this).find("p:first-of-type").css("color","black");
                  $(this).find("p:nth-of-type(2)").css("color","#7e84b7");
                  $(this).find("p:last-of-type").css("color","#798083");
                  $(this).find("img").css("filter","invert(90%) sepia(9%) saturate(10%) hue-rotate(314deg) brightness(91%) contrast(83%)");
              });
// fim da atualização da div Detalhes
//-----------------------------------------------------botoes------------------------------------------------------------
  pesquisar()
  $( "#pesquisaVeiculo" ).keypress(function( event ) {
    if ( event.which == 13 ) {
      pesquisar()
    }
  });
// botao dentro do formulario de adicionar veiculo
  $( ".adicionarBtn2" ).on("click",function( event ) {
    adicionarVeiculo();
  });
  // botao icone de adicionar  para abri formulario
  $( ".adicionarBtn" ).on("click",function( event ) {
    $(".overlayForm").css("z-index",1);
    $(".overlayForm").css("opacity",1);
    $(".overlayForm").find(".adicionarBtn2").show();
    $(".overlayForm").find(".editarBtn").hide();
  });
  //botao Cancelar
  $( ".btn-danger" ).on("click",function( event ) {
    $(".overlayForm").css("z-index","-1");
    $(".overlayForm").css("opacity",0);
    $('.overlayForm input').val('');
    $('.overlayForm textarea').val('');
  });
  //Botao editar
  $(".informacoes").on("click",".editar",function( event ) {
    var marca=$(".informacoes").find(".marcaDetalhe").text();
    var modelo=$(".informacoes").find(".modeloDetalhe").text();
    var ano=$(".informacoes").find(".anoDetalhe").text();
    var descricao=$(".informacoes").find(".descricaoDetalhes p").text();
    var id= $(".informacoes").find(".idDetalhes").val();
    $(".overlayForm").css("z-index",1);
    $(".overlayForm").css("opacity",1);
    $(".overlayForm").find(".editarBtn").show();
    $(".overlayForm").find(".adicionarBtn2").hide();
    $(".inputMarca").val(marca);
    $(".inputModelo").val(modelo);
    $(".inputAno").val(ano);
    $(".textDescricao").text(descricao);
    $(".inputId").val(id);
  });
  $( ".editarBtn" ).on("click",function( event ) {
    editar();
  });
});
