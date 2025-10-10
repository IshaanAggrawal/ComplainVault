from fastapi import FastAPI
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PDF Chatbot + Complaint Classifier API")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PDF_PATH = r"contact.pdf"

if not os.path.exists(PDF_PATH):
    raise FileNotFoundError(f"PDF file not found: {PDF_PATH}")

loader = PyPDFLoader(PDF_PATH)
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)
embeddings = HuggingFaceEmbeddings()
db = FAISS.from_documents(chunks, embeddings)
llm = ChatGroq(api_key=GROQ_API_KEY, model="llama-3.1-8b-instant")
qa = RetrievalQA.from_chain_type(llm=llm, retriever=db.as_retriever(), chain_type="stuff")

class ChatRequest(BaseModel):
    question: str

class ComplaintRequest(BaseModel):
    description: str

@app.get("/")
def home():
    return {"message": "🚀 FastAPI PDF Chatbot + Complaint Classifier is running!"}

@app.get("/debug/pdf-content")
def debug_pdf_content():
    """Debug endpoint to check PDF content"""
    try:
        # Get all document chunks
        all_docs = db.similarity_search("", k=10)  # Get more documents
        content_preview = []
        for i, doc in enumerate(all_docs[:5]):  # Show first 5 chunks
            content_preview.append({
                "chunk_id": i,
                "content_preview": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "full_length": len(doc.page_content)
            })
        
        return {
            "total_chunks": len(all_docs),
            "pdf_loaded": True,
            "content_preview": content_preview
        }
    except Exception as e:
        return {"error": str(e), "pdf_loaded": False}

@app.post("/chat")
def chat(req: ChatRequest):
    if not req.question.strip():
        return {"error": "No question provided"}
    
    try:
        # Get relevant documents first
        relevant_docs = db.similarity_search(req.question, k=3)
        
        if not relevant_docs:
            return {"answer": "I couldn't find any relevant information in the available documents. Please make sure the PDF file contains the information you're looking for."}
        
        # Check if the question is about contact details
        question_lower = req.question.lower()
        if any(keyword in question_lower for keyword in ['contact', 'phone', 'email', 'address', 'number', 'details']):
            # Look for contact information in the documents
            contact_info = []
            for doc in relevant_docs:
                content = doc.page_content.lower()
                if any(keyword in content for keyword in ['contact', 'phone', 'email', 'address', 'number', '@', 'tel:', 'call']):
                    contact_info.append(doc.page_content)
            
            if contact_info:
                # Use the QA chain with the contact-specific context
                answer = qa.run(req.question)
            else:
                answer = "I couldn't find specific contact details in the available documents. The PDF might not contain contact information, or it might be in a format that's difficult to extract. Please check the original document or contact the relevant department directly."
        else:
            # Regular question processing
            answer = qa.run(req.question)
        
        return {"answer": answer}
    
    except Exception as e:
        return {"answer": f"I encountered an error while processing your question: {str(e)}. Please try rephrasing your question or check if the PDF file is accessible."}

@app.post("/classify")
def classify(req: ComplaintRequest):
    description = req.description.strip()
    if not description:
        return {"error": "No description provided"}

    departments = {
        1: "Police Department",
        2: "Electricity Department",
        3: "Water Department",
        4: "Transport Department",
        5: "General Department"
    }

    prompt = f"""
    You are a complaint classification assistant.
    Classify the following complaint into one of the given departments:
    1. Police Department
    2. Electricity Department
    3. Water Department
    4. Transport Department
    5. General Department

    Complaint: "{description}"

    Respond with the department number (1-5) and name.
    """

    response = llm.invoke(prompt)
    answer = response.content.strip()
    dept_num = next((num for num in departments if str(num) in answer), 5)

    return {
        "department": departments[dept_num],
        "department_id": dept_num,
        "raw_response": answer
    }
