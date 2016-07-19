var appdata=(function(){

  var startupTemplateSel='#app_data > #startup_template:first';
  var templatesSel='#app_data > #templates:first';
  var insertsSel='#app_data > #template_inserts:first';
  var settingsSel='#app_data > #data_file_settings:first';

  var getCommentContent=function(str){
      str=str.trim(); var hasComment=false;
      if(str.indexOf('<!--')===0){ str=str.substring('<!--'.length); hasComment=true; }
      if(str.lastIndexOf('-->')===str.length-'-->'.length){ str=str.substring(0, str.lastIndexOf('-->')); hasComment=true; }
      if(hasComment){ str=str.trim(); }
      return str;
  };

  var replaceAll=function(str, replace, search, callback){
    while(str.indexOf(replace)!==-1){
      str=str.replace(replace, search);
      if(callback!=undefined){
        callback(str, replace, search);
      }
    }
    return str;
  };

  var getWhichChild=function(which, parent, attrKey){
    var ret;
    if(parent!=undefined && parent.length>0){
      //if which is an index
      if(!isNaN(parseInt(which))){
        var index=which;
        var el=parent.children('['+attrKey+']:eq('+index+')');
        if(el.length>0){
          var key=el.attr(attrKey);
          ret={index:index, el:el, key:key};
        }
      }else if(typeof which==='string'){
        var key=which;
        var el=parent.children('['+attrKey+'="'+key+'"]:first');
        if(el.length>0){
          var index=el.index();
          ret={index:index, el:el, key:key};
        }
      }else if(which.attr && which.attr(attrKey)){
        var el=which;
        var key=el.attr(attrKey);
        var index=el.index();
        ret={index:index, el:el, key:key};
      }
    }
    return ret;
  };

  return{
    getStartupTemplate:function(){
      var ret, val, el=jQuery(startupTemplateSel);
      if(el.length>0){
        val=getCommentContent(el.html());
        ret={sel:startupTemplateSel, el:el, val:val};
      }
      return ret;
    },
    getTemplate:function(which, addInserts, addTags){
      var self=this;
      if(addInserts==undefined){addInserts=true;}
      if(addTags==undefined){addTags=true;}
      var inserts, tags;
      if(addInserts){
        inserts=self['getTemplateInserts']();
      }
      if(addTags){
        tags=self['getDataFileSetting']('data-file-tags');
      }
      var ret, templatesEl=jQuery(templatesSel);
      var templateData=getWhichChild(which, templatesEl, 'data-template');
      if(templateData!=undefined){
        templateData['el'].children('[data-key]').each(function(){
          var key=jQuery(this).attr('data-key');
          var val=getCommentContent(jQuery(this).html());
          if(key==='content'){
            if(inserts!=undefined && inserts.length>0){
              for(var i=0;i<inserts.length;i++){
                var insert=inserts[i];
                if(!insert.hasOwnProperty('error')){
                  if(val.indexOf(insert['key'])!==-1){
                    while(val.indexOf(insert['key'])!==-1){
                      val=val.replace(insert['key'], insert['content']); //*** put the tags around the content
                    }
                  }
                }
              }
            }
            if(tags!=undefined){
              val=template_parser['getContentWithDataFileTags'](val, tags);
            }
          }
          if(ret==undefined){ ret={key:templateData['key']}; }
          ret[key]=val;
        });
      }
      return ret;
    },
    getTemplates:function(addInserts){
      if(addInserts==undefined){addInserts=false;}
      var ret=[], self=this, templatesEl=jQuery(templatesSel);
      if(templatesEl.length>0){
        templatesEl.children('[data-template]').each(function(){
          var data=self['getTemplate'](jQuery(this), addInserts);
          if(data!=undefined){
            ret.push(data);
          }
        });
      }
      return ret;
    },
    getDataFileSetting:function(which){
      var ret, settingsEl=jQuery(settingsSel);
      var settingsData=getWhichChild(which, settingsEl, 'data-key');
      if(settingsData!=undefined){

        switch(settingsData['key']){

          case 'data-file-tags':
            ret={};
            settingsData['el'].children('[data-tag]').each(function(){
              var tagName=jQuery(this).attr('data-tag');
              ret[tagName]={trim:false,before:'',after:''};
              jQuery(this).children('[data-key]').each(function(){
                var keyName=jQuery(this).attr('data-key');
                var val=jQuery(this).html();
                switch(keyName){
                  case 'trim':
                    val=val.trim(); val=val.toLowerCase();
                    if(val.indexOf('true')===0){
                      ret[tagName]['trim']=true;
                    }
                    break;
                  case 'before':
                    val=replaceAll(val, '&lt;', '<');
                    val=replaceAll(val, '&gt;', '>');
                    ret[tagName]['before']=val;
                    break;
                  case 'after':
                    val=replaceAll(val, '&lt;', '<');
                    val=replaceAll(val, '&gt;', '>');
                    ret[tagName]['after']=val;
                    break;
                }
              });
            });
            break;



        }
      }
      return ret;
    },
    getDataFileSettings:function(){
      var ret, self=this, settingsEl=jQuery(settingsSel);
      if(settingsEl.length>0){
        settingsEl.children('[data-key]').each(function(){
          var key=jQuery(this).attr('data-key');
          var data=self['getDataFileSetting'](jQuery(this));
          if(data!=undefined){
            if(ret==undefined){ret={};}
            ret[key]=data;
          }
        });
      }
      return ret;
    },
    getTemplateInsert:function(which){
      var ret, insertsEl=jQuery(insertsSel);
      var insertsData=getWhichChild(which, insertsEl, 'data-insert');
      if(insertsData!=undefined){
          var key=insertsData['key'];
          var val=getCommentContent(insertsData['el'].html());
          if(val.indexOf(key)===-1){
            ret={key:key, content:val};
          }else{
            ret={error:'error, content contains key', key:key, content:val};
          }
      }
      return ret;
    },
    getTemplateInserts:function(){
      var ret=[], self=this, insertsEl=jQuery(insertsSel);
      if(insertsEl.length>0){
        insertsEl.children('[data-insert]').each(function(){
          var data=self['getTemplateInsert'](jQuery(this));
          if(data!=undefined){
            ret.push(data);
          }
        });
      }
      return ret;
    }
  };
}());
