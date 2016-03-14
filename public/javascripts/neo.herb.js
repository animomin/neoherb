var neoPost, neoModals;
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

var pharmNotice = null;

function neoMenu_p(m){
  var nm = sidemenu;
  var elm_sidemenu = $('#side-menu');

  // Set Event Listener
  function setEventListener(id){
    //TODO
  }

  // Set Side Menu Active
  function setSideMenuActive(){
    if( elm_sidemenu.length > 0 ){
      elm_sidemenu.children().eq(sidemenu.main).addClass('active');
      elm_sidemenu.children().eq(sidemenu.main).children().eq(sidemenu.sub).addClass('active');
    }
  }

  // NeoSoftBank News
  function getNews_(){
    var list = $('ul#notice-neo-list');
    var cntnt = $('div#notice-neo-contents');
    var options ={}; // No rquire any options

    list.empty();
    cntnt.empty();

    $.getJSON('/master/notice/list', options, OnLayOut);

    function OnLayOut(json){
      var status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "") || json.status;
      var message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "") || json.message;
      var dataCount = json.dataTotalCount;
      if(status === 200 && dataCount > 0){
        OnLayOut_(json.jsData);
        list.children().first().tab('show');
        cntnt.children().first().addClass('in active');
      }else{
        if(status === 500 && message === "NODATA"){
          OnLayOut_(null);
        }else{
          neoForms.notice.error(message);
        }
      }
    }

    function OnLayOut_(data){
      if(data === null){
        return list.append(
          '<li class="list-group-item">' +
            '<div class="small m-t-xs>"' +
              '<p class="m-b-xs font-bold"> 공지사항이 없습니다. </p>' +
            '</div>' +
          '</div>'
        );
      }else{
        $.each(data, function(i,v){
          var type =(v.구분 === 0 ? '<span class="label pull-right label-danger">NOTICE</span>' : '<span class="label pull-right label-info">EVENT</span>');
          var li = $('<li>').addClass('list-group-item');
          var a = $('<a>').attr({'data-toggle' : 'tab', 'href' : '#tab-' + i, 'aria-expanded' : 'true'});
          a.append(
            '        <div class="small m-t-xs"> ' +
            '            <p class="m-b-xs ellipsis font-bold">' + v.제목 + ' </h5> ' +
            '            <p class="m-b-none"> ' +
            '                ' + type +
            '                <i class="fa fa-calendar"></i> ' + getDate(v.등록일자,'.') +
            '            </p> ' +
            '        </div> '
          );
          li.append(a).appendTo(list);

          cntnt.append(
            '<div id="tab-'+i+'" class="tab-pane fade"> ' +
            '      <div class="small text-muted"> ' +
            '          <i class="fa fa-clock-o"></i> ' + getDate(v.등록일자,'.') +
            '      </div> ' +
            '      <h1 class="border-bottom"> ' + v.제목 + '</h1><br>' + v.내용
          );

        });
        //list.children().first().tab('show');
      }
    }
  }

  // Pharm Notice
  function getPharmNotice_(){
    var menusLabel = $('a#notice-menu-list');
    var noticeTitle = $('h2#notice-list-title');
    var list = $('tbody#notice-list');
    var options ={
      UserKey : pharm.약업사키,
      Admin : 1
    };

    list.empty();
    menusLabel.find('.label').remove();

    $.getJSON('/master/notice/list',options,OnLayOut);

    function OnLayOut(json){
      var status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "" ) || json.status;
      var message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "" ) || json.message;
      var dataCount = json.dataTotalCount;

      if(status === 200 && dataCount > 0){
        pharmNotice = json.jsData;
        menusLabel.append('<label class="label label-warning pull-right">' + dataCount + '</label>');
        noticeTitle.text('공지사항 리스트('+dataCount+')');
        OnLayOut_(json.jsData);
      }else{
        if(status === 500 && message === "NODATA"){
          OnLayOut_(null);
        }else{
          neoForms.notice.error(message);
        }
      }
    }

    function OnLayOut_(data){
      if(data === null){
        return list.append(
          '<tr class="unread">' +
            '<td colspan="7" class="mail-subject text-center">' +
              '<p class="m-b-xs font-bold"> 공지사항이 없습니다. </p>' +
            '</td>' +
          '</tr>'
        );
      }else{
        $.each(data, function(i,v){
          var tr = $('<tr>').addClass((v.삭제 === 1 ? 'unread' : 'read'));
          var tdcheck = $('<td>').addClass('check-mail').appendTo(tr);
            var check = $('<input>').attr('type','checkbox').addClass('i-checks').appendTo(tdcheck);
            if (v.삭제 === 1) {
              check.attr({'checked' : 'checked', 'disabled' : 'disabled'});
            }
          var tdstatus = $('<td>').addClass('mail-status text-center').appendTo(tr);
            var status = $('<i>').addClass('fa fa-circle').appendTo(tdstatus);
              if(v.공지일수 <= 0) status.addClass('text-default');
              else{
                var sDate = new Date(v.공지일);
                var eDate = new Date(v.공지일);
                    eDate.setDate(eDate.getDate() + v.공지일수);
                var toDay = new Date();
                if(toDay >= sDate && toDay <= eDate) status.addClass('text-navy');
                else   status.addClass('text-default');
              }
          var tdontact = $('<td>').addClass('mail-ontact text-right').appendTo(tr);
            //var type =$((v.구분 === 0 ? '<span class="label label-danger">NOTICE</span>' : '<span class="label label-info">EVENT</span>')).appendTo(tdontact);
            var type = $('<span>').addClass('label')
                                  .addClass((v.삭제 === 1 ? 'label-default' : (v.구분 === 0 ? 'label-danger' : 'label-info')))
                                  .text((v.구분 === 0 ? 'NOTICE' : 'EVENT'))
                                  .appendTo(tdontact);

          var tdsubject = $('<td>').addClass('mail-subject').appendTo(tr);
            var title = $('<a>').addClass('notice-list-item').attr({'href':'/pharm/notice/view', 'notice-index' : i})
                                .html((v.삭제 === 1 ? '<del>' + v.제목 + '</del>' : v.제목)).appendTo(tdsubject);
            title.on('click',notice_list_item_OnClick);
          var tddate = $('<td>').addClass('text-center mail-date').html((v.삭제 === 1 ? '<del>' + getDate(v.작성일,'.') + '</del>' : getDate(v.작성일,'.'))).appendTo(tr);
          var tdsdate = $('<td>').addClass('text-center mail-date').html((v.삭제 === 1 ? '<del>' + getDate(v.공지일,'.') + '</del>' : getDate(v.공지일,'.'))).appendTo(tr);
          var tdedate = $('<td>').addClass('text-center mail-date').html((v.삭제 === 1 ? '<del>' + v.공지일수 + '</del>' : v.공지일수)).appendTo(tr);

          list.append(tr);
        });
        list.find('input').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green'
        });
      }
    }
  }

  // Pharm Notice Item Click
  function notice_list_item_OnClick(event){
    event.preventDefault();
    var item = pharmNotice[$(this).attr('notice-index')];
    if(item !== undefined){
      sessionStorage.removeItem('notice');
      sessionStorage.setItem('notice', JSON.stringify(item));
      var href = $(this).attr('href');
      location.href = href + '/' + pharm.약업사키;
    }
  }

  // Show Pharm's Notice Contents
  function ShowNotice_(){
    var notice = null;
    notice = JSON.parse(sessionStorage.getItem('notice'));
    if(notice !== null && notice !== ""){
      $('h3#notice-title').text(notice.제목);
      $('h5#notice-info').html(
        '<span class="font-normal"><i class="fa fa-calendar"></i> 공지기간: ' + notice.시작일자 + ' - ' + notice.종료일자 + '</span>' +
        '<span class="font-nrmarl pull-right"><i class="fa fa-calendar"></i> 작성일자: ' + notice.등록일자 + '</span>'
      );
      $('div#notice-content').html(notice.내용);
    }
  }

  switch(nm.main){
    case 1 :
      getNews_();
      break;
    case 2 :
      if(nm.sub === 21){
        getPharmNotice_();
      }else if(nm.sub === 22){
        ShowNotice_();
      }else if(nm.sub === 23){
        //TODO
      }
      break;
    default :
      break;
  }

  setEventListener(nm.main);
  setSideMenuActive();

}

