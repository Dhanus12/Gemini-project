package com.ai.gemini.ai;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/qna")
@AllArgsConstructor

@CrossOrigin(origins = "${frontend.url}") // ✅ Use env variable
public class AIController {


    private final  QnaService qnaService;
    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody Map<String,String> payload){
        String question = payload.get("question");
        String answer=qnaService.getAnswer(question);
        return ResponseEntity.ok(answer);
    }

}

