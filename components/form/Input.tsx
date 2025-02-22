import { Text, TextInput, View } from 'react-native';
import { Control, Controller, FieldValues, RegisterOptions, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  placeholder: string;
  secureTextEntry?: boolean;
}

export const Input = <T extends FieldValues>({
  control,
  name,
  label,
  rules = {},
  placeholder,
  secureTextEntry,
}: FormInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-4 w-full">
          <Text className="text-text-secondary font-nunito-regular mb-2">{label}</Text>
          <TextInput
            className={`font-nunito-regular text-text-primary w-full rounded-xl bg-white px-4 py-5
                text-xl
              ${error ? 'border-2 border-red-500' : 'border border-gray-200'}`}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="#9CA3AF"
          />
          {error && (
            <Text className="font-nunito-regular mt-1 text-sm text-red-500">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
};
