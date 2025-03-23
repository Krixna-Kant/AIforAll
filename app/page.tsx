import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MicIcon, EyeIcon, BookOpenIcon, GlobeIcon, MessageSquareIcon, VolumeIcon } from "lucide-react"
import DarkModeToggle from "@/components/dark-mode-toggle"
import DemoSection from "@/components/demo-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-background focus:z-50"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold">AI4All</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
              Demo
            </Link>
            <Link href="/guide" className="text-sm font-medium transition-colors hover:text-primary">
              Guide
            </Link>
            <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
              FAQ
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
            <DarkModeToggle />
          </nav>
        </div>
      </header>

      <main id="main-content" className="container py-10 space-y-20">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Digital Accessibility for Everyone
            </h1>
            <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
              AI4All is a comprehensive platform that transforms how people with disabilities experience digital content
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <span>Download Extension</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Explore Platform</Link>
            </Button>
          </div>
          <div className="relative w-full max-w-4xl mx-auto mt-8 rounded-lg overflow-hidden shadow-xl border">
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="AI4All platform interface showing various accessibility features including sign language translation and content conversion"
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Comprehensive Accessibility Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
              Our AI-powered platform makes digital content accessible in multiple formats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="h-full">
              <CardHeader>
                <VolumeIcon className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle>AI Text-to-Speech</CardTitle>
                <CardDescription>Natural-sounding voice reads content aloud with customizable options</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Advanced AI technology converts text to natural speech in over 50 languages with adjustable speed,
                  pitch, and voice styles.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <BookOpenIcon className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Braille & Simplified Text</CardTitle>
                <CardDescription>Convert content to Braille or simplified language</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Transform complex content into Braille-ready format or simplified text with adjustable reading levels
                  for different cognitive abilities.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <EyeIcon className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Visual Adaptations</CardTitle>
                <CardDescription>Customize visual presentation for different needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Adjust color contrast, font styles, text size, and spacing. Includes specialized dyslexia-friendly
                  fonts and high-contrast modes.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <GlobeIcon className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>Break language barriers with instant translation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Translate content between over 100 languages while preserving context and meaning, with specialized
                  support for sign languages.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <MicIcon className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Voice & Media Input</CardTitle>
                <CardDescription>Control and interact using voice or media uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Navigate with natural voice commands and upload images, audio, or video for accessibility conversion.
                  Supports dictation and voice-based form filling.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <MessageSquareIcon className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle>AI Sign Language Chatbot</CardTitle>
                <CardDescription>Interactive assistance with sign language support</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our AI chatbot can understand text, voice, and sign language input, responding with sign language
                  videos, text, or speech based on user preference.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-12 space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Try It Yourself</h2>
            <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
              Experience our accessibility tools in action
            </p>
          </div>

          <Tabs defaultValue="chatbot" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
              <TabsTrigger value="converter">Content Converter</TabsTrigger>
              {/* <TabsTrigger value="signlanguage">Sign Language</TabsTrigger> */}
            </TabsList>
            <TabsContent value="chatbot" className="p-4 border rounded-lg mt-4">
              <DemoSection type="chatbot" />
            </TabsContent>
            <TabsContent value="converter" className="p-4 border rounded-lg mt-4">
              <DemoSection type="converter" />
            </TabsContent>
            {/* <TabsContent value="signlanguage" className="p-4 border rounded-lg mt-4">
              <DemoSection type="signlanguage" />
            </TabsContent> */}
          </Tabs>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
              Find answers to common questions about our accessibility extension
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is AI4All and how does it work?</AccordionTrigger>
              <AccordionContent>
                AI4All is a comprehensive accessibility platform that uses artificial intelligence to make digital
                content accessible to everyone. It includes a Chrome extension, web application, and API services that
                can convert content between different formats including text, speech, sign language, Braille, and
                simplified language.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is AI4All free to use?</AccordionTrigger>
              <AccordionContent>
                We offer a free tier with basic features for individual users. Premium plans are available for
                organizations and power users who need advanced features, higher usage limits, and priority support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How accurate is the sign language translation?</AccordionTrigger>
              <AccordionContent>
                Our sign language translation uses advanced AI models trained on native signers. It currently supports
                American Sign Language (ASL), British Sign Language (BSL), and several other sign languages with
                approximately 90-95% accuracy for common phrases and concepts. We're continuously improving our models
                with feedback from the deaf community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I use AI4All with any website or content?</AccordionTrigger>
              <AccordionContent>
                Yes, AI4All works with most websites, documents, images with text, and media files. You can use our
                Chrome extension for live website translation, upload files directly to our web application, or
                integrate our API into your own applications. Some highly dynamic or complex websites may have limited
                compatibility.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How does the content converter handle different media types?</AccordionTrigger>
              <AccordionContent>
                Our content converter can process text, URLs, images, audio, and video. For text and URLs, we directly
                convert the content. For images, we use OCR to extract text before conversion. For audio and video, we
                use speech recognition to transcribe content before applying the requested accessibility
                transformations. We can also generate audio descriptions for visual content.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>support@aiaccessibility.com</p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p>+1 (800) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-medium">Social Media</h3>
                  <div className="flex space-x-4 mt-2">
                    <Button variant="ghost" size="icon" aria-label="Twitter">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Facebook">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="LinkedIn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your email"
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your message"
                      aria-required="true"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/40">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <EyeIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold">AI4All</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AI4All. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

