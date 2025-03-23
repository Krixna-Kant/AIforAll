"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  MessageSquare,
  Volume2,
  Loader2,
  ImageIcon,
  LinkIcon,
  VideoIcon,
  HandIcon,
  DownloadIcon,
  ShareIcon,
  FileTextIcon,
  MicIcon,
} from "lucide-react"

interface DemoSectionProps {
  type: "chatbot" | "converter"
}

export default function DemoSection({ type }: DemoSectionProps) {
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("audio")
  const [selectedFont, setSelectedFont] = useState("default")
  const [fontSize, setFontSize] = useState(16)
  const [contrast, setContrast] = useState(50)

  const handleSubmit = async () => {
    if (!inputText.trim()) return

    setLoading(true)

    try {
      // Send input text to the chatbot endpoint
      const chatResponse = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      })
      const chatData = await chatResponse.json()
      setOutputText(chatData.response)

      // Send chatbot response to the text-to-speech endpoint
      const ttsResponse = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chatData.response }),
      })
      const ttsData = await ttsResponse.json()

      // Play the generated audio
      const audio = new Audio(ttsData.audio_url)
      audio.play()
    } catch (error) {
      console.error("Error:", error)
      setOutputText("Failed to get response from the chatbot.")
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = () => {
    const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)()
    recognition.lang = "en-US" 
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
    }
    recognition.start()
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
  }

  const handleListen = async () => {
    if (!outputText.trim()) return;
  
    try {
      // Send chatbot response to the text-to-speech endpoint
      const ttsResponse = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: outputText }),
      });
      const ttsData = await ttsResponse.json();
  
      // Play the generated audio
      const audio = new Audio(ttsData.audio_url);
      audio.play();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {type === "chatbot" ? (
        <>
          <div className="space-y-2">
            <label htmlFor="chat-input" className="block text-sm font-medium">
              Ask a question in any language
            </label>
            <Textarea
              id="chat-input"
              placeholder="E.g., How can I make my website more accessible for screen readers?"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleVoiceInput}>
              <MicIcon className="h-4 w-4 mr-2" />
              Voice Input
            </Button>
            {/* <Button variant="outline" size="sm" onClick={() => setInputText(inputText + " 📷")}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Image
            </Button> */}
          </div>

          <div className="flex justify-between">
            <Button onClick={handleSubmit} disabled={loading || !inputText.trim()} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  <span>Send Question</span>
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={loading || (!inputText && !outputText)}>
              Clear
            </Button>
          </div>

          {outputText && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">AI4All Assistant</p>
                  <p className="mt-1">{outputText}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleListen}>
                  <Volume2 className="h-4 w-4" />
                  <span>Listen</span>
                </Button>
                {/* <Button variant="ghost" size="sm" className="gap-2">
                  <HandIcon className="h-4 w-4" />
                  <span>Sign Language</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  <span>Simplified Text</span>
                </Button> */}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="output-format" className="block text-sm font-medium mb-2">
                  Output Format
                </label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger id="output-format">
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio">Audio Description</SelectItem>
                    <SelectItem value="braille">Braille</SelectItem>
                    <SelectItem value="simplified">Simplified Text</SelectItem>
                    <SelectItem value="signlanguage">Sign Language</SelectItem>
                    <SelectItem value="dyslexic">Dyslexia-Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="language-select" className="block text-sm font-medium mb-2">
                  Language
                </label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="font-size" className="block text-sm font-medium mb-2">
                Font Size: {fontSize}px
              </label>
              <Slider id="font-size" value={[fontSize]} onValueChange={(value) => setFontSize(value[0])} min={12} max={24} step={1} />
            </div>

            <div>
              <label htmlFor="contrast" className="block text-sm font-medium mb-2">
                Contrast: {contrast}%
              </label>
              <Slider id="contrast" value={[contrast]} onValueChange={(value) => setContrast(value[0])} min={0} max={100} step={1} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content-input" className="block text-sm font-medium">
              Enter content or URL to convert
            </label>
            <div className="flex gap-2">
              <Textarea
                id="content-input"
                placeholder="Enter text, paste URL, or upload media to apply accessibility features..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={3}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInputText("https://example.com/article")}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Enter URL
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInputText(inputText + " 📷")}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInputText(inputText + " 🎬")}>
              <VideoIcon className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInputText(inputText + " 🎤")}>
              <MicIcon className="h-4 w-4 mr-2" />
              Voice Input
            </Button>
          </div>

          <div className="flex justify-between">
            <Button onClick={handleSubmit} disabled={loading || !inputText.trim()} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Convert Content</span>
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={loading || (!inputText && !outputText)}>
              Clear
            </Button>
          </div>

          {outputText && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Converted Content:</p>
              <div className={`p-4 border rounded-lg ${selectedFont}`} style={{ fontSize: `${fontSize}px`, filter: `contrast(${contrast}%)` }}>
                {outputText}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Volume2 className="h-4 w-4" />
                  <span>Listen</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <DownloadIcon className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}