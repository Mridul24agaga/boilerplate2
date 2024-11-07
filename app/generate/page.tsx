"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, Copy, Twitter, Instagram, Linkedin, Clock, Hash } from "lucide-react";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/Navbar";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  saveGeneratedContent,
  getGeneratedContentHistory,
} from "@/utils/db/actions";
import { TwitterMock } from "@/components/social-mocks/TwitterMock";
import { InstagramMock } from "@/components/social-mocks/InstagramMock";
import { LinkedInMock } from "@/components/social-mocks/LinkedInMock";

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
        <div className="text-center bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to ThreadCraft AI
          </h1>
          <p className="text-gray-400 mb-6">
            To start generating amazing content, please sign in or create an account.
          </p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300">
              Sign In / Sign Up
            </button>
          </SignInButton>
          <p className="text-gray-500 mt-4 text-sm">
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
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Left sidebar - History */}
          <div className="lg:col-span-1 bg-gray-900 rounded-xl p-6 h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-blue-400">History</h2>
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="space-y-4">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleHistoryItemClick(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-2">
                    {item.contentType === "twitter" && (
                      <Twitter className="mr-2 h-5 w-5 text-blue-400" />
                    )}
                    {item.contentType === "instagram" && (
                      <Instagram className="mr-2 h-5 w-5 text-pink-400" />
                    )}
                    {item.contentType === "linkedin" && (
                      <Linkedin className="mr-2 h-5 w-5 text-blue-600" />
                    )}
                    <span className="text-sm font-medium">
                      {item.contentType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">
                    {item.prompt}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content generation form */}
            <div className="bg-gray-900 p-6 rounded-xl space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Content Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {contentTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      className={`flex items-center justify-center p-4 rounded-lg ${
                        contentType === type.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => setContentType(type.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <type.icon className="mr-2 h-5 w-5" />
                      {type.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800 border-none rounded-lg resize-none p-2 text-white"
                />
              </div>

              {contentType === "instagram" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
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
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center justify-center px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      <span>Upload Image</span>
                    </label>
                    {image && (
                      <span className="text-sm text-gray-400">
                        {image.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <motion.button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </motion.button>
            </div>

            {/* Generated content display */}
            {(selectedHistoryItem || generatedContent.length > 0) && (
              <div className="bg-gray-900 p-6 rounded-xl space-y-4">
                <h2 className="text-2xl font-semibold text-blue-400">
                  {selectedHistoryItem ? "History Item" : "Generated Content"}
                </h2>
                {contentType === "twitter" ? (
                  <div className="space-y-4">
                    {(selectedHistoryItem
                      ? selectedHistoryItem.content.split("\n\n")
                      : generatedContent
                    ).map((tweet, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ReactMarkdown className="prose prose-invert max-w-none mb-2 text-sm">
                          {tweet}
                        </ReactMarkdown>
                        <div className="flex justify-between items-center text-gray-400 text-xs mt-2">
                          <span>
                            {tweet.length}/{MAX_TWEET_LENGTH}
                          </span>
                          <motion.button
                            onClick={() => copyToClipboard(tweet)}
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="bg-gray-800 p-4 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReactMarkdown className="prose prose-invert max-w-none text-sm">
                      {selectedHistoryItem
                        ? selectedHistoryItem.content
                        : generatedContent[0]}
                    </ReactMarkdown>
                  </motion.div>
                )}
              </div>
            )}

            {/* Content preview */}
            {generatedContent.length > 0 && (
              <motion.div
                className="bg-gray-900 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  Preview
                </h2>
                {renderContentMock()}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}