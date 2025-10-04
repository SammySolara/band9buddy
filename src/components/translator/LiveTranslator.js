import { useState } from "react";
import {Languages, ArrowLeftRight } from "lucide-react";

const LiveTranslator = () => {
  const [fromLang, setFromLang] = useState("EN");
  const [toLang, setToLang] = useState("VI");
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "VI", name: "Tiếng Việt", flag: "🇻🇳" },
  ];

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setText(translatedText);
    setTranslatedText("");
  };

  const translateText = async () => {
    if (!text.trim()) {
      setTranslatedText("");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://smjypkielfgtyaddrpbb.supabase.co/functions/v1/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            text,
            source: fromLang,
            target: toLang,
          }),
        }
      );

      if (!response.ok) throw new Error("Supabase function failed");

      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (err) {
      console.error("Translation error:", err);
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Languages className="w-6 h-6 text-blue-600" />
        Live Translator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">
              {languages.find((l) => l.code === fromLang).flag}{" "}
              {languages.find((l) => l.code === fromLang).name}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type here..."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">
              {languages.find((l) => l.code === toLang).flag}{" "}
              {languages.find((l) => l.code === toLang).name}
            </span>
          </div>
          <textarea
            value={translatedText}
            readOnly
            className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={swapLanguages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Swap
        </button>

        <button
          onClick={translateText}
          disabled={loading || !text.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "Đang dịch" : "Dịch"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default LiveTranslator;
