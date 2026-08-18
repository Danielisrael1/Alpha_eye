import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/Colors';

const FAQ_RESPONSES = {
  'what is cataract': 'A cataract is a clouding of the natural lens inside the eye. It develops slowly and can cause blurry vision, difficulty seeing at night, and sensitivity to light. Cataracts are the leading cause of reversible blindness worldwide.',
  'cataract symptoms': 'Common symptoms include:\n• Blurry or cloudy vision\n• Difficulty seeing at night\n• Sensitivity to bright light and glare\n• Seeing halos around lights\n• Faded or yellowish colors\n• Double vision in one eye\n• Frequent changes in glasses prescription',
  'cataract treatment': 'The only effective treatment for cataracts is surgery, where the cloudy lens is replaced with an artificial one (intraocular lens). Surgery is typically recommended when cataracts significantly affect daily activities. It is a safe, common procedure with a high success rate (over 95%).',
  'cataract prevention': 'While cataracts cannot be completely prevented, you can reduce risk by:\n• Wearing sunglasses that block UV rays\n• Eating a diet rich in fruits and vegetables\n• Not smoking\n• Limiting alcohol consumption\n• Managing diabetes and other health conditions\n• Having regular eye examinations',
  'how does alpha eye work': 'Alpha Eye uses a MobileNetV2 AI model trained on eye images to detect signs of cataracts. You capture an eye image using your phone camera, and the AI analyzes it to classify the cataract severity as Normal, Mild, Moderate, or Severe, with a confidence score. Results are stored in the cloud for healthcare professional review.',
  'is this app accurate': 'Alpha Eye is a prototype screening tool with simulated AI accuracy of 89-99%. It is designed for preliminary community-level screening and is NOT a substitute for professional ophthalmological examination. Always consult a qualified eye care professional for diagnosis and treatment.',
  'where can i get surgery': 'In the Kampala/Wakiso area, partner facilities include:\n• Mengo Hospital Eye Department\n• Mulago National Referral Hospital Eye Center\n• City Eye Care Kampala\n• Rubaga Hospital Ophthalmic Clinic\n\nUse the "Find Clinics" feature in the app to get directions.',
  'what is a vht': 'A Village Health Team (VHT) is a community health volunteer group in Uganda. VHT members are trained to conduct basic health screenings, including using Alpha Eye for preliminary cataract detection, and to refer patients to healthcare facilities for further evaluation.',
};

const SUGGESTIONS = [
  'What is cataract?',
  'Cataract symptoms',
  'Cataract treatment',
  'How does Alpha Eye work?',
  'Where can I get surgery?',
];

function findBestResponse(input) {
  const lower = input.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return response;
    }
  }

  // Fuzzy keyword matching
  const keywords = lower.split(/\s+/);
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    const keyWords = key.split(/\s+/);
    const matchCount = keywords.filter((w) => keyWords.some((kw) => kw.includes(w) || w.includes(kw))).length;
    if (matchCount >= 1) return response;
  }

  return "I'm not sure about that. I can help with questions about cataracts, symptoms, treatment, prevention, and how Alpha Eye works. Try asking one of those topics!";
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: '0',
      text: "Hello! I'm the Alpha Eye AI Health Assistant. I can answer your questions about cataracts, eye health, and how this screening app works. What would you like to know?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg = { id: Date.now().toString(), text: messageText, sender: 'user' };
    const botResponse = findBestResponse(messageText);
    const botMsg = { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    return (
      <View style={[styles.messageRow, isBot ? styles.botRow : styles.userRow]}>
        {isBot && (
          <View style={styles.botAvatar}>
            <Ionicons name="eye" size={16} color={Colors.primary} />
          </View>
        )}
        <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.bubbleText, isBot ? styles.botText : styles.userText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        ListFooterComponent={
          messages.length <= 1 ? (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>Try asking:</Text>
              {SUGGESTIONS.map((s, i) => (
                <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about cataracts, eye health..."
          placeholderTextColor={Colors.textMuted}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()} disabled={!input.trim()}>
          <Ionicons name="send" size={20} color={input.trim() ? '#ffffff' : '#94a3b8'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  messageList: { padding: Spacing.lg, paddingBottom: Spacing.sm },
  messageRow: { flexDirection: 'row', marginBottom: Spacing.md, maxWidth: '85%' },
  botRow: { alignSelf: 'flex-start' },
  userRow: { alignSelf: 'flex-end' },
  botAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm, marginTop: 2,
  },
  bubble: { padding: Spacing.md, borderRadius: 16, maxWidth: '100%' },
  botBubble: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 4,
  },
  bubbleText: { fontSize: FontSizes.sm, lineHeight: 21 },
  botText: { color: Colors.textPrimary },
  userText: { color: '#ffffff' },
  suggestions: { marginTop: Spacing.md },
  suggestionsTitle: { fontSize: FontSizes.sm, color: Colors.textMuted, fontWeight: '600', marginBottom: Spacing.sm },
  suggestionChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: 10, marginBottom: Spacing.sm,
  },
  suggestionText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});
