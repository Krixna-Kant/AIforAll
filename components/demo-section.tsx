"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Volume2, Loader2, ImageIcon, LinkIcon, MicIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DemoSectionProps {
  type: "chatbot" | "converter";
}

export default function DemoSection({ type }: DemoSectionProps) {
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedOutputFormat, setSelectedOutputFormat] = useState("audio");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [outputType, setOutputType] = useState("");
  const [isHtmlOutput, setIsHtmlOutput] = useState(false);

  // Handle chat submission
  const handleChatSubmit = async () => {
    if (!inputText.trim()) return;

    setLoading(true);

    try {
      const chatResponse = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      if (!chatResponse.ok) {
        throw new Error(`Server responded with ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      setOutputText(chatData.response);

      generateAudio(chatData.response);
    } catch (error) {
      console.error("Error:", error);
      setOutputText("Failed to get response from the chatbot. Please try again.");
      toast({
        title: "Error",
        description: "Failed to connect to the chatbot service.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle content conversion
  const handleConversionSubmit = async () => {
    if (!inputText.trim()) return;

    setLoading(true);

    try {
      const convertResponse = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input_type: "text",
          input_content: inputText,
          output_format: selectedOutputFormat,
          language: selectedLanguage,
        }),
      });

      if (!convertResponse.ok) {
        throw new Error(`Server responded with ${convertResponse.status}`);
      }

      const convertData = await convertResponse.json();
      
      // Set original text if available
      if (convertData.original_text) {
        setOriginalText(convertData.original_text);
      }

      // Check for errors
      if (convertData.error) {
        toast({
          title: "Error",
          description: convertData.error,
          variant: "destructive",
        });
        setOutputText(convertData.original_text || "Error occurred during conversion");
        return;
      }

      // Handle different output types
      setOutputType(convertData.output_type || selectedOutputFormat);
      setIsHtmlOutput(convertData.is_html || false);

      if (convertData.output_type === "audio" || selectedOutputFormat === "audio") {
        setAudioUrl(convertData.output_url);
        setOutputText(convertData.output || convertData.original_text || "Audio generated successfully. Click Listen to play.");
      } else {
        setOutputText(convertData.output || "");
      }
    } catch (error) {
      console.error("Error:", error);
      setOutputText("Failed to convert content. Please try again.");
      toast({
        title: "Error",
        description: "Failed to connect to the conversion service.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate audio from text
  const generateAudio = async (text: string) => {
    try {
      const ttsResponse = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: selectedLanguage }),
      });

      if (!ttsResponse.ok) {
        throw new Error(`TTS server responded with ${ttsResponse.status}`);
      }

      const ttsData = await ttsResponse.json();
      setAudioUrl(ttsData.audio_url);
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Play audio
  const handleListen = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        toast({
          title: "Error",
          description: "Could not play audio. Please try again.",
          variant: "destructive",
        });
      });
    } else if (outputText) {
      generateAudio(outputText).then(() => {
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play();
        }
      });
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage || "en-US";

    setInputText("Listening...");

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = () => {
      setInputText(inputText === "Listening..." ? "" : inputText);
      toast({
        title: "Error",
        description: "Could not capture voice input. Please try again.",
        variant: "destructive",
      });
    };

    recognition.start();
  };

  // Handle image upload
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process uploaded file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessingFile(true);
    setInputText(`Processing image: ${file.name}`);

    try {
      // For image files, read and convert to base64
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            // Get base64 data without the prefix
            const base64Data = (e.target?.result as string).split(',')[1];
            
            // Process the image using the convert endpoint
            const convertResponse = await fetch("http://localhost:5000/convert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                input_type: "image",
                input_content: { data: base64Data },
                output_format: selectedOutputFormat,
                language: selectedLanguage,
              }),
            });

            if (!convertResponse.ok) {
              throw new Error(`Conversion failed with status ${convertResponse.status}`);
            }

            const result = await convertResponse.json();
            
            if (result.error) {
              toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
              });
              setOutputText(result.original_text || "Error processing the image");
              return;
            }

            setOutputType(result.output_type || selectedOutputFormat);
            setIsHtmlOutput(result.is_html || false);
            
            if (result.output_type === "audio" || selectedOutputFormat === "audio") {
              setAudioUrl(result.output_url || "");
              setOutputText(result.output || result.original_text || "Image processed. Click Listen to hear description.");
            } else {
              setOutputText(result.output || result.original_text || "");
            }
            
            setOriginalText(result.original_text || "");
          } catch (error) {
            console.error("Error processing image:", error);
            toast({
              title: "Error",
              description: "Failed to process the image. Please try again.",
              variant: "destructive",
            });
            setOutputText("Failed to process the image. Please try again.");
          } finally {
            setProcessingFile(false);
          }
        };
        
        reader.onerror = () => {
          setProcessingFile(false);
          toast({
            title: "Error",
            description: "Failed to read the image file. Please try again.",
            variant: "destructive",
          });
        };
        
        reader.readAsDataURL(file);
      } else {
        // For non-image files, use FormData and upload
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        setOutputText(`File uploaded: ${file.name}`);
        setProcessingFile(false);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to process the uploaded file. Please try again.",
        variant: "destructive",
      });
      setProcessingFile(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle URL input
  const handleUrlSubmit = async () => {
    if (!inputText.trim() || !inputText.startsWith("http")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const convertResponse = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input_type: "url",
          input_content: inputText,
          output_format: selectedOutputFormat,
          language: selectedLanguage,
        }),
      });

      if (!convertResponse.ok) {
        throw new Error(`Server responded with ${convertResponse.status}`);
      }

      const result = await convertResponse.json();
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        setOutputText(result.original_text || "Error processing the URL");
        return;
      }

      setOutputType(result.output_type || selectedOutputFormat);
      setIsHtmlOutput(result.is_html || false);
      
      if (result.output_type === "audio" || selectedOutputFormat === "audio") {
        setAudioUrl(result.output_url || "");
        setOutputText(result.output || result.original_text || "URL processed. Click Listen to hear content.");
      } else {
        setOutputText(result.output || result.original_text || "");
      }
      
      setOriginalText(result.original_text || "");
    } catch (error) {
      console.error("Error processing URL:", error);
      setOutputText("Failed to process URL. Please check the URL and try again.");
      toast({
        title: "Error",
        description: "Failed to process the URL content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear inputs and outputs
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setOriginalText("");
    setAudioUrl("");
    setOutputType("");
    setIsHtmlOutput(false);
  };

  // Handle submit based on type
  const handleSubmit = () => {
    if (type === "chatbot") {
      handleChatSubmit();
    } else if (inputText.trim().startsWith("http")) {
      handleUrlSubmit();
    } else {
      handleConversionSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
        title="Upload file"
      />

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
            <Button variant="outline" size="sm" onClick={handleVoiceInput} disabled={loading}>
              <MicIcon className="h-4 w-4 mr-2" />
              Voice Input
            </Button>
          </div>

          <div className="flex justify-between">
            <Button onClick={handleSubmit} disabled={loading || !inputText.trim() || inputText === "Listening..."} className="gap-2">
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
                <Select value={selectedOutputFormat} onValueChange={setSelectedOutputFormat}>
                  <SelectTrigger id="output-format">
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio">Listen</SelectItem>
                    <SelectItem value="braille">Braille</SelectItem>
                    <SelectItem value="dyslexia">Dyslexia-Friendly</SelectItem>
                    <SelectItem value="simplified">Simplified Text</SelectItem>
                    <SelectItem value="sign" disabled>Sign Language (Not Available Now)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="language-select" className="block text-sm font-medium mb-2">
                  Language
                </label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleVoiceInput} 
              disabled={loading || processingFile}>
              <MicIcon className="h-4 w-4 mr-2" />
              Voice Input
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImageClick} 
              disabled={loading || processingFile}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>

          <div className="flex justify-between">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || processingFile || !inputText.trim() || inputText === "Listening..."} 
              className="gap-2">
              {loading || processingFile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : inputText.trim().startsWith("http") ? (
                <>
                  <LinkIcon className="h-4 w-4 mr-1" />
                  <span>Process URL</span>
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
              
              {/* Display output based on type */}
              {isHtmlOutput ? (
                <div 
                  className={`p-4 border rounded-lg ${outputType === "dyslexia" ? "font-dyslexic" : ""}`}
                  dangerouslySetInnerHTML={{ __html: outputText }}
                />
              ) : (
                <div className={`p-4 border rounded-lg ${outputType === "dyslexia" ? "font-dyslexic" : ""}`}>
                  {outputText}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {(selectedOutputFormat === "audio" || audioUrl) && (
                  <Button variant="ghost" size="sm" className="gap-2" onClick={handleListen}>
                    <Volume2 className="h-4 w-4" />
                    <span>Listen</span>
                  </Button>
                )}
                
                {originalText && outputText !== originalText && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setOutputText(originalText);
                      setOutputType("original");
                      setIsHtmlOutput(false);
                    }}>
                    Show Original
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}