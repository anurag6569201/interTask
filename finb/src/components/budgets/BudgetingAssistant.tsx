import React, { useState, useRef, useEffect } from 'react';
import { Bot, User as UserIcon, Send, RefreshCcw } from 'lucide-react';
import { CategoryBudget } from '../../types';
import { formatCurrency } from '../../data/mockData';

interface Message {
  id: string;
  text: string | React.ReactNode;
  sender: 'user' | 'bot';
}

interface BudgetingAssistantProps {
  budgets: CategoryBudget[];
  userName?: string;
}

const BudgetingAssistant: React.FC<BudgetingAssistantProps> = ({ budgets, userName = "User" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      { id: 'welcome', text: `Hi ${userName}! I'm your Budgeting Assistant. How can I help you today? You can ask things like "How's my food budget?", "Am I over budget anywhere?", or "Give me a savings tip".`, sender: 'bot' }
    ]);
  }, [userName]);

  const getBotResponse = (userInput: string): string | React.ReactNode => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return `Hello ${userName}! What can I do for you?`;
    }

    const categoryMatch = budgets.find(b => lowerInput.includes(b.category) && lowerInput.includes('budget'));
    if (categoryMatch) {
        const remaining = categoryMatch.budgeted - categoryMatch.spent;
        const status = remaining >= 0 
            ? `You have ${formatCurrency(remaining)} remaining.` 
            : `You are ${formatCurrency(Math.abs(remaining))} over budget.`;
        return (
            <div className="text-sm md:text-base">
                For your <span className="capitalize font-semibold">{categoryMatch.category}</span> budget ({formatCurrency(categoryMatch.budgeted)}),
                you've spent {formatCurrency(categoryMatch.spent)}. {status}
            </div>
        );
    }
    
    if (lowerInput.includes('over budget')) {
        const overspent = budgets.filter(b => b.spent > b.budgeted);
        if (overspent.length > 0) {
            return (
                <div className="text-sm md:text-base">
                    <p>You are over budget in the following categories:</p>
                    <ul className="list-disc list-inside ml-2 md:ml-4 mt-1">
                        {overspent.map(b => (
                            <li key={b.category} className="capitalize">
                                {b.category} (Over by {formatCurrency(b.spent - b.budgeted)})
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2">Consider reviewing your spending in these areas or adjusting your budget.</p>
                </div>
            );
        }
        return "Great job! You are not over budget in any category.";
    }

    if (lowerInput.includes('savings tip') || lowerInput.includes('save money')) {
      const tips = [
        "Try the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings.",
        "Review your subscriptions regularly. Are there any you don't use often enough to justify the cost?",
        "Set up automatic transfers to your savings account on payday. Even small amounts add up!",
        "Look for categories where you consistently overspend and see if you can make small cutbacks.",
        "Cook more meals at home instead of eating out or ordering takeout. This can save a significant amount.",
        "Before making a non-essential purchase, wait 24 hours. You might find you don't need it after all."
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (lowerInput.includes('thank')) {
        return "You're welcome! Is there anything else I can help with?";
    }

    return "I'm still learning! I can help with basic budget questions like 'How is my housing budget?', ask 'Am I over budget?', or give 'savings tips'.";
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = input; // Capture current input before clearing
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = getBotResponse(currentInput);
      const newBotMessage: Message = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  const handleReset = () => {
    setMessages([
      { id: 'welcome-reset', text: `Hi ${userName}! Session reset. How can I assist you now?`, sender: 'bot' }
    ]);
    setInput('');
    setIsTyping(false);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 flex flex-col h-[500px] md:h-[600px]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <Bot size={24} className="mr-2 text-primary-500" /> Budgeting Assistant
        </h2>
        <button
          onClick={handleReset}
          title="Reset Conversation"
          className="p-1.5 text-gray-500 rounded-md hover:bg-gray-100 hover:text-primary-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-primary-400"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[100%] md:max-w-[100%] p-2.5 md:p-3 rounded-lg shadow ${
              msg.sender === 'user'
                ? 'bg-primary-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'
            }`}>
              <div className="flex items-start">
                {msg.sender === 'bot' && <Bot size={16} className="inline mr-1.5 mt-0.5 flex-shrink-0" />}
                {msg.sender === 'user' && <UserIcon size={16} className="inline mr-1.5 mt-0.5 flex-shrink-0" />}
                <div className="text-sm md:text-base break-words">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none">
              <div className="flex items-start">
                <Bot size={16} className="inline mr-1.5 mt-0.5 flex-shrink-0" />
                <span className="italic text-sm md:text-base">Typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
          placeholder="Ask something..."
          className="flex-grow px-3 py-1 border border-0 rounded-l-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm md:text-base"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={isTyping || input.trim() === ''}
          className="px-3 md:px-4 py-1 border-0 bg-primary-500 text-white rounded-r-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default BudgetingAssistant;