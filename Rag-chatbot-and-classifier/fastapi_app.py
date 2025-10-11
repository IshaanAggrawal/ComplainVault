from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PDF/Text Chatbot + Complaint Classifier API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or set your frontend URLs here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# File paths
PDF_PATH = "website_content.pdf"
TEXT_PATH = "website_content.txt"

# Load documents (PDF preferred, fallback to text)
if os.path.exists(PDF_PATH):
    loader = PyPDFLoader(PDF_PATH)
elif os.path.exists(TEXT_PATH):
    loader = TextLoader(TEXT_PATH, encoding="utf-8")
else:
    raise FileNotFoundError("No contact.pdf or website_content.txt found!")

docs = loader.load()

# Split documents into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)

# Create embeddings and FAISS vector store
embeddings = HuggingFaceEmbeddings()
db = FAISS.from_documents(chunks, embeddings)

# Initialize Groq LLM
llm = ChatGroq(api_key=GROQ_API_KEY, model="llama-3.1-8b-instant")

# Setup QA chain
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=db.as_retriever(),
    chain_type="stuff"
)

# Request models
class ChatRequest(BaseModel):
    question: str

class ComplaintRequest(BaseModel):
    description: str

# Home endpoint
@app.get("/")
def home():
    return {"message": "🚀 FastAPI Chatbot + Complaint Classifier is running!"}

# Debug PDF/Text content
@app.get("/debug/pdf-content")
def debug_pdf_content():
    try:
        all_docs = db.similarity_search("", k=10)
        content_preview = [
            {
                "chunk_id": i,
                "content_preview": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "full_length": len(doc.page_content)
            } for i, doc in enumerate(all_docs[:5])
        ]
        return {
            "total_chunks": len(all_docs),
            "pdf_loaded": True,
            "content_preview": content_preview
        }
    except Exception as e:
        return {"error": str(e), "pdf_loaded": False}

# Chat endpoint
@app.post("/chat")
def chat(req: ChatRequest):
    question = req.question.strip()
    if not question:
        return {"error": "No question provided"}

    try:
        relevant_docs = db.similarity_search(question, k=3)
        if not relevant_docs:
            return {"answer": "No relevant information found in the documents."}

        # Detect contact-related questions
        if any(keyword in question.lower() for keyword in ['contact', 'phone', 'email', 'address', 'number', 'details']):
            contact_info = [
                doc.page_content for doc in relevant_docs
                if any(k in doc.page_content.lower() for k in ['contact', 'phone', 'email', 'address', 'number', '@', 'tel:', 'call'])
            ]
            answer = qa.run(question) if contact_info else "No contact info found in the documents."
        else:
            answer = qa.run(question)

        return {"answer": answer}

    except Exception as e:
        return {"answer": f"Error processing question: {str(e)}"}

# Complaint classification endpoint
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
    else:
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
