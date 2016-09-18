var template_parser=(function(){
  return{
    //get a codemirror position from a given index
    getPosFromIndex:function(index, content){
      //CodeMirror.Pos
      var str=content.substring(0, index);
      var lines=str.split('\n');
      var ch=lines[lines.length-1].length;
      return CodeMirror.Pos(lines.length-1, ch);
    },
    //get the substring range of a file within the index.html
    getFileRange:function(path, content){
      var range, self=this;
      var el=self['getDataFileElement'](content, path);
      if(el!=undefined && el.length>0){
        var outer_html=el[0].outerHTML;
        var inner_html=el.html();
        //*** get the tag start and end
        var strIndex=content.indexOf(outer_html);
        var fromPos=self['getPosFromIndex'](strIndex, content);
        var toPos=self['getPosFromIndex'](strIndex+outer_html.length, content);
        range={
            from:fromPos,
            to:toPos,
            outer_html:outer_html,
            inner_html:inner_html
        };
      }
      return range;
    },
    //pass the full html content to return info about files defined inside the content
    getFilesData:function(content){
      var ret={objs:[], files:[]}, self=this;
      var dataFiles=self['getDataFileElements'](content);
      dataFiles.each(function(){
        var file=jQuery(this).attr('data-file'), range=self['getFileRange'](file, content);
        var obj={path:file, range:range};
        for(var a=0;a<jQuery(this)[0].attributes.length;a++){
          var keyVal=jQuery(this)[0].attributes[a];
          if(keyVal.name.indexOf('data-')===0 && keyVal.name!=='data-file'){
            var key=keyVal.name.substring('data-'.length);
            var val=keyVal.value;
            obj[key]=val;
          }
        }
        ret['objs'].push(obj);
        ret['files'].push(file);
      });
      return ret;
    },
    //get the before and after strings for a given [data-file] elemen
    getBeforeAndAfterForElement:function(dataFileEl, dataFileTags){
      var before='', after='', dataFileTag, tagName=dataFileEl[0].tagName.toLowerCase();
      if(dataFileTags==undefined){ dataFileTags=appdata['getDataFileSetting']('data-file-tags'); }
      if(dataFileTags!=undefined){
        if(dataFileTags.hasOwnProperty('default')){ dataFileTag=dataFileTags['default']; }
        if(dataFileTags.hasOwnProperty(tagName)){ dataFileTag=dataFileTags[tagName]; }
        if(dataFileTag!=undefined){
          //get before/after values from settings
          if(dataFileTag.hasOwnProperty('before')){ before=dataFileTag['before']; }
          if(dataFileTag.hasOwnProperty('after')){ after=dataFileTag['after']; }
          //overwrite before/after settings, with available inline attribute (if any)
          var beforeAttr=dataFileEl.attr('data-before');
          var afterAttr=dataFileEl.attr('data-after');
          var replaceCharsInAttr=function(str){
            str=str.replace(/\\n/g, "\n");
            str=str.replace(/\\t/g, "\t");
            str=str.replace(/&lt;/g, "<");
            str=str.replace(/&gt;/g, ">");
            return str;
          };
          if(beforeAttr!=undefined){ before=replaceCharsInAttr(beforeAttr); }
          if(afterAttr!=undefined){ after=replaceCharsInAttr(afterAttr); }
        }
      }
      return {before:before,after:after,tag:dataFileTag};
    },
    //pass the full html content and returns the content with the before and after tags inserted
    getContentWithDataFileTags:function(content, dataFileTags){
      var ret=content, self=this;
      if(dataFileTags==undefined){ dataFileTags=appdata['getDataFileSetting']('data-file-tags'); }
      if(dataFileTags!=undefined){
        var els=self['getDataFileElements'](content);
        els.each(function(){
          var dataFileEl=jQuery(this);
          var tagName=dataFileEl[0].tagName.toLowerCase();
          var htmlStart='', htmlContent='', htmlEnd='</'+tagName+'>';
          htmlContent=dataFileEl.html();
          var beforeAfter=self['getBeforeAndAfterForElement'](dataFileEl, dataFileTags);
          var before=beforeAfter['before'], after=beforeAfter['after'];
          //if already starts with...
          if(htmlContent.indexOf(before)===0){ before=''; }
          //if already ends with...
          if(htmlContent.lastIndexOf(after)===htmlContent.length-after.length){ before=''; }
          //if there is a before or after to insert around the content...
          if(before.length>0 || after.length>0){
            htmlStart=dataFileEl[0].outerHTML;
            if(dataFileEl[0].attributes.length>0){
              var lastAttr=dataFileEl[0].attributes[dataFileEl[0].attributes.length-1];
              var endIndex=htmlStart.indexOf(lastAttr.value)+lastAttr.value.length;
              var consumeStr=htmlStart.substring(endIndex);
              endIndex+=consumeStr.indexOf('>')+'>'.length;
              htmlStart=htmlStart.substring(0, endIndex);
              htmlStart=htmlStart.substring('<'.length, htmlStart.length-'>'.length);
              htmlStart=htmlStart.replace(/>/g, "&gt;");
              htmlStart=htmlStart.replace(/</g, "&lt;");
              htmlStart='<'+htmlStart+'>';
            }else{
              htmlStart=htmlStart.substring(0, htmlStart.indexOf('>')+'>'.length);
            }
            ret=ret.replace(htmlStart+htmlContent+htmlEnd, htmlStart+before+htmlContent+after+htmlEnd);
          }
        });
      }
      return ret;
    },
    //get the [data-file] elements within the content string
    getDataFileElements:function(content){
      var ret;
      if(typeof content==='string'){
        var parseHtml=jQuery('<div>'+content+'</div>');
        ret=parseHtml.find('[data-file]');
      }
      return ret;
    },
    //get one [data-file] element from the content (selected by path)
    getDataFileElement:function(content, path){
      var ret;
      var dataFiles=this['getDataFileElements'](content);
      ret=dataFiles.filter('[data-file="'+path+'"]:first');
      if(ret.length<1){ ret=undefined; }
      return ret;
    },
    //get the inner content of a specific [data-file] element within content
    getDataFileContent:function(content, path, includeBeforeAfter){
      var ret, self=this;
      if(includeBeforeAfter==undefined){ includeBeforeAfter=false; }
      if(path!=undefined){
        var el=this['getDataFileElement'](content, path);
        if(el!=undefined){
          ret=el.html();
          if(!includeBeforeAfter){
            var beforeAfter=self['getBeforeAndAfterForElement'](el);
            var before=beforeAfter['before'], after=beforeAfter['after'];
            if(before.length>0){
              //if starts with...
              if(ret.indexOf(before)===0){
                ret=ret.substring(before.length);
              }
            }
            if(after.length>0){
              //if ends with...
              if(ret.lastIndexOf(after)===ret.length-after.length){
                ret=ret.substring(0, ret.lastIndexOf(after));
              }
            }
          }
        }
      }else{
        ret=content;
      }
      return ret;
    }
  };
}());
