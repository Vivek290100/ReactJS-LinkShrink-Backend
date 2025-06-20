import React, { useState, useEffect } from 'react';
import { Copy, Check, LogOut } from 'lucide-react';
import { api } from '../services/api';
import type { ShortenedUrl } from '../types';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const urls = await api.getUserUrls();
        setShortenedUrls(urls);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
      }
    };
    fetchUrls();
  }, []);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      const response = await api.createShortUrl(originalUrl);
      setShortenedUrls([response, ...shortenedUrls]);
      setOriginalUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortCode: string, index: number) => {
    const shortUrl = `http://localhost:3000/url/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">LinkShrink</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shorten Your URL</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your long URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/very-long-url"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </button>
            </div>
          </div>

          {shortenedUrls.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Shortened URLs</h3>

              <div className="space-y-4">
                {shortenedUrls.map((url, index) => (
                  <div key={url._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 mb-1">Original URL:</p>
                        <p className="text-gray-900 break-all mb-3">{url.originalUrl}</p>

                        <p className="text-sm text-gray-600 mb-1">Short URL:</p>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-3 py-1 rounded text-indigo-600 font-mono text-sm">
                            {`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/url/${url.shortCode}`}
                          </code>
                          <button
                            onClick={() => copyToClipboard(url.shortCode, index)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === index ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {new Date(url.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;