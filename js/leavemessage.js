// HTML5本地数据库对象
	function DataBase(){
		this.db=openDatabase('message','1.0','leaveMessages',2*1024*1024);
		this.createTable();
	}
	DataBase.prototype={
		//创建数据表
		createTable:function(){
			this.db.transaction(function(tx){
				tx.executeSql('create table if not exists leaveMessage (id unique,log)');
			});
		},
		// 添加数据
		setData:function(name,info){
			this.db.transaction(function(tx){
				tx.executeSql('insert into leaveMessage (id,log) values (?,?)',[name,info]);
				// tx.executeSql('INSERT INTO leaveMessages (id, log) VALUES (1, "www.runoob.com")');
			});
		},
		//获取所有数据
		getData:function(selectorId){
			this.db.transaction(function(tx){
				tx.executeSql('select * from leaveMessage',[],function(tx,rs){
					// id: 1832/03/22 15:15#1564648946131#留言者
					// log:留言内容
					
					var str='';


					for (var i = 0; i < rs.rows.length; i++) {
						var num=Math.ceil(Math.random()*7);
						// console.log(num);

						str+='<div class="media" data-time="'+rs.rows.item(i).id+'">';
							str+='<div class="media-left">';
								str+='<a href="#">';
									str+='<img class="media-object" src="images/nickPic'+num+'.jpg" alt="...">';
								str+='</a>';
							str+='</div>';
							str+='<div class="media-body">';
								str+='<h4 class="media-heading">';
									str+='<p class="leaveName">'+rs.rows.item(i).id.split('#')[2]+'</p>';
									str+='<span class="leaveTime">'+rs.rows.item(i).id.split('#')[0]+'</span>';
								str+='</h4>';
								str+='<div class="leaveInfo">'+rs.rows.item(i).log+'</div>';
							str+='</div>';
							str+='<i class="icon-bin"></i>';
						str+='</div>';
					}
					// console.log(str);
						
					$('#'+selectorId).html(str);
				})
			})
		},
		// 删除数据
		deleteData:function(id){
			this.db.transaction(function(tx){
				tx.executeSql('delete from leaveMessage where id=?',[id]);
				// tx.executeSql('delete from leaveMessage where id=123456');
				 // tx.executeSql("DROP TABLE leaveMessages");
			});
		},

	}
	// 留言对象
	function MessageBar(){
		this.inputHeight=$('.leave-mes-zone-wrap').outerHeight();
		this.winWidth=$(window).outerWidth();
		this.winHeight=$(window).outerHeight();
		this.height=0;
		this.dataBase=new DataBase();
		this.config={
			// 留言板容器
			messageCon:$('#messageList'),
			//保存新留言按钮
			saveMessage:$('#submit-info'),
			//留言称谓选框
			leaveName:$('#name'),
			//留言内容选框
			leaveDetail:$('#info'),
			//称谓提示icon
			tipIcon:$('.leavePanel i'),
			//留言内容为空提示p语段
			tipParagraph:$('.leavePanel .tip'),
		}
		this.init();
	}
	MessageBar.prototype={
		init:function(){
			this.dataBase.getData('messageList');
			this.bindEvents();
		},
		bindEvents:function(){
			var self=this;
			// 删除留言
			self.config.messageCon.on('click','.icon-bin',function(){
				var r=prompt('请输入删除密码~');
				if(r){
					if(r==='666666'){
						var id=$(this).parent().data('time');
						console.log(id);
						self.dataBase.deleteData(id);
						
						$(this).parent().slideUp();
						// $(this).parent().prev().css({
						// 	'borderBottom':0
						// })
					}else{
						alert('密码错误！');
					}
				}
			});
			// 添加新留言
			self.config.saveMessage.on('click',function(){
				var name=self.config.leaveName.val();
				var details=self.config.leaveDetail.val();

				// 中文开头，允许字母数字下划线中文，2-13个字符
				var reg=/^[\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{1,9}$/;

				console.log(reg.test(name));
				// 格式不正确，增加感叹号提示
				if(!reg.test(name)){
					self.config.tipIcon.fadeIn();
					return false;
				}else{
					self.config.tipIcon.fadeOut();
				}
				// 留言为空检测
				if(details==''){
					self.config.tipParagraph.slideDown();
					return false;
				}else{
					self.config.tipParagraph.fadeOut();
				}

				var time=self.getTime();
				var str=time+'#'+name;
				
				console.log(time);
				self.dataBase.setData(str,details);
				self.dataBase.getData('messageList');
				self.config.leaveName.val('');
				self.config.leaveDetail.val('');
			});
			//focus事件
			$('#info').on('focus',function(){
				$('.leavePanel .tip').slideUp();
			})
		},
		getTime:function(){

			var date=new Date();
			// console.log(date);
			var year=this.checkNum(date.getFullYear());
			var month=this.checkNum(date.getMonth()+1);
			var day=this.checkNum(date.getDate());
			var hour=this.checkNum(date.getHours());
			var minute=this.checkNum(date.getMinutes());
			var str='';
			str=year+'/'+month+'/'+day+' '+hour+':'+minute+'#'+date.getTime();
			console.log(str);
			return str;
		},
		checkNum:function(i){
			if(i<10){
				i='0'+i;
			}
			return i;
		},
	}
	var messageBar=new MessageBar();