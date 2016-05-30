var codeminterface=(function(){
  return{
    getFileWrap:function(path, createIfNew){
      var self=this;
      if(createIfNew==undefined){ createIfNew=false; }
      var mainPanel=jQuery('#main_panel_center:first');
      var panelContent=mainPanel.children('.panel_content:first');
      var fileWrap=panelContent.children('.content[data-file="'+path+'"]:first');
      //this file wrap not yet created
      if(fileWrap.length<1){
        if(createIfNew){
          panelContent.append('<div class="content" data-file="'+path+'"></div>');
          fileWrap=panelContent.children('.content[data-file="'+path+'"]:first');


          //**** create the code mirror textarea, etc...




        }else{
          fileWrap=undefined;
        }
      }
      return fileWrap;
    },
    openFile:function(path){
      var strPath=path, self=this, ret;
      //get "file" content
      if(path==='index.html'){ path=undefined; }
      var fullContent=datainterface['load_from_memory']();
      var content=template_parser['getDataFileContent'](fullContent['content'], path);
      if(content!=undefined){
        //build the html for this file, if not already built
        var fileWrap=self['getFileWrap'](strPath, true);
        //open this content if it's not already active
        if(!fileWrap.hasClass('active')){
          var panelContent=fileWrap.parent();
          panelContent.children('.content.active').removeClass('content');
          fileWrap.addClass('active');
          ret=fileWrap;
        }
      }
    }
  };
}());
