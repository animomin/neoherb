(function(a){

  var nm, nav_menu, marketInput, marketBtn;
  var status, message, dataCount;


  function b(t){
    console.log(t);
    nm = t;
    nav_menu = $('#side-menu');
    setSideMenuActive();
    getNeoNews();

    //if(typeof funcs[type][nm.main][nm.sub] === 'function') funcs[type][nm.main][nm.sub]();
    if(type === 1){ // 약업사
      if(nm.main === 2){ // 약업사 공지사항관리
        if(nm.sub === 21) pharmNoticeManage();
        if(nm.sub === 22) ShowNotice_();
      }
    }else if(type === 2){ // 한의원
      getPharmNews();
      if(nm.main === 3){ // 한의원 약재장터

        if(nm.sub === 31){ // 한의원 약재장터 메인
          //특가품목 가져오는 부분은 이곳에
          marketBtn = $('button#market-search-btn').bind('click', getSellProducts);
          marketInput = $('input#market-search-input').bind('keypress', function(e){
            if(e.keyCode === 13) return getSellProducts();
          });
        }

        if(nm.sub === 32){ // 한의원 약재장터 장바구니
          $.fn.getCartlst();
        }
      }
    }
  }

  function getSellProducts(){
    if(marketInput.val().trim() === "") return false;
    var list = $('ul#market-list');
    var options = {
      Mode : 0 ,
      SearchKey : marketInput.val().trim()
    };
    list.empty();
    $.getJSON('/hosp/market/product/' + hosp.한의원키, options, function(json){
      getSellProducts_(list, json,0);
    });
  }

  function getSameProducts(){
    var list = $('ul#market-same-list');
    var options = {
      Mode : 1,
      SearchKey : $(this).text().trim(),
      ExceptKey : $(this).attr('data-value')
    };

    list.empty();

    $.getJSON('/hosp/market/product/' + hosp.한의원키, options, function(json){
      getSellProducts_(list, json,1);
    });

  }

  function getSellProducts_(list,json,k){
    status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "") || json.status;
    message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "") || json.message;
    dataCount = json.dataTotalCount;
    if(status === 200 && dataCount > 0){
      if(k === 0) objProduct = json.jsData;
      else objSameProduct = json.jsData;
      setSellProducts_(list, json.jsData);
    }else{
      if(status === 500 && message === "NODATA"){
        setSellProducts_(list, null);
      }else{
        //neoForms.notice.error(message); ERROR MESSAGE HERE
      }
    }
  }

  function setSellProducts_(list, data){
    if(data === null){
      return list.append(
        '<li class="list-group-item market-no-result animated fadeInUp">' +
          '<div class="m-t-xs>"' +
            '<h4 class="m-b-xs font-bold"> 검색결과가 없습니다. </h4>' +
          '</div>' +
        '</div>'
      );
    }else{
      $.each(data, function(i,v){
        var li = $('<li>').addClass('list-group-item market-item animated fadeInUp');
        li.append(
          '<span class="pull-right text-success">' + v.단가 + '원 / ' + v.본초단위 + '</span>' +
          '<a href="#" class="text-success market-item-name" data-value="' + v.약업사키 + '">' + v.본초상세이름 + '</a>' +
          '<div class="small m-t-xs">' +
              '<p class="m-b-none">' + v.본초메모 +
              ' <div class="btn-group pull-right"><a href="#" class=" btn btn-xs btn-primary market-item-btns" data-toggle="tooltip" data-placement="top" title="장바구니에 추가" data-bind="cart" data-value="' + i + '" data-kind = "' + list.attr('id') + '"><i class="fa fa-cart-plus"></i></a>' +
              ' <a href="#" class="btn btn-xs btn-white market-item-btns" data-toggle="tooltip" data-placement="top" title="원내장부에 등록" data-bind="note"><i class="fa fa-edit"></i></a></div>' +
              ' <a href="#" class="text-info font-bold market-item-btns" data-bind="pharminfo" data-value="' + v.약업사키 + '"><i class="fa fa-hospital-o"></i> ' + v.약업사이름 + '</a>' +
              '</p>' +
          '</div>'
        );
        li.appendTo(list);
        if(list.attr('id').trim() === 'market-list'){
          li.find('a.market-item-name').bind('click', getSameProducts);
        }
        li.find('.market-item-btns[data-bind="pharminfo"]')
          .bind('click', getPharmInfo)
          .bind('focusout', function(){
            //console.log($(this).popover());
            $(this).popover('hide');
          });
      });
    }
  }

  function getPharmInfo(){
    var e = $(this);
    var k = e.attr('data-value');
    if(e.attr('data-original-title') === ""){
      e.popover('show');
    }else{
      $.getJSON('/pharm/info/' + k, {} , function(json){
        console.log(json);
        var data = json.jsData[0];
        if (json.datacount > 0 ){
          e.popover ( {
            animation : true,
            container : 'body',
            title : data.약업사이름,
            content : '<h4>' + data.대표자 + '</h4>' +
                      ' <p>' +
                      '   <i class="fa fa-map-marker"></i> (' + data.우편번호 + ') ' + data.기본주소 + ' ' + data.상세주소 + '<br> ' +
                      '   <i class="fa fa-phone-square"></i> ' + data.연락처 +
                      ' </p>',
            html : true,
            placement : "right"

          }).popover('show');
        }
      });
    }
  }


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
                '<p class="m-b-xs font-bold"> 새로운 소식이 없습니다. </p>' +
              '</div>' +
            '</div>'
          );
        }

        if( navNews.length > 0 ) navNews.append('<li class="list-group-item">새로운 소식이 없습니다.</li>');

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

          if(navNews.children().length < 5){
            var badge =(v.구분 === 0 ? '<small><span class="badge badge-danger">N</span></small> ' : '<small><span class="badge badge-info">E</span></small> ');
            navNews.append(
              '<li class="list-group-item ellipsis border-bottom-dark">' +
              ' <a href="#" data-value="' + v.인덱스 + '"> ' + badge + v.제목 +
              '   <small class="pull-right">' + getDate(v.공지일,'.') + '</small>' +
              ' </a>' +
              '</li>'
            );

            if(navNews.children().length === 3 && list.length === 0 ) return false;

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
          var tdontact = $('<td>').addClass('mail-ontact text-center').appendTo(tr);
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
    console.log(notice);
    if(notice !== null && notice !== ""){
      $('h3#notice-title').text(notice.제목);
      $('h5#notice-info').html(
        '<span class="font-normal"><i class="fa fa-calendar"></i> 공지일: ' + notice.공지일 + ' / 공지일수:' + notice.공지일수 + '일간</span>' +
        '<span class="font-nrmarl pull-right"><i class="fa fa-calendar"></i> 작성일자: ' + notice.작성일 + '</span>'
      );
      $('div#notice-content').html(notice.내용);
    }
  }

  // Get Pharm Notice List for Hosp
  function getPharmNews(){
    var navPharmNews = $('#notice-pharm-nav');
    var list = $('ul#pharms');
    var cntnt = $('div#pharmsContents');
    var options = {
      ClientKey : hosp.한의원키
    };

    // make summary table
    $.getJSON('/master/notice/list', {ClientKey : options.ClientKey, UserKey : -1}, getAllNotice_);

    function getAllNotice_(json){
      status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "" ) || json.status;
      message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "" ) || json.message;
      dataCount = json.dataTotalCount;

      if(status === 200 && dataCount > 0){
        setAllNotice_(json.jsData);
      }else{
        if(status === 500 && message === "NODATA"){
          setAllNotice_(null);
        }else{
          // 에러 메세지 박스를 띄워요!
        }
      }
    }

    function setAllNotice_(data){
      if(data === null){
          navPharmNews.append('<li class="list-group-item">새로운 소식이 없습니다.</li>');
      }else{
        navPharmNews.empty();
        $.each(data, function(i, v){
          var badge =(v.구분 === 0 ? '<small><span class="badge badge-danger">N</span></small> ' : '<small><span class="badge badge-info">E</span></small> ');
          navPharmNews.append(
            '<li class="list-group-item ellipsis border-bottom-dark">' +
            ' <a href="/hosp/notice/' + hosp.한의원키 + '?pk=' + v.약업사키 + '&idx=' + v.인덱스 + '" data-value="' + v.인덱스 + '"> ' + badge + v.제목 +
            '   <small class="pull-right">' + getDate(v.공지일,'.') + '</small>' +
            ' </a>' +
            '</li>'
          );

          if(navPharmNews.children().length === 5 ) return false;
        });
      }
    }

    if(list.length === 0) return false;

    list.empty();
    cntnt.empty();
    // make tabe
    $.getJSON('/hosp/pharm/' + hosp.한의원키, {Status : 1}, getPharms_);

    function getPharms_(json){
      status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "" ) || json.status;
      message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "" ) || json.message;
      dataCount = json.dataTotalCount;

      if(status === 200 && dataCount > 0){
        setPharms_(json.jsData);
        if(query.hasOwnProperty('pk')){
          list.find('a[href="#tab-pane-'+query.pk+'"]').trigger('click');
        }
      }else{
        if(status === 500 && message === "NODATA"){
          // 약업사를 등록해줘요~
        }else{
          // 에러 메세지 박스를 띄워요!
        }
      }
    }

    function setPharms_(data){

      $.each(data,function(i,v){
          var li = $('<li>').appendTo(list);
          var a = $('<a>').addClass('notice-pharm-tab').attr({
            'data-toggle' : 'tab',
            'href' : '#tab-pane-' + v.약업사키
          }).html('<i class="fa fa-building"></i> ' + v.약업사이름).appendTo(li);
          var tabpane = $('<div>').addClass('tab-pane').attr('id','tab-pane-' + v.약업사키).appendTo(cntnt);
          a.bind('click', noticeTab_OnClick);
          if(i === 0){
            a.trigger('click');
          }
      });

    }

    function noticeTab_OnClick(){
      var pk = $(this).attr('href').trim().replace('#tab-pane-','');
      var tabpane = $('#tab-pane-' + pk);
      var options = {
        ClientKey : hosp.한의원키,
        UserKey : pk
      };
      tabpane.empty();

      $.getJSON('/master/notice/list', options, getPharmNews_);

      function getPharmNews_(json){
        console.log(json);
        status = (json.jsData[0] !== undefined ? json.jsData[0].Status : "" ) || json.status;
        message = (json.jsData[0] !== undefined ? json.jsData[0].Message : "" ) || json.message;
        dataCount = json.dataTotalCount;

        if(status === 200 && dataCount > 0){
          objNotice = json.jsData;
          setPharmNews_(json.jsData);
        }else{
          if(status === 500 && message === "NODATA"){
            setPharmNews_(null);
          }else{
            // 에러 메세지를 띄워요!
          }
        }
      }

      function setPharmNews_(data){
          var box, avatar, media, body, title, small, type;
          if(data === null){
            tabpane.append('<div class="panel-body"><p class="text-muted font-bold"> 공지사항이 없습니다. </p></div>');
          }else{

            $.each(data, function(i, v){
              box = $('<div>').addClass('social-feed-box animated fadeInUp');
              avatar = $('<div>').addClass('social-avatar').appendTo(box);
              media = $('<div>').addClass('media-body').appendTo(avatar);
              title = $('<h3>').addClass('text-success').appendTo(media);
              type = $('<span>').addClass('label')
                                .addClass((v.구분 === 0 ? 'label-danger' : 'label-info'))
                                .text((v.구분 === 0 ? 'NOTICE' : 'EVENT'))
                                .appendTo(title);
              title.append(' ' + v.제목);
              small = $('<small>').addClass('text-muted').text(v.공지일).appendTo(avatar);
              body = $('<div>').addClass('social-body').appendTo(box);
              body.html(v.내용);
              box.appendTo(tabpane);
            });
          }
      }

    }

  }

  //var f = a.fn.neoModals;
  var f = a.fn.neoNews;
  a.fn.neoNews = b;


}(jQuery));

