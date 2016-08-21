var codeminterface=(function(){
  return{
    //get the div element, where json data is stored
    getContentJSONDiv:function(){
      return jQuery('#frontend-ui #workspace .panel_content:first');
    },
    //get the div that contains the project path
    getProjectPathDiv:function(){
      return jQuery('#project_file:first');
    },
    //set the project path as it is shown in the path div
    setProjectPath:function(newPath){
      var self=this;
      var div=self['getProjectPathDiv']();
      div.html(newPath);
    },
    //get the file div from the given codemirror instance
    getDivFromInstance:function(instance){
      var lineDiv=jQuery(instance.display.lineDiv);
      var div=lineDiv.parents('[data-file]:first');
      if(div.length<1){ div=undefined; }
      return div;
    },
    //get the file path from the given codemirror instance
    getPathFromInstance:function(instance){
      var path='', div=this['getDivFromInstance'](instance);
      if(div!=undefined){ path=div.attr('data-file'); }
      return path;
    },
    //get the codemirror "mode" assigned to the extension of this file's path
    getFileMode:function(path){
      var ext=this['getExtension'](path); var mode;
      switch(ext){
        case 'css': mode='css'; break;
        case 'html': mode='htmlmixed'; break;
        case 'js': mode='javascript'; break;
        case 'xml': mode='xml'; break;
        case 'vert': mode='clike'; break;
        case 'frag': mode='clike'; break;
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
          var myCodeMirror=CodeMirror(function(el){
            textarea[0].parentNode.replaceChild(el, textarea[0]);
          },config);
          if(path==='index.html'){ //fold all of the code sections on page load
            CodeMirror.commands.foldAll(myCodeMirror.doc.cm);
          }
          //wire up code mirror events
          myCodeMirror.on('change',function(instance,object){
            codemevents['change'](instance,object);
          });
          myCodeMirror.on('cursorActivity',function(instance,object){
            codemevents['cursorActivity'](instance,object);
          });
          myCodeMirror.on('beforeChange',function(instance,object){
            codemevents['beforeChange'](instance,object);
          });
          //****





        }else{
          fileWrap=undefined;
        }
      }
      return fileWrap;
    },
    /*//get the substring text in a file, designated by an instance, from, and to, param
    getContentText:function(instance, fromLine, toLine){
      var editTabTxt=false;
      if(toLine==undefined){toLine=fromLine;}
      //get the text from the "from" line to the "to" line
      var editTxt='';
      for(var i=fromLine;i<=toLine;i++){
        editTxt+=instance.doc.getLine(i)+'\n';
      }
      return editTxt;
    },*/
    //do something for each unsaved path
    eachUnsavedPath:function(callback){
      var self=this;
      if(callback!=undefined){
        var div=self['getContentJSONDiv']();
        if(div[0].hasOwnProperty('unsaved_paths')){
          for(var path in div[0]['unsaved_paths']){
            if(div[0]['unsaved_paths'].hasOwnProperty(path)){
              callback(path, div[0]['unsaved_paths'][path]);
            }
          }
        }
      }
    },
    //align path with modified content
    alignPathContent:function(path){
      var self=this, contentDiv=self['getContentJSONDiv']();
      if(contentDiv[0].hasOwnProperty('unsaved_paths')){
        if(contentDiv[0]['unsaved_paths'].hasOwnProperty(path)){
          var json=contentDiv[0]['unsaved_paths'][path];
          //need to align content inside index.html
          if(path==='index.html'){
            self['eachUnsavedPath'](function(thePath, theJson){
              if(thePath!=='index.html'){
                if(!theJson['aligned_index']){
                  var test='';
                }
              }
            });
          //need to align content in an individual file
          }else if(!json['aligned_file']){
            var test='';
          }
        }
      }
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
          panelContent.children('.content.active').removeClass('active');
          fileWrap.addClass('active');

          var leftNavUl=jQuery('#file-system-nav .init_filenav_wrap ul:first');
          var leftNavLi=filenav['getItem'](leftNavUl, strPath);
          var pathDiv=self['getProjectPathDiv'](); var asterisk='';
          if(leftNavLi.hasClass('change')){
            pathDiv.addClass('change'); asterisk='<span class="asterisk">*</span>';
          }else{
            pathDiv.removeClass('change');
          }
          self['setProjectPath'](strPath+asterisk);
          //update / align content
          self['alignPathContent'](strPath);

          ret=fileWrap;
        }
      }
    }
  };
}());
