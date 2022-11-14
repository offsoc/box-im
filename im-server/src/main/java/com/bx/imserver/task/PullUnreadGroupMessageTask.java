package com.bx.imserver.task;

import com.bx.common.contant.RedisKey;
import com.bx.common.enums.WSCmdEnum;
import com.bx.common.model.im.GroupMessageInfo;
import com.bx.imserver.websocket.WebsocketServer;
import com.bx.imserver.websocket.processor.MessageProcessor;
import com.bx.imserver.websocket.processor.ProcessorFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class PullUnreadGroupMessageTask extends  AbstractPullMessageTask {

    @Autowired
    private WebsocketServer WSServer;

    @Autowired
    private RedisTemplate<String,Object> redisTemplate;



    @Override
    public void pullMessage() {
        // 从redis拉取未读消息
        String key = RedisKey.IM_UNREAD_GROUP_MESSAGE + WSServer.getServerId();
        List messageInfos = redisTemplate.opsForList().range(key,0,-1);
        for(Object o: messageInfos){
            redisTemplate.opsForList().leftPop(key);
            GroupMessageInfo messageInfo = (GroupMessageInfo)o;
            MessageProcessor processor = ProcessorFactory.createProcessor(WSCmdEnum.GROUP_MESSAGE);
            processor.process(messageInfo);
        }
    }



}