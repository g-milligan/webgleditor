var svg=(function(){
  return{
    get:function(key){
      var ret;
      var vectors={
        panel_toggle:{
          xml:'<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="900.000000pt" height="900.000000pt" viewBox="0 0 900 900" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,900.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M675 7328 c-3 -7 -4 -1289 -3 -2848 l3 -2835 3815 0 3815 0 0 2845 0 2845 -3813 3 c-3045 2 -3814 0 -3817 -10z m1865 -2838 l0 -2040 -517 2 -518 3 -3 2025 c-1 1114 0 2031 3 2038 3 9 117 12 520 12 l515 0 0 -2040z m4705 0 l0 -2035 -1880 0 -1880 0 -3 2025 c-1 1114 0 2031 3 2038 3 10 385 12 1882 10 l1878 -3 0 -2035z"/><path d="M4500 4485 c0 -1347 1 -1465 16 -1465 9 0 33 15 54 33 20 17 83 70 140 117 56 47 122 101 145 120 23 19 64 53 90 75 27 22 81 67 120 100 38 33 93 78 120 100 63 51 72 58 175 145 100 85 101 86 205 170 43 36 114 94 155 130 90 76 161 135 205 170 79 61 355 295 355 300 0 10 -34 42 -105 100 -37 30 -103 84 -145 120 -43 36 -122 102 -176 147 -55 45 -375 312 -712 593 -337 280 -620 510 -628 510 -12 0 -14 -199 -14 -1465z"/></g>'
        }
      };
      if(vectors.hasOwnProperty(key)){
        ret=vectors[key]['xml'];
      }
      return ret;
    },
    append:function(key, selectors){
      var xml=this['get'](key);
      if(xml!=undefined){
        for(var s=0;s<selectors.length;s++){
          var el=jQuery(selectors[s]);
          if(el.length>0){
            el.append(xml);
          }
        }
      }
    }
  };
}());