(function(){

  function addToCart(i){
    var pk = i.약업사키 + i.본초마스터키;
    var cart = sessionStorage.getItem('cart');
    var cartlst;
    if(cart === null){
      cartlst={};
      cartlst[pk] = i;
      cartlst[pk]["본초수량"] = 1;
    }else{
      cartlst = JSON.parse(cart);
      if(cartlst.hasOwnProperty(pk)) cartlst[pk]["본초수량"] += 1;
      else{
        cartlst[pk] = i;
        cartlst[pk]["본초수량"] = 1;
      }
    }
    sessionStorage.setItem('cart', JSON.stringify(cartlst));
    swal({
      title : "약재장터",
      text : "장바구니에 선택하신 약재가 추가되었습니다.",
      type : "success",
      showCancelButton : true,
      cancelButtonText : '계속 쇼핑하기',
      confirmButtonClass : 'btn-success',
      confirmButtonText : '장바구니로 가기'
    },function(isConfirm){
      if(isConfirm){
        //장바구니로 고고싱
        location.href = '/hosp/cart/' + hosp.한의원키;
      }else{
        // Not Do Anything
      }
    });
  }

  var cartLst = null, hisLst = null;
  var cartTitle = null, cartPrice = null;
  var iboxContent, resTable, table, tbody, tr, td, ol, li, a, ic, won, dan;
  var cartCount = 0, cartSumPrice = 0;

  function getCartlst(){

    if(cartLst === null) setCartObj();

    cartLst.find('.ibox-content').remove();
    cartPrice.text("");

    setCartLst();
    setOrderHistory();

    function setCartLst(){
      cartCount = 0;
      cartSumPrice = 0;
      var cart = sessionStorage.getItem('cart');
      if(cart === null){
        //장바구니에 추가된 상품이 없습니다.
      }else{
        cart = JSON.parse(cart);

        $.each(cart, function(i,v){
          cartCount += 1;
          cartSumPrice += (v.단가 * v.본초수량);
          iboxContent = $('<div>').addClass('ibox-content');
          resTable = $('<div>').addClass('table-responsive').appendTo(iboxContent);
          table = $('<table>').addClass('table shoping-cart-table').appendTo(resTable);
          tbody = $('<tbody>').appendTo(table);
          tr = $('<tr>').appendTo(tbody);
          td = $('<td>').addClass('desc').appendTo(tr);
          td.append('<h3>' + v.본초상세이름 + '</h3>');
          ol = $('<ol>').addClass('breadcrumb').appendTo(td);
          li = $('<li>').addClass('text-info font-bold').appendTo(ol);
          a = $('<a>').appendTo(li);
          a.append('<i class="fa fa-building"></i> ' + v.약업사이름);
          li = $('<li>').addClass('text-danger font-bold').appendTo(ol);
          a = $('<a>').appendTo(li);
          a.append('<i class="fa fa-trash"></i> 삭제');

          won = $('<h4>').text(v.단가 + '원');
          dan = $('<h4 class="cart-danprice">').attr({'id' : i, 'data-value' : (v.단가 * v.본초수량)}).text((v.단가 * v.본초수량) + '원');

          $('<td>').css('width', '80px').append(won).appendTo(tr);
          td = $('<td>').css('width', '80px').appendTo(tr);
          $('<input>').addClass('form-control cart-product-count')
                      .attr({
                        'type' : 'number',
                        'data-bind' : i,
                        'data-value' : v.단가
                      }).val(v.본초수량).appendTo(td)
                      .bind('keyup mouseup' , function(){
                        var k = $(this).attr('data-bind');
                        var w = $(this).attr('data-value');
                        var v = $(this).val();
                        if(v==="0" || v === "") return $(this).val(1);
                        var e = $('h4#' + k);
                        var t = e.parent();
                        var n = e.clone(true);
                        var c = sessionStorage.getItem('cart');
                          c = JSON.parse(c);
                          c[k]["본초수량"] = v;
                          sessionStorage.setItem('cart',JSON.stringify(c));
                          e.remove();
                          n.text((w * v) + '원').attr('data-value', (w * v)).addClass('animated fadeIn');
                          n.appendTo(t);
                          setCartSumPrice();
                      });
          $('<td>').css('width', '80px').append(dan).appendTo(tr);
          iboxContent.appendTo(cartLst);
        });

      }

      cartTitle.append('<span class="pull-right">(<strong>' + cartCount + '</strong>)개 품목</span>');
      cartPrice.attr('data-value', cartSumPrice);
      cartPrice.text(cartSumPrice + '원');
    }

    function setCartSumPrice(){
      cartSumPrice = 0;
      $.each($('h4.cart-danprice'), function(i,v){
        cartSumPrice += $(this).attr('data-value')*1;
      });
      cartPrice.attr('data-value', cartSumPrice);
      return cartPrice.text(cartSumPrice + '원');
    }

    function setOrderHistory(){
      hisLst.empty();
      $.getJSON('/hosp/market/history/' + hosp.한의원키,{}, function(json){
        console.log(json);
        if(json.message === 'NODATA'){
          hisLst.append('<tr><td colspan="3" class="text-center text-muted font-bold">구매내역이 없습니다.</td></tr>');
        }else{
          $.each(json.jsData, function(i, v){
            tr = $('<tr>').appendTo(hisLst);
            $('<td>').text(getDate(v.주문일자,'.')).appendTo(tr);
            $('<td>').attr({
              'data-toggle' : 'tooltip',
              'data-placement' : 'top',
              'title' : v.주문이름
            }).text(v.주문이름).appendTo(tr);
            $('<td>').addClass('text-right text-danger').text(v.주문총액 + '원').appendTo(tr);
            $('<td>').append('<a class="btn btn-xs btn-warning" data-toggle="tooltip" data-placement="bottom" title="동일한 품목으로 구매요청합니다.">재주문</a>').appendTo(tr);
          });
        }
      });
    }

  }

  function setCartObj(){
    cartLst = $('div#cart-list');
    cartTitle = cartLst.find('.ibox-title');
    cartPrice = $('h2#cart-price');
    hisLst = $('tbody#cart-history');
  }

  function sendCartlst(){
    var cart = sessionStorage.getItem('cart');
    if(cart === null) return swal({
      title : "약재장터",
      text : "장바구니에 물품을 추가해주세요.",
      type : "warning"
    });

    var objCart = JSON.parse(cart);
    var orderTitle = objCart[Object.keys(objCart)[0]].본초상세이름;
    if(Object.keys(objCart).length > 1) orderTitle += " 외 " + (Object.keys(objCart).length - 1) + "개 품목";

    var deliveryInfo = $('div#delivery-info');
    var order = {
      한의원키 : hosp.한의원키,
      한의원이름 : hosp.한의원이름,
      한의사 : hosp.한의사,
      주문상태 : 1,
      주문총액 : cartPrice.attr('data-value'),
      주문이름 : orderTitle,
      주문물품 : cart,
      주문자 : hosp.한의사,
      받는사람 : hosp.한의사,       
      배송지우편번호 : $('#pharmZipcode').val(),
      배송지기본주소 : $('#pharmAddr1').val(),
      배송지상세주소 : $('#pharmAddr2').val(),
      배송지연락처 : $('#tel').val(),
      배송메모 : $('#memo').val()
    };


    $.ajax({
      url : '/hosp/market/order/' + hosp.한의원키,
      method : 'post',
      data : order,
      success : function(data){
        console.log(data);
        if(data.status === 200){
          sessionStorage.removeItem('cart');
          swal({
            title : "약재장터",
            text : "구매신청이 완료되었습니다.",
            type : "success"
          },function(isConfirm){
            location.reload();
          });
        }else{

        }
      }
    });


  }

  $.fn.addToCart = addToCart;
  $.fn.getCartlst = getCartlst;
  $.fn.sendCartlst = sendCartlst;

}(jQuery));
