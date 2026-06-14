import { Client } from "@stomp/stompjs";

let client = null;

export function connectWebSocket() {

    if (client?.active) {
        return;
    }

    client = new Client({
        brokerURL: "ws://localhost:8080/ws",

        reconnectDelay: 5000,

        onConnect: () => {
            console.log("STOMP Connected");
        },

        onStompError: (frame) => {
            console.error(frame);
        },

        onWebSocketError: (error) => {
            console.error(error);
        }
    });

    client.activate();
}

export function subscribeToStock(symbol, callback) {

    if (!client) return null;

    if (!client.connected) {

        const interval = setInterval(() => {

            if (client.connected) {
                clearInterval(interval);

                client.subscribe(
                    `/topic/stocks/${symbol}`,
                    (message) => {
                        callback(
                            JSON.parse(
                                message.body
                            )
                        );
                    }
                );
            }

        }, 100);

        return {
            unsubscribe: () =>
                clearInterval(interval)
        };
    }

    return client.subscribe(
        `/topic/stocks/${symbol}`,
        (message) => {
            callback(
                JSON.parse(
                    message.body
                )
            );
        }
    );
}

export function disconnectWebSocket() {
    client?.deactivate();
}