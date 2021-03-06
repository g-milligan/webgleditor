var codemevents=(function(){
  return{
    //triggered before a change takes place
    beforeChange:function(instance,object){
      var path=codeminterface['getPathFromInstance'](instance);
      //keep track of the file elements before any may be changed
      if(path==='index.html'){

        //*** track the line numbers that got updated
        var editedText=instance.getRange(object.from, object.to);
        var changeType=object.origin;
        var filesData=template_parser['getFilesData'](instance.doc.getValue());

        //figure out if any of the file content got chanced
        for(var f=0;f<filesData.objs.length;f++){
          var range=filesData.objs[f]['range'];
          var fromPos=range['from'];
          var toPos=range['to'];
          var rangeCoords={from:fromPos,to:toPos};
          //if edit occurred somewhere in the file content
          if(template_parser['posIsInRange'](object.from, rangeCoords) ||
          template_parser['posIsInRange'](object.to, rangeCoords)){
            //if edit occurred in the data-file="path" attributes
            rangeCoords={from:range.dataFileRange.from, to:range.dataFileRange.to};
            if(template_parser['posIsInRange'](object.from, rangeCoords) ||
            template_parser['posIsInRange'](object.to, rangeCoords)){
              var test='';
            }
            //if edit occurred in the data-file="path" attributes
            rangeCoords={from:range.contentRange.from, to:range.contentRange.to};
            if(template_parser['posIsInRange'](object.from, rangeCoords) ||
            template_parser['posIsInRange'](object.to, rangeCoords)){
              var test='';
            }
          }
        }



      }
    },
    //when text is changed in an editor area
    change:function(instance,object){
      var path=codeminterface['getPathFromInstance'](instance);
      //set updated in left nav
      var leftNavUl=jQuery('#file-system-nav .init_filenav_wrap ul:first');
      var leftNavLi=filenav['getItem'](leftNavUl, path);
      var leftNavAncestors=filenav['getAncestorItems'](leftNavLi);
      var indexLi=filenav['getItem'](leftNavUl, 'index.html');
      leftNavLi.addClass('change'); indexLi.addClass('change');
      leftNavAncestors.addClass('change-ancestor');
      //set updated styles on project path
      var pathDiv=codeminterface['getProjectPathDiv']();
      var pathDivStr=pathDiv.html();
      if(pathDivStr===path){
        pathDiv.addClass('change');
        pathDiv.append('<span class="asterisk">*</span>');
      }
      //track this path as updated, so it can be one of the saved paths onsave
      var contentDiv=codeminterface['getContentJSONDiv']();
      if(!contentDiv[0].hasOwnProperty('unsaved_paths')){
        contentDiv[0]['unsaved_paths']={}
      }
      var isAlignedIndex=false, isAlignedFile=false;
      if(path==='index.html'){ isAlignedIndex=true; }
      else{ isAlignedFile=true; }
      contentDiv[0]['unsaved_paths'][path]={
        left_nav_li:leftNavLi, instance:instance,
        aligned_index:isAlignedIndex, aligned_file:isAlignedFile};
      if(!contentDiv[0]['unsaved_paths'].hasOwnProperty('index.html')){
        contentDiv[0]['unsaved_paths']['index.html']={};
      }
    },
    //when mouse cursor position changes
    cursorActivity:function(instance,object){
      var test='';
    }
  };
}());
