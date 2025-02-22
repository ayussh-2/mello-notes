import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface FormContainerProps {
  children: React.ReactNode;
}

export const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
