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
          var panels_type=getArg('panels_type','columns');
          var defaultStartSizes=[]; var defaultSize=100/panels.length;
          for(var d=0;d<panels.length;d++){
            defaultStartSizes.push(defaultSize);
          }
          var start_size_percents=getArg('start_size_percents',defaultStartSizes);
          wrapEl[0]['panels_data']=retInit;
          switch(panels_type){
            case 'columns': panels.addClass('panel_column'); break;
            case 'rows': panels.addClass('panel_row'); break;
          }
          var currentPos=0, panelsCount=panels.length;
          panels.each(function(p){
            var sizeType='width', posType='left'; if(panels_type==='rows'){ sizeType='height'; posType='top'; }
            jQuery(this).css(sizeType,start_size_percents[p]+'%').css(posType, currentPos+'%');
            currentPos+=start_size_percents[p];
            jQuery(this).attr('data-panel', (p+1)+'');
            var handleMouseDownHandle=function(e,handle){
              var panel=handle.parents('[data-panel]:first');
              var wrap=panel.parents('.init_panels:first');
              handle.addClass('drag_panel');
              panel.addClass('drag_panel');
              wrap.addClass('drag_panel');
              handle.css({width:handle.width()+'px',height:handle.height()+'px',
                left:handle.offset().left+'px',top:handle.offset().top+'px',position:'fixed',
                right:'auto',bottom:'auto'});
              var bodyEl=jQuery('body:first');
              bodyEl.addClass('drag_panel');
              bodyEl.append(handle);
              var size_type='height', pos_type='top';
              if(panel.hasClass('panel_column')){
                size_type='width'; pos_type='left'; bodyEl.addClass('panel_column');
              }else{
                bodyEl.addClass('panel_row');
              }
              document['dragging_panel']={dragging:true, wrap:wrap, panel:panel, handle:handle,
                size_type:size_type, pos_type:pos_type};
            };
            if(p!==0){
              jQuery(this).append('<div class="panel_drag_handle before"></div>');
              var dragHandleBefore=jQuery(this).children('.panel_drag_handle.before:last');
              dragHandleBefore.mousedown(function(e){ handleMouseDownHandle(e,jQuery(this)); });
            }
            if(p+1<panelsCount){
              jQuery(this).append('<div class="panel_drag_handle after"></div>');
              var dragHandleAfter=jQuery(this).children('.panel_drag_handle.after:last');
              dragHandleAfter.mousedown(function(e){ handleMouseDownHandle(e,jQuery(this)); });
            }
          });



          if(!document.hasOwnProperty('init_panels')){
            document['init_panels']=true;
            var stopDrag=function(e){
              if(document.hasOwnProperty('dragging_panel')){
                if(document['dragging_panel']['dragging']){
                  document['dragging_panel']['dragging']=false;
                  var wrap=document['dragging_panel']['wrap'];
                  var panel=document['dragging_panel']['panel'];
                  var handle=document['dragging_panel']['handle'];

                  var size_type=document['dragging_panel']['size_type'];
                  var pos_type=document['dragging_panel']['pos_type'];

                  var handleStopDrag=function(posType, sizeType){
                    var panelNum=parseInt(panel.attr('data-panel'));
                    var panelIndex=panelNum-1;
                    var adjacentPanel;
                    if(handle.hasClass('before')){
                      adjacentPanel=jQuery(wrap[0]['panels_data']['panels_el'][panelIndex-1]);
                    }else{
                      adjacentPanel=jQuery(wrap[0]['panels_data']['panels_el'][panelIndex+1]);
                    }
                    var adjacentPanelNum=parseInt(adjacentPanel.attr('data-panel'));
                    //if adjacentPanel is before panel
                    if(adjacentPanelNum<panelNum){

                    }else{
                      //panel is before adjacentPanel

                    }



                  };
                  if(panel.hasClass('panel_column')){
                    handleStopDrag('left', 'width');
                  }else if(panel.hasClass('panel_row')){
                    handleStopDrag('top', 'height');
                  }
                  //reset the handle move
                  var bodyEl=jQuery('body:first');
                  bodyEl.removeClass('drag_panel').removeClass('panel_column').removeClass('panel_row');
                  wrap.removeClass('drag_panel');
                  panel.removeClass('drag_panel');
                  handle.removeClass('drag_panel');
                  if(handle.hasClass('before')){
                    panel.prepend(handle);
                  }else{
                    panel.append(handle);
                  }
                  handle.removeAttr('style');
                }
              }
            };
            var moveDrag=function(e){
              if(document.hasOwnProperty('dragging_panel')){
                if(document['dragging_panel']['dragging']){
                  var wrap=document['dragging_panel']['wrap'];
                  var panel=document['dragging_panel']['panel'];
                  var handle=document['dragging_panel']['handle'];

                  var size_type=document['dragging_panel']['size_type'];
                  var pos_type=document['dragging_panel']['pos_type'];

                  var this_pos={left:e['pageX'],top:e['pageY']};
                  handle.css(pos_type,this_pos[pos_type]+'px');
                }
              }
            };
            jQuery(document).mousemove(function(e){ moveDrag(e); });
            jQuery(document).mouseup(function(e){ stopDrag(e); });
            jQuery(document).mouseleave(function(e){ stopDrag(e); });
          }
        }
      }else{ retInit['status']='error, wrap element not found'; }
      return retInit;
    }
  };
}());
