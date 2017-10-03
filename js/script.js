// tooltip初始化
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

// 顶部导航栏高度变化(暴露全局)
// (function(){
	var $body=$('body');
	var $navbarBrand=$('.navbar-reset,.navbar-reset .navbar-brand');
	var $navbarIcon=$('#nav .icon-crown');
	var $navbarToggle=$('.navbar-reset .navbar-toggle');
	var $navbarALink=$('.navbar-reset .navbar-nav > li > a');

	$(window).on('scroll',topBarHeight);
	function topBarHeight(){
		var scrollTop=$(document).scrollTop();
		if(scrollTop>50){
			// console.log(scrollTop);
			$navbarBrand.css({height:'60px'});
			$body.css({'margin-top':'60px'});
			$navbarIcon.css({'line-height':'50px'});
			$navbarToggle.css({'top':'5px'});
			$navbarALink.css({'height':'60px','line-height':'60px'});
		}else{
			$navbarBrand.css({height:'80px'});
			$body.css({'margin-top':'80px'});
			$navbarIcon.css({'line-height':'65px'});
			$navbarToggle.css({'top':'15px'});
			$navbarALink.css({'height':'80px','line-height':'80px'});
		}
	};
// })();

// news-loading
// 
(function(){
	var curPage=1;
	getNewsList(1)
	function getNewsList(page){
		$.ajax({
			url:'https://idol.yinyuetai.com/article/artist-articles?&artistId=1559&page='+page+'&pageSize=10',
			dataType:'jsonp',
			type:'GET',
			success:function(data){
				// console.log(data);
				// console.log(data.articles);

				var data=data.articles;
				
				for (var i = 0; i < data.length; i++) {
					var str='';
					
						str+='<div class="row">';
							str+='<div class="news-image col-md-5 col-sm-5 col-xs-12">';
								str+='<a href="http://news.yinyuetai.com/article/'+data[i].id+'" target="_blank">';
									str+='<img class="media-object" src="'+data[i].image+'" alt="...">';
								str+='</a>';
							str+='</div>';
							str+='<div class="news-info col-md-7 col-sm-7 col-xs-12">';
								str+='<h4 class="news-heading">';
									str+='<p class="news-title">';
										str+='<a href="http://news.yinyuetai.com/article/'+data[i].id+'" target="_blank">'+data[i].title+'</a>';
									str+='</p>';
									str+='<span class="news-date">音悦台&nbsp;&nbsp;&nbsp;&nbsp;'+data[i].datetime+'</span>';
								str+='</h4>';
								str+='<div class="news-details">';
									str+='<a href="http://news.yinyuetai.com/article/'+data[i].id+'" target="_blank">'+data[i].summary+'</a>';
								str+='</div>';
							str+='</div>';
						str+='</div>';

					$('<div class="news-item"></div>').html(str).appendTo($('.news-content'));
				}
				// console.log(str);
					
			},
			error:function(){
				console.log('error');
			}
		})
	}


	// loading-more-news
	var $loading=$('.loading-more');
 	$('#content').on('click','.loading-more',function(){
 		// console.log($(this));
 		$(this).html('');
 		$(this).css({
 			'background-image': 'url(images/loadingMore.gif)',
			'background-color': 'rgb(252,210,88)',
 		});
 		setTimeout(function(){
 			curPage++;
 			getNewsList(curPage);
 			$loading.html('点击加载更多内容');
 			$loading.css({
 			'background-image': '',
			'background-color': '',
 		});
 		},1200);
 	})

})();

// ajax跳转，实现单页面
(function(){
	var winWidth=$(window).width();
	var	isSmallScreen=winWidth<768 ? true:false;
	// console.log(window.location.hash);
	var	now=window.location.hash.split('#')[1];
	// 导航
	var aLink=$('#nav .navbar-nav').find('a');
	// 渲染页面
	checkAddress();

	aLink.each(function(i,ele){
		if($(this).attr('href')=='#'+now){
			$(this).parent().addClass('active').siblings().removeClass('active');
			$(this).parent().parent().siblings().find('li').removeClass('active');
		}
	})

	aLink.on('click',function(){
		// console.log($(this));
		// 去除active下划线
		$(this).parent().addClass('active').siblings().removeClass('active');
		$(this).parent().parent().siblings().find('li').removeClass('active');
		now=$(this).data('local');

		// 小屏幕点击导航后自动关闭面板
		if(isSmallScreen){
			$('.navbar-toggle').click();
		}
		
		// 删除scroll事件冲突
		if(now!='waterfall' || now!='musicVideo'){
			$(window).off('scroll');
		}
		// 重新启用顶部导航栏的动态
		$(window).on('scroll',topBarHeight);

		checkAddress();
	});
	// 获取页面的数据
	function getShowData(url){
		$.ajax({
			type:'GET',
			url:url,
			success:function(data){
				// console.log(data);
				$('#content').html(data);
			},
			error:function(){
				console.log('error!');
			}
		})
	}
	// 检索当前地址栏是否存在锚点
	function checkAddress(){
		// console.log(now);
		if(!now){
			now='Home';
			checkMobile();
		}else{
			if(now=='Home'){
				checkMobile();
			}else{
				getShowData(now+'.html');
			}
		}
		
		//waterfall单独的背景图片
		if(now=='waterfall'){
			$('body').css({
				'background':'url(image/bgI-waterfall.jpg) repeat',
				'background-attachment':'fixed',
				'background-size': 'cover',
			});
			$('footer').hide();
		}else{
			$('body').css({
				'background':'',
				'background-attachment':'',
				'background-size': '',
			});
			$('footer').show();
		}
	}
	// 检索当前设备是否是移动端
	function checkMobile(){
		if(isSmallScreen){
			getShowData(now+'Mobile.html');
			// console.log('移动端');
		}else{
			getShowData(now+'PC.html');
			// console.log('PC端');
		}
	}
})();
