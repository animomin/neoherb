(function(a){

  var nm, nav_menu, marketInput, marketBtn, marketSmLst;
  var status, message, dataCount;
  var objNeoNews = [] ,objNotice = [];

  // Set Side Menu Active
  function setSideMenuActive(){
    if( nav_menu.length > 0 ){
      nav_menu.children().eq(nm.main).addClass('active');
      nav_menu.children().eq(nm.main).children().eq(nm.sub).addClass('active');
    }
  }

  // NeoSoftBank News
  function getNeoNews(){
    var list = $('ul#notice-neo-list'); // news list
    var cntnt = $('div#notice-neo-contents'); // news tabs
    var navNews = $('#notice-neo-nav'); // navbar news
    var options = {}; // No require any options

    if(list.length > 0 ){
      list.empty();
      cntnt.empty();
    }
    if(navNews.length > 0) navNews.empty();

    $.getJSON('/master/notice/list', options, getNeoNews_);

    // json data checking
    function getNeoNews_(json){
      status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "") || json.status;
      message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "") || json.message;
      dataCount = json.dataTotalCount;
      if(status === 200 && dataCount > 0){
        objNeoNews = json.jsData;
        SetNeoNews_(json.jsData);
        if(list.length > 0 ) {
          list.children().first().tab('show');
          cntnt.children().first().addClass('in active');
        }
      }else{
        if(status === 500 && message === "NODATA"){
          SetNeoNews_(null);
        }else{
          neoForms.notice.error(message);
        }
      }
    }

    // create html elements
    function SetNeoNews_(data){
      if(data === null){
        if(list.length > 0 ) {
          list.append(
            '<li class="list-group-item">' +
              '<div class="small m-t-xs>"' +
                '<p class="m-b-xs font-bold"> 최신뉴스가 없습니다. </p>' +
              '</div>' +
            '</div>'
          );
        }

        if( navNews.length > 0 ) navNews.append('<li class="list-group-item">최신뉴스가 없습니다.</li>');

      }else{
        $.each(data, function(i,v){
          if( list.length > 0 ){
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
          }

          if(navNews.children() < 3){
            var badge =(v.구분 === 0 ? '<small><span class="badge badge-danger">N</span></small> ' : '<small><span class="badge badge-info">E</span></small> ');
            navNews.append(
              '<li class="list-group-item ellipsis border-bottom-dark">' +
              ' <a href="#" data-value="' + v.인덱스 + '"> ' + badge + v.제목 +
              '   <small class="pull-right">' + getDate(v.등록일자) + '</small>' +
              ' </a>' +
              '</li>'
            );

            if(navNews.children() === 3 && list.length === 0 ) return false;

          }

        });
      }
    }
  }

  // Pharm Notice Manager
  function pharmNoticeManage(){
    var noticeCntLabel = $('a#notice-menu-list');
    var noticelst = $('tbody#notice-list');
    var options = {
      UserKey : pharm.약업사키,
      Admin : 1
    };

    noticelst.empty();
    noticeCntLabel.find('.label').remove();

    $.getJSON('/master/notice/list', options, getPharmNotice_);

    function getPharmNotice_(json){
      status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "" ) || json.status;
      message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "" ) || json.message;
      dataCount = json.dataTotalCount;

      if(status === 200 && dataCount > 0){
        objNotice = json.jsData;
        noticeCntLabel.append('<label class="label label-warning pull-right">' + dataCount + '</label>');
        setPharmNotice_(json.jsData);
      }else{
        if(status === 500 && message === "NODATA"){
          setPharmNotice_(null);
        }else{
          neoForms.notice.error(message);
        }
      }
    }

    function setPharmNotice_(data){
      if(data === null){
        return noticelst.append(
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

          noticelst.append(tr);
        });
        noticelst.find('input').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green'
        });
      }
    }
  }

  // Pharm Notice Item Click
  function notice_list_item_OnClick(event){
    event.preventDefault();
    var item = objNotice[$(this).attr('notice-index')];
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

  var funcs = [];
  funcs[1] = [];
  funcs[1][1] = [];
  funcs[1][1][0] = null;
  funcs[1][2] = [];
  funcs[1][2][21] = pharmNoticeManage;
  funcs[1][2][22] = ShowNotice_;
  //funcs[1][2][23] =

  funcs[2] = [];
  funcs[2][2] = [];
  //funcs[2][3][31] = MargetList;
  //funcs[2][3][32] = CartList;


  function b(t){

      nm = t;
      nav_menu = $('#side-menu');
      setSideMenuActive();
      getNeoNews();

    //  if(typeof funcs[type][nm.main][nm.sub] === 'function') funcs[type][nm.main][nm.sub]();


  }



  //var f = a.fn.neoModals;
  var f = a.fn.neoNews;
  a.fn.neoNews = b;

}(jQuery));
