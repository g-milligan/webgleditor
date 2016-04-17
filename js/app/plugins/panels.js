var workspacePanels=(function(){
  return{
    init:function(args){
      var retInit={status:'ok'}; var self=this;
      var getArg=function(name,defaultVal,json){
          var ret;
          if(json==undefined){
            if(args.hasOwnProperty(name)){ ret=args[name]; retInit[name]=ret; }
            else{
              ret=defaultVal;
              args[name]=ret;
            }
          }else{
            if(json.hasOwnProperty(name)){ ret=json[name]; json[name]=ret; }
            else{
              ret=defaultVal;
              json[name]=ret;
            }
          } return ret;
      };
      var getArgEl=function(selType,parent,json){
        var sel=getArg(selType,undefined,json); var el;
        if(sel!=undefined){
          if(parent==undefined){ el=jQuery(sel); }
          else{ el=parent.find(sel); }
          if(el.length>0){
            if(json==undefined){
              retInit[selType+'_el']=el;
            }else{
              json[selType+'_el']=el;
            }
          }
        } return el;
      };
      var wrapEl=getArgEl('wrap');
      if(wrapEl!=undefined && wrapEl.length>0){
        wrapEl.addClass('init_panels');
        wrapEl.attr('data-panels', jQuery('.init_panels').length+'');
        //default value for 'panels'
        var defaultPanels=[];
        if(!args.hasOwnProperty('panels')){
          var defaultSize=100 / wrapEl.children().length;
          wrapEl.children().each(function(c){
            defaultPanels.push({selector:'> *:eq('+c+')',start_size_percent:defaultSize,min_resize_px:0});
          });
        }
        //get all of the panel elements that actually exist
        var panels_type=getArg('panels_type','columns');
        var panels_json=getArg('panels',defaultPanels);
        if(!retInit.hasOwnProperty('panels')){ retInit['panels']=panels_json; }
        for(var p=0;p<panels_json.length;p++){
          var panel=panels_json[p]; var panelEl=getArgEl('selector',wrapEl,panels_json[p]);
          if(panelEl!=undefined && panelEl.length>0){
            switch(panels_type){
              case 'columns': panelEl.addClass('panel_column'); break;
              case 'rows': panelEl.addClass('panel_row'); break;
            }
            panel['selector_el']=panelEl;
          }
        }
        var panels=wrapEl.find('.panel_column, .panel_row');
        if(panels.length>0){
          var roundIt=function(it){
            it=parseFloat(it)
            return Math.round(it);
          };
          //function to get a panel that comes BEFORE pnl2
          var getPrevPanel=function(w,pnl2){
            var pnl1; var pnl2Num=parseInt(pnl2.attr('data-panel'));
            if(pnl2Num>1){
              var pnl2Index=pnl2Num-1;
              pnl1=w[0]['panels_data']['panels'][pnl2Index-1]['selector_el'];
            } return pnl1;
          };
          //function to get a panel that comes AFTER pnl1
          var getNextPanel=function(w,pnl1){
            var pnl2; var pnl1Num=parseInt(pnl1.attr('data-panel'));
            var pnl1Index=pnl1Num-1;
            if(pnl1Index<w[0]['panels_data']['panels'].length){
              pnl2=w[0]['panels_data']['panels'][pnl1Index+1]['selector_el'];
            } return pnl2;
          };
          //get the two panels that will change size, given the drag panel
          var getPanelPair=function(w,dragPnl,beforeOrAfter){
            var panelNum=parseInt(dragPnl.attr('data-panel'));
            var panelIndex=panelNum-1;
            var adjacentPanel;
            if(beforeOrAfter==='before'){
              adjacentPanel=w[0]['panels_data']['panels'][panelIndex-1]['selector_el'];
            }else{
              adjacentPanel=w[0]['panels_data']['panels'][panelIndex+1]['selector_el'];
            }
            var adjacentPanelNum=parseInt(adjacentPanel.attr('data-panel'));
            var panel1, panel2;
            //if adjacentPanel is before dragPnl
            if(adjacentPanelNum<panelNum){
              panel1=adjacentPanel; panel2=dragPnl;
            }else{ //dragPnl is before adjacentPanel
              panel1=dragPnl; panel2=adjacentPanel;
            }
            return {panel1:panel1,panel2:panel2};
          };
          //function to get the before boundary
          var getPrevBoundary=function(w,pnl2){
            var offsetBound;
            var pnl1=getPrevPanel(w,pnl2);
            if(pnl2.hasClass('panel_column')){
              if(pnl1==undefined){
                offsetBound=w.offset().left;
              }else{
                offsetBound=pnl1.offset().left;
              }
            }else if(pnl2.hasClass('panel_row')){
              if(pnl1==undefined){
                offsetBound=w.offset().top;
              }else{
                offsetBound=pnl1.offset().top;
              }
            }
            if(offsetBound!=undefined){
              offsetBound+=pnl1[0]['panel_data']['min_resize_px'];
            }
            return offsetBound;
          };
          //function to get the next boundary
          var getNextBoundary=function(w,pnl1){
            var offsetBound;
            var pnl2=getNextPanel(w,pnl1);
            if(pnl1.hasClass('panel_column')){
              if(pnl2==undefined){
                offsetBound=w.offset().left + w.innerWidth();
              }else{
                offsetBound=pnl2.offset().left + pnl2.innerWidth();
              }
            }else if(pnl1.hasClass('panel_row')){
              if(pnl2==undefined){
                offsetBound=w.offset().top + w.innerHeight();
              }else{
                offsetBound=pnl2.offset().top + pnl2.innerHeight();
              }
            }
            if(offsetBound!=undefined){
              offsetBound-=pnl2[0]['panel_data']['min_resize_px'];
            }
            return offsetBound;
          };
          var restorePanelOpen=function(btn){
            var didRestore=false;
            if(btn.hasClass('toggle_off')){
              btn.removeClass('toggle_off');

              var sizeType=btn[0]['restore_toggle_panel_data']['size_type'];
              var posType=btn[0]['restore_toggle_panel_data']['pos_type'];
              var shrinkData=btn[0]['restore_toggle_panel_data']['shrink_panel'];
              var growData=btn[0]['restore_toggle_panel_data']['grow_panel'];
              var shrinkPnl=shrinkData['el'];
              var growPnl=growData['el'];

              shrinkPnl.removeClass('toggle_off');
              delete shrinkPnl[0]['toggle_off_button'];
              shrinkPnl.css(sizeType,shrinkData['restore_size']+'%');

              if(shrinkData.hasOwnProperty('restore_pos')){
                shrinkPnl.css(posType,shrinkData['restore_pos']+'%');
              }else{
                growPnl.css(posType,growData['restore_pos']+'%');
              }

              var growPnlNum=growPnl.attr('data-panel');
              var sizeTotal=0;

              var w=btn.parents('.init_panels:first');
              for(var i=0;i<w[0]['panels_data']['panels'].length;i++){
                var panelData=w[0]['panels_data']['panels'][i];
                var pnl=panelData['selector_el'];
                var pnlNum=pnl.attr('data-panel');
                if(pnlNum!==growPnlNum){
                  sizeTotal+=roundIt(pnl[0].style[sizeType]);
                }
              }

              var restoreGrowSize=100-sizeTotal;
              growPnl.css(sizeType,restoreGrowSize+'%');

              didRestore=true;
            }
          };
          wrapEl[0]['panels_data']=retInit;
          //init panel mouse down drag events and initial widths
          var currentPos=0, panelsCount=panels.length;
          panels.each(function(p){
            var panelEl=jQuery(this); var panelJson=panels_json[p];
            if(!panelJson.hasOwnProperty('min_resize_px')){ panelJson['min_resize_px']=0; }
            var toggleBtns=function(btnTypes,clickFunc){
              for(var t=0;t<btnTypes.length;t++){
                var btnType=btnTypes[t];
                if(panelJson.hasOwnProperty('btn_toggle_'+btnType)){
                  var btn;
                  switch(btnType){
                    case 'prev': if(p>0){
                      var toggleJson=panelJson['btn_toggle_prev'];
                      if(toggleJson.hasOwnProperty('selector')){
                        btn=panelEl.find(toggleJson['selector']); btn.addClass('btn_toggle_prev');
                      }
                    } break;
                    case 'next': if(p+1<panelsCount){
                      var toggleJson=panelJson['btn_toggle_next'];
                      if(toggleJson.hasOwnProperty('selector')){
                        btn=panelEl.find(toggleJson['selector']); btn.addClass('btn_toggle_next');
                      }
                    } break;
                  }
                  if(btn!=undefined && btn.length>0){
                    panelJson['btn_toggle_'+btnType+'_el']=btn;
                    btn[0]['on_click_toggle_type']=btnType;
                    btn.click(function(e){
                      clickFunc(e,jQuery(this),jQuery(this)[0]['on_click_toggle_type']);
                    });
                    if(panelJson['btn_toggle_'+btnType].hasOwnProperty('click_onload')){
                      var doClick=panelJson['btn_toggle_'+btnType]['click_onload'];
                      if(doClick){
                        btn.addClass('click_onload'); //toggle panel off on load
                      }
                    }
                  }
                }
              }
            };
            toggleBtns(['prev','next'],function(e,btn,btnType){
              var pnl=btn.parents('[data-panel]:first');
              var w=pnl.parents('.init_panels:first');
              var beforeOrAfter;
              if(btn.hasClass('btn_toggle_next')){
                beforeOrAfter='after';
              }else{
                beforeOrAfter='before';
              }
              var pnls1and2=getPanelPair(w,pnl,beforeOrAfter); var panel1=pnls1and2['panel1']; var panel2=pnls1and2['panel2'];
              var sizeType, posType;
              if(pnl.hasClass('panel_column')){
                sizeType='width'; posType='left';
              }else{
                sizeType='height'; posType='top';
              }
              if(!btn.hasClass('toggle_off')){
                btn.addClass('toggle_off');
                btn[0]['restore_toggle_panel_data']={shrink_panel:{},grow_panel:{},size_type:sizeType,pos_type:posType};
                var shrinkPnl, growPnl;
                if(beforeOrAfter==='before'){
                  shrinkPnl=panel1; growPnl=panel2;
                  btn[0]['restore_toggle_panel_data']['grow_panel']['restore_pos']=roundIt(growPnl[0].style[posType]);
                }else{
                  shrinkPnl=panel2; growPnl=panel1;
                  btn[0]['restore_toggle_panel_data']['shrink_panel']['restore_pos']=roundIt(shrinkPnl[0].style[posType]);
                }
                shrinkPnl[0]['toggle_off_button']=btn;
                btn[0]['restore_toggle_panel_data']['shrink_panel']['el']=shrinkPnl;
                btn[0]['restore_toggle_panel_data']['grow_panel']['el']=growPnl;

                var hideSize=roundIt(shrinkPnl[0].style[sizeType]);
                btn[0]['restore_toggle_panel_data']['shrink_panel']['restore_size']=hideSize;

                //calculate new positions and sizes
                var prevGrowPnlSize=roundIt(growPnl[0].style[sizeType]);
                var prevPanel2Pos=roundIt(panel2[0].style[posType]);
                var newPanel2Pos;
                if(beforeOrAfter==='before'){
                  newPanel2Pos=prevPanel2Pos-hideSize;
                }else{
                  newPanel2Pos=prevPanel2Pos+hideSize;
                }
                panel2.css(posType, newPanel2Pos+'%');
                growPnl.css(sizeType,(hideSize+prevGrowPnlSize)+'%');
                shrinkPnl.css(sizeType,'0%').addClass('toggle_off');
              }else{
                restorePanelOpen(btn);
              }
            });
            panelEl[0]['panel_data']=panelJson;
            var sizeType='width', posType='left'; if(panels_type==='rows'){ sizeType='height'; posType='top'; }
            panelEl.css(sizeType,panelJson['start_size_percent']+'%').css(posType, currentPos+'%');
            currentPos+=panelJson['start_size_percent'];
            panelEl.attr('data-panel', (p+1)+'');
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
              var beforeOrAfter='before'; if(handle.hasClass('after')){ beforeOrAfter='after' }
              var pnls1and2=getPanelPair(wrap,panel,beforeOrAfter);
              var panel1=pnls1and2['panel1']; var panel2=pnls1and2['panel2'];
              var prev_boundary=getPrevBoundary(wrap,panel2);
              var next_boundary=getNextBoundary(wrap,panel1);
              document['dragging_panel']={dragging:true, wrap:wrap, panel:panel, handle:handle,
                size_type:size_type, pos_type:pos_type,
                prev_boundary:prev_boundary, next_boundary:next_boundary, panel1:panel1, panel2:panel2};
            };
            if(p!==0){
              panelEl.append('<div class="panel_drag_handle before"></div>');
              var dragHandleBefore=panelEl.children('.panel_drag_handle.before:last');
              dragHandleBefore.mousedown(function(e){ handleMouseDownHandle(e,jQuery(this)); });
            }
            if(p+1<panelsCount){
              panelEl.append('<div class="panel_drag_handle after"></div>');
              var dragHandleAfter=panelEl.children('.panel_drag_handle.after:last');
              dragHandleAfter.mousedown(function(e){ handleMouseDownHandle(e,jQuery(this)); });
            }
          });
          wrapEl.find('.btn_toggle_prev.click_onload,.btn_toggle_next.click_onload').click();

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
                  var panel1=document['dragging_panel']['panel1'];
                  var panel2=document['dragging_panel']['panel2'];
                  //function that calculates new size/position of 2 adjacent panels
                  var newSizePercent1, newSizePercent2, newPosPercent2;
                  var calculateNewSizePos=function(panelSize1, panelSize2, before1, before2, wrapSize){
                    var handlePos=roundIt(handle.css(pos_type));
                    var after1=before1+panelSize1;
                    var after2=before2+panelSize2;
                    var oldSizePercent1=roundIt(panel1[0].style[size_type]);
                    var oldSizePercent2=roundIt(panel2[0].style[size_type]);
                    var oldPosPercent2=roundIt(panel2[0].style[pos_type]);
                    //if the handle is over the panel1
                    if(before1<=handlePos && handlePos<=after1){
                      var reducedBy1=after1-handlePos;
                      var newSize1=panelSize1-reducedBy1;

                      newSizePercent1=roundIt(newSize1 / wrapSize * 100);

                      var sizePercentRemoved1=oldSizePercent1-newSizePercent1;
                      newSizePercent2=oldSizePercent2+sizePercentRemoved1;
                      newPosPercent2=oldPosPercent2-sizePercentRemoved1;

                      if(panel2[0].hasOwnProperty('toggle_off_button')){
                        if(panel2[0]['toggle_off_button']!=undefined){
                          panel2[0]['toggle_off_button'].click();
                        }
                      }
                    //if the handle is over the panel2
                    }else if(before2<=handlePos && handlePos<=after2){
                      var increaseBy1=handlePos-after1;
                      var newSize1=panelSize1+increaseBy1;

                      newSizePercent1=roundIt(newSize1 / wrapSize * 100);

                      var sizePercentAdded1=newSizePercent1-oldSizePercent1;
                      newSizePercent2=oldSizePercent2-sizePercentAdded1;
                      newPosPercent2=oldPosPercent2+sizePercentAdded1;

                      if(panel1[0].hasOwnProperty('toggle_off_button')){
                        if(panel1[0]['toggle_off_button']!=undefined){
                          panel1[0]['toggle_off_button'].click();
                        }
                      }
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

                  var next_boundary=document['dragging_panel']['next_boundary'];
                  var prev_boundary=document['dragging_panel']['prev_boundary'];

                  var size_type=document['dragging_panel']['size_type'];
                  var pos_type=document['dragging_panel']['pos_type'];

                  var newPos;
                  if(pos_type==='left'){
                    newPos=e['pageX'];
                  }else{
                    newPos=e['pageY'];
                  }

                  if(newPos<prev_boundary){
                    newPos=prev_boundary; handle.addClass('drag_limit_prev');
                  }else if(next_boundary<newPos){
                    newPos=next_boundary; handle.addClass('drag_limit_next');
                  }else{
                    handle.removeClass('drag_limit_prev').removeClass('drag_limit_next');
                  }

                  handle.css(pos_type,newPos+'px');
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
