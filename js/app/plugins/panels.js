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


          //if this panels plugin has not already been initialized
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
                  var panelNum=parseInt(panel.attr('data-panel'));
                  var panelIndex=panelNum-1;
                  var adjacentPanel;
                  if(handle.hasClass('before')){
                    adjacentPanel=jQuery(wrap[0]['panels_data']['panels_el'][panelIndex-1]);
                  }else{
                    adjacentPanel=jQuery(wrap[0]['panels_data']['panels_el'][panelIndex+1]);
                  }
                  var adjacentPanelNum=parseInt(adjacentPanel.attr('data-panel'));
                  var panel1, panel2;
                  //if adjacentPanel is before panel
                  if(adjacentPanelNum<panelNum){
                    panel1=adjacentPanel; panel2=panel;
                  }else{ //panel is before adjacentPanel
                    panel1=panel; panel2=adjacentPanel;
                  }
                  //function that calculates new size/position of 2 adjacent panels
                  var newSizePercent1, newSizePercent2, newPosPercent2;
                  var calculateNewSizePos=function(panelSize1, panelSize2, before1, before2, wrapSize){
                    var handlePos=parseFloat(handle.css(pos_type));
                    var after1=before1+panelSize1;
                    var after2=before2+panelSize2;
                    var oldSizePercent2=parseFloat(panel2[0].style[size_type]);
                    var oldPosPercent2=parseFloat(panel2[0].style[pos_type]);
                    //if the handle is over the panel1
                    if(before1<=handlePos && handlePos<=after1){
                      var reducedBy1=after1-handlePos;
                      var newSize1=panelSize1-reducedBy1;
                      var newSize2=panelSize2+reducedBy1;
                      newSizePercent1=newSize1 / wrapSize * 100;
                      newSizePercent2=newSize2 / wrapSize * 100;
                      newPosPercent2=oldPosPercent2-(newSizePercent2-oldSizePercent2);
                    //if the handle is over the panel2
                    }else if(before2<=handlePos && handlePos<=after2){
                      var increaseBy1=handlePos-after1;
                      var newSize1=panelSize1+increaseBy1;
                      var newSize2=panelSize2-increaseBy1;
                      newSizePercent1=newSize1 / wrapSize * 100;
                      newSizePercent2=newSize2 / wrapSize * 100;
                      newPosPercent2=oldPosPercent2+(oldSizePercent2-newSizePercent2);
                    }
                  };
                  //use different size/positions depending on columns vs. rows
                  if(pos_type==='top'){
                    calculateNewSizePos(
                      panel1.outerHeight(), panel2.outerHeight(),
                      panel1.offset().top, panel2.offset().top,
                      wrap.outerHeight()
                    );
                  }else if(pos_type==='left'){
                    calculateNewSizePos(
                      panel1.outerWidth(), panel2.outerWidth(),
                      panel1.offset().left, panel2.offset().left,
                      wrap.outerWidth()
                    );
                  }
                  //finally, set the new panel sizes and position
                  panel1.css(size_type,newSizePercent1+'%');
                  panel2.css(size_type,newSizePercent2+'%');
                  panel2.css(pos_type,newPosPercent2+'%');
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
