export default {
	
	state: {
		activeIndex: -1,
		chats: []
	},
	
	mutations: {
		initChatStore(state) {
			state.activeIndex = -1;
		},
		openChat(state,chatInfo){
			let chat = null;
			for(let i in state.chats){
				if(state.chats[i].targetId === chatInfo.targetId){
					chat = state.chats[i];
					// 放置头部
					state.chats.splice(i,1);
					state.chats.unshift(chat);
					break;
				}
			}
			// 创建会话
			if (chat == null) {
				chat = {
					targetId: chatInfo.targetId,
					type: chatInfo.type,
					showName: chatInfo.showName,
					headImage: chatInfo.headImage,
					lastContent: "",
					lastSendTime: new Date().getTime(),
					unreadCount: 0,
					messages: [],
				};
				state.chats.unshift(chat);
			}

		},	
		activeChat(state,idx){
			state.activeIndex = idx;
			state.chats[idx].unreadCount=0;
		},
		removeChat(state,idx){
			state.chats.splice(idx, 1);
			if(state.activeIndex  >= state.chats.length){
				state.activeIndex = state.chats.length-1;
			}
		},
		
		insertMessage(state, msgInfo) {
			let targetId = msgInfo.selfSend?msgInfo.recvId:msgInfo.sendId;
			let chat = state.chats.find((chat)=>chat.targetId==targetId);
		
			chat.lastContent = msgInfo.content;
			chat.lastSendTime = msgInfo.sendTime;
			chat.messages.push(msgInfo);
			// 如果不是当前会话，未读加1
			if(state.activeIndex == -1 || state.chats[state.activeIndex].targetId != targetId){
				chat.unreadCount++;
			}
		},
		handleFileUpload(state,info){
			// 文件上传后数据更新
			let  chat = state.chats.find((c)=>c.targetId === info.targetId);
			if(chat){
				let msg = chat.messages.find((m)=>info.fileId==m.fileId);
				msg.loadStatus = info.loadStatus;
				if(info.content){
					msg.content = info.content;
				}
			}
		},
		updateChatFromUser(state, user){
			for(let i in state.chats){
				if(state.chats[i].targetId == user.id){
					state.chats[i].headImage = user.headImageThumb;
					state.chats[i].showName = user.nickName;
					break;
				}
			}
		},
		resetChatStore(state){
			console.log("清空store")
			state.activeIndex = -1;
			state.chats = [];
		}
	},
	
}