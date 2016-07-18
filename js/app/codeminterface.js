var codeminterface=(function(){
  return{
    //get the codemirror "mode" assigned to the extension of this file's path
    getFileMode:function(path){
      var ext=this['getExtension'](path); var mode;
      switch(ext){
        case 'html': mode='htmlmixed'; break;
      }
      return mode;
    },
    //get the extension of a file path
    getExtension:function(str){
      var ret='';
      if(str.indexOf('.')!==-1){
        ret=str;
        ret=ret.substring(ret.lastIndexOf('.')+'.'.length);
        ret=ret.toLowerCase();
        ret=ret.trim();
      }
      return ret;
    },
    getFileWrap:function(path, createIfNew, content){
      var self=this;
      if(createIfNew==undefined){ createIfNew=false; }
      var mainPanel=jQuery('#main_panel_center:first');
      var panelContent=mainPanel.children('.panel_content:first');
      var fileWrap=panelContent.children('.content[data-file="'+path+'"]:first');
      //this file wrap not yet created
      if(fileWrap.length<1){
        if(createIfNew){
          panelContent.append('<div class="content" data-file="'+path+'"><textarea class="content"></textarea></div>');
          fileWrap=panelContent.children('.content[data-file="'+path+'"]:last');
          var textarea=fileWrap.children('textarea.content:first');
          //set the codemirror config options
          var config={};
          if(content==undefined){ content=''; }
          config['value']=content;
          config['lineNumbers']=true;
          config['extraKeys']={
            'Ctrl-Space':'autocomplete'
          };
          config['styleActiveLine']=true;
          config['mode']=self['getFileMode'](path);
          config['theme']='custom-dark';
          if(path==='index.html'){ //allow folding large sections of code in data-file elements
            config['foldGutter']=true;
            config['gutters']=['CodeMirror-linenumbers','CodeMirror-foldgutter'];
          }
          //init the editor textarea
          var myCodeMirror = CodeMirror(function(el) {
            //textarea.removeClass('raw');
            textarea[0].parentNode.replaceChild(el, textarea[0]);
          },config);

          if(path==='index.html'){ //fold all of the code sections on page load
            CodeMirror.commands.foldAll(myCodeMirror.doc.cm);
          }


          //****





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
        var fileWrap=self['getFileWrap'](strPath, true, content);
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
