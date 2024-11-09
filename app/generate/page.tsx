"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, Copy, Twitter, Instagram, Linkedin, Clock, Menu, X as XIcon, Home, Settings, HelpCircle, LogOut, History, FileText } from "lucide-react";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { SignInButton, useUser, SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  saveGeneratedContent,
  getGeneratedContentHistory,
} from "@/utils/db/actions";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const contentTypes = [
  { value: "twitter", label: "Twitter Thread", icon: Twitter },
  { value: "instagram", label: "Instagram Caption", icon: Instagram },
  { value: "linkedin", label: "LinkedIn Post", icon: Linkedin },
];

const MAX_TWEET_LENGTH = 280;

interface HistoryItem {
  id: number;
  contentType: string;
  prompt: string;
  content: string;
  createdAt: Date;
}

const TwitterMock = ({ content }: { content: string[] }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg max-w-md mx-auto shadow-lg">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image src="/placeholder.svg?height=48&width=48" alt="User Avatar" width={48} height={48} />
        </div>
        <div className="ml-3">
          <p className="font-bold">User Name</p>
          <p className="text-gray-500 text-sm">@username</p>
        </div>
      </div>
      {content.map((tweet, index) => (
        <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
          <p className="text-base">{tweet}</p>
          <div className="mt-2 flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>Just now</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const InstagramMock = ({ content }: { content: string }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg max-w-md mx-auto shadow-lg">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image src="/placeholder.svg?height=32&width=32" alt="User Avatar" width={32} height={32} />
        </div>
        <p className="font-bold ml-3">username</p>
      </div>
      <div className="w-full h-64 bg-gray-200 mb-4 rounded-lg overflow-hidden">
        <Image src="/placeholder.svg?height=256&width=256" alt="Instagram post" width={256} height={256} className="w-full h-full object-cover" />
      </div>
      <p className="text-sm">{content}</p>
    </div>
  );
};

const LinkedInMock = ({ content }: { content: string }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg max-w-md mx-auto shadow-lg">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image src="/placeholder.svg?height=48&width=48" alt="User Avatar" width={48} height={48} />
        </div>
        <div className="ml-3">
          <p className="font-bold">User Name</p>
          <p className="text-gray-500 text-sm">Job Title</p>
        </div>
      </div>
      <p className="text-base">{content}</p>
      <div className="mt-4 flex items-center text-gray-500 text-sm">
        <Clock className="w-4 h-4 mr-1" />
        <span>Just now</span>
      </div>
    </div>
  );
};

export default function GenerateContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [contentType, setContentType] = useState(contentTypes[0].value);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      console.error("Gemini API key is not set");
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else if (isSignedIn && user) {
      console.log("User loaded:", user);
      fetchContentHistory();
    }
  }, [isLoaded, isSignedIn, user, router]);

  const fetchContentHistory = async () => {
    if (user?.id) {
      const contentHistory = await getGeneratedContentHistory(user.id);
      setHistory(contentHistory);
    }
  };

  const handleGenerate = async () => {
    if (!genAI || !user?.id || !prompt) {
      alert("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      let promptText = `Generate ${contentType} content about "${prompt}".`;
      if (contentType === "twitter") {
        promptText += " Provide a thread of 5 tweets, each under 280 characters.";
      }

      let imagePart: Part | null = null;
      if (contentType === "instagram" && image) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              resolve(e.target.result);
            } else {
              resolve("");
            }
          };
          reader.readAsDataURL(image);
        });

        const base64Data = imageData.split(",")[1];
        if (base64Data) {
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: image.type,
            },
          };
        }
        promptText += " Describe the image and incorporate it into the caption.";
      }

      const parts: (string | Part)[] = [promptText];
      if (imagePart) parts.push(imagePart);

      const result = await model.generateContent(parts);
      const generatedText = result.response.text();

      let content: string[];
      if (contentType === "twitter") {
        content = generatedText
          .split("\n\n")
          .filter((tweet) => tweet.trim() !== "");
      } else {
        content = [generatedText];
      }

      setGeneratedContent(content);

      const savedContent = await saveGeneratedContent(
        user.id,
        content.join("\n\n"),
        prompt,
        contentType
      );

      if (savedContent) {
        setHistory((prevHistory) => [savedContent, ...prevHistory]);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent(["An error occurred while generating content."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setContentType(item.contentType);
    setPrompt(item.prompt);
    setGeneratedContent(
      item.contentType === "twitter"
        ? item.content.split("\n\n")
        : [item.content]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderContentMock = () => {
    if (generatedContent.length === 0) return null;

    switch (contentType) {
      case "twitter":
        return <TwitterMock content={generatedContent} />;
      case "instagram":
        return <InstagramMock content={generatedContent[0]} />;
      case "linkedin":
        return <LinkedInMock content={generatedContent[0]} />;
      default:
        return null;
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[350px]">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome to ThreadCraft AI</h2>
          <p className="text-gray-600 text-center mb-6">
            To start generating amazing content, please sign in or create an account.
          </p>
          <SignInButton mode="modal">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In / Sign Up
            </button>
          </SignInButton>
          <p className="text-xs text-gray-500 text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Mobile menu button */}
        <button
          className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <XIcon /> : <Menu />}
        </button>

        {/* Sidebar */}
        <aside
          className={`bg-gray-900 w-64 fixed inset-y-0 left-0 z-40 overflow-y-auto border-r border-white border-opacity-10 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:h-screen`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Menu</h2>
            </div>
            <nav className="space-y-2">
              <button className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg">
                <Home className="mr-4 h-4 w-4" />
                Dashboard
              </button>
            </nav>
          </div>
          <div className="p-4">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bottom-full mb-2",
                  },
                }}
              />
            </SignedIn>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 pt-16 md:p-8 md:ml-64 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Content generation form */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-md text-white">
              <h2 className="text-2xl font-semibold mb-4">Generate Content</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {contentTypes.map((type) => (
                      <button
                        key={type.value}
                        className={`flex items-center justify-center p-4 rounded-lg ${
                          contentType === type.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setContentType(type.value)}
                      >
                        <type.icon className="mr-2 h-5 w-5" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                    Prompt
                  </label>
                  <textarea
                    id="prompt"
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {contentType === "instagram" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Image
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Image</span>
                      </label>
                      {image && (
                        <span className="text-sm text-gray-600">
                          {image.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg ${
                    isLoading || !prompt ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </button>
              </div>
            </div>

            {/* Generated content display and preview */}
            {(selectedHistoryItem || generatedContent.length > 0) && (
              <div className="bg-gray-900 p-6 rounded-xl shadow-md text-white">
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedHistoryItem ? "History Item" : "Generated Content"}
                </h2>
                <div className="mb-4">
                  <div className="flex border-b">
                    <button
                      className={`py-2 px-4 ${activeTab === 'content' ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveTab('content')}
                    >
                      Content
                    </button>
                    <button
                      className={`py-2 px-4 ${activeTab === 'preview' ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveTab('preview')}
                    >
                      Preview
                    </button>
                  </div>
                </div>
                {activeTab === 'content' && (
                  contentType === "twitter" ? (
                    <div className="space-y-4">
                      {(selectedHistoryItem
                        ? selectedHistoryItem.content.split("\n\n")
                        : generatedContent
                      ).map((tweet, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 p-4 rounded-lg relative"
                        >
                          <ReactMarkdown className="prose max-w-none mb-2 text-sm">
                            {tweet}
                          </ReactMarkdown>
                          <div className="flex justify-between items-center text-gray-500 text-xs mt-2">
                            <span>
                              {tweet.length}/{MAX_TWEET_LENGTH}
                            </span>
                            <button
                              onClick={() => copyToClipboard(tweet)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <ReactMarkdown className="prose max-w-none text-sm">
                        {selectedHistoryItem
                          ? selectedHistoryItem.content
                          : generatedContent[0]}
                      </ReactMarkdown>
                    </div>
                  )
                )}
                {activeTab === 'preview' && renderContentMock()}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}