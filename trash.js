      $.fn.editable.defaults.mode = 'inline';
      $("tbody a.text").editable({

        url:function(params){

          console.log(params);

          var data={
            "zdmc":nowRow[0].innerText,
            "xsmc":nowRow[1].innerText,
            "sjlx":nowRow[2].innerText,
            "mjzddw":nowRow[3].innerText,
            "zdxh":nowRow[4].innerText,
            "sfxs":nowRow[5].innerText,
            "sfss":nowRow[6].innerText,
            "sfbz":nowRow[7].innerText
          }

          if(data.zdmc==='')data.zdmc=params.value;
          if(data.xsmc==='')data.xsmc=params.value;
          if(data.sjlx==='')data.sjlx=params.value;
          if(data.mjzddw==='')data.mjzddw=params.value;
          if(data.zdxh==='')data.zdxh=params.value;
          if(data.sfxs==='')data.sfxs=params.value;
          if(data.sfss==='')data.sfss=params.value;
          if(data.sfbz==='')data.sfbz=params.value;
          
         
          $.ajax({
            type:"POST",
            url:"http://120.78.146.16:3000",
            data:data,
            success:function(){
              alert("成功")
            },
            error:function(){
              alert("失败")
            }
          })

        },


        validate:function(value){
          if(!$.trim(value)){
            return "不能为空";
          }
        }
      });


      $('tbody a.select-datatype').editable({
        value: 2,    
        source: [
              {value: 1, text: 'Active'},
              {value: 2, text: 'Blocked'},
              {value: 3, text: 'Deleted'}
           ]
    });