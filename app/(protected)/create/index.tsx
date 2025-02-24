import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  MessageEvent,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import { Container } from '~/components/Container';
import FormattingButtons from '~/components/create-notes/FormattingButtons';
import Navbar from '~/components/layout/Navbar';
import GeminiButton from '~/components/create-notes/GeminiButton';

interface WebViewMessage {
  type: 'content' | 'save';
  content: string;
  title?: string;
}

interface MobileNoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => Promise<void>;
}

const MobileNoteEditor: React.FC<MobileNoteEditorProps> = ({
  initialTitle = 'Start with a catchy title...',
  initialContent = '',
  onSave,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [showFormatting, setShowFormatting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const webViewRef = useRef<WebView | null>(null);

  const getEditorHTML = (): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <!-- Import Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Nunito', 'Segoe UI', sans-serif;
            font-weight: 700;
            padding: 16px 16px 0px 16px;
            margin: 0;
            font-size: 17.5px;
            color: #333;
            height: 100%;
            line-height: 1.5;
            background-color: #F8EEE2;
          }
          
          #editor {
            min-height: 100%;
            outline: none;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Nunito', 'Segoe UI', sans-serif;
          }

          #editor:empty:before {
            content: "What are you thinking?";
            color: #9ca3af;
            font-family: 'Nunito', 'Segoe UI', sans-serif;
            font-weight: 700;
          }

          ul {
            padding-left: 24px;
          }

          ol {
            padding-left: 24px;
          }
        </style>
      </head>
      <body>
        <div id="editor" contenteditable="true">${initialContent}</div>
        <script>
          document.getElementById('editor').addEventListener('input', function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'content', content: this.innerHTML })
            );
          });

          // Check if Google Fonts loaded successfully
          document.fonts.ready.then(function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'fontsLoaded', success: true })
            );
          }).catch(function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'fontsLoaded', success: false })
            );
          });
        </script>
      </body>
      </html>
    `;
  };

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

  const handleMessage = async (event: NativeSyntheticEvent<MessageEvent>): Promise<void> => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'fontsLoaded') {
        setIsLoading(false);
      } else if (data.type === 'save') {
        console.log('Saving note:', { title, content: data.content });

        if (onSave) {
          await onSave(title, data.content);
        }

        if (!onSave) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

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
            source={{ html: getEditorHTML() }}
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
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default MobileNoteEditor;
