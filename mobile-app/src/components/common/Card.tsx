import React from 'react';
import {commonStyles} from '../../styles/commonStyles';
import {Text, View} from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: object;
}

const Card: React.FC<CardProps> = ({title, children, style}) => {
  return (
    <View style={[commonStyles.card, style]}>
      {title && <Text style={commonStyles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );
};

export default Card;
