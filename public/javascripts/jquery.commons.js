function querystring(query){
  this.query = null;
  query += "";
  if(this.query === null && query !== "") this.SetQueryString(query);
}

querystring.prototype = {
  query : null,
  SetQueryString : function(query){
    query = query.replace('?','');
    var tmp = query.split('&');
    for(var i in tmp){
      var subTmp = tmp[i].split("=");
      this.querystring[subTmp[0]] = subTmp[1];
    }
  }
};
/*
function Notice(n,l,t){
  this.notice = n;
  if(l.find("a#notice-neo").length>0){
    this.neoNotice = l.find("a#notice-neo");
  }

  if(l.find("a#notice-pharm").length>0){
    this.pharmNotice = l.find("a#notice-pharm");
  }
}
*/
function Notice( n, p, l, t){
  this.notice = n;
  this.pharmkey = p;
  this.pharmNotice = null;
  this.list = l;
  this.tab = t;
  this.OnLayOut(this.notice);
}

Notice.prototype = {
  notice : null,
  pharmkey : null,
  pharmNotice : null,
  list : null,
  tab : null,

  OnLayOut : function(data){
    var me = this;
    this.list.empty();
    this.tab.empty();

    if(data.dataTotalCount === 0){
      return this.list.append(
        '<li class="list-group-item">' +
          '<div class="small m-t-xs>"' +
            '<p class="m-b-xs font-bold"> 공지사항이 없습니다. </p>' +
          '</div>' +
        '</div>'
      );
    }else{
      $.each(data.jsData, function(i,v){
        var type =(v.구분 === 0 ? '<span class="label pull-right label-warning">NOTICE</span>' : '<span class="label pull-right label-info">EVENT</span>');

        me.list.append(
          '<a class="list-group-item" data-toggle="tab" href="#tab-'+i+'" aria-expanded="true"> ' +
          //'    <a data-toggle="tab" href="#tab-'+i+'" aria-expanded="true"> ' +
          '        <div class="small m-t-xs"> ' +
          '            <p class="m-b-xs ellipsis font-bold">' + v.제목 + ' </h5> ' +
          //'            <p class="m-b-xs ellipsis"> ' +
          //'                ' + v.내용.replace(/<p>/gi,'<p class="m-b-xs ellipsis">') +
          //'            </p> ' +
          '            <p class="m-b-none"> ' +
          '                ' + type +
          '                <i class="fa fa-calendar"></i> ' + getDate(v.등록일자,'.') +
          '            </p> ' +
          '        </div> ' +
          //'    </a> ' +
          '</a> '
        );

        var noticeCntnts = '<div id="tab-'+i+'" class="tab-pane"> ' +
        '      <div class="small text-muted"> ' +
        '          <i class="fa fa-clock-o"></i> ' + getDate(v.등록일자,'.') +
        '      </div> ' +
        '      <h1 class="border-bottom"> ' + v.제목 + '</h1><br>' + v.내용;
        var noticeFiles = "";

        me.tab.append(noticeCntnts + noticeFiles);

      });
      me.list.children().first().tab('show');
    }
  },
  getNeoNews : function(e){
    event.preventDefault();
    $.getJSON('/master/admin/notice',{}, function(json){
      //console.log(json);
      if(json.status === 200){
        neonotice.notice = json;
        neonotice.OnLayOut(json);
      }
    });
  },
  getPharmNotice : function(e){
    event.preventDefault();
    $.getJSON('/master/admin/notice/' + neonotice.pharmkey, {} , function(json){
      if(json.status ===200 || json.message === "NODATA"){
        neonotice.pharmNotice = json;
        neonotice.OnLayOut(json);
      }
    });
  }
};

function getDate(d, f){
  var date = new Date(d);
  var gYear = date.getFullYear();
  var gMonth = date.getMonth() + 1; gMonth = (gMonth < 10 ? "0" : "" ) + gMonth;
  var gDate = date.getDate(); gDate = (gDate < 10 ? "0" : "") + gDate;
  return gYear + f + gMonth + f + gDate;
}