function neoMenu_h(m){
  var nm = sidemenu;
  var elm_sidemenu = $('#side-menu');
  var elm_marketInput, elm_marketBtn;


  // Set Side Menu Active
  function setSideMenuActive(){
    if( elm_sidemenu.length > 0 ){
      elm_sidemenu.children().eq(sidemenu.main).addClass('active');
      elm_sidemenu.children().eq(sidemenu.main).children().eq(sidemenu.sub).addClass('active');
    }
  }

  // NeoSoftBank News
  function getNews_(){
    var list = $('ul#notice-neo-list');
    var cntnt = $('div#notice-neo-contents');
    var options ={}; // No rquire any options

    list.empty();
    cntnt.empty();

    $.getJSON('/master/notice/list', options, OnLayOut);

    function OnLayOut(json){
      var status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "") || json.status;
      var message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "") || json.message;
      var dataCount = json.dataTotalCount;
      if(status === 200 && dataCount > 0){
        OnLayOut_(json.jsData);
        list.children().first().tab('show');
        cntnt.children().first().addClass('in active');
      }else{
        if(status === 500 && message === "NODATA"){
          OnLayOut_(null);
        }else{
          neoForms.notice.error(message);
        }
      }
    }

    function OnLayOut_(data){
      if(data === null){
        return list.append(
          '<li class="list-group-item">' +
            '<div class="small m-t-xs>"' +
              '<p class="m-b-xs font-bold"> 공지사항이 없습니다. </p>' +
            '</div>' +
          '</div>'
        );
      }else{
        $.each(data, function(i,v){
          var type =(v.구분 === 0 ? '<span class="label pull-right label-danger">NOTICE</span>' : '<span class="label pull-right label-info">EVENT</span>');
          var li = $('<li>').addClass('list-group-item');
          var a = $('<a>').attr({'data-toggle' : 'tab', 'href' : '#tab-' + i, 'aria-expanded' : 'true'});
          a.append(
            '        <div class="small m-t-xs"> ' +
            '            <p class="m-b-xs ellipsis font-bold">' + v.제목 + ' </h5> ' +
            '            <p class="m-b-none"> ' +
            '                ' + type +
            '                <i class="fa fa-calendar"></i> ' + getDate(v.등록일자,'.') +
            '            </p> ' +
            '        </div> '
          );
          li.append(a).appendTo(list);

          cntnt.append(
            '<div id="tab-'+i+'" class="tab-pane fade"> ' +
            '      <div class="small text-muted"> ' +
            '          <i class="fa fa-clock-o"></i> ' + getDate(v.등록일자,'.') +
            '      </div> ' +
            '      <h1 class="border-bottom"> ' + v.제목 + '</h1><br>' + v.내용
          );

        });
        //list.children().first().tab('show');
      }
    }
  }

  // Sell Product lists
  function getSellProducts(){
    if(elm_marketInput.val() === "") return false;
    // replace master drug lists
    var list = $('ul#market-list');
    var options = {
      SearchKey : elm_marketInput.val().trim()
    };

    list.empty();

    $.getJSON('/hosp/market/product/' + hosp.한의원키, options, OnLayOut);

    function OnLayOut(json){
      var status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "") || json.status;
      var message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "") || json.message;
      var dataCount = json.dataTotalCount;
      if(status === 200 && dataCount > 0){
        OnLayOut_(json.jsData);
      }else{
        if(status === 500 && message === "NODATA"){
          OnLayOut_(null);
        }else{
          //neoForms.notice.error(message); ERROR MESSAGE HERE
        }
      }
    }

    function OnLayOut_(data){
      console.log(data);

      if(data === null){
        return list.append(
          '<li class="list-group-item market-no-result">' +
            '<div class="m-t-xs>"' +
              '<h4 class="m-b-xs font-bold"> 검색결과가 없습니다. </h4>' +
            '</div>' +
          '</div>'
        );
      }else{
        $.each(data, function(i,v){
          var tags = v.본초이명.split(',');
          var taglist = "";
          var tmp = [];
          $.each(tags, function(si, sv){
            if(sv.trim() !== "") {
              if($.inArray(sv, tmp) === -1) {
                //taglist += '<button class="btn btn-xs btn-default"><small><i class="fa fa-tag"></i>' + sv + '</small></button>';
                taglist += '<i class="fa fa-tag"></i>' + sv + '&nbsp; ';
                tmp.push(sv);
              }
            }
          });
          var li = $('<li>').addClass('warning-element market-item animated fadeInUp');
          li.append('<h4 class="m-b-xs font-bold"><span class="pull-right">' + v.단가 + '원</span>' + v.본초상세이름 + ' </h4>');
          li.append(
            '<div class="agile-detail">' +
            ' <a href="#" class="pull-right btn btn-xs btn-primary">장바구니</a>' +
            ' <a href="#" class="pull-right btn btn-xs btn-white">원내장부</a>' +
            ' <i class="fa fa-hospital-o"></i>' + v.약업사이름 + '<br>' +
            taglist +
            '</div>'
          );
          li.appendTo(list);
          li.bind('click', getSameProductsSellers);


        });
      }

    }
  }

  function getSameProductsSellers(){
    console.log($(this));

  }

  switch (nm.main) {
    case 1:
      getNews_();
      break;
    case 3:
      elm_marketBtn = $('button#market-search-btn').bind('click', getSellProducts);
      elm_marketInput = $('input#market-search-input').bind('keypress', function(e){
        if(e.keyCode === 13) return getSellProducts();
      });
      //getSellProducts();
      break;
    default:

  }
  setSideMenuActive();
}

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
    if(type === 1) neoMenu_p(sidemenu);
    else neoMenu_h(sidemenu);
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
