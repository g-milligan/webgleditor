var filenav=(function(){
  return{
    getItem:function(ul, path){
      var self=this;
      var names=path.split('/');
      var li=ul.children('li[data-name="'+names[0]+'"]:first');
      if(li.length>0 && names.length>1){
        for(var n=1;n<names.length;n++){
          li=li.children('ul:first').children('li[data-name="'+names[n]+'"]:first');
          if(li.length<1){ break; }
        }
      }
      return li;
    },
    getAncestorItems:function(liItem){
      var ret;
      if(liItem!=undefined && liItem.length>0){
        ret=liItem.parents('li[data-name]');
        ret=jQuery(ret.get().reverse());
      }
      return ret;
    },
    sortItems:function(ul,doRecursive){
      var self=this;
      if(doRecursive==undefined){ doRecursive=false; }
      var sortItemTypes=function(types){
        for(var t=0;t<types.length;t++){
          var type=types[t]; var abcNames=[];
          ul.children('li[data-type="'+type+'"]').each(function(){
            abcNames.push(jQuery(this).attr('data-name'));
          });
          abcNames.sort();
          for(var a=0;a<abcNames.length;a++){
            var li=ul.children('li[data-type="'+type+'"][data-name="'+abcNames[a]+'"]:first');
            ul.append(li);
            if(doRecursive){
              var childUl=li.children('ul:last');
              if(childUl.length>0){
                self['sortItems'](childUl,doRecursive);
              }
            }
          }
        }
      };
      sortItemTypes(['d','f']);
    },
    getNextItem:function(li,prevOrNext,skipClosed){
      if(skipClosed==undefined){ skipClosed=false; }
      var wrap=li.parents('.init_filenav_wrap:first');
      li.addClass('current');
      var lis;
      if(!skipClosed){
        lis=wrap.find('li');
      }else{
        lis=wrap.find('> ul > li, li.open > ul > li');
      }
      lis.each(function(i){
        jQuery(this).attr('data-index',i+'');
      });
      var currentIndex=parseInt(lis.filter('.current').attr('data-index'));
      var nextIndex=currentIndex;
      switch(prevOrNext){
        case 'prev':
          nextIndex--; if(nextIndex<0){ nextIndex=lis.length-1; }
          break;
        case 'next':
          nextIndex++; if(nextIndex>=lis.length){ nextIndex=0; }
          break;
      }
      var liNext=lis.filter('[data-index="'+nextIndex+'"]');
      lis.removeAttr('data-index');
      li.removeClass('current');
      return liNext;
    },
    focusNext:function(wrap,skipClosed){
      if(skipClosed==undefined){ skipClosed=false; }
      var currentLi=wrap.find('li.focus:first');
      if(currentLi.length<1){
        currentLi=wrap.find('li:first');
        this['setFocus'](currentLi);
      }else{
        var li=this['getNextItem'](currentLi,'next',skipClosed);
        this['setFocus'](li);
        if(!skipClosed){ this['openItem'](li,false); }
      }
    },
    focusPrev:function(wrap,skipClosed){
      if(skipClosed==undefined){ skipClosed=false; }
      var currentLi=wrap.find('li.focus:first');
      if(currentLi.length<1){
        currentLi=wrap.find('li:first');
        this['setFocus'](currentLi);
      }else{
        var li=this['getNextItem'](currentLi,'prev',skipClosed);
        this['setFocus'](li);
        if(!skipClosed){ this['openItem'](li,false); }
      }
    },
    clearFocus:function(wrap){
      wrap.removeClass('focus');
      wrap.find('li.focus').removeClass('focus');
    },
    setFocus:function(li){
      var wrap=li.parents('.init_filenav_wrap:first');
      wrap.find('li.focus').removeClass('focus');
      li.addClass('focus');
    },
    openItem:function(li,fireEvent){
      if(fireEvent==undefined){ fireEvent=true; }
      if(!li.hasClass('open')){
        var self=this;
        //if this is a parent dir
        if(li.children('ul:last').length>0){
          li.addClass('open');
        }
        var path=li.attr('data-name');
        li.parents('li').each(function(){
          self['openItem'](jQuery(this),false);
          path=jQuery(this).attr('data-name')+'/'+path;
        });
        if(fireEvent){
          var wrap=li.parents('.init_filenav_wrap:first');
          var parent=wrap.parent();
          if(parent[0]['filenav_data'].hasOwnProperty('onopen')){
            li[0]['filenav_data']['path']=path;
            li[0]['filenav_data']['type']=li.attr('data-type');
            parent[0]['filenav_data']['onopen'](li,li[0]['filenav_data']);
          }
        }
      }
    },
    closeItem:function(li){
      //if this is a parent dir
      if(li.children('ul:last').length>0){
        li.removeClass('open');
        li.find('li.open').removeClass('open');
      }
    },
    toggleItem:function(li){
      if(li.hasClass('open')){
        //if this is a parent dir
        if(li.children('ul:last').length>0){
          this['closeItem'](li);
        }
      }else{
        this['openItem'](li);
      }
    },
    addPaths:function(wrap,paths){
      var self=this;
      if(wrap!=undefined && wrap.length>0){
        //if filenav not already init
        var filenav=wrap.children('.init_filenav_wrap'); var openPaths=[], focusPath;
        if(filenav.length<1){
          wrap.append('<div class="init_filenav_wrap"><ul></ul></div>');
          filenav=wrap.children('.init_filenav_wrap');
          filenav.hover(function(){
            jQuery(this).addClass('focus');
          },function(){
            jQuery(this).removeClass('focus');
          });
          filenav.mouseleave(function(){
            jQuery(this).removeClass('focus');
          });
          jQuery(document).keydown(function(e){
            var focusLis=jQuery('.init_filenav_wrap li.focus');
            if(focusLis.length>0){
              if(focusLis.length>1){ focusLis=focusLis.eq(0); }
              var nav=focusLis.parents('.init_filenav_wrap:first');
              switch(e.keyCode){
                case 38: //key up
                  e.preventDefault(); e.stopPropagation();
                  self['focusPrev'](nav,true);
                  break;
                case 40: //key down
                  e.preventDefault(); e.stopPropagation();
                  self['focusNext'](nav,true);
                  break;
                case 37: //key left
                  e.preventDefault(); e.stopPropagation();
                  self['focusPrev'](nav);
                  break;
                case 39: //key right
                  e.preventDefault(); e.stopPropagation();
                  self['focusNext'](nav);
                  break;
                case 13: //enter key
                  e.preventDefault(); e.stopPropagation();
                  nav.find('li.focus:first').children('.lbl:first').click();
                  break;
                case 27: //escape key
                  e.preventDefault(); e.stopPropagation();
                  self['clearFocus'](nav);
                  break;
              }
            }
          });
          jQuery(document).click(function(e){
            var nav=jQuery('.init_filenav_wrap');
            if(nav.length>0){
              e.preventDefault(); e.stopPropagation();
              nav.each(function(){
                self['clearFocus'](jQuery(this));
              });
            }
          });
        }
        var rootUl=filenav.children('ul:first');
        //default path values
        var defaultFileSvg=svg['get']('file');
        var defaultDirSvg=svg['get']('dir');
        //function to add a single path
        var addPath=function(data){
          var newPathAdded=false;
          if(data.hasOwnProperty('path')){
            if(!data.hasOwnProperty('type')){ data['type']='f'; }
            if(!data.hasOwnProperty('svg')){
              if(data['type']==='f'){
                data['svg']=defaultFileSvg;
              }else if(data['type']==='d'){
                data['svg']=defaultDirSvg;
              }
            }else{ data['svg']=svg['get'](data['svg']); }
            var setToggleopen=function(li){
              var toggle=li.children('span.toggle:first');
              if(toggle.length<1){
                li.prepend('<span class="toggle"></span>');
                toggle=li.children('span.toggle:first');
                toggle.click(function(e){
                  e.preventDefault(); e.stopPropagation();
                  var l=jQuery(this).parents('li:first');
                  self['toggleItem'](l); self['setFocus'](l);
                });
                var otherTriggers=li.children('.ico:first,.lbl:first');
                otherTriggers.each(function(){
                  if(!jQuery(this)[0].hasOwnProperty('init_toggle_open_trigger')
                  || !jQuery(this)[0]['init_toggle_open_trigger']){
                    jQuery(this)[0]['init_toggle_open_trigger']=true;
                    jQuery(this).click(function(e){
                      e.preventDefault(); e.stopPropagation();
                      var l=jQuery(this).parents('li:first');
                      self['toggleItem'](l); self['setFocus'](l);
                    });
                  }
                });
              }else{
                li.prepend(toggle);
              }
            };
            var createDir=function(ul,name,json){
              if(json==undefined){ json={}; }
              if(!json.hasOwnProperty('svg')){ json['svg']=defaultDirSvg; }
              var li=ul.children('li[data-name="'+name+'"][data-type="d"]:first');
              if(li.length<1){
                newPathAdded=true;
                ul.append('<li data-type="d" data-name="'+name+'"><span class="lbl">'+name+'</span></li>');
                li=ul.children('li[data-name="'+name+'"][data-type="d"]:first');
                li[0]['filenav_data']=json;
              }
              var existingIco=li.children('span.ico:first');
              if(existingIco.length<1){
                li.prepend('<span class="ico">'+json['svg']+'</span>');
              }else{
                li.prepend(existingIco);
              }
              setToggleopen(li);
              if(json.hasOwnProperty('open')){
                if(json['open']){ openPaths.push(li); }
              }
              if(json.hasOwnProperty('focus')){
                if(json['focus']){ focusPath=li; }
              }
              return li;
            };
            var createFile=function(ul,name,json){
              if(json==undefined){ json={}; }
              if(!json.hasOwnProperty('svg')){ json['svg']=defaultFileSvg; }
              var li=ul.children('li[data-name="'+name+'"][data-type="f"]:first');
              if(li.length<1){
                newPathAdded=true;
                ul.append('<li data-type="f" data-name="'+name+'"><span class="lbl">'+name+'</span></li>');
                li=ul.children('li[data-name="'+name+'"][data-type="f"]:first');
                li[0]['filenav_data']=json;
              }
              var existingIco=li.children('span.ico:first');
              if(existingIco.length<1){
                li.prepend('<span class="ico">'+json['svg']+'</span>');
              }
              setToggleopen(li);
              if(json.hasOwnProperty('open')){
                if(json['open']){ openPaths.push(li); }
              }
              if(json.hasOwnProperty('focus')){
                if(json['focus']){ focusPath=li; }
              }
              return li;
            };
            var path=data['path'];
            var pathArr=path.split('/');
            var ul=rootUl;
            for(var p=0;p<pathArr.length;p++){
              var file=pathArr[p];
              //if last item in path
              if(p+1===pathArr.length){
                switch(data['type']){
                  case 'f': createFile(ul,file,data); break;
                  case 'd': createDir(ul,file,data); break;
                }
              }else{
                //not last item in the path
                var li=createDir(ul,file);
                var nextUl=li.children('ul:last');
                if(nextUl.length<1){
                  li.append('<ul></ul>');
                  ul=li.children('ul:last');
                }else{ ul=nextUl; }
              }
            }
          } return newPathAdded;
        };
        var newPathAdded=false;
        if(!Array.isArray(paths)){
          newPathAdded=addPath(paths);
        }else{
          for(var p=0;p<paths.length;p++){
            if(addPath(paths[p])){
              newPathAdded=true;
            }
          }
        }
        if(newPathAdded){
          self['sortItems'](rootUl,true);
        }
        //open all of the paths with open:true
        for(var p=0;p<openPaths.length;p++){
          self['openItem'](openPaths[p], true);
        }
        //focus the last path that has focus:true
        if(focusPath!=undefined){
          self['setFocus'](focusPath);
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
        var onopen=getArg('onopen');
        var paths=getArg('paths');
        wrapEl[0]['filenav_data']=retInit;
        self['addPaths'](wrapEl, paths);
      }else{ retInit['status']='error, cannot find wrap element'; }
      return retInit;
    }
  };
}());
