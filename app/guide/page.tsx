import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Settings, MousePointer, Keyboard, Mic } from "lucide-react"

export default function GuidePage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container py-10">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter">AI Accessibility Assistant Guide</h1>
            <p className="text-xl text-muted-foreground">
              Learn how to use the AI Accessibility Assistant browser extension for comprehensive accessibility.
            </p>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Installation Guide</h2>

            <div className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
                      <Download className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Step 1: Download the Extension</h3>
                      <p>
                        Download the extension files from the GitHub repository by clicking the button below.
                      </p>
                      <Button className="mt-2" asChild>
                        <a
                          href="https://github.com/Krixna-Kant/AI-Accessibility-Extension"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Download from GitHub</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
                      <MousePointer className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Step 2: Install the Extension</h3>
                      <p>
                        Open Google Chrome and go to <code>chrome://extensions/</code>. Enable Developer mode (toggle in
                        the top right corner), then click "Load unpacked" and select the folder where you extracted the
                        extension files.
                      </p>
                      <div className="mt-4 border rounded-lg overflow-hidden">
                        <img
                          src="/extension-dev.jpg"
                          alt="Screenshot showing the Load unpacked button in Chrome extensions"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
                      <Settings className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Step 3: Pin to Toolbar</h3>
                      <p>
                        After installation, click the extensions icon in Chrome, find "AI Accessibility Assistant," and
                        click the pin icon to keep it easily accessible in your toolbar.
                      </p>
                      <div className="mt-4 border rounded-lg overflow-hidden">
                        <img
                          src="/pin-img.jpg"
                          alt="Screenshot showing how to pin the extension to the Chrome toolbar"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Using the Extension</h2>

            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="voice">Voice Commands</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Getting Started</h3>
                  <p>
                    After installation, click the extension icon in your toolbar to open the main panel. Here are some of
                    the key features:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Text-to-Speech</h4>
                      <p>Select text on any webpage and click the "Read Aloud" button in the extension panel.</p>
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <img
                          src="/read-img.jpg"
                          alt="Demonstration of the Text-to-Speech feature"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Dyslexia-Friendly Font</h4>
                      <p>
                        Click "Font Settings" in the extension panel to switch to OpenDyslexic for better readability.
                      </p>
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <img
                          src="/dyslexia-font.jpg"
                          alt="Demonstration of the Dyslexia-Friendly Font feature"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">High Contrast Mode</h4>
                      <p>
                        Use the "Color Settings" to enable high contrast mode for better visibility.
                      </p>
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <img
                          src="/high-contrast.jpg"
                          alt="Demonstration of the High Contrast Mode feature"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Translation</h4>
                      <p>Select text and click "Translate" to convert content to your preferred language.</p>
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <img
                          src="/trans-img.jpg"
                          alt="Demonstration of the Translation feature"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="voice" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Voice Command Guide</h3>
                  <p>Control your browsing experience using just your voice with these commands:</p>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left">Command</th>
                          <th className="p-3 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3 font-medium">"Scroll down"</td>
                          <td className="p-3">Scrolls the page down</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-medium">"Scroll up"</td>
                          <td className="p-3">Scrolls the page up</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-medium">"Go back"</td>
                          <td className="p-3">Navigates to the previous page</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-medium">"Go forward"</td>
                          <td className="p-3">Navigates to the next page</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-medium">"Stop reading"</td>
                          <td className="p-3">Stops the text-to-speech</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-medium">"Read page"</td>
                          <td className="p-3">Reads the current page content</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Mic className="h-8 w-8 text-primary" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium">Activating Voice Commands</h4>
                      <p>
                        Click the microphone icon in the extension panel or say "Hey Assistant" to activate voice
                        command mode.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Customizing Your Experience</h3>
                  <p>Personalize the extension to meet your specific accessibility needs:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Voice Settings</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Choose from multiple voice options</li>
                        <li>Adjust speaking rate and pitch</li>
                        <li>Set preferred language</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Font Settings</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Select from dyslexia-friendly fonts</li>
                        <li>Adjust font size and spacing</li>
                        <li>Customize line height</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Color Settings</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Choose from preset color themes</li>
                        <li>Create custom color schemes</li>
                        <li>Adjust contrast levels</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Keyboard Shortcuts</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Customize keyboard shortcuts</li>
                        <li>Enable/disable specific features</li>
                        <li>Set activation keys</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Keyboard className="h-8 w-8 text-primary" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium">Accessing Settings</h4>
                      <p>
                        Click the gear icon in the extension panel to open the settings menu and customize your
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Video Tutorial</h2>
            <p>Watch our comprehensive video guide to learn all the features of the AI Accessibility Assistant:</p>

            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-muted-foreground">Video tutorial placeholder</p>
                <Button variant="outline" className="mt-4">
                  Play Video
                </Button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Need More Help?</h2>
            <p>If you're experiencing any issues or have questions, please contact our support team:</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/#contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://github.com/Krixna-Kant/AI-Accessibility-Extension" target="_blank" rel="noopener noreferrer">
                  Visit GitHub Repository
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/40">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AI Accessibility Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}