var navDropdown=(function(){
  return{
      updateHasOpen:function(trueOrFalse){
        if(trueOrFalse==undefined){
          var openLi=jQuery('.init_nav_dropdown li.open');
          if(openLi.length>0){
            document['has_open_nav_dropdown']=true;
          }else{
            document['has_open_nav_dropdown']=false;
          }
        }else{
          document['has_open_nav_dropdown']=trueOrFalse;
        }
      },
      parentClick:function(span,e){
        var li=span.parent(); var self=this;
        if(li!=undefined && li.hasClass('parent')){
          e.preventDefault(); e.stopPropagation();
          var wraps=jQuery('.init_nav_dropdown');
          var isOpen=li.hasClass('open');
          wraps.find('li.open').removeClass('open');
          if(!isOpen){
            li.addClass('open');
            self['updateHasOpen'](true);
          }else{
            self['updateHasOpen']();
          }
        }
      },
      parentHoverOn:function(span){
        var li=span.parent(); var self=this;
        if(li!=undefined && li.hasClass('parent')){
          var wrap=span.parents('.init_nav_dropdown:first');
          if(!li.hasClass('open')){
            var liSibs=li.siblings('.open');
            if(liSibs.length>0){
              liSibs.removeClass('open');
              li.addClass('open');
              self['updateHasOpen'](true);
            }
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
        var topUlEl=getArgEl('top_ul');
        if(topUlEl!=undefined && topUlEl.length>0){
          topUlEl.addClass('init_nav_dropdown');
          var data_ids=getArg('data_ids');
          //iterate over each child li, recursively
          var iterateChildLis=function(ul,lvl){
            var childLis=ul.children('li');
            var lastIndex=childLis.length-1;
            childLis.each(function(i){
              var li=jQuery(this);
              if(i===0){ li.addClass('first'); }
              if(i===lastIndex){ li.addClass('last'); }
              var childUl=li.children('ul');
              if(childUl.length>0){
                li.addClass('parent');
                var span=li.children('span:first');
                span.click(function(e){ self['parentClick'](jQuery(this),e); });
                span.hover(
                  function(e){ self['parentHoverOn'](jQuery(this)); },
                  function(e){ }
                );
                iterateChildLis(childUl,lvl+1);
              }
              var dataId=li.attr('data-id');
              if(dataId){
                if(data_ids!=undefined){
                  if(data_ids.hasOwnProperty(dataId)){
                    data_ids[dataId](li);
                  }
                }
              }
            });
          };
          iterateChildLis(topUlEl,1);

          if(!document.hasOwnProperty('init_nav_dropdown')){
            document['init_nav_dropdown']=true; self['updateHasOpen'](false);
            //close all dropdowns
            var closeDropdowns=function(e){
              if(document['has_open_nav_dropdown']){
                var openLi=jQuery('.init_nav_dropdown li.open');
                if(openLi.length>0){
                  e.preventDefault(); e.stopPropagation();
                  openLi.each(function(){
                    jQuery(this).removeClass('open');
                  });
                  self['updateHasOpen'](false);
                }
              }
            };
            jQuery(document).click(function(e){ closeDropdowns(e); });
            jQuery(document).keydown(function(e){
              switch(e.keyCode){
                case 27: //escape key
                  closeDropdowns(e);
                  break;
              }
            });
          }

        }else{ retInit['status']='error, top_ul element not found'; }
        return retInit;
      }
  };
}());
