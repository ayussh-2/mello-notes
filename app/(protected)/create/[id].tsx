import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  Text,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Container } from '~/components/Container';
import FormattingButtons from '~/components/create-notes/FormattingButtons';
import Navbar from '~/components/layout/Navbar';
import GeminiButton from '~/components/create-notes/GeminiButton';
import { getEditorHTML } from '~/constants';
import { useLocalSearchParams } from 'expo-router';
import { useNotesStore } from '~/store/notesStore';
import { useGeminiAI } from '~/hooks/useGeminiAi';

const CreateNote = () => {
  const { id } = useLocalSearchParams();
  const noteId = Array.isArray(id) ? id[0] : id;
  const [editorReady, setEditorReady] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

  const {
    generateCompletion,
    isLoading: aiLoading,
    error: aiError,
    displayedResponse,
  } = useGeminiAI();

  const {
    currentNote,
    isLoading,
    lastSaved,
    contentChanged,
    getNoteById,
    createNote,
    updateNote,
    setContentChanged,
    setIsSaving,
  } = useNotesStore();

  const webViewRef = useRef<WebView | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const AUTO_SAVE_INTERVAL = 30000;
  const TYPING_TIMEOUT = 2000;
  const title = currentNote?.title || '';
  const content = currentNote?.content || 'Write Something Amazing...';
  const [existingNoteId, setExistingNoteId] = useState<string | null>(null);
  const [showFormatting, setShowFormatting] = React.useState<boolean>(false);

  useEffect(() => {
    if (displayedResponse && webViewRef.current && editorReady) {
      const escapedText = displayedResponse
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');

      webViewRef.current.injectJavaScript(`
        (function() {
          try {
            const editor = document.getElementById('editor');
            if (!editor.innerHTML.includes("ai-generated-content")) {
              editor.innerHTML += '<div class="ai-generated-content"></div>';
            }
            
            const aiContent = document.querySelector('.ai-generated-content');
            aiContent.innerHTML = "${escapedText}";
            
            editor.scrollTop = editor.scrollHeight;
            
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'contentChanged' })
            );
          } catch (err) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'error', message: err.toString() })
            );
          }
          return true;
        })();
      `);
    }
  }, [displayedResponse, editorReady]);

  useEffect(() => {
    if (aiError) {
      Alert.alert('Error', `Failed to generate content: ${aiError}`);
    }
  }, [aiError]);

  const executeCommand = (command: string): void => {
    const script = `document.execCommand('${command}', false, null); true;`;
    webViewRef.current?.injectJavaScript(script);
  };

  const handleTitleChange = (newTitle: string) => {
    if (currentNote) {
      useNotesStore.setState({
        currentNote: { ...currentNote, title: newTitle },
        contentChanged: true,
      });

      setUserIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setUserIsTyping(false);
      }, TYPING_TIMEOUT);
    }
  };

  const handleSave = async (autoSave: boolean = false): Promise<void> => {
    if (autoSave && userIsTyping) {
      return;
    }

    if (!autoSave) {
      setIsSaving(true);
    }

    webViewRef.current?.injectJavaScript(`
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'save', content: document.getElementById('editor').innerHTML, title: '${title}', autoSave: ${autoSave} })
      );
      true;
    `);
  };

  const setupContentChangeDetection = () => {
    webViewRef.current?.injectJavaScript(`
      const editor = document.getElementById('editor');
      
      editor.addEventListener('input', function() {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'contentChanged', isTyping: true })
        );
      });
      
      // Let React Native know the editor is ready
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'editorReady' })
      );
      
      true;
    `);
  };

  const handleMessage = async (event: NativeSyntheticEvent<any>): Promise<void> => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'fontsLoaded' || data.type === 'editorReady') {
        setupContentChangeDetection();
        setEditorReady(true);
      } else if (data.type === 'contentChanged') {
        setContentChanged(true);

        if (data.isTyping) {
          setUserIsTyping(true);

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          typingTimeoutRef.current = setTimeout(() => {
            setUserIsTyping(false);
          }, TYPING_TIMEOUT);
        }
      } else if (data.type === 'save') {
        if (existingNoteId === 'new') {
          if (currentNote) {
            const savedNoteId = await createNote({
              title: currentNote.title,
              content: data.content,
              user_id: currentNote.user_id || 'anonymous',
            });
            if (savedNoteId) setExistingNoteId(savedNoteId);
          }
        } else if (existingNoteId) {
          await updateNote(existingNoteId!, {
            title: currentNote?.title,
            content: data.content,
          });
        }

        if (!data.autoSave) {
          setIsSaving(false);
        }
      } else if (data.type === 'getCurrentContent') {
        generateCompletion(title, data.content);
      } else if (data.type === 'error') {
        console.error('WebView error:', data.message);
      }
    } catch (error) {
      console.error('Error processing WebView message:', error);
      if (!data?.autoSave) {
        setIsSaving(false);
      }
    }
  };

  const handleWebViewLoad = () => {
    setTimeout(() => {
      setupContentChangeDetection();
    }, 500);
  };

  const handleAutoComplete = async () => {
    if (currentNote) {
      handleSave(true);
    }

    if (!webViewRef.current || !editorReady) {
      Alert.alert('Error', 'Editor not ready. Please try again.');
      return;
    }

    webViewRef.current.injectJavaScript(`
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ 
          type: 'getCurrentContent', 
          content: document.getElementById('editor').innerHTML 
        })
      );
      true;
    `);
  };

  useEffect(() => {
    async function getNote() {
      const newId = (await getNoteById(noteId || 'new')) ?? 'new';
      setExistingNoteId(newId);
    }
    getNote();
  }, [noteId, getNoteById]);

  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (contentChanged && !userIsTyping) {
        handleSave(true);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [contentChanged, userIsTyping]);

  useEffect(() => {
    if (contentChanged && !userIsTyping) {
      const debounceTimer = setTimeout(() => {
        handleSave(true);
      }, 5000);
      return () => clearTimeout(debounceTimer);
    }
  }, [title, contentChanged, userIsTyping]);

  useEffect(() => {
    if (webViewRef.current && editorReady) {
      webViewRef.current.injectJavaScript(`
        // Keep track of selection and focus when changes occur
        const editor = document.getElementById('editor');
        let savedSelection = null;
        
        function saveSelection() {
          const sel = window.getSelection();
          if (sel.rangeCount > 0) {
            savedSelection = sel.getRangeAt(0).cloneRange();
          }
        }
        
        function restoreSelection() {
          if (savedSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedSelection);
            editor.focus();
          }
        }
        
        // Save selection before any state changes
        editor.addEventListener('blur', saveSelection);
        
        // Override the default focus behavior
        const originalFocus = editor.focus;
        editor.focus = function() {
          originalFocus.apply(this);
          restoreSelection();
        };
        
        true;
      `);
    }
  }, [editorReady]);

  return (
    <Container>
      <Navbar
        rightElement={
          lastSaved && (
            <Text className="font-nunito-extra-bold text-xs text-gray-500">
              Last saved:
              {lastSaved.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          )
        }></Navbar>
      <KeyboardAvoidingView
        className="h-full w-full flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View className="px-4 py-3">
          {!isLoading && (
            <TextInput
              className="p-0 font-nunito-extra-bold text-2xl text-gray-800"
              value={title}
              onChangeText={handleTitleChange}
              placeholder="Start with a catchy title..."
              placeholderTextColor="#9ca3af"
            />
          )}
        </View>
        {isLoading ? (
          <View className="flex-1 items-center justify-center bg-[#F8EEE2]">
            <ActivityIndicator size="large" color="#4B5563" />
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: getEditorHTML(content) }}
            className="flex-1 font-nunito-regular text-lg"
            onMessage={handleMessage}
            onLoad={handleWebViewLoad}
            scrollEnabled={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            bounces={false}
            originWhitelist={['*']}
            keyboardDisplayRequiresUserAction={false}
          />
        )}
        <View className="absolute bottom-5 right-5 items-end">
          <GeminiButton isLoading={aiLoading} handleAutoComplete={handleAutoComplete} />
          <FormattingButtons
            executeCommand={executeCommand}
            setShowFormatting={setShowFormatting}
            showFormatting={showFormatting}
          />
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default CreateNote;
