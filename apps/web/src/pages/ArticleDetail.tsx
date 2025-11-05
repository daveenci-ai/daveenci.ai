import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';
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
  read_time: string | null;
  featured: boolean;
  image_url: string | null;
  image_alt: string | null;
}

const ArticleDetail = () => {
  const { id: urlSlug } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const apiUrl = import.meta.env.API_URL;
      
      if (!apiUrl) {
        setError('Backend API not configured');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/articles`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data: Article[] = await response.json();
        
        // Find article by URL slug
        const foundArticle = data.find(a => a.url === urlSlug);
        
        if (!foundArticle) {
          setError('Article not found');
          setLoading(false);
          return;
        }

        setArticle(foundArticle);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [urlSlug]);

  // Inject hero image after Quick Answer, before Introduction
  useEffect(() => {
    if (!article?.image_url) return;

    // Wait for DOM to render
    const timer = setTimeout(() => {
      const articleContent = document.querySelector('.article-content');
      if (!articleContent) return;

      // Check if image already exists
      if (document.querySelector('.article-hero-image')) return;

      // Strategy 1: Look for Quick Answer box
      const answerBox = articleContent.querySelector('.answer-box');
      
      if (answerBox) {
        // Insert after Quick Answer
        const imageContainer = document.createElement('div');
        imageContainer.className = 'article-hero-image';
        imageContainer.innerHTML = `
          <img 
            src="${article.image_url}" 
            alt="${article.image_alt || article.title}"
            loading="eager"
          />
        `;
        answerBox.parentNode?.insertBefore(imageContainer, answerBox.nextSibling);
        return;
      }

      // Strategy 2: Look for Introduction heading (fallback if no Quick Answer)
      const headings = articleContent.querySelectorAll('h2');
      let introHeading = null;
      
      for (const heading of headings) {
        if (heading.textContent?.toLowerCase().includes('introduction')) {
          introHeading = heading;
          break;
        }
      }

      if (introHeading) {
        // Insert before Introduction heading
        const imageContainer = document.createElement('div');
        imageContainer.className = 'article-hero-image';
        imageContainer.innerHTML = `
          <img 
            src="${article.image_url}" 
            alt="${article.image_alt || article.title}"
            loading="eager"
          />
        `;
        introHeading.parentNode?.insertBefore(imageContainer, introHeading);
        return;
      }

      // Strategy 3: Insert as first element (ultimate fallback)
      const firstChild = articleContent.firstElementChild;
      if (firstChild) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'article-hero-image';
        imageContainer.innerHTML = `
          <img 
            src="${article.image_url}" 
            alt="${article.image_alt || article.title}"
            loading="eager"
          />
        `;
        articleContent.insertBefore(imageContainer, firstChild);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CCVNavbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-slate-400 mb-4" />
          <p className="text-slate-600 text-lg">Loading article...</p>
        </div>
        <CCVFooter />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <CCVNavbar />
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto my-20">
          <p className="text-red-900 text-lg mb-4">{error || 'Article not found'}</p>
          <Link to="/articles" className="text-brand-600 hover:underline">
            ← Back to Articles
          </Link>
        </div>
        <CCVFooter />
      </div>
    );
  }

// The actual component starts above with the fetched data
  return (
    <div className="min-h-screen bg-white">
      <CCVNavbar />
      
      {/* Article Header - Crowley Capital Style with Hero Image Background */}
      <div className="relative bg-gradient-to-br from-black via-slate-900 to-slate-800 py-20 px-6 lg:px-8 overflow-hidden">
        {/* Hero Image Background */}
        {article.image_url && (
          <>
            <div className="absolute inset-0 z-0">
              <img 
                src={article.image_url} 
                alt={article.image_alt || article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-slate-900/80 to-slate-800/75 z-10" />
          </>
        )}
        
        {/* Background Pattern (fallback when no image) */}
        {!article.image_url && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
        )}
        
        <div className="max-w-5xl mx-auto relative z-20">
          <Link 
            to="/articles" 
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            {article.topic && (
              <Badge className="bg-white text-black hover:bg-slate-100 rounded-lg px-4 py-1.5 text-sm">
                {article.topic}
              </Badge>
            )}
            {article.featured && (
              <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-lg px-4 py-1.5 text-sm">
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-10 font-light leading-relaxed">
            {article.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">By {article.author}</span>
            </div>
            {article.date_published && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(article.date_published).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            )}
            {article.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {article.read_time}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Article Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 mb-12">
            <div 
              dangerouslySetInnerHTML={{ __html: article.article }}
              className="article-content"
            />
          </div>

          {/* Back to Articles Link */}
          <div className="text-center">
            <Link 
              to="/articles"
              className="inline-flex items-center gap-2 text-black hover:text-slate-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </div>

      <CCVFooter />
    </div>
  );
};

export default ArticleDetail;
