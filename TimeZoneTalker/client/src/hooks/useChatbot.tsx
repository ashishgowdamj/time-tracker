import { useState, useCallback } from "react";
import { CHATBOT_QUESTIONS } from "@/lib/constants";
import { ChatbotQuestion } from "@shared/schema";

interface ChatbotResult {
  getResponse: (question: string, questions?: ChatbotQuestion[]) => string;
  findBestMatch: (input: string, questions: ChatbotQuestion[]) => ChatbotQuestion | null;
  generateFallbackResponse: () => string;
}

export function useChatbot(): ChatbotResult {
  // Get response for user's question
  const getResponse = useCallback((userInput: string, questions = CHATBOT_QUESTIONS): string => {
    // Try to find a matching predefined answer
    const match = findBestMatch(userInput, questions);
    
    if (match) {
      return match.answer;
    }
    
    // If no match found, return a fallback response
    return generateFallbackResponse();
  }, []);
  
  // Find the best matching question based on keywords
  const findBestMatch = useCallback((input: string, questions: ChatbotQuestion[]): ChatbotQuestion | null => {
    const inputLower = input.toLowerCase();
    
    // First, try exact question matches
    for (const q of questions) {
      if (inputLower === q.question.toLowerCase()) {
        return q;
      }
    }
    
    // Then, try keyword matching
    let bestMatch: ChatbotQuestion | null = null;
    let highestScore = 0;
    
    for (const q of questions) {
      let matchScore = 0;
      
      // Check each keyword
      for (const keyword of q.keywords) {
        if (inputLower.includes(keyword.toLowerCase())) {
          // Add points based on the specificity of the match
          matchScore += keyword.length;
        }
      }
      
      if (matchScore > highestScore) {
        highestScore = matchScore;
        bestMatch = q;
      }
    }
    
    // Only return match if score is above a threshold
    return highestScore > 3 ? bestMatch : null;
  }, []);
  
  // Generate a fallback response when no match is found
  const generateFallbackResponse = useCallback((): string => {
    const fallbackResponses = [
      "I'm sorry, I don't understand that question. Could you rephrase it or ask about time zones, scheduling, or language settings?",
      "I'm not sure I understand. You can ask me about scheduling sessions, managing time zones, or updating your language preferences.",
      "I don't have that information. Try asking about session scheduling, time zone conversion, or language learning features.",
      "I couldn't find an answer to that. Would you like to ask about time zones, scheduling, or your language progress?",
      "I'm still learning! For now, I can best help with questions about scheduling, time zones, and language settings."
    ];
    
    // Return a random fallback response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }, []);
  
  return {
    getResponse,
    findBestMatch,
    generateFallbackResponse
  };
}
