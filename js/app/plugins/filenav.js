var filenav=(function(){
  return{
    addPaths:function(wrap,paths){
      if(wrap!=undefined && wrap.length>0){
        //if filenav not already init
        var filenav=wrap.children('.init_filenav_wrap');
        if(filenav.length<1){
          wrap.append('<div class="init_filenav_wrap"><ul></ul></div>');
          filenav=wrap.children('.init_filenav_wrap');
        }
        var rootUl=filenav.children('ul:first');
        //default path values
        var defaultFileSvg=svg['get']('file');
        var defaultDirSvg=svg['get']('dir');
        //function to add a single path
        var addPath=function(data){
          if(data.hasOwnProperty('path')){
            if(!data.hasOwnProperty('type')){ data['type']='f'; }
            if(!data.hasOwnProperty('svg')){
              if(data['type']==='f'){
                data['svg']=defaultFileSvg;
              }else if(data['type']==='d'){
                data['svg']=defaultDirSvg;
              }
            }
            var path=data['path'];
            var pathArr=path.split('/');





            



          }
        };
        if(!Array.isArray(paths)){
          addPath(paths);
        }else{
          for(var p=0;p<paths.length;p++){ addPath(paths[p]); }
        }
      }
    },
    init:function(args){
      var retInit={status:'ok'}; var self=this;
      var getArg=function(name,defaultVal){
          var ret;if(args.hasOwnProperty(name)){ ret=args[name]; retInit[name]=ret; }
          else{ ret=defaultVal; } return ret;
      };
      var getArgEl=function(selType){
        var sel=getArg(selType); var el;
        if(sel!=undefined){
          el=jQuery(sel); if(el.length>0){ retInit[selType+'_el']=el; }
        } return el;
      };
      var wrapEl=getArgEl('wrap');
      if(wrapEl!=undefined && wrapEl.length>0){
        var paths=getArg('paths');
        self['addPaths'](wrapEl, paths);
      }else{ retInit['status']='error, cannot find wrap element'; }
    }
  };
}());
