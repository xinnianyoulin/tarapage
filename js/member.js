$('.member-info').on('click','.info-item i',function(){
	// 判断详情panel状态
	var state=$(this).hasClass('icon-circle-down');
	// console.log(state);

	// 获取需要展开的高度
	var needHeight=$(this).siblings('.info').height();
	// console.log(needHeight);

	//获取初始高度
	var startHeight=$(this).siblings('.desc').height();

	if(state){
		// 打开详情
		$(this).removeClass('icon-circle-down').addClass('icon-circle-up');
		// $(this).parent().animate({
		// 	'height':needHeight,
		// },function(){$(this).addClass('openInfo')});
		$(this).parent().addClass('openInfo').animate({
			'height':needHeight,
		});
	}else{
		// 关闭详情
		$(this).removeClass('icon-circle-up').addClass('icon-circle-down');
		// $(this).parent().animate({
		// 	'height':startHeight,
		// },function(){$(this).removeClass('openInfo')});
		$(this).parent().removeClass('openInfo').animate({
			'height':startHeight,
		});
	}
});
// 添加事件
function showMoreInfo(){
	$('.info-item .info').each(function(i,ele){
		if($(this).height()>50){
			// console.log(this);
			$(this).parent().append('<i class="icon-circle-down"></i>');
		}
	});
}
// 加载数据
getInfo('朴智妍',1);
getInfo('李居丽',2);
getInfo('朴素妍',3);
getInfo('朴孝敏',4);
getInfo('全宝蓝',5);
getInfo('含恩静',6);
// showMoreInfo();
setTimeout(function(){
	showMoreInfo();
},300)

// $.when(
// 	getInfo('朴智妍',1),
// 	getInfo('李居丽',2),
// 	getInfo('朴素妍',3),
// 	getInfo('朴孝敏',4),
// 	getInfo('全宝蓝',5),
// 	getInfo('含恩静',6)
// ).then(function(){
// 	showMoreInfo();
// 	console.log('1');
// },function(){
// 	console.log('2');
// })

function getInfo(name,pageNum){
	$.ajax({
		type:'GET',
		// async:false,
		url:'https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key='+name,
		dataType:'jsonp',
		success:function(data){
			// console.log(data);
			// console.log(data.card[0].name);//desc
			// console.log(data.card[0].value[0]);//info
			var str='';
			var data=data.card;

			for (var i = 0; i < data.length; i++) {

				str+='<li class="info-item col-md-6">';
					str+='<span class="desc">'+data[i].name+'</span>';

					var pInfo='';
					for (var j = 0; j < data[i].value.length; j++) {
						
						pInfo+=data[i].value[j];
						
					}
					// console.log(pInfo);
					str+='<p class="info">'+pInfo+'</p>';
				str+='</li>';
			}
			// console.log(str);
			$('.page'+pageNum).find('.member-info').html(str);
			
		},
		error:function(){
			// return '出错啦~';
			// console.log('wrong');
		}
	})
}






