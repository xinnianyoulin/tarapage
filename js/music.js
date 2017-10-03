(function(){
	//音乐播放器对象
	function Music(){
		this.timer=null;
		this.flag='close';
		this.$audio=$('audio')[0];
		this.config={
			//播放暂停按钮
			playButton:$('#music .music-button'),
			//正在播放的音乐名字存放的容器
			musicNameCon:$('#music .music-name'),
			//当前音乐总时间容器
			musicAllTime:$('#music .music-allTime'),
			//音乐播放的当前时间容器
			musicCurTime:$('#music .music-curTime'),
			//播放进度的进度条容器
			musicProgressCon:$('#music .music-progress'),
			//播放进度的进度条
			musicProgress:$('#music .music-progress-cur'),
			//静音按钮
			musicMute:$('#music .music-volume'),
		}
		this.init();
	}
	Music.prototype={
		// 入口函数
		init:function(){
			this.musicStatus();
			this.playMusic();
			this.changeVolume();
		},
		// 当前播放器状态--是否正在播放
		musicStatus:function(){
			var self=this;
			this.$audio.addEventListener('canplaythrough',function(){
				$('.loading').fadeOut();
			});
			this.$audio.addEventListener('play',function(){
				self.config.playButton.find('i').addClass('icon-pause').removeClass('icon-play');
				self.update();
				// $('.musicSwitch').addClass('onPlay');
				// console.log('1');
			});
			// this.$audio.addEventListener('ended',function(){
			// 	$('.musicSwitch').removeClass('onPlay');
			// });
			
		},
		//获取当前音乐总时间
		getAllTime:function(index){
			var musicAllTime=parseInt(this.$audio.duration);
			// console.log(musicAllTime);
			// 
			var allMinute=this.checkNum(parseInt(musicAllTime/60));
			var allSecond=this.checkNum(parseInt(musicAllTime%60));

			var allTime=allMinute+':'+allSecond;
			// console.log(allTime);
			this.config.musicAllTime.html(allTime);
		},
		// 获取当前播放时间
		getCurTime:function(index){
			// 获取当前时间
			var musicCurTime=parseInt(this.$audio.currentTime);
			// console.log(musicCurTime);
			// 
			var curMinute=this.checkNum(parseInt(musicCurTime/60));
			var curSecond=this.checkNum(parseInt(musicCurTime%60));

			var curTime=curMinute+':'+curSecond;
			// console.log(curTime);
			this.config.musicCurTime.html(curTime);

			// 根据当前时间设置进度条
			var musicAllTime=parseInt(this.$audio.duration);
			var thisWidth=this.config.musicProgressCon.outerWidth();
			var curWidth=(this.$audio.currentTime/musicAllTime)*thisWidth;
			this.config.musicProgress.css('width',curWidth);
		},
		//处理获取到的文件路径，提取文件名
		checkMusicName:function(str){
			var str=str.split('/');
			var name=str[str.length-1].split('.');
			return name[0];
		},
		// 处理数值低于10的数据，进行补零
		checkNum:function(i){
			if(i<10){
				i='0'+i;
			}
			return i;
		},
		// 设置音量
		changeVolume:function(){
			// 静音
			var self=this;
			var volume=this.$audio.volume;
			this.config.musicMute.on('click',function(){
				
				if(self.$audio.volume){
					$(this).find('i').addClass('icon-volume-mute').removeClass('icon-volume-medium');
					self.$audio.volume=0;
				}else{
					$(this).find('i').addClass('icon-volume-medium').removeClass('icon-volume-mute');
					self.$audio.volume=volume;
				}
			});
		},
		//添加播放暂停按钮事件
		playMusic:function(){
			var self=this;
			self.config.playButton.on('click',function(e){
				if(self.$audio.paused){
					self.$audio.play();
					self.update();
					// console.log('play');
					e.stopPropagation();
				}else if(!self.$audio.paused){
					$(this).find('i').addClass('icon-play').removeClass('icon-pause');
					self.$audio.pause();
					clearInterval(self.timer);
					// console.log('pause');
					e.stopPropagation();
				}
				
			})
		},
		//更新音乐播放进度
		update:function(){
			var self=this;
			this.timer=setInterval(function(){
				self.getCurTime();
				self.getAllTime();
			},1000);
		},
	}
	var music=new Music();
	// 点击列表播放音乐
	$('#content').on('click','#musicVideo .music-list li',function(e){
		// 当前点击的位置
		console.log('点击音乐');
		var clickX=$(e.target).offset().left;
		var clickY=$(e.target).offset().top;
		// console.log('点击的位置：'+clickX,clickY);
		// 目标位置（右侧音乐控件的位置）
		var musicSwitchX=$('.music-wrap').offset().left;
		var musicSwitchY=$('.music-wrap').offset().top;
		// console.log('控件的位置：'+musicSwitchX,musicSwitchY);
		// 相对位置
		var moveX=parseInt(musicSwitchX-clickX);
		var moveY=parseInt(musicSwitchY-clickY);
		// console.log('差值：'+moveX,moveY);
		// 设置初始位置
		$('#moveMusicIcon').css({
			'transform':'translate(-'+moveX+'px,-'+moveY+'px)',
		}).show();
		// 延迟后设置目的位置
		setTimeout(function(){
			$('#moveMusicIcon').css({
				'transform':'translate(0,0)'
			})
		},100);
		// 设置淡出
		setTimeout(function(){
			$('#moveMusicIcon').fadeOut();
		},500);
		// console.log('transform:translate(-'+moveX+'px,-'+moveY+'px)');

		$('.loading').fadeIn();
		$(window).scroll();
		// 获取data属性内容src
		var musicSrc=$(this).data('music');
		// console.log(musicSrc);
		// 设置src
		$('#music').find('audio').attr('src',musicSrc);
		// 播放控件打开不旋转,未打开旋转
		if(flag=='close'){
			// 右侧控件旋转动画
			$('.musicSwitch').addClass('onPlay');
		}
		// 正在播放的音乐名称
		$('#music .music-name').html($(this).find('.musicName').html())
	})
	// 默认播放控件隐藏
	$('#music').css({
		'right':-$('#music').outerWidth(),

	});
	

	$(window).on('resize',function(){
		// 判断是否为小屏幕
		var winWidth=$(window).width();
		var isSmallScreen=winWidth<768?true:false;

		// console.log(winWidth-$('#music').parent().offset().left);

		if(isSmallScreen){
			$('#music').css({
				// 距离左侧测屏幕5个像素距离
				'width':$('#music').parent().offset().left-5,
			})
		}
	}).trigger('resize');
	
	// 右侧控件状态
	var flag='close';//播放控件打开不旋转,未打开旋转右侧控件

	// 右侧控件点击事件
	$('.musicSwitch').on('click',function(){
		if(flag=='open'){
			// 关闭播放控件
			flag='close';
			// 判断音乐播放状态
			if(!$('audio')[0].paused){
				$('.musicSwitch').addClass('onPlay');
			}
			// 原型和方形切换
			$(this).animate({
				'borderRadius':'23px',
			});
			// 向右移动动画
			$('#music').stop().animate({
				'right':-$('#music').outerWidth(),
			}).fadeOut();

		}else{
			// 打开播放控件
			flag='open';
			// 停止旋转
			$('.musicSwitch').removeClass('onPlay');
			// 变成方形
			$(this).animate({
				'borderRadius':'0',
			});
			// 向左移动动画
			$('#music').stop().fadeIn().animate({
				'right':0,
			});
		}
		
	})

})();