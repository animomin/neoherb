$(document).on('ready',function(){
  console.log('loaded event javascript');
  window.addEventListener("message", receiveMessage, false);
})
.on('click','.btn-zipcode', function(event){
  event.preventDefault();
  Modal_SearchAdderss();
})
.on('focusout', '.form-control', function(event){
  var i = this;
  var id = $(this).attr('id');
  var v = $(this).val();
  $(i).popover('destroy');
  switch(id){
    case "pharmID":
      $.ajax({
        url : '/pharm/reg/' + v,
        datatype : 'json',
        success : function(json){
            obj = json.jsData[0];
            $(i).popover({
              animation : true,
              content : obj.Message,
              placement : "right",
              delay : {show:100,hide:100}
            }).popover('show').on('shown.bs.popover', function(){
              if(obj.Status === 500) $(i).focus();
            });

        }
      });
      break;
    case "pharmPWD2":
      var p1;
      p1 = $('input[id="pharmPWD"]').val();
      if(p1!==v){
        $(this).popover({
          animation : true,
          content : "비밀번호가 일치하지 않습니다.",
          placement : "bottom",
          delay : {show:100,hide:100}
        }).popover('show').on('shown.bs.popover', function(){$(i).focus();});
      }
      break;
  }
});

function Modal_SearchAdderss(){
  var m = $('<div>').attr('id','zipModal');
  var m_dialog = $('<div>').addClass('modal-dialog');
  var m_content = $('<div>').addClass('modal-content').css('height','800px').appendTo(m_dialog);
  var postPage = $('<iframe>');
  postPage.css({
    'width' : '100%',
    'height' : '100%'
  }).attr('src','http://post.neochart.co.kr?url=test').appendTo(m_content);
  m.addClass('modal fade').attr('role','dialog');
  m.append(m_dialog).appendTo('body');
  m.modal();
}


function receiveMessage(event){
  if(event.origin === "http://post.neochart.co.kr"){
    var zipData = JSON.parse(event.data);
    $('span[id="pharmZipcode"]').text(zipData.zipno);
    $('input[id="pharmAddr1"]').val(zipData.addr);
    $('div#zipModal').modal('toggle');
    $('input[id="pharmAddr2"]').focus();
  }
}
