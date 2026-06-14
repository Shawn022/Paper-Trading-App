package com.papertrading.backend.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

@Component
public class WebSocketEvents {

    @EventListener
    public void connect(SessionConnectEvent e) {
        System.out.println("STOMP CONNECT");
    }

    @EventListener
    public void subscribe(SessionSubscribeEvent e) {
        System.out.println("STOMP SUBSCRIBE");
    }
}
