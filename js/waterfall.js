$(function(){
	$(window).on('resize',function(){
		waterfall();
	}).trigger('resize');
	
	// 伪数据
	var dataint={"data":[{"src":"32.jpg"},{"src":"33.jpg"},{"src":"34.jpg"},
	{"src":"35.jpg"},{"src":"36.jpg"},{"src":"37.jpg"},{"src":"38.jpg"},
	{"src":"39.jpg"},{"src":"40.jpg"},{"src":"41.jpg"},{"src":"42.jpg"},
	{"src":"43.jpg"},{"src":"44.jpg"},{"src":"45.jpg"},{"src":"46.jpg"},
	{"src":"47.jpg"},{"src":"48.jpg"},{"src":"49.jpg"},{"src":"50.jpg"},
	{"src":"51.jpg"},{"src":"52.jpg"},{"src":"53.jpg"},{"src":"54.jpg"},
	{"src":"55.jpg"},{"src":"56.jpg"},{"src":"57.jpg"},{"src":"58.jpg"},
	{"src":"59.jpg"},{"src":"60.jpg"},{"src":"61.jpg"},{"src":"62.jpg"},
	{"src":"63.jpg"},{"src":"64.jpg"},{"src":"65.jpg"},{"src":"66.jpg"},
	{"src":"67.jpg"},{"src":"68.jpg"},{"src":"69.jpg"},{"src":"70.jpg"}]};

	$(window).scroll(function(){
		// 若滚动高度比当前已加载的最后一张图片距离顶部加上本身高度的一半的时候执行加载图片操作
		if(($(document).scrollTop()+$(window).height())>$('.box').eq($('.box').length-1).offset().top){
			// 遍历伪数据库
			$(dataint.data).each(function(i,ele){
				$('<div class="box"><div class="pic"><img src="image/'+dataint.data[i].src+'"/></div></div>').appendTo('#main_body');
			});
			// 重新定位位置
			waterfall();
		}
	});
	// 瀑布流布局主函数
	function waterfall(){
		var $boxw=$('.box').outerWidth();
		var $winWidth=$(window).width();
		var cols=Math.floor($winWidth/$boxw);
		// console.log(cols);
		$('#main_body').css({'width':cols*$boxw,'margin':'0 auto'});
		// 存放每一列的总高度
		var harr=[];
		$('.box').each(function(i,ele){
			// 第一行的图片
			if(i<cols){
				//resize的时候适应屏幕
				$(this).css({
					left:$boxw*i,
					top:0
				});
				harr.push($(this).outerHeight());
			}else{//第二行开始之后的图片
				var minH=Math.min.apply(null,harr);//最小高度
				var minIndex=$.inArray(minH,harr);//取索引
				// console.log(minIndex);
				$(this).css({
					position:'absolute',
					left:$boxw*minIndex,
					top:minH
				});
				harr[minIndex]=$(this).outerHeight()+minH;
				minIndex=$.inArray(minH,harr);
			}
		});
	};

});