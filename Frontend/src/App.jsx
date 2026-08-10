import { useState,useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import EditorModule  from "react-simple-code-editor"
const Editor = EditorModule.default || EditorModule;
console.log('Editor:', Editor);
import prism from "prismjs"
import Markdown from "react-markdown"
console.log('Markdown:', Markdown);
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'



function App() {
  const [count, setCount] = useState(0)
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
    }`)

  const [ review, setReview ] = useState(``)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setReview("");
    try {
      const response = await axios.post('https://code-review-backend-iota.vercel.app/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      console.error("Error fetching review:", err);
      setError("Failed to fetch review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <main>

        <div className="leftcontainer">
        
        <div className="code">
         <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px", 
                height: "100%",
                width: "100%"
              }}
            /> 
        </div>
        <div 
  onClick={!loading ? reviewCode : null} 
  className={`review ${loading ? 'disabled' : ''}`}
>
  {loading ? "Reviewing..." : "Review"}
</div>

</div>
<div className="rightcontainer">
  {loading ? (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Analyzing code, please wait...</p>
    </div>
  ) : (
    <Markdown rehypePlugins={[rehypeHighlight]}>
      {review}
    </Markdown>
  )}
</div>
    </main>
    </>
  )
}

export default App
