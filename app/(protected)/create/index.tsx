import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Container } from '~/components/Container';
import FormattingButtons from '~/components/create-notes/FormattingButtons';
import Navbar from '~/components/layout/Navbar';
import GeminiButton from '~/components/create-notes/GeminiButton';
import { getEditorHTML } from '~/constants';
import { addNote } from '~/utils/crud';

const CreateNote = () => {
  const [title, setTitle] = useState<string>('Start with a catchy title...');
  const [showFormatting, setShowFormatting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const webViewRef = useRef<WebView | null>(null);

  const executeCommand = (command: string): void => {
    const script = `document.execCommand('${command}', false, null); true;`;
    webViewRef.current?.injectJavaScript(script);
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);

    webViewRef.current?.injectJavaScript(`
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'save', content: document.getElementById('editor').innerHTML, title: '${title}' })
      );
      true;
    `);
  };

  const handleMessage = async (event: NativeSyntheticEvent<any>): Promise<void> => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'fontsLoaded') {
        setIsLoading(false);
      } else if (data.type === 'save') {
        await addNote({
          title,
          content: data.content,
          user_id: '1',
          is_deleted: false,
        });
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
      setIsSaving(false);
    }
  };

  const handleWebViewLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <Container>
      <Navbar>Create Note</Navbar>
      <KeyboardAvoidingView
        className="h-full w-full flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View className="px-4 py-3">
          <TextInput
            className="p-0 font-nunito-extra-bold text-2xl text-gray-800"
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4B5563" />
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: getEditorHTML('Write Something Amazing...') }}
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
          {/* Save Button */}
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
