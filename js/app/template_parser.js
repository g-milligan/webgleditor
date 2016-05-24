var template_parser=(function(){
  return{
    getFilesData:function(content){
      var ret={objs:[], files:[]};
      var dataFiles=this['getDataFileElements'](content);
      dataFiles.each(function(){
        var file=jQuery(this).attr('data-file');
        var obj={path:file};
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
    getDataFileElements:function(content){
      var ret;
      if(typeof content==='string'){
        var parseHtml=jQuery('<div>'+content+'</div>');
        ret=parseHtml.find('[data-file]');
      }
      return ret;
    },
    getDataFileElement:function(content, path){
      var ret;
      var dataFiles=this['getDataFileElements'](content);
      ret=dataFiles.filter('[data-file="'+path+'"]:first');
      if(ret.length<1){ ret=undefined; }
      return ret;
    },
    getDataFileContent:function(content, path){
      var ret;
      if(path!=undefined){
        var el=this['getDataFileElement'](content, path);
        if(el!=undefined){
          ret=el.html();
        }
      }else{
        ret=content;
      }
      return ret;
    }
  };
}());
