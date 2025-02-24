import React, { useState, useRef } from 'react';
import {
  View,
  Text,
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
  const webViewRef = useRef<WebView | null>(null);

  const editorHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: 'InterNunito_700Bold', sans-serif;
          padding: 16px;
          margin: 0;
          font-size: 16px;
          color: #333;
          height: 100%;
          line-height: 1.5;
        }
        
        #editor {
          min-height: 100%;
          outline: none;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        #editor:empty:before {
          content: "Start typing...";
          color: #9ca3af;
          font-family: 'InterNunito_700Bold', sans-serif;
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
      </script>
    </body>
    </html>
  `;

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
      const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
      if (data.type === 'save') {
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

  return (
    <Container>
      <KeyboardAvoidingView
        className="h-full w-full flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View className="border-b border-gray-200 px-4 py-3">
          <TextInput
            className="p-0 font-nunito-extra-bold text-xl text-gray-800"
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <WebView
          ref={webViewRef}
          source={{ html: editorHTML }}
          className="flex-1"
          onMessage={handleMessage}
          scrollEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          bounces={false}
          originWhitelist={['*']}
          keyboardDisplayRequiresUserAction={false}
        />

        {/* Floating buttons */}
        <View className="absolute bottom-5 right-5 items-end">
          {/* Save Button */}
          <TouchableOpacity
            className="mb-2.5 h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-md"
            onPress={handleSave}
            activeOpacity={0.7}>
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Icon name="save" size={24} color="#fff" />
            )}
          </TouchableOpacity>

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

export default MobileNoteEditor;
