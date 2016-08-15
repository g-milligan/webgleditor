var codemevents=(function(){
  return{
    //triggered before a change takes place
    beforeChange:function(instance,object){
      var test='';
    },
    //when text is changed in an editor area
    change:function(instance,object){
      var path=codeminterface['getPathFromInstance'](instance);
      var leftNavUl=jQuery('#file-system-nav .init_filenav_wrap ul:first');
      var leftNavLi=filenav['getItem'](leftNavUl, path);
      var leftNavAncestors=filenav['getAncestorItems'](leftNavLi);
      var indexLi=filenav['getItem'](leftNavUl, 'index.html');
      leftNavLi.addClass('change'); indexLi.addClass('change');
      leftNavAncestors.addClass('change-ancestor');
      var pathDiv=codeminterface['getProjectPathDiv']();
      var pathDivStr=pathDiv.html();
      if(pathDivStr===path){
        pathDiv.addClass('change');
        pathDiv.append('<span class="asterisk">*</span>');
      }
    },
    //when mouse cursor position changes
    cursorActivity:function(instance,object){
      var test='';
    }
  };
}());
