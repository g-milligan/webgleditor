var loadview=(function(){
  return{
    init:function(){
      var dataSrc=datainterface['getDataSource']();
      var start_data=datainterface['load_from_'+dataSrc]();
      var dataFiles=template_parser['getDataFileElements'](start_data['content']);






      
      var test='';
    }
  };
}());
