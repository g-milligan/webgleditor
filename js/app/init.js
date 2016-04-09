jQuery(document).ready(function(){
  //main top navigation
  navDropdown.init({
    top_ul:'#topnav > ul:first',
    data_ids:{
      newproject:function(li){
        li.children('span:first').click(function(e){
          alert('new project');
        });
      },
      openproject:function(li){
        li.children('span:first').click(function(e){

        });
      },
      saveproject:function(li){
        li.children('span:first').click(function(e){

        });
      },
      saveasproject:function(li){
        li.children('span:first').click(function(e){

        });
      },
      light:function(li){
        li.children('span:first').click(function(e){

        });
      },
      dark:function(li){
        li.children('span:first').click(function(e){

        });
      },
      layout:function(li){
        li.children('span:first').click(function(e){

        });
      }
    }
  });


});
