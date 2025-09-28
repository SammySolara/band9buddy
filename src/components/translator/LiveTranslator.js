// src/components/translator/LiveTranslator.js
import { useState, useEffect, useCallback } from 'react'
import { ArrowRightLeft, Copy, Volume2, Languages, Loader2 } from 'lucide-react'

const LiveTranslator = () => {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('vi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Common languages for quick access
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' }
  ]

  // Mock translation function - replace with actual Google Translate API
  const translateText = async (text, from, to) => {
    if (!text.trim()) {
      setTranslatedText('')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Mock translation with delay to simulate API call
      // Replace this with actual Google Translate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock translations for demo
      const mockTranslations = {
        'hello': { vi: 'xin chào', zh: '你好', ja: 'こんにちは', ko: '안녕하세요' },
        'goodbye': { vi: 'tạm biệt', zh: '再见', ja: 'さようなら', ko: '안녕히 가세요' },
        'thank you': { vi: 'cảm ơn', zh: '谢谢', ja: 'ありがとう', ko: '감사합니다' },
        'how are you': { vi: 'bạn khỏe không', zh: '你好吗', ja: '元気ですか', ko: '어떻게 지내세요' },
        'good morning': { vi: 'chào buổi sáng', zh: '早上好', ja: 'おはよう', ko: '좋은 아침' }
      }

      const lowerText = text.toLowerCase()
      if (mockTranslations[lowerText] && mockTranslations[lowerText][to]) {
        setTranslatedText(mockTranslations[lowerText][to])
      } else {
        // Fallback mock translation
        setTranslatedText(`[${to.toUpperCase()}] ${text}`)
      }

      /* 
      // Actual Google Translate API implementation would look like this:
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source: from,
          target: to
        })
      })
      
      if (!response.ok) {
        throw new Error('Translation failed')
      }
      
      const data = await response.json()
      setTranslatedText(data.translatedText)
      */

    } catch (err) {
      setError('Translation failed. Please try again.')
      console.error('Translation error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Debounced translation
  const debouncedTranslate = useCallback(
    debounce((text, from, to) => translateText(text, from, to), 500),
    []
  )

  useEffect(() => {
    if (sourceText) {
      debouncedTranslate(sourceText, sourceLang, targetLang)
    }
  }, [sourceText, sourceLang, targetLang, debouncedTranslate])

  const swapLanguages = () => {
    const tempLang = sourceLang
    const tempText = sourceText
    
    setSourceLang(targetLang)
    setTargetLang(tempLang)
    setSourceText(translatedText)
    setTranslatedText(tempText)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(err => console.log('Copy failed:', err))
  }

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'vi' ? 'vi-VN' : lang === 'en' ? 'en-US' : lang
      speechSynthesis.speak(utterance)
    }
  }

  const getLanguageName = (code) => {
    return languages.find(lang => lang.code === code)?.name || code
  }

  const getLanguageFlag = (code) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Live Translator 🌐
        </h2>
        <p className="text-gray-600">
          Dịch thuật trực tiếp giữa các ngôn ngữ. Nhập văn bản và xem kết quả dịch ngay lập tức.
        </p>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center md:col-span-2 md:order-last">
            <button
              onClick={swapLanguages}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>Swap</span>
            </button>
          </div>

          {/* Target Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {getLanguageFlag(sourceLang)} {getLanguageName(sourceLang)}
            </h3>
            <div className="flex items-center gap-2">
              {sourceText && (
                <>
                  <button
                    onClick={() => speakText(sourceText, sourceLang)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                    title="Listen"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(sourceText)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                    title="Copy"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="mt-2 text-right text-sm text-gray-500">
            {sourceText.length}/5000 characters
          </div>
        </div>

        {/* Translated Text */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {getLanguageFlag(targetLang)} {getLanguageName(targetLang)}
            </h3>
            <div className="flex items-center gap-2">
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
              {translatedText && !loading && (
                <>
                  <button
                    onClick={() => speakText(translatedText, targetLang)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                    title="Listen"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(translatedText)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                    title="Copy"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="w-full h-64 p-4 bg-gray-50 border border-gray-300 rounded-lg overflow-y-auto">
            {error ? (
              <div className="text-red-600 italic">{error}</div>
            ) : (
              <div className="text-gray-900 whitespace-pre-wrap">
                {translatedText || (sourceText && loading ? 'Translating...' : 'Translation will appear here...')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Translation Examples */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {['hello', 'thank you', 'good morning', 'how are you', 'goodbye', 'see you later'].map((phrase) => (
            <button
              key={phrase}
              onClick={() => setSourceText(phrase)}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-gray-900 capitalize">{phrase}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Debounce utility function
function debounce(func, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export default LiveTranslator