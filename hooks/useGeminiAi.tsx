//@ts-nocheck

import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { systemInstruction } from '~/constants';

export function useGeminiAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullResponse, setFullResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const simulationTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (fullResponse && fullResponse.length > 0) {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }

      let currentIndex = 0;
      const chunkSize = Math.max(3, Math.floor(fullResponse.length / 20));
      setDisplayedResponse('');

      simulationTimerRef.current = setInterval(() => {
        currentIndex = Math.min(currentIndex + chunkSize, fullResponse.length);
        const partialText = fullResponse.substring(0, currentIndex);
        setDisplayedResponse(partialText);

        if (currentIndex >= fullResponse.length) {
          clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
        }
      }, 100);
    }
  }, [fullResponse]);

  const generateCompletion = async (title, content) => {
    if (!title || !content) {
      setError('Title and content are required');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setFullResponse('');
    setDisplayedResponse('');

    try {
      const geminiKey = process.env.EXPO_PUBLIC_GEMINI_KEY || '';
      const genAI = new GoogleGenerativeAI(geminiKey);

      const generationConfig = {
        temperature: 0.7,
        topP: 1,
        topK: 0,
        maxOutputTokens: 2048,
        responseMimeType: 'text/plain',
      };

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction,
      });

      const prompt = `
        Title: ${title}
        Content (HTML): ${content}
        Continue and enhance the note in a natural way. Do not give the title again in the response.
        Do not include the original content in the response.
        Do not change the language already used in the content.
      `;
      const chat = model.startChat({
        generationConfig,
        safetySettings,
      });

      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();
      const cleanedText = responseText.replace(/```[a-z]*\n?/g, '');
      setFullResponse(cleanedText);
      setIsLoading(false);
      return cleanedText;
    } catch (error) {
      console.error('Gemini API Error:', error);
      setError(error.message || String(error));
      setIsLoading(false);
      return null;
    }
  };

  return {
    generateCompletion,
    isLoading,
    error,
    displayedResponse,
    fullResponse,
  };
}
