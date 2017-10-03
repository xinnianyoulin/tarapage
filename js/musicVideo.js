(function(){
	// 视频对象
		function Video(){
			this.$video=$('video')[0];
			this.timer=null;//循环
			this.time=null;//延迟
			this.config={
				// 点击面板和按钮实现暂停播放
				playPanel:$('#video .play-btn,#video'),
				//视频面板
				video:$('#video'),
				// 菜单面板
				menu:$('#video .menu'),
				// 播放按钮
				playButton:$('#video .play-btn'),
				// 全屏播放按钮
				playButtonBig:$('#video .play-btn-big'),
				// 进度条包裹层
				progressCon:$('#video .progress-wrap'),
				// 进度条
				progress:$('#video .progress-cur'),
				//当前时间
				curTime:$('#video curTime'),
				//总时间
				allTime:$('#video .allTime'),
				// 静音按钮
				volumeButton:$('#video .volume'),
				// 全屏按钮
				fullScreenBtn:$('#video .fullscreen'),
				//关闭视频按钮
				closeBtn:$('#video .close-btn'),
			}
			this.init();
		}
		Video.prototype={
			init:function(){
				this.mainLoop();
				this.bindEvent();
			},
			bindEvent:function(){
				var self=this;
				this.$video.addEventListener('canplaythrough',function(){
					$('.loading').fadeOut();
				});
				// menu面板显示隐藏
				self.config.video.on('mouseenter',function(){
					console.log('enter');
					
					self.config.menu.stop().animate({'bottom':'0px'});
					self.config.closeBtn.fadeIn();
				}).on('mouseleave',function(){
					console.log('out');
					if(self.time){
						clearTimeout(self.time);
					}
					self.time=setTimeout(function(){
						self.config.menu.stop().animate({'bottom':'-30px'});
						self.config.closeBtn.fadeOut();
					},1000);
					
				}).on('click',function(e){
					e.stopPropagation();
				});
				//绑定静音按钮
				self.config.volumeButton.on('click',function(){
					if(self.$video.volume){
						$(this).find('i').addClass('icon-volume-mute').removeClass('icon-volume-medium');
						self.$video.volume=0;
					}else{
						$(this).find('i').addClass('icon-volume-medium').removeClass('icon-volume-mute');
						self.$video.volume=1;
					}
					
				});
				// 播放按钮和视频区域点击事件
				this.config.playPanel.on('click',function(){
					if(self.$video.paused){
						self.config.playButton.find('i').addClass('icon-pause').removeClass('icon-play');
						self.config.playButtonBig.fadeOut(500).find('i').addClass('icon-pause').removeClass('icon-play');
						self.$video.play();
						self.mainLoop();
					}else{
						self.config.playButton.find('i').addClass('icon-play').removeClass('icon-pause');
						self.$video.pause();
						self.config.playButtonBig.fadeIn(500).find('i').addClass('icon-play').removeClass('icon-pause');
						clearInterval(self.timer);
					}
				});
				//点击菜单区域，阻止事件冒泡
				self.config.menu.on('click',function(e){
					e.stopPropagation();
				});
				self.config.fullScreenBtn.on('click',function(){
					self.$video.webkitRequestFullScreen()
				});
				//关闭视频按钮事件
				self.config.closeBtn.on('click',function(e){
					// 动画一-渐渐淡出
					// self.config.video.fadeOut(500,function(){
					// 	$(this).find('video').attr('src','');
					// })
					// 动画二-放大缩小
					self.config.video.css({
						'transform':'scale(0)'
					});
					setTimeout(function(){
						self.config.video.find('video').attr('src','');
					},500);
					
					$('#mask').fadeOut();

					e.stopPropagation();
				});
				// 视频区域外点击关闭视频
				$(document).on('click',function(){
					self.config.closeBtn.click();
				});
				$
			},
			// 主循环
			mainLoop:function(){
				var self=this;
				self.setAllTime();
				self.timer=setInterval(function(){
					self.setCurTime();
					self.setProgress();
				},1000);
			},
			// 设置当前播放时间
			setCurTime:function(){
				var curTime=this.$video.currentTime;
				// console.log(curTime);
				var time=this.formatTime(curTime);
				this.config.curTime.html(time);
				return curTime;
			},
			// 设置播放总时间
			setAllTime:function(){
				var allTime=this.$video.duration;
				// console.log(allTime);
				var time=this.formatTime(allTime);
				this.config.allTime.html(time);
				return allTime;
			},
			//设置进度条状态
			setProgress:function(){
				var curTime=this.setCurTime();
				var allTime=this.setAllTime();

				var progressWidth=this.config.progressCon.outerWidth();
				var curWidth=(curTime/allTime)*progressWidth;
				this.config.progress.css('width',curWidth);
			},
			//整理显示时间字符串
			formatTime:function(time){

				var minute=this.checkNum(parseInt(time/60));
				var second=this.checkNum(parseInt(time%60));
				
				var str='';
				str=minute+':'+second;
				return str;
			},
			//处理小于10的数字
			checkNum:function(i){
				if(i<10){
					i='0'+i;
				}
				return i;
			}
		}
		// 实例化视频源1
		var video=new Video();

	// 添加点击视频区块播放事件

	$('#musicVideo .musicItem').on('click',function(e){
		e.stopPropagation();
		// console.log('1');
		$('.loading').fadeIn();
		
		var $video=$('#video');
		// 获取视频src
		var curSrc=$(this).find('img').data('src');
		// console.log(curSrc);
		// 设置src
		// $video.find('video').attr('src',curSrc).end().show();
		//做动画
		$video.find('video').attr('src',curSrc).end().show().css({
			'transform':'scale(1)'
		});

		// 获取窗口大小
		var winWidth=$(window).outerWidth();
		var winHeight=$(window).outerHeight();
		// 获取当前滚动高度
		var curTop=$(window).scrollTop();
		// 判断是不是移动设备/小屏幕
		var isSmallScreen=winWidth<768?true:false;
		// 是小屏幕设备播放区域的宽度就取窗口宽度
		if(isSmallScreen){
			$video.find('video').attr('width',winWidth).attr('height',winWidth*9/16).end().css({
				'width':winWidth,
				// 采用16:9的比例
				'height':winWidth*9/16,
				'position':'absolute',
				// 将其定位到屏幕中央
				'left':0,
				'top':curTop+(winHeight-$video.height())/2,
			});

		}else{
			// 不是小屏幕设备-宽度高度使用默认值
			$video.css({
				'position':'absolute',
				// 定位至中央
				'left':(winWidth-$video.width())/2,
				'top':curTop+(winHeight-$video.height())/2,
			});
		}
		// 遮罩层
		var $mask=$('#mask');
		$mask.css({
			'position':'absolute',
			'top':curTop,
			'width':winWidth,
			'height':winHeight,
			'background-color':'rgba(255,255,255,0.35)'
		}).fadeIn();

		// 监听滚动事件
		$(window).on('scroll',function(){
			// 若没有播放视频不执行函数
			if($video[0].style.transform=='scale(0)'){
				return false;
			}
			var curTop=$(window).scrollTop();
			// console.log(curTop);
			$video.css({
				'top':curTop+(winHeight-$video.height())/2,
			})
			$mask.css({
				'top':curTop,
			})
			
		})
	});


	// 音悦台搜索更多mv
	// 

	$('.search-yinyuetai').on('focus',function(){
		$(window).keyup(function(e){
			// console.log(e.which);
			if(e.which==13){
				var keyword=$('.search-yinyuetai').val();
				window.open('http://so.yinyuetai.com/?keyword='+keyword);
			}
		})
	});

	$(window).resize(function(){
		var imgWidth=$('#musicVideo .musicItem').find('img').outerWidth();
		var imgHeight=$('#musicVideo .musicItem').find('img').outerHeight();


		$('#musicVideo .musicItem').find('.mask').css({
			'width':imgWidth,
			'height':imgHeight,
		})

	// loading
	// 
		var $loadingSpan=$('.loading span');
		$loadingSpan.css({
			'top':($(window).height()-$loadingSpan.height())/2,
			'left':($(window).width()-$loadingSpan.width())/2,
		});
		$('.loading').css({
			'width':$(window).width(),
			'height':$(window).height(),
			'display':'none',
		})
	}).trigger('resize');

	$(window).scroll(function(){
		if($('.loading')[0].style.display=='none'){
			return false;
		}
		var curScrollTop=$(window).scrollTop();
		// console.log(curScrollTop);

		$('.loading').css({
			'top':curScrollTop,
		})
	});




})();