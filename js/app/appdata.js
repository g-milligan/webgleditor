var appdata=(function(){
  return{
    map:{
      startup_template:{
        value:function(self, el, extraArgs){
          return self['getCommentContent'](el.text());
        }
      },
      templates:{
        value:function(self, el, extraArgs){
          var ret;
          var getTemplateData=function(whichTemplate){
            var templateIndex=parseInt(whichTemplate), div, data;
            if(isNaN(templateIndex)){
              if(typeof whichTemplate==='string'){
                div=el.children('[data-template="'+whichTemplate+'"]:first');
              }else if(whichTemplate.attr('data-template')){
                div=whichTemplate;
              }
            }else{
              div=el.children().eq(templateIndex);
            }
            if(div.length>0){
              templateIndex=div.index();
              data={index:templateIndex, el:div, key:div.attr('data-template')};
              div.children('[data-key]').each(function(){
                data[jQuery(this).attr('data-key')]=self['getCommentContent'](jQuery(this).html());
              });
            }
            return data;
          };
          if(extraArgs==undefined){
            ret=[];
            el.children('[data-template]').each(function(){
              var data=getTemplateData(jQuery(this).attr('data-template'));
              if(data!=undefined){ ret.push(data); }
            });
          }else{
            ret=getTemplateData(extraArgs);
          }
          return ret;
        }
      },
      data_file_settings:{
        value:function(self, el, extraArgs){
          var ret;

          return ret;
        }
      },
      template_inserts:{
        value:function(self, el, extraArgs){
          var ret;

          return ret;
        }
      }
    },
    getMappedElement:function(id,appDataEl){
      var el, self=this;
      if(self['map'].hasOwnProperty(id)){
        if(appDataEl==undefined){ appDataEl=jQuery('#app_data:first'); }
        var mapItem=self['map'][id]; var itemSelector='#'+id;
        if(mapItem.hasOwnProperty('selector')){
          itemSelector=mapItem['selector'];
        }
        el=appDataEl.find(itemSelector);
        if(el.length<1){ el=undefined; }
        else{ el[0]['mapped_item_json']=mapItem; }
      }
      return el;
    },
    getMappedValue:function(id,appDataEl,extraArgs){
      var val, self=this;
      var el=self['getMappedElement'](id,appDataEl);
      if(el!=undefined){
        var mapItem=el[0]['mapped_item_json'];
        if(mapItem.hasOwnProperty('value')){
          val=mapItem['value'](self, el, extraArgs);
        }
      }
      return val;
    },
    getCommentContent:function(str){
      str=str.trim(); var hasComment=false;
      if(str.indexOf('<!--')===0){
        str=str.substring('<!--'.length); hasComment=true;
      }
      if(str.lastIndexOf('-->')===str.length-'-->'.length){
        str=str.substring(0, str.lastIndexOf('-->')); hasComment=true;
      }
      if(hasComment){ str=str.trim(); }
      return str;
    },
    get:function(getId,extraArgs){
      var ret, self=this;
      var appDataEl=jQuery('#app_data:first');
      if(appDataEl.length>0){
        //if no specific id is specified
        if(getId==undefined){
          ret={};
          //cycle through each mapped element and return all of the values
          for(var id in self['map']){
            if(self['map'].hasOwnProperty(id)){
              var val=self['getMappedValue'](id,appDataEl);
              if(val!=undefined){ret[id]=val;}
            }
          }
        }else{
          //a specific getId is specified
          var ret=self['getMappedValue'](getId,appDataEl,extraArgs);
        }
      } return ret;
    }
  };
}());
