(function(a){

  var modals_container = null;
  //var modals_kind = "";
  var modals_kind = {};
  //modals_kind.neopost = modal_post;
  function setContainer(){
    modals_container = $(document).find('div.modals-container');
  }

  var modal_post = {
    elem : null,
    url : '/modal/zipcode',
    modal : null,
    iSearch : null,
    bSearch : null,
    postList : null,
    AfterShown : function(){
      var me = modal_post;
      me.iSearch.focus();
    },
    BeforeHide : function(){
      modals_container.empty();
    },
    ShowModal : function(){
      var me = modal_post;
      modals_container.load(me.url, me.SetModal);
    },
    SetModal : function(r,s,x){
      var me = modal_post;
      if(s === 'success'){
        $('.i-checks').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green',
        });
        me.modal = $('#zipcode');
        me.iSearch = $('#input-zip-search');
        me.bSearch = $('#btn-zip-search');
        me.postList = $('#ziplist');
        neoPost = new neopost(me.iSearch, me.bSearch, me.postList);
        //me.neopost.me = me.neopost;
        me.modal.modal().on('shown.bs.modal', me.AfterShown).on('hidden.bs.modal',me.BeforeHide);
      }
    },
    init : function(e){
      var me = this;
      this.elem = e;
      this.elem.each(function(i,v){
        switch (v.tagName.toUpperCase()) {
          case 'INPUT':
            if(v.addEventListener){
              v.addEventListener('focus', me.ShowModal, false);              
            }else{
              v.attachEvent('onfocus', me.ShowModal);
            }
            break;
          case 'BUTTON':
            if(v.addEventListener){
              v.addEventListener('click', me.ShowModal, false);
            }else{
              v.attachEvent('click', me.ShowModal);
            }
            break;
          default:

        }
      });
    }
  };

  function b(t){
      //modals_kind = t;
      setContainer();
      modals_kind.neopost = modal_post;
      modals_kind[t].init(this);
      //this.each(function(i,v){

      //});
  }



  var f = a.fn.neoModals;
  a.fn.neoModals = b;

}(jQuery));
