var appdata=(function(){
  return{
    map:{
      startup_template:{
        value:function(self, el){
          return self['getCommentContent'](el.text());
        }
      }
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
    get:function(getId){
      var ret, self=this;
      var appDataEl=jQuery('#app_data:first');
      if(appDataEl.length>0){
        //function to get the mapped value for the given id
        var getMappedValue=function(id){
          var val;
          var mapItem=self['map'][id];
          var itemSelector='#'+id;
          if(mapItem.hasOwnProperty('selector')){
            itemSelector=mapItem['selector'];
          }
          var el=appDataEl.find(itemSelector);
          if(el.length>0){
            if(mapItem.hasOwnProperty('value')){
              val=mapItem['value'](self, el);
            }
          }
          return val;
        };
        //if no specific id is specified
        if(getId==undefined){
          ret={};
          //cycle through each mapped element and return all of the values
          for(var id in self['map']){
            if(self['map'].hasOwnProperty(id)){
              var val=getMappedValue(id);
              if(val!=undefined){ret[id]=val;}
            }
          }
        }else{
          //a specific getId is specified
          var ret=getMappedValue(getId);
        }
      } return ret;
    }
  };
}());
