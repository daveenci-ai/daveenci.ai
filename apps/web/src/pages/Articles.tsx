import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CCVNavbar from '@/components/CCV/CCVNavbar';
import CCVFooter from '@/components/CCV/CCVFooter';

interface Article {
  id: number;
  title: string;
  description: string;
  article: string;
  url: string;
  topic: string | null;
  author: string;
  date_published: string | null;
  featured: boolean;
  status: string;
  read_time: string | null;
  image_url: string | null;
  image_alt: string | null;
}

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch articles from database
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchArticles = async () => {
      const apiUrl = import.meta.env.API_URL;
      
      if (!apiUrl) {
        setError('Backend API not configured');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/articles`, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data: Article[] = await response.json();
        
        // Filter to only show published articles
        const publishedArticles = data.filter(article => article.status === 'published');
        
        setArticles(publishedArticles);
        setFilteredArticles(publishedArticles);
        
        // Extract unique categories from articles
        const uniqueCategories = ['All', ...new Set(publishedArticles.map(a => a.topic).filter(Boolean))];
        setCategories(uniqueCategories as string[]);
        
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Articles fetch aborted');
          return;
        }
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
        setLoading(false);
      }
    };

    fetchArticles();
    
    // Cleanup: abort fetch if component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  // Filter articles based on search term and category
  const handleFilter = () => {
    let filtered = articles;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.topic === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.topic && article.topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredArticles(filtered);
  };

  // Update filtered articles when search term or category changes
  React.useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedCategory]);

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-white">
      <CCVNavbar />
      
      {/* Header Section - Crowley Capital Style */}
      <div className="relative bg-gradient-to-br from-black via-slate-900 to-slate-800 pt-32 pb-24 px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight">
              Insights & Resources
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light leading-relaxed">
              Strategic insights for startup founders navigating product, capital, and growth.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-6 py-4 text-lg bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-white/40 rounded-xl text-white placeholder:text-slate-400 transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-slate-400 mb-4" />
              <p className="text-slate-600 text-lg">Loading articles...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <p className="text-red-900 text-lg mb-4">{error}</p>
              <p className="text-red-700 text-sm">Please check your backend API configuration.</p>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-6 py-3 text-base font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-black text-white hover:bg-slate-800 shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <section className="mb-20">
              <h2 className="text-4xl font-light text-slate-900 mb-10">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredArticles.map((article) => (
                  <Link 
                    key={article.id} 
                    to={`/articles/${article.url}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-200"
                  >
                    {/* Hero Image */}
                    {article.image_url && (
                      <div className="relative h-64 overflow-hidden bg-slate-900">
                        <img 
                          src={article.image_url} 
                          alt={article.image_alt || article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        {article.topic && (
                          <Badge className="bg-black text-white hover:bg-slate-800 rounded-lg px-3 py-1">
                            {article.topic}
                          </Badge>
                        )}
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg px-3 py-1">
                          Featured
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">By {article.author}</span>
                          {article.date_published && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(article.date_published).toLocaleDateString()}
                            </div>
                          )}
                          {article.read_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {article.read_time}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-black font-medium">
                        Read article <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Regular Articles */}
          <section>
            <h2 className="text-4xl font-light text-slate-900 mb-10">
              {featuredArticles.length > 0 ? "All Articles" : "Articles"}
            </h2>
            
            {regularArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.map((article) => (
                  <Link 
                    key={article.id} 
                    to={`/articles/${article.url}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200"
                  >
                    {/* Hero Image */}
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden bg-slate-900">
                        <img 
                          src={article.image_url} 
                          alt={article.image_alt || article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {article.topic && (
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg px-3 py-1 text-xs">
                            {article.topic}
                          </Badge>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3 text-sm">
                        {article.description}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 mb-3 gap-3">
                        <span className="font-medium">By {article.author}</span>
                        {article.date_published && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.date_published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                        {article.read_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.read_time}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-black font-medium text-sm group-hover:gap-3 transition-all">
                        Read article <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                <p className="text-slate-500 text-xl mb-6">No articles found matching your criteria.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="bg-black text-white hover:bg-slate-800 px-8 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </section>
            </>
          )}
        </div>
      </div>

      <CCVFooter />
    </div>
  );
};

export default Articles;
