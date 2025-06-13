import React, { useState, useMemo } from 'react';
import { healthArticlesData } from '@/data/healthArticles'; 
import AdPlaceholder from '@/components/AdPlaceholder';
import { useTranslation } from '@/hooks/useTranslation';
import ShareIcon from '@/assets/icons/ShareIcon'; // New icon

const HealthLibraryMode = ({ onBack }) => {
  const { t_noDynamic } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedArticleId, setExpandedArticleId] = useState(null);

  const articles = useMemo(() => {
    return healthArticlesData.map(article => ({
      ...article,
      title: t_noDynamic(article.id + '_title') || article.title, 
      category: t_noDynamic(article.id + '_category') || article.category,
      summary: t_noDynamic(article.id + '_summary') || article.summary,
      content: t_noDynamic(article.id + '_content') || article.content, 
      keywords: article.keywords.map(k => t_noDynamic(article.id + '_keyword_' + k.replace(/\s+/g, '_')) || k) 
    }));
  }, [healthArticlesData, t_noDynamic]);


  const categories = useMemo(() => {
    const allCategories = articles.map(article => article.category);
    return [t_noDynamic('healthLibAllCategories'), ...Array.from(new Set(allCategories))];
  }, [articles, t_noDynamic]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === t_noDynamic('healthLibAllCategories') || !selectedCategory || article.category === selectedCategory;
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = article.title.toLowerCase().includes(lowerSearchTerm) ||
                            article.summary.toLowerCase().includes(lowerSearchTerm) ||
                            (article.content && article.content.toLowerCase().includes(lowerSearchTerm)) || 
                            article.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm));
      return matchesCategory && matchesSearch;
    });
  }, [articles, searchTerm, selectedCategory, t_noDynamic]);

  const toggleArticleExpand = (id) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  const handleShareArticle = (articleTitle, articleUrl) => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const textToShare = t_noDynamic('shareArticleTextToFriendDefault') + ` "${articleTitle}".\n\n${articleUrl}`;
      const shareParameters = `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(textToShare)}`;
      window.Telegram.WebApp.openTelegramLink(shareParameters);
    } else {
      alert(t_noDynamic('shareFunctionNotAvailable'));
    }
  };
  
  return (
    <>
      <div className="max-w-5xl mx-auto p-4 md:p-8 shadow-2xl rounded-lg bg-gradient-to-br from-indigo-50/70 via-pink-50/60 to-yellow-50/70 backdrop-blur-md text-slate-800">
        <h2 className="text-3xl font-bold text-center mb-2 uppercase text-slate-800">{t_noDynamic('healthLibTitle')}</h2>
        <p className="text-center mb-6 -mt-0 text-sm uppercase text-slate-500">{t_noDynamic('healthLibSubtitle')}</p>
        
        <AdPlaceholder 
            adType="banner_728x90" 
            className="w-full mb-6"
            titleText={t_noDynamic('adPlaceholderArticleListTop')}
        />

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={t_noDynamic('healthLibSearchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
            aria-label={t_noDynamic('healthLibSearchAriaLabel')}
          />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value === t_noDynamic('healthLibAllCategories') ? null : e.target.value)}
            className="p-3 border rounded-lg outline-none md:min-w-[200px] border-slate-300/80 bg-white/90 text-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            aria-label={t_noDynamic('healthLibCategorySelectAriaLabel')}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {filteredArticles.length === 0 && (
          <p className="text-center text-lg py-10 uppercase text-slate-500">
            {searchTerm || (selectedCategory && selectedCategory !== t_noDynamic('healthLibAllCategories')) 
              ? t_noDynamic('healthLibNoResultsFound')
              : t_noDynamic('healthLibNoArticlesYet')}
          </p>
        )}

        <div className="space-y-6">
          {filteredArticles.map(article => (
            <div key={article.id} className="rounded-lg shadow-lg overflow-hidden transition-all duration-300 bg-sky-50/70 backdrop-blur-xs border border-sky-200/80 hover:shadow-sky-200/60">
              <div className="p-6 cursor-pointer" onClick={() => toggleArticleExpand(article.id)} role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') toggleArticleExpand(article.id)}}>
                <h3 className="text-xl font-semibold mb-2 text-sky-700">{article.title}</h3>
                <p className="text-sm mb-1 text-slate-500">{t_noDynamic('healthLibCategoryLabel')}: {article.category}</p>
                <p className="text-sm mb-3 leading-relaxed text-slate-600">{article.summary}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-400">{t_noDynamic('healthLibLastUpdatedLabel')}: {article.lastUpdated}</p>
                  <button 
                      className="text-sm font-medium uppercase text-sky-600 hover:text-sky-700"
                      aria-expanded={expandedArticleId === article.id}
                      aria-controls={`article-content-${article.id}`}
                    >
                    {expandedArticleId === article.id ? t_noDynamic('healthLibCollapseButton') : t_noDynamic('healthLibExpandButton')} 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                        className={`w-4 h-4 inline-block ml-1 transition-transform duration-200 ${expandedArticleId === article.id ? 'rotate-180' : 'rotate-0'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
              </div>
              {expandedArticleId === article.id && (
                <div id={`article-content-${article.id}`} className="px-6 pb-6 pt-2 border-t border-sky-200/80">
                  <div 
                      className="prose prose-sm max-w-none article-content prose-slate text-slate-700" 
                      dangerouslySetInnerHTML={{ __html: article.content }} 
                  />
                  <p className="text-xs mt-4 text-slate-400">{t_noDynamic('healthLibKeywordsLabel')}: {article.keywords.join(', ')}</p>
                  <button
                    onClick={() => handleShareArticle(article.title, window.location.href + `#article-${article.id}` )} 
                    className="mt-4 flex items-center space-x-1.5 py-1.5 px-3 text-xs rounded-md bg-teal-500 hover:bg-teal-600 text-white transition-colors"
                    aria-label={t_noDynamic('shareArticleButtonAriaLabel')}
                  >
                    <ShareIcon className="w-3 h-3" />
                    <span>{t_noDynamic('shareArticleButton')}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-xs mt-8 text-center uppercase text-slate-500">
            {t_noDynamic('healthLibDisclaimer')}
          </p>
      </div>
      <button
        onClick={onBack}
        className="flex items-center justify-center mx-auto space-x-2 text-base py-3 px-5 rounded-lg transition-colors uppercase text-sky-600 hover:text-sky-700 hover:bg-sky-100/70 backdrop-blur-sm mt-8 border border-sky-500 hover:border-sky-600 w-full max-w-xs"
        aria-label={t_noDynamic('backToMainMenuButton')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>{t_noDynamic('mainMenuButton')}</span>
      </button>
    </>
  );
};

export default HealthLibraryMode;