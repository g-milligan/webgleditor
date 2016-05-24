var loadview=(function(){
  return{
    init:function(){
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
            var fullContent=datainterface['load_from_memory']();
            var path=data['path']; if(path==='index.html'){ path=undefined; }
            var content=template_parser['getDataFileContent'](fullContent['content'], path);


            console.log(content);

          }
        },
        paths:filesData['objs']
      });
    }
  };
}());
