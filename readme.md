# DefenseSim — Thesis Defense Simulator

DefenseSim is a web-based, AI-powered simulator designed to help students prepare for their thesis defenses. By uploading their thesis document, users can face a panel of simulated AI examiners who ask dynamic, context-aware questions based on the actual contents of the document. 

Group leaders can monitor live sessions in real-time, inject surprise questions, and evaluate performance, while members can practice their defense skills.

## 🚀 Features

- **Knowledge Base Ingestion**: Upload your thesis (PDF, DOCX, TXT, MD) to build a localized RAG (Retrieval-Augmented Generation) knowledge base.
- **AI Examiner Panel**: Face six distinct examiner personas (Methodology, Literature, Technical, etc.) that ask specific, context-driven questions.
- **Real-time Live Monitor**: Group Leaders can watch active defense sessions and inject surprise follow-up questions on the fly.
- **AI Answer Evaluation**: Get instant feedback, scoring, and correct answers based on your thesis excerpts.
- **Fallback LLM Support**: Uses Google Gemini as the primary AI, with an automatic fallback to Groq if the primary provider fails.
- **Role-based Access**: Distinct admin (Group Leader) and member (Student) dashboards.
- **Built-in Security**: Firebase Authentication and Firestore security rules keep your data safe.

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES2022)
- **Backend / Database**: Firebase (Auth & Firestore)
- **File Parsing**: PDF.js, Mammoth.js
- **AI Integration**: OpenAI-compatible APIs (Google Gemini, Groq, OpenAI)

## 📋 Prerequisites

Before running this application, you will need:
1. A **Firebase Project** with Authentication (Email/Password) and Firestore Database enabled.
2. An **API Key** from an AI provider (Google Gemini or Groq is recommended).
3. A basic web server to run the files locally (e.g., VS Code Live Server, Python `http.server`, or deployed on Vercel).

## ⚙️ Setup & Installation

### 1. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project and add a Web App.
3. Copy your Firebase configuration object.
4. Open `app.js` and replace the `firebaseConfig` object at the top of the file with your own credentials.

### 2. Firestore Security Rules
Go to **Firestore Database → Rules** in your Firebase Console and paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isLeader() {
      return isSignedIn() && request.auth.token.email == 'YOUR_LEADER_EMAIL@gmail.com';
    }
    match /defensesim_users/{userId} {
      allow read: if isSignedIn() || resource.data.role == 'admin';
      allow create: if isSignedIn() && ((request.resource.data.uid == request.auth.uid && request.resource.data.role == 'member') || isLeader());
      allow update, delete: if isLeader();
    }
    match /defensesim_documents/{docId} {
      allow read: if isSignedIn(); allow write: if isLeader();
    }
    match /defensesim_chunks/{chunkId} {
      allow read: if isSignedIn(); allow write: if isLeader();
    }
    match /defensesim_live/{sessionId} {
      allow read, update: if isSignedIn() && (isLeader() || resource.data.uid == request.auth.uid);
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid;
      allow delete: if isLeader() || (isSignedIn() && resource.data.uid == request.auth.uid);
    }
    match /defensesim_settings/{settingId} {
      allow read: if isSignedIn(); allow write: if isLeader();
    }
  }
}