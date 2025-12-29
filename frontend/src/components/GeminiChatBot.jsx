import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot, User, Recycle, Shield, Zap, Battery, Laptop, Phone, Tv } from 'lucide-react';

const GeminiChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your EcoWaste assistant. 🌱 Ask me about recycling, e-waste categories, or our services! I\'m here to help you recycle responsibly.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Advanced intelligent response generator
  const generateIntelligentResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Greeting patterns
    if (/(hello|hi|hey|greetings|good morning|good afternoon)/.test(input)) {
      return `Hello! 👋 I'm your EcoWaste assistant, ready to help you with all things e-waste recycling!

I can assist you with:
• 📱 Device recycling guidelines
• 🚚 Pickup scheduling
• 🔒 Data security
• 🌍 Environmental impact
• 💰 Service costs

What would you like to know about today?`;
    }

    // Recycling general questions
    if (/(what.*recycle|recycle.*what|accept|take|which device)/.test(input)) {
      return `**We accept a wide range of electronic devices:**

📊 **Computers & IT Equipment**
• Laptops, desktops, servers
• Monitors (LCD, LED, CRT)
• Printers, scanners, copiers
• Keyboards, mice, accessories

📱 **Mobile & Communication**
• Smartphones, tablets, iPads
• Feature phones, landlines
• Smartwatches, wearables
• Routers, modems, network gear

📺 **Home Electronics**
• TVs (all types and sizes)
• Audio systems, speakers
• Gaming consoles, controllers
• Cameras, camcorders

🔋 **Power & Batteries**
• Lithium-ion batteries
• Alkaline batteries (AA, AAA)
• Rechargeable batteries
• Power banks, UPS systems

🏠 **Small Appliances**
• Microwaves, toasters
• Vacuum cleaners, fans
• Electric tools, hair dryers
• Cables, chargers, accessories

*Note: We handle all items according to environmental standards at certified facilities.*`;
    }

    // Pickup and scheduling
    if (/(pickup|schedule|collect|arrange|when.*come|how.*get)/.test(input)) {
      return `**🚚 Pickup Service Details**

**Scheduling Options:**
1. **Mobile App** - Fastest way, instant confirmation
2. **Website** - Full service portal
3. **Phone** - Call 1-800-RECYCLE
4. **Email** - schedule@ecowaste.com

**Service Information:**
• 🕐 **Hours**: Mon-Sat, 8:00 AM - 6:00 PM
• 📅 **Lead Time**: Schedule 2-3 days in advance
• 🏠 **Location**: Curbside or doorstep pickup
• ⏱️ **Duration**: 15-30 minutes typically

**Preparation Tips:**
• Place items in visible, accessible area
• Ensure someone is available
• For large items, mention in notes
• Bad weather? We'll reschedule!

**Cost**: Completely FREE for residential customers!`;
    }

    // Data security concerns
    if (/(data|privacy|security|wipe|erase|information|personal)/.test(input)) {
      return `**🔒 Data Security - Your Privacy Matters**

We take data protection extremely seriously:

**Our Certified Process:**
1. **Multiple Pass Wiping** - DoD standard data erasure
2. **Physical Destruction** - Optional for hard drives
3. **Certification** - Documented proof provided
4. **Audit Trail** - Complete process tracking

**What We Protect:**
• Personal files and documents
• Login credentials and accounts
• Financial information
• Photos and personal media
• Browser history and cookies

**Your Responsibility:**
✓ Back up important files
✓ Perform factory resets when possible
✓ Remove SIM/memory cards
✓ Log out of accounts

**Business Customers**: We provide certified data destruction reports for compliance.`;
    }

    // Battery-specific questions
    if (/(batter|power|charge|lithium|alkaline)/.test(input)) {
      return `**🔋 Battery Recycling - Handle with Care**

**Accepted Battery Types:**
✅ **Lithium-ion** - Phones, laptops, power tools
✅ **Alkaline** - AA, AAA, C, D, 9V
✅ **Rechargeable** - NiMH, NiCd, LiPo
✅ **Lead-acid** - Car, motorcycle, UPS
✅ **Button Cells** - Watches, hearing aids

**⚠️ Safety Instructions:**
• Tape terminals with clear tape
• Place in separate plastic bags
• Don't crush or puncture
• Keep away from metal objects
• Damaged batteries? Tell us in advance!

**Why Recycle Batteries?**
Prevents heavy metals (lead, mercury, cadmium) from contaminating soil and water. One car battery can pollute 50,000 liters of water!`;
    }

    // Environmental impact
    if (/(environment|planet|earth|green|eco|sustainable|impact|benefit)/.test(input)) {
      return `**🌍 Environmental Impact - Making a Difference**

**By recycling with us, you're helping:**

💧 **Protect Water Sources**
• Prevents heavy metal contamination
• Reduces water pollution from mining
• Safeguards drinking water quality

🌱 **Conserve Resources**
• Saves energy equivalent to powering homes
• Reduces need for new mining
• Preserves natural habitats

🔥 **Reduce Carbon Footprint**
• Lower greenhouse gas emissions
• Less energy than manufacturing new
• Sustainable material cycles

👥 **Support Communities**
• Creates green jobs locally
• Promotes environmental awareness
• Builds sustainable communities

**Did You Know?** Recycling one million laptops saves the energy equivalent to powering 3,500 US homes for a year!`;
    }

    // Cost and pricing
    if (/(cost|price|free|charge|money|pay|fee)/.test(input)) {
      return `**💰 Pricing - Transparent and Fair**

**Free Services:**
• Residential e-waste pickup
• Small business recycling (< 10 items)
• Community collection events
• Educational institution recycling

**Paid Services:**
• Large commercial quantities
• Urgent/same-day service
• Special handling items
• Certified data destruction reports
• Large CRT monitors/TVs

**Payment Options:**
• Credit/Debit cards
• Digital wallets (PayPal, etc.)
• Business invoicing
• Government purchase orders

**Price Examples:**
• Standard pickup: FREE
• Data destruction certificate: $15/device
• Urgent service: $50 flat fee
• Large CRT monitor: $25

*Contact us for exact quotes based on your specific needs!*`;
    }

    // Device preparation
    if (/(prepare|ready|pack|package|how.*get ready)/.test(input)) {
      return `**📦 Device Preparation Guide**

**Before We Arrive:**

1. **Data Backup & Security**
   • Backup important files
   • Perform factory resets
   • Log out of all accounts
   • Remove SIM/memory cards

2. **Physical Preparation**
   • Gather all related accessories
   • Keep cables with devices
   • Place in cardboard boxes
   • Separate batteries

3. **Large Items**
   • Measure large TVs/monitors
   • Note any special requirements
   • Ensure clear access path

4. **Documentation**
   • List items for pickup
   • Note any damage
   • Special instructions

**Pro Tip**: Take photos of your setup before resetting devices for easy restoration reference!`;
    }

    // Process and what happens
    if (/(process|what happens|after|next|where.*go)/.test(input)) {
      return `**🔄 Our Recycling Process**

**Step 1: Collection & Transport**
• Secure pickup from your location
• GPS-tracked vehicles
• Climate-controlled storage
• Chain of custody documentation

**Step 2: Sorting & Assessment**
• Manual inspection of all items
• Separation by device type
• Assessment for reuse potential
• Data security verification

**Step 3: Processing**
• Certified data destruction
• Component disassembly
• Material separation
• Hazardous material handling

**Step 4: Material Recovery**
• Metal extraction and refining
• Plastic processing and recycling
• Glass recovery and repurposing
• Rare earth element recovery

**Step 5: Responsible Disposal**
• EPA-compliant waste handling
• Landfill diversion reporting
• Environmental impact tracking
• Certificate of recycling

**Result**: 95%+ material recovery rate! ♻️`;
    }

    // Business services
    if (/(business|company|office|commercial|enterprise|corporate)/.test(input)) {
      return `**🏢 Business & Commercial Services**

**Services for Organizations:**
• Bulk equipment recycling
• Scheduled maintenance pickups
• Data destruction compliance
• Environmental reporting
• Asset tracking and reporting

**Industries We Serve:**
• IT companies and data centers
• Healthcare facilities
• Educational institutions
• Government agencies
• Financial institutions
• Small businesses

**Compliance & Certifications:**
• HIPAA compliant data destruction
• NIST 800-88 standards
• R2/RIOS certified facilities
• EPA compliance reporting
• Audit trail documentation

**Request a business consultation today!**`;
    }

    // Thank you responses
    if (/(thank|thanks|appreciate|grateful)/.test(input)) {
      return `You're very welcome! 😊 

Thank YOU for choosing to recycle responsibly. Every device you recycle helps protect our environment and create a more sustainable future.

Together, we're making a difference—one device at a time! 🌎💚

Is there anything else about e-waste recycling you'd like to know?`;
    }

    // Fallback for unknown questions
    return `I'd be happy to help with that! While I specialize in e-waste recycling, let me connect you with the most relevant information:

**Based on your question, you might be interested in:**

🔧 **Device Recycling**
• What items we accept
• How to prepare devices
• Pickup scheduling

🛡️ **Data Security**
• Our privacy protection process
• Data destruction methods
• Compliance certifications

🌱 **Environmental Impact**
• Benefits of recycling
• Carbon footprint reduction
• Resource conservation

💼 **Business Services**
• Commercial recycling programs
• Bulk pickup options
• Compliance documentation

**Could you clarify which aspect you're most interested in?** Or try one of the quick questions below!`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userContent = inputText;
    const newMessages = [...messages, { role: 'user', content: userContent }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate AI "thinking" time for better UX
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      
      const botResponse = generateIntelligentResponse(userContent);
      
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      
    } catch (error) {
      console.error("Chat Error:", error);
      
      // Ultimate fallback
      const botResponse = `I apologize for the confusion! Let me help you with e-waste recycling information.

**Quick Assistance:**
• Schedule pickup: Call 1-800-RECYCLE
• Device questions: Check our accepted items list
• Data security: We use certified destruction methods
• Environmental impact: Recycling saves energy and resources

**Need immediate help?** Visit our website or contact customer support!`;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: botResponse
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hi! I\'m your EcoWaste assistant. 🌱 Ask me about recycling, e-waste categories, or our services! I\'m here to help you recycle responsibly.'
      }
    ]);
  };

  // Enhanced quick suggestions
  const quickSuggestions = [
    { text: "What can I recycle?", icon: Recycle },
    { text: "Schedule a pickup", icon: Laptop },
    { text: "Data security info", icon: Shield },
    { text: "Battery recycling", icon: Battery },
    { text: "Environmental benefits", icon: Zap },
    { text: "Cost and pricing", icon: Phone }
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputText(suggestion.text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto bg-white/95 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-200/50 backdrop-blur-sm flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-4 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm border border-white/30">
                <Recycle className="h-5 w-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">EcoWaste Assistant</h3>
                <p className="text-xs text-green-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                  Always Available
                </p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="text-white/70 hover:text-white transition-colors p-1"
                title="Clear chat"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50/50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2 max-w-[85%] ${
                  msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border ${
                  msg.role === 'user' ? 'bg-blue-100 border-blue-200' : 'bg-green-100 border-green-200'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className={`p-3 rounded-2xl text-sm backdrop-blur-sm border ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none border-blue-200' 
                    : 'bg-white border-gray-200/50 text-gray-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Enhanced Quick Suggestions */}
            {messages.length === 1 && (
              <div className="self-center mt-2">
                <p className="text-xs text-gray-500 text-center mb-3">Quick questions to get started:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="text-xs bg-white/80 border border-gray-200/50 text-gray-700 p-2 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all duration-200 backdrop-blur-sm flex items-center gap-1.5"
                    >
                      <suggestion.icon className="h-3 w-3 flex-shrink-0" />
                      <span className="text-left flex-1">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="self-start flex gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center backdrop-blur-sm border border-green-200">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
                <div className="bg-white border border-gray-200/50 p-3 rounded-2xl rounded-tl-none shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-500">Finding the best information...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white/80 border-t border-gray-200/50 flex gap-2 backdrop-blur-sm">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about e-waste recycling..."
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm bg-white/50 backdrop-blur-sm placeholder-gray-400"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-2 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          {/* Status Indicator */}
          <div className="px-3 py-2 bg-green-50 border-t border-green-200 text-xs text-green-700 text-center backdrop-blur-sm">
            <Sparkles className="h-3 w-3 inline mr-1" />
            EcoWaste Assistant • Always Ready to Help
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group backdrop-blur-sm border border-white/20"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default GeminiChatBot;