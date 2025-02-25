import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Container } from '~/components/Container';
import FormattingButtons from '~/components/create-notes/FormattingButtons';
import Navbar from '~/components/layout/Navbar';
import GeminiButton from '~/components/create-notes/GeminiButton';
import { getEditorHTML } from '~/constants';
import { addNote, findNoteById, updateNote } from '~/utils/crud';
import { useLocalSearchParams } from 'expo-router';
import { userStorage } from '~/utils/userStorage';

const CreateNote = () => {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState<string>('Start with a catchy title...');
  const [content, setContent] = useState<string>('Write Something Amazing...');
  const [showFormatting, setShowFormatting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [contentChanged, setContentChanged] = useState<boolean>(false);
  const webViewRef = useRef<WebView | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [existingNoteId, setExistingNoteId] = useState<string | null>(null);

  const AUTO_SAVE_INTERVAL = 30000;

  const executeCommand = (command: string): void => {
    const script = `document.execCommand('${command}', false, null); true;`;
    webViewRef.current?.injectJavaScript(script);
  };

  const handleSave = async (autoSave: boolean = false): Promise<void> => {
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
          JSON.stringify({ type: 'contentChanged' })
        );
      });
      
      true;
    `);
  };

  const handleMessage = async (event: NativeSyntheticEvent<any>): Promise<void> => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'fontsLoaded') {
        setIsLoading(false);
        setupContentChangeDetection();
      } else if (data.type === 'contentChanged') {
        setContentChanged(true);
      } else if (data.type === 'save') {
        if (existingNoteId === 'new') {
          const user = await userStorage.getUser();
          const savedData = await addNote({
            title,
            content: data.content,
            user_id: user?.id || 'anonymous',
          });
          if (savedData && savedData.length > 0) setExistingNoteId(savedData[0].id);
        } else {
          await updateNote(existingNoteId!, {
            title,
            content: data.content,
          });
        }

        setLastSaved(new Date());
        setContentChanged(false);

        if (!data.autoSave) {
          setIsSaving(false);
        }
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
      if (!data?.autoSave) {
        setIsSaving(false);
      }
    }
  };

  const handleWebViewLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
      setupContentChangeDetection();
    }, 500);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setContentChanged(true);
  };

  const findNote = async () => {
    const noteId = Array.isArray(id) ? id[0] : id;
    setExistingNoteId(noteId);
    if (!noteId || noteId === 'new') return;
    setIsLoading(true);
    const note = await findNoteById(noteId);
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      console.log('note', note);
      setLastSaved(new Date(note.updated_at || note.created_at));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (contentChanged) {
        handleSave(true);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [contentChanged]);

  useEffect(() => {
    if (contentChanged) {
      const debounceTimer = setTimeout(() => {
        handleSave(true);
      }, 5000);
      return () => clearTimeout(debounceTimer);
    }
  }, [title, contentChanged]);

  useEffect(() => {
    findNote();
  }, []);

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
              placeholder="Title"
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
          <GeminiButton isLoading={isSaving} handleAutoComplete={handleSave} />

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
