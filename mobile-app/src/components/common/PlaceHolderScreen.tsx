import React from 'react';
import {Text, View} from 'react-native';
import {commonStyles} from '../../styles/commonStyles';

interface CreatePlaceholderScreenProps {
  title: string;
  description: string;
}
// Reusable placeholder screen component
const CreatePlaceholderScreen: React.FC<CreatePlaceholderScreenProps> = ({
  title,
  description,
}) => {
  return (
    <View style={commonStyles.screenContainer}>
      <Text style={commonStyles.screenTitle}>{title}</Text>
      <Text style={commonStyles.screenContent}>{description}</Text>
    </View>
  );
};

export default CreatePlaceholderScreen;
