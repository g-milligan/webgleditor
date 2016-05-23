var template_parser=(function(){
  return{
    getDataFileElements:function(content){
      var ret;
      if(typeof content==='string'){
        var parseHtml=jQuery('<div>'+content+'</div>');
        ret=parseHtml.find('[data-file]');
      }
      return ret;
    }
  };
}());
