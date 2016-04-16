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
  //workspace panels
  workspacePanels.init({
    wrap:'#frontend-ui #workspace #main_panels:first',
    panels_type:'columns',
    panels:[
      {
        selector:'#main_panel_left',
        start_size_percent:25,
        min_resize_px:80
      },
      {
        selector:'#main_panel_center',
        start_size_percent:50,
        min_resize_px:300
      },
      {
        selector:'#main_panel_right',
        start_size_percent:25,
        min_resize_px:80
      }
    ]

  });

});
