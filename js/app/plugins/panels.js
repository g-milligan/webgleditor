var workspacePanels=(function(){
  return{
    init:function(args){
      var retInit={status:'ok'}; var self=this;
      var getArg=function(name,defaultVal){
          var ret;if(args.hasOwnProperty(name)){ ret=args[name]; retInit[name]=ret; }
          else{ ret=defaultVal; } return ret;
      };
      var getArgEl=function(selType,parent){
        var sel=getArg(selType); var el;
        if(sel!=undefined){
          if(parent==undefined){ el=jQuery(sel); }
          else{ el=parent.find(sel); }
          if(el.length>0){ retInit[selType+'_el']=el; }
        } return el;
      };
      var wrapEl=getArgEl('wrap');
      if(wrapEl!=undefined && wrapEl.length>0){
        wrapEl.addClass('init_panels');
        wrapEl.attr('data-panels', jQuery('.init_panels').length+'');
        var panels=getArgEl('panels',wrapEl);
        if(panels.length>0){
          panels.each(function(p){
            jQuery(this).attr('data-panel', (p+1)+'');
          });
          var panels_type=getArg('panels_type','columns');
          switch(panels_type){
            case 'columns': panels.addClass('panel_column');

              break;
            case 'rows': panels.addClass('panel_row');
              
              break;
          }




        }
      }else{ retInit['status']='error, wrap element not found'; }
      return retInit;
    }
  };
}());
