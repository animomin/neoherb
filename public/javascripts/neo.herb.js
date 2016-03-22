var neoPost, neoModals;
var objNeoNews = [] ,objNotice = [], objProduct, objSameProduct;
var neoForms = {
  signup : {
    done : function(data){
      var status = (data.jsData[0] !== undefined ? data.jsData[0].Status : "") || data.status;
      var message = (data.jsData[0] !== undefined ? data.jsData[0].Message : "") || data.message;
      swal({
        title : (status === 200 ? "환영합니다!": "서비스신청 실패!"),
        text : message,
        type : (status === 200 ? "success" : "error")
      }, function(){
        if(status === 200)location.href = '/pharm/index/' + data.jsData[0].License;
        else location.href = '/pharm/reg';
      });
    }
  },
  notice : {
    save : function(data){
      //if(data.status !== 200) return th
      swal({
        title : "저장되었습니다!",
        //text : message,
        type : "success"
      }, function(){
        location.href = '/pharm/notice/' + pharm.약업사키;
      });
    },
    error : function(message){
      var text = "";
      if(typeof message === 'object'){
        text = '<h4>' + message.name + '</h4>';
        text += '<h5>' + message.message + '</h5>';
      }else{
          switch (message) {
            case "NODATA":
              text = "공지사항이 없습니다.";
              break;
            default:
              text = message;
              break;
          }
      }

      swal({
        title : "공지사항 오류!",
        text : text,
        type : 'error',
        html: true
      });
    }
  }
};

/* 드롭다운 이벤트는 이곳에 모임. */
function neoDropDown(e){
  var $target = $(e.currentTarget);
  $target.closest('.dropdown-group').find('[data-bind="label"]').text($target.text()).end();
  $(this).addClass('active').siblings().removeClass('active');
}

/* 공지사항 버튼 이벤트 모임 */
function neoNoticeBtns(e){
  var datavalue = $(this).attr('data-value');
  if(datavalue === 'refresh') return neoNotice_Refresh();
  if(datavalue === 'save') return neoNotice_Save();

  /* 새로고침 이벤트 모임 */
  function neoNotice_Refresh(){
    switch(sidemenu.main){
      case 2 :
        if(sidemenu.sub===21){

        }else if(sidemenu.sub===22){

        }else if(sidemenu.sub===23){
          $("#notice-kind-menu>li>a:eq(0), #notice-day-menu>li>a:eq(0)").trigger('click');
          $("#notice-title, #notice-date").val("");
        }
    }
  }

  /* 공지사항 수정,작성 저장 이벤트 */
  function neoNotice_Save(){
    var isValid = true;
    var neoNotice = {
      PharmKey : pharm.약업사키,
      제목 : "",
      내용 : "",
      공지일 : "",
      공지일수 : "",
      구분 : ""
    };
    $.each($('.notice-input-items'),function(i,v){
      var id = $(v).attr('id');
      var type = v.tagName;
      switch (type) {
        case "UL":
          var el = $('li[class="active"]',v);
          if(id === 'notice-kind-menu') neoNotice.구분 = el.find('a').attr('data-value');
          else neoNotice.공지일수 = el.find('a').attr('data-value');
          break;
        case "INPUT":
          if(id === 'notice-title') neoNotice.제목 = $(v).val();
          else if(id === 'notice-date') neoNotice.공지일 = $(v).val();
          break;
        case "TEXTAREA":
          neoNotice.내용 = $(v).val();
          break;
        default:
          break;
      }
    });

    if(neoNotice.제목 === "" || neoNotice.내용 === "") return swal({type: 'error', title : '공지사항 저장 실패', text : '제목과 내용은 필수입력사항입니다.', timer : 2000, showConfirmButton: true});

    if(neoNotice.공지일수 === "0"){
      return swal({
        type : 'error',
        title : '공지사항 저장 실패',
        text : '공지일수를 선택해주세요.',
        timer : 2000
      });
    }

    $.ajax({
      url : '/pharm/notice/write/' + neoNotice.PharmKey,
      method : 'post',
      data : neoNotice,
      //processData : false,
      //contentType : false,
      success : function(result){
        neoForms.notice.save(result);
      }
    });

  }

}

$(document).on('ready', function(){
  if(type !== undefined){
    //if(type === 1) neoMenu_p(sidemenu);
    //else neoMenu_h(sidemenu);

    $(sidemenu).neoNews(sidemenu);
  }
  // 우편번호 팝업
  if($('.neopost').length > 0 ){
    $('.neopost').neoModals('neopost');
  }
  // 우편번호 페이지
  if($('.neopostv2').length > 0){
    neoPost = new neopost($('#input-zip-search'), $('#btn-zip-search'), $('#ziplist'));
  }

  // 폼전송 모음집
  $('form').on('submit', neoSubmit);

  $('.dropdown-menu>li').on('click', neoDropDown);

  $('.notice-btns').on('click', neoNoticeBtns);

  // 서비스 신청 폼 이벤트
  $('.form-control').on('focusout', function(event){
    var i = this;
    var id = $(this).attr('id');
    var v = $(this).val();
    //$(i).popover('destroy');
    switch(id){
      case "pharmID":
        $.ajax({
          url : '/pharm/reg/' + v,
          datatype : 'json',
          success : function(json){
              obj = json.jsData[0];
              if(obj.Status === 500) {
                $('button[type="submit"]').addClass('disabled');
                $(i).addClass('error');
                $(i).parent().find('label').remove();
                $(i).parent().prepend("<label for='"+$(i).attr('name')+"' class='error pull-right'>" + obj.Message + "</span>");
                $(i).focus();
              }else{
                $('button[type="submit"]').removeClass('disabled');
                $(i).removeClass('error').parent().find('label').remove();
              }
          }
        });
        break;
      case "pharmPWD2":
        var p1;
        p1 = $('input[id="pharmPWD"]').val();
        if(p1!==v){
          $('button[type="submit"]').addClass('disabled');
          $(i).addClass('error').focus();
          $(i).parent().find('label').remove();
          $(i).parent().prepend("<label for='"+$(i).attr('name')+"' class='error pull-right'>비밀번호가 일치하지 않습니다.</span>");
        }else{
          $('button[type="submit"]').removeClass('disabled');
          $(i).removeClass('error').parent().find('label').remove();
        }
        break;
    }
  });



});

$(document).on('click','.market-item-btns', function(){
  if($(this).attr('data-bind') !== 'cart') return false;
  var pid = $(this).attr('data-value');
  var k = $(this).attr('data-kind');
  var item =  ( k === 'market-list' ? objProduct[pid] : objSameProduct[pid]);
  $.fn.addToCart(item);

  
});

function neoSubmit(e){
  e.preventDefault();
  //console.log($(this).serialize());
  //if($(this).attr('action') === 'noSubmit') return false;
  var formtype = $(this).attr('form-type');
  var formdata = $(this).serialize();
  $.ajax({
    url : $(this).attr('action'),
    method : $(this).attr('method'),
    data : formdata,
    success : function(data){
      if(neoForms[formtype] !== undefined){
        neoForms[formtype].done(data);
      }
    },
    error : function(err){
      console.log(err);
    }
  });
}

function getDate(d, f){
  if(d === '0000-00-00') return '-';
  if(d.length > 10) d = d.substring(0,10);
  var date = new Date(d);
  var gYear = date.getFullYear();
  var gMonth = date.getMonth() + 1; gMonth = (gMonth < 10 ? "0" : "" ) + gMonth;
  var gDate = date.getDate(); gDate = (gDate < 10 ? "0" : "") + gDate;
  return gYear + f + gMonth + f + gDate;
}
