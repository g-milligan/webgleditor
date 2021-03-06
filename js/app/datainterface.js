var datainterface=(function(){
  return{
    init:function(){
      if(!this['hasSetDataSource']()){
        var defaultSrc=this['fallback']['datasource']();
        this['setDataSource'](defaultSrc);
      }
    },
    key:{
      datasource:function(){ return 'webgleditor_datasource'; }
    },
    fallback:{
      datasource:function(){ return 'browser'; }
    },
    setDataSource:function(type){
      var keyName=this['key']['datasource']();
      switch(type){
        case 'browser':
          localStorage.setItem(keyName, type);
          break;
        case 'files':
          localStorage.setItem(keyName, type);
          break;
      }
    },
    getDataSource:function(){
      var keyName=this['key']['datasource']();
      var srcVal=localStorage.getItem(keyName);
      if(srcVal==undefined){
        srcVal=this['fallback']['datasource']();
        this['setDataSource'](srcVal);
      }
      return srcVal;
    },
    hasSetDataSource:function(){
      var has=false;
      var keyName=this['key']['datasource']();
      var srcVal=localStorage.getItem(keyName);
      if(srcVal!=undefined){ has=true; }
      return has;
    },
    load_from_fallback:function(){ //when all other memory sources are not available (brand new open)
      var ret={load_from:'fallback'};
      var whichTemplate=appdata.getStartupTemplate();
      var template=appdata.getTemplate(whichTemplate['val']);
      for(var t in template){
        if(template.hasOwnProperty(t)){
          ret[t]=template[t];
        }
      }
      return ret;
    },
    load_from_files:function(){ //load from real disk file system files
      var ret={load_from:'files'};







      return ret;
    },
    load_from_browser:function(){ //load from html5 file system API
      var ret={load_from:'browser'};




      ret=this['load_from_fallback']();



      return ret;
    },
    load_from_memory:function(){ //load from memory (not saved to any other source)
      var ret={load_from:'memory'};




      ret=this['load_from_fallback']();



      return ret;
    }
  };
}());
