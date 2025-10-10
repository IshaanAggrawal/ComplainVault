// Test script to verify chatbot fixes
const axios = require('axios');

async function testChatbot() {
    const baseUrl = 'http://127.0.0.1:5000';
    
    console.log('🧪 Testing Chatbot Fixes...\n');
    
    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const healthCheck = await axios.get(`${baseUrl}/`);
        console.log('✅ Server is running:', healthCheck.data.message);
        
        // Test 2: Check PDF content debug
        console.log('\n2. Checking PDF content...');
        const debugResponse = await axios.get(`${baseUrl}/debug/pdf-content`);
        console.log('✅ PDF Debug Info:', {
            totalChunks: debugResponse.data.total_chunks,
            pdfLoaded: debugResponse.data.pdf_loaded
        });
        
        // Test 3: Test contact details question
        console.log('\n3. Testing contact details question...');
        const contactResponse = await axios.post(`${baseUrl}/chat`, {
            question: "What contact details are mentioned in the PDF?"
        });
        console.log('✅ Contact Details Response:', contactResponse.data.answer);
        
        // Test 4: Test general question
        console.log('\n4. Testing general question...');
        const generalResponse = await axios.post(`${baseUrl}/chat`, {
            question: "What is this document about?"
        });
        console.log('✅ General Question Response:', generalResponse.data.answer);
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testChatbot();
