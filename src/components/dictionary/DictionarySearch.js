// src/components/dictionary/DictionarySearch.js
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, BookOpen, Volume2, Heart, Copy, AlertCircle } from 'lucide-react'

const DictionarySearch = () => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [wordData, setWordData] = useState(null)
  const [vietnameseTranslation, setVietnameseTranslation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    const wordParam = searchParams.get("word");
    if (!wordParam) return;

    setSearchTerm(wordParam);

    const fetchWord = async () => {
      if (!wordParam.trim()) return;

      setLoading(true);
      setError(null);
      setVietnameseTranslation(null);

      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${wordParam.toLowerCase()}`
        );
        if (!response.ok) throw new Error("Word not found");

        const data = await response.json();
        setWordData(data[0]);

        searchVietnameseTranslation(wordParam);

        setSearchHistory((prev) => {
          const newHistory = [
            wordParam,
            ...prev.filter(
              (item) => item.toLowerCase() !== wordParam.toLowerCase()
            ),
          ];
          return newHistory.slice(0, 5);
        });
      } catch (err) {
        setError(err.message);
        setWordData(null);
        setVietnameseTranslation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [searchParams]);
  

const searchVietnameseTranslation = async (word) => {
  try {
    const response = await fetch(
      `https://freedictionaryapi.com/api/v1/entries/en/${word.toLowerCase()}?translations=true`
    )

    if (response.ok) {
      const data = await response.json()
      console.log('Vietnamese API response:', data)

      const translations = []

      if (data && data.entries) {
        for (const entry of data.entries) {
          if (entry.senses) {
            for (const sense of entry.senses) {
              if (sense.translations) {
                sense.translations.forEach(t => {
                  if (t.language && t.language.code === 'vi') {
                    translations.push(t.word)
                  }
                })
              }
            }
          }
        }
      }

      if (translations.length > 0) {
        // remove duplicates and join
        setVietnameseTranslation([...new Set(translations)].join(', '))
      } else {
        setVietnameseTranslation(null)
      }
    } else {
      setVietnameseTranslation(null)
    }
  } catch (err) {
    console.log('Vietnamese translation fetch failed:', err)
    setVietnameseTranslation(null)
  }
}

  const searchWord = async (word) => {
    if (!word.trim()) return
    
    setLoading(true)
    setError(null)
    setVietnameseTranslation(null) // Reset Vietnamese translation
    
    try {
      // Primary API call for English definitions
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`)
      
      if (!response.ok) {
        throw new Error('Word not found')
      }
      
      const data = await response.json()
      setWordData(data[0])
      
      // Secondary API call for Vietnamese translation (don't await to avoid blocking)
      searchVietnameseTranslation(word)
      
      // Add to search history (keep last 5 searches)
      setSearchHistory(prev => {
        const newHistory = [word, ...prev.filter(item => item.toLowerCase() !== word.toLowerCase())]
        return newHistory.slice(0, 5)
      })
      
    } catch (err) {
      setError(err.message)
      setWordData(null)
      setVietnameseTranslation(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    searchWord(searchTerm)
  }

  const playPronunciation = (audioUrl) => {
    const audio = new Audio(audioUrl)
    audio.play().catch(err => console.log('Audio play failed:', err))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(err => console.log('Copy failed:', err))
  }

  const renderPhonetics = (phonetics) => {
    if (!phonetics || phonetics.length === 0) return null
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Pronunciation</h3>
        <div className="space-y-2">
          {phonetics.map((phonetic, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {phonetic.text && (
                <span className="text-blue-600 font-mono text-lg">{phonetic.text}</span>
              )}
              {phonetic.audio && (
                <button
                  onClick={() => playPronunciation(phonetic.audio)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMeanings = (meanings) => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Meanings</h3>
        {meanings.map((meaning, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {meaning.partOfSpeech}
              </span>
            </div>
            
            {/* Definitions */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Definitions:</h4>
              {meaning.definitions.slice(0, 3).map((def, defIndex) => (
                <div key={defIndex} className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-700 mb-2">{def.definition}</p>
                  {def.example && (
                    <p className="text-gray-500 italic text-sm">
                      Example: "{def.example}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Synonyms */}
            {meaning.synonyms && meaning.synonyms.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Synonyms:</h4>
                <div className="flex flex-wrap gap-2">
                  {meaning.synonyms.slice(0, 5).map((synonym, synIndex) => (
                    <button
                      key={synIndex}
                      onClick={() => searchWord(synonym)}
                      className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors"
                    >
                      {synonym}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Antonyms */}
            {meaning.antonyms && meaning.antonyms.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Antonyms:</h4>
                <div className="flex flex-wrap gap-2">
                  {meaning.antonyms.slice(0, 5).map((antonym, antIndex) => (
                    <button
                      key={antIndex}
                      onClick={() => searchWord(antonym)}
                      className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors"
                    >
                      {antonym}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          English Dictionary 📚
        </h2>
        <p className="text-gray-600">
          Tìm kiếm định nghĩa, phát âm, và ví dụ của từ tiếng Anh. Có thể bao gồm bản dịch tiếng Việt.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter an English word..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent searches:</h4>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((word, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(word)
                    searchWord(word)
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">
              Sorry, we couldn't find "{searchTerm}". Please check the spelling and try again.
            </p>
          </div>
        </div>
      )}

      {/* Word Display */}
      {wordData && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Word Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {wordData.word}
              </h1>
              
              {/* Vietnamese Translation */}
              {vietnameseTranslation && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-800">Vietnamese Translation:</span>
                  </div>
                  <p className="text-blue-700 font-medium">{vietnameseTranslation}</p>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => copyToClipboard(wordData.word)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy word"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">Copy</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Add to favorites</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phonetics */}
          {renderPhonetics(wordData.phonetics)}

          {/* Meanings */}
          {renderMeanings(wordData.meanings)}

          {/* Source */}
          {wordData.sourceUrls && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Sources:</h4>
              {wordData.sourceUrls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {url}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!wordData && !loading && !error && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Start exploring English words
          </h3>
          <p className="text-gray-600">
            Type any English word in the search box above to get definitions, pronunciations, and examples.
          </p>
        </div>
      )}
    </div>
  )
}

export default DictionarySearch