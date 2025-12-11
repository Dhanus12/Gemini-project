package com.ai.gemini.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class QnaService {
    //access the api key and url
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    private  final WebClient webClient;

    public QnaService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public String getAnswer(String question) {
        Map<String,Object> requestBody=Map.of(
                "contents",new Object[]{
                        Map.of( "parts", new Object[]{
                                Map.of("text",question)
                        })
                }
        );
        //make Api call
        String response=webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey) // <-- FIXED
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return response;
    }
}
