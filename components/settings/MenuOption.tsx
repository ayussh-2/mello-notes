import { ChevronRight } from 'lucide-react-native';
import { TouchableOpacity, View, Text } from 'react-native';

const MenuOption = ({
  Icon,
  label,
  handlePress,
}: {
  Icon: any;
  label: string;
  handlePress?: () => void;
}) => {
  return (
    <TouchableOpacity className={`flex-row items-center p-4 `} onPress={handlePress}>
      <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-[#FFFDFA]">
        <Icon size={20} color="#DC2626" />
      </View>
      <Text className="flex-1 font-nunito-regular text-lg text-[#595555]">{label}</Text>
      <ChevronRight size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default MenuOption;
