jQuery(document).ready(function(){
  //add svg images
  svg.append('panel_toggle',
    [
      '#frontend-ui #main_panel_center .panel_ctls .btn_toggle_prev:first',
      '#frontend-ui #main_panel_center .panel_ctls .btn_toggle_next:first'
    ]
  );
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
        selector:'#main_panel_left:first',
        start_size_percent:25,
        min_resize_px:80
      },
      {
        selector:'#main_panel_center:first',
        start_size_percent:50,
        min_resize_px:300,
        btn_toggle_prev:{
          selector:'.panel_ctls .btn_toggle_prev:first'
        },
        btn_toggle_next:{
          selector:'.panel_ctls .btn_toggle_next:first',
          click_onload:true
        }
      },
      {
        selector:'#main_panel_right:first',
        start_size_percent:25,
        min_resize_px:80
      }
    ]
  });
  //filenav menu
  var filenavData=filenav.init({
    wrap:'#file-system-nav:first',
    onopen:function(li,data){
      if(data['type']==='f'){
        console.log('open: '+data['path']);
      }
    },
    paths:[
      {
        path:'index.html', type:'f', svg:'xml_file_inverse'
      },
      {
        path:'vendor/js/glMatrix.min.js'
      },
      {
        path:'js/webgl-utils.js'
      },
      {
        path:'css/styles.css'
      },
      {
        path:'html/canvas.html'
      },
      {
        path:'shaders/shader.vert'
      },
      {
        path:'shaders/shader.frag'
      },
      {
        path:'js/main.js'
      }
    ]
  });

});
