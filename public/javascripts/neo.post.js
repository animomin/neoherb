function neopost(s, b, l){
  var me = this;
  this.search = s;
  this.searchbtn = b;
  this.list = l;

  if(this.search !==null){
    var down = function(e){me.Search_Post(e);};
    this.search.keydown(down);
  }

  if(this.searchbtn !== null){
    var click = function(e){me.page = 1; me.Search_Post(null, me.search.val());};
    this.searchbtn.click(click);
  }
}

neopost.prototype = {
  search : null,
  searchbtn : null,
  list : null,
  ZIPCODEKEY : 'U01TX0FVVEgyMDE1MDMwNTA5MTc0Mg==',
  ZIPPATH : 'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do',
  page : 1,
  ppc : 30,

  Post_Commons : null,
  Post_Juso : null,

  ClearList : function(){
    this.page = 1;
    this.ppc = 30;
    this.list.empty();
  },

  Search_Post : function(e, wrd){
    var me = this;
    if(e !== null){
      if(e.keyCode !== 13)return false;
      else wrd = this.search.val();
    }
    wrd = $.trim(wrd);
    if(wrd !== ""){
      if(me.page === 1) me.ClearList();
      $.ajax({
        url : me.ZIPPATH,
        type : 'post',
        data : {
          currentPage : me.page,
  				countPerPage : me.ppc,
  				confmKey : me.ZIPCODEKEY,
  				keyword : wrd
        },
        dataType : 'jsonp',
        crossDomain : true,
        success : me.onSearch_Success,
        error : me.onSearch_Error,
        beforeSend : me.onSearch_BeforeSend,
        complete : me.onSearch_Complete
      });
    }
  },

  onSearch_Success : function(xml){
    var me = neoPost;
    var x2js = new X2JS();
    var cjson = x2js.xml_str2json(xml.returnXml);
    me.Post_Commons = cjson.results.common;
    if(me.Post_Commons.totalCount === "1")me.Post_Juso = [cjson.results.juso];
    else me.Post_Juso = cjson.results.juso;
    if(me.Post_Commons.errorCode !== "0"){
      return me.onError();
    }
    SortPostData(me.Post_Juso, function(data){
      return me.OnLayout(data);
    });
  },
  onSearch_Error : function(xhr, status, error){
    console.log("error");
  },
  onSearch_BeforeSend : function(){
    console.log("before");
  },
  onSearch_Complete : function(){
    console.log("complete");
  },
  OnLayout : function(data){

    if($('.btn-zip-more').length > 0)$('.btn-zip-more').remove();

    $.each(data, function(i,v){
      neoPost.list.append(
        '<li class="success-element post-item" data-id="'+i+'"> ' +
        '    '+v.roadAddr+' ' +
        '    <div class="agile-detail"> ' +
        '        <a href="#" class="pull-right btn btn-xs btn-primary btn-zip-item" data-id="'+i+'">선택</a> ' +
        '        '+v.zipNo+' ' +
        '    </div> ' +
        '</li> '
      );
    });

    if(neoPost.Post_Commons.totalCount >= (neoPost.ppc * neoPost.page)){
      neoPost.list.append(
        //'<a href="#" class="btn btn-sm btn-primary btn-block btn-zip-more">더보기('+ np.page +'/'+ Math.ceil((np.Post_Commons.totalCount/np.ppc))+')</a>'
        '<a href="#" class="btn btn-sm btn-primary btn-block btn-zip-more">더보기('+ neoPost.page +'/'+ Math.ceil((neoPost.Post_Commons.totalCount/neoPost.ppc))+')</a>'
      );
    }

    //neoPost.list.find('.btn-zip-item').click(neoPost.onItem_Click);
    //neoPost.list.find('.btn-zip-more').click(neoPost.onMore_Click);
    $('.btn-zip-item').bind('click', neoPost.onItem_Click);
    $('.btn-zip-more').bind('click', neoPost.onMore_Click);

  },
  onItem_Click : function(e){
    //console.log("item click");
    var zipData = neoPost.Post_Juso[$(this).attr('data-id')];
    console.log(zipData);
    $('span[id="pharmZipcode"]').text(zipData.zipNo);
    $('input[id="pharmZipcode"]').val(zipData.zipNo);
    $('input[id="pharmAddr1"]').val(zipData.roadAddr);
    $('div#zipcode').modal('toggle');
    $('input[id="pharmAddr2"]').focus();
  },
  onMore_Click : function(e){
    //console.log("more click");
    //$(this).remove();
    e.preventDefault();
    $(this).text('더불러오는중...');
    neoPost.page += 1;
    neoPost.Search_Post(null, neoPost.search.val());
  }
};

function SortPostData(obj, callback){
  return callback(obj.sort(function(a, b){
    var x = a.zipNo; var y = b.zipNo;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  }));
}
