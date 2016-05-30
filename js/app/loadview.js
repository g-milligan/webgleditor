var loadview=(function(){
  return{
    init:function(){
      var self=this;
      //load the html blob and parse the individual files out of it
      var dataSrc=datainterface['getDataSource']();
      var start_data=datainterface['load_from_'+dataSrc]();
      var filesData=template_parser['getFilesData'](start_data['content']);
      filesData['objs'].push({
        path:'index.html', type:'f', svg:'xml_file_inverse', open:true, focus:true
      });
      //filenav menu
      var filenavData=filenav.init({
        wrap:'#file-system-nav:first',
        onopen:function(li,data){
          if(data['type']==='f'){
            //load the individual file content from the full content blob in memory
            codeminterface['openFile'](data['path']);
          }
        },
        paths:filesData['objs']
      });
    }
  };
}());
