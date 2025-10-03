import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {colors} from '../../styles/commonStyles';
import Card from '../common/Card';
import {AIAssistantMessage, AirQualityData} from '../../types/airGuard';
import PredictionTimePicker from '../common/PredictionTimePicker';

interface AIAssistantProps {
  airQualityData: AirQualityData;
  onMessageSend: (message: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  airQualityData,
  onMessageSend,
}) => {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your AirGuard AI assistant. I can help you understand air quality data, provide personalized recommendations, and answer questions about pollution levels.

Current AQI in your area is ${airQualityData.aqi} (${airQualityData.status}). How can I assist you today?`,
      timestamp: '2 minutes ago',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const quickSuggestions = [
    '💨 What does my current AQI mean?',
    '🏃‍♂️ Is it safe to exercise outside?',
    '🌍 Show me pollution trends',
    '💊 Health recommendations for asthma',
    '📊 Air quality forecast',
  ];

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping, typingAnim]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('aqi') || message.includes('air quality')) {
      return `Based on the current AQI of ${
        airQualityData.aqi
      }, your air quality is ${airQualityData.status.toLowerCase()}.

${
  airQualityData.aqi <= 50
    ? '✅ Great news! The air quality is good for outdoor activities.'
    : airQualityData.aqi <= 100
    ? '⚠️ Moderate air quality. Sensitive individuals should consider limiting prolonged outdoor exertion.'
    : '🚨 Unhealthy air quality. Everyone should limit outdoor activities and consider wearing masks.'
}

Would you like specific recommendations based on your health profile?`;
    }

    if (
      message.includes('exercise') ||
      message.includes('outdoor') ||
      message.includes('run')
    ) {
      return `For outdoor exercise with current AQI of ${airQualityData.aqi}:

${
  airQualityData.aqi <= 50
    ? '🏃‍♂️ Perfect conditions for outdoor exercise! Enjoy your workout.'
    : airQualityData.aqi <= 100
    ? '🚶‍♂️ Light to moderate exercise is fine. Avoid intense workouts if you have respiratory conditions.'
    : '🏠 I recommend indoor exercise today. If you must go outside, keep activities light and brief.'
}

Best exercise times are usually early morning (6-8 AM) when pollution levels are typically lower.`;
    }

    if (
      message.includes('health') ||
      message.includes('asthma') ||
      message.includes('symptoms')
    ) {
      return `Health recommendations for current conditions:

🫁 **Respiratory Health:**
• ${
        airQualityData.aqi > 100
          ? 'Keep rescue inhalers accessible'
          : 'Normal respiratory precautions'
      }
• ${
        airQualityData.aqi > 150
          ? 'Use air purifiers indoors'
          : 'Good ventilation recommended'
      }
• Stay hydrated and avoid smoking

👶 **Vulnerable Groups:**
Children, elderly, and those with respiratory conditions should ${
        airQualityData.aqi > 100 ? 'stay indoors' : 'take normal precautions'
      }.

💊 **Medication:** ${
        airQualityData.aqi > 100
          ? 'Have rescue medications ready'
          : 'Follow regular medication schedule'
      }`;
    }

    if (
      message.includes('forecast') ||
      message.includes('tomorrow') ||
      message.includes('predict')
    ) {
      return `📈 **Air Quality Forecast:**

Next 24 hours: Expected AQI range 65-85 (Moderate)
• Morning: Better air quality (60-70)
• Afternoon: Slight increase due to traffic (70-85)
• Evening: Gradual improvement (65-75)

🌟 **Best Times for Outdoor Activities:**
• 6-8 AM: Excellent
• 12-3 PM: Use caution
• 6-8 PM: Good

Would you like pollution source analysis or route recommendations?`;
    }

    if (
      message.includes('route') ||
      message.includes('drive') ||
      message.includes('commute')
    ) {
      return `🗺️ **Smart Commute Suggestions:**

Based on current air quality patterns:
• **Route A (Park Ave):** AQI ~${airQualityData.aqi - 15} - Recommended
• **Route B (Highway):** AQI ~${airQualityData.aqi + 20} - Avoid if possible
• **Route C (Residential):** AQI ~${airQualityData.aqi + 5} - Good alternative

🚗 **Driving Tips:**
• Use recirculated air mode
• Avoid rush hour when possible
• Consider carpooling to reduce emissions`;
    }

    return `I understand you're asking about "${userMessage}".

As your AI air quality assistant, I can help with:
• Real-time air quality analysis
• Personalized health recommendations
• Exercise and outdoor activity guidance
• Pollution forecasts and trends
• Safe route suggestions
• Emergency air quality alerts

Current conditions: AQI ${airQualityData.aqi} (${airQualityData.status})

What specific information would you like to know?`;
  };

  const sendMessage = (message: string) => {
    if (!message.trim() || isTyping) return;

    const userMessage: AIAssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    if (onMessageSend) {
      onMessageSend(message);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);

    setTimeout(() => {
      const aiResponse: AIAssistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(message),
        timestamp: 'Just now',
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    }, 1500);
  };

  const renderMessage = (item: AIAssistantMessage) => (
    <View
      key={item.id}
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.assistantMessage,
      ]}>
      {item.type === 'assistant' && (
        <View style={styles.assistantAvatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          item.type === 'user' ? styles.userBubble : styles.assistantBubble,
        ]}>
        <Text
          style={[
            styles.messageText,
            item.type === 'user' ? styles.userText : styles.assistantText,
          ]}>
          {item.content}
        </Text>
        <Text
          style={[
            styles.messageTime,
            item.type === 'user' ? styles.userTime : styles.assistantTime,
          ]}>
          {item.timestamp}
        </Text>
      </View>
      {item.type === 'user' && (
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.assistantMessage]}>
      <View style={styles.assistantAvatar}>
        <Text style={styles.avatarText}>🤖</Text>
      </View>
      <View style={[styles.messageBubble, styles.assistantBubble]}>
        <Animated.View style={[styles.typingContainer, {opacity: typingAnim}]}>
          <Text style={styles.typingText}>AI is thinking...</Text>
          <View style={styles.typingDots}>
            <Text style={styles.dot}>●</Text>
            <Text style={styles.dot}>●</Text>
            <Text style={styles.dot}>●</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <Card title="🤖 AI Air Quality Assistant">
      <View style={styles.container}>
        <View style={styles.timePickerContainer}>
          <PredictionTimePicker showCard={false} compact={true} />
        </View>

        <View style={styles.statusStrip}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Current AQI</Text>
            <Text
              style={[
                styles.statusValue,
                {
                  color:
                    airQualityData.aqi <= 50
                      ? colors.success
                      : airQualityData.aqi <= 100
                      ? '#ff9800'
                      : '#f44336',
                },
              ]}>
              {airQualityData.aqi}
            </Text>
          </View>
          <Text style={styles.statusDescription}>
            Ask me anything about air quality!
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsContainer}
          contentContainerStyle={styles.suggestionsContent}>
          {quickSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() =>
                sendMessage(suggestion.split(' ').slice(1).join(' '))
              }>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }>
          {messages.map(item => renderMessage(item))}
          {isTyping && renderTypingIndicator()}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Ask about air quality, health recommendations, or forecasts..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline={true}
            maxLength={500}
            onSubmitEditing={() => sendMessage(inputMessage)}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}>
            <Text style={styles.sendButtonText}>{isTyping ? '⏳' : '📤'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.capabilitiesContainer}>
          <Text style={styles.capabilitiesTitle}>
            What I can help you with:
          </Text>
          <View style={styles.capabilitiesList}>
            <Text style={styles.capabilityItem}>
              • Real-time air quality analysis
            </Text>
            <Text style={styles.capabilityItem}>
              • Personalized health recommendations
            </Text>
            <Text style={styles.capabilityItem}>
              • Exercise and activity guidance
            </Text>
            <Text style={styles.capabilityItem}>
              • Pollution forecasts & trends
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 600,
  },
  statusStrip: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusDescription: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 15,
    fontWeight: '500',
  },
  suggestionsContainer: {
    flexGrow: 0,
    marginBottom: 15,
  },
  suggestionsContent: {
    paddingRight: 15,
  },
  suggestionChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    maxHeight: 300,
    marginBottom: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 5,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  assistantBubble: {
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  assistantText: {
    color: colors.textPrimary,
  },
  userText: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  assistantTime: {
    color: colors.textLight,
  },
  userTime: {
    color: '#e0e0e0',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    fontSize: 8,
    color: colors.primary,
    marginHorizontal: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 15,
    marginBottom: 15,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
    backgroundColor: colors.white,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  sendButtonText: {
    fontSize: 18,
  },
  capabilitiesContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  capabilitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  capabilitiesList: {
    marginLeft: 5,
  },
  capabilityItem: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 2,
  },
  timePickerContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default AIAssistant;
