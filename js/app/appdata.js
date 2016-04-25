var appdata=(function(){
  return{
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
    get:function(){
      var ret, self=this;
      var appDataEl=jQuery('#app_data:first');
      if(appDataEl.length>0){
        ret={};
        appDataEl.children('[id]').each(function(){
          var div=jQuery(this);
          var id=div.attr('id');
          switch(id){
            case 'startup_template':
              ret[id]=self['getCommentContent'](div.text());
              break;
            case 'templates':






              break;
            case 'data_file_settings':






              break;
            case 'template_inserts':





            
              break;
          }
        });
      } return ret;
    }
  };
}());
