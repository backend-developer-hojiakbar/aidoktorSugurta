import React, { useState, useMemo } from 'react';
import { healthArticlesData } from '@/data/healthArticles';
import AdPlaceholder from '@/components/AdPlaceholder';
import { useTranslation } from '@/hooks/useTranslation';
import ShareIcon from '@/assets/icons/ShareIcon'; // New icon

const PhysiotherapyMode = ({ onBack }) => {
  const { t_noDynamic } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [expandedArticleId, setExpandedArticleId] = useState(null);

  const physiotherapyArticles = useMemo(() => {
    return healthArticlesData
        .filter(article => (t_noDynamic(article.id + '_category') || article.category) === t_noDynamic('physiotherapyCategoryName'))
        .map(article => ({
            ...article,
            title: t_noDynamic(article.id + '_title') || article.title,
            category: t_noDynamic(article.id + '_category') || article.category,
            summary: t_noDynamic(article.id + '_summary') || article.summary,
            content: t_noDynamic(article.id + '_content') || article.content,
            keywords: article.keywords.map(k => t_noDynamic(article.id + '_keyword_' + k.replace(/\s+/g, '_')) || k)
        }));
  }, [healthArticlesData, t_noDynamic]);

  const problemTypes = useMemo(() => {
    const allProblemIndications = physiotherapyArticles.map(article => {
      const titleMainPart = article.title.split(':')[0].split('(')[0].trim();
      const keywordsRelated = article.keywords.filter(k =>
        k.toLowerCase().includes(t_noDynamic('physioKeywordPainSuffixLC')) ||
        k.toLowerCase().includes(t_noDynamic('physioKeywordSyndromeSuffixLC')) ||
        k.toLowerCase().includes(t_noDynamic('physioKeywordFasciitisSuffixLC')) ||
        k.toLowerCase().includes(t_noDynamic('physioKeywordHerniaSuffixLC')) ||
        k.toLowerCase().includes(t_noDynamic('physioKeywordArthritisSuffixLC')) ||
        k.toLowerCase().includes(t_noDynamic('physioKeywordScoliosisSuffixLC')) ||
        k.toLowerCase().includes(t_noDynamic('physioKeywordStrokeSuffixLC')) ||
        k.toLowerCase().includes(t_noDynamic('physioKeywordEpicondylitisSuffixLC'))
      );
      return [titleMainPart, ...keywordsRelated].find(p => p) || t_noDynamic('physioOtherProblem');
    });
    const uniqueProblems = Array.from(new Set(allProblemIndications.map(p => p.charAt(0).toUpperCase() + p.slice(1))));
    return [t_noDynamic('physioAllConditions'), ...uniqueProblems.sort()];
  }, [physiotherapyArticles, t_noDynamic]);


  const filteredArticles = useMemo(() => {
    return physiotherapyArticles.filter(article => {
      const lowerSelectedProblem = selectedProblem?.toLowerCase();
      const matchesProblem = selectedProblem === t_noDynamic('physioAllConditions') || !selectedProblem ||
                             article.title.toLowerCase().includes(lowerSelectedProblem || '') ||
                             article.keywords.some(keyword => keyword.toLowerCase().includes(lowerSelectedProblem || ''));
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
                            article.title.toLowerCase().includes(lowerSearchTerm) ||
                            article.summary.toLowerCase().includes(lowerSearchTerm) ||
                            (article.content && article.content.toLowerCase().includes(lowerSearchTerm)) ||
                            article.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm));
      return matchesProblem && matchesSearch;
    });
  }, [physiotherapyArticles, searchTerm, selectedProblem, t_noDynamic]);

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
      <div className="max-w-5xl mx-auto p-4 md:p-8 shadow-2xl rounded-lg bg-gradient-to-br from-pink-50/70 via-rose-50/60 to-fuchsia-50/70 backdrop-blur-md text-slate-800">
        <h2 className="text-3xl font-bold text-center mb-2 uppercase text-slate-800">{t_noDynamic('physioTitle')}</h2>
        <p className="text-center mb-6 -mt-0 text-sm uppercase text-slate-500">{t_noDynamic('physioSubtitle')}</p>

        <AdPlaceholder
            adType="banner_728x90"
            className="w-full mb-6"
            titleText={t_noDynamic('adPlaceholderPhysioListTop')}
        />

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={t_noDynamic('physioSearchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none border-slate-300/80 bg-white/90 text-slate-800 placeholder-slate-500"
            aria-label={t_noDynamic('physioSearchAriaLabel')}
          />
          <select
            value={selectedProblem || ''}
            onChange={(e) => setSelectedProblem(e.target.value === t_noDynamic('physioAllConditions') ? null : e.target.value)}
            className="p-3 border rounded-lg outline-none md:min-w-[200px] border-slate-300/80 bg-white/90 text-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            aria-label={t_noDynamic('physioProblemSelectAriaLabel')}
          >
            {problemTypes.map(problem => (
              <option key={problem} value={problem}>{problem}</option>
            ))}
          </select>
        </div>

        {filteredArticles.length === 0 && (
          <p className={`text-center text-lg py-10 uppercase ${
            searchTerm || (selectedProblem && selectedProblem !== t_noDynamic('physioAllConditions'))
              ? 'text-slate-500' 
              : 'text-red-500 animate-fadeInOut'
          }`}>
            {searchTerm || (selectedProblem && selectedProblem !== t_noDynamic('physioAllConditions'))
              ? t_noDynamic('physioNoResultsFound')
              : t_noDynamic('physioNoGuidesYet')}
          </p>
        )}

        <div className="space-y-6">
          {filteredArticles.map(article => (
            <div key={article.id} className="rounded-lg shadow-lg overflow-hidden transition-all duration-300 bg-pink-50/70 backdrop-blur-xs border border-pink-200/80 hover:shadow-pink-200/60">
              <div className="p-6 cursor-pointer" onClick={() => toggleArticleExpand(article.id)} role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') toggleArticleExpand(article.id)}} aria-controls={`physio-article-content-${article.id}`}>
                <h3 className="text-xl font-semibold mb-2 text-pink-700">{article.title}</h3>
                <p className="text-sm mb-3 leading-relaxed text-slate-600">{article.summary}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-400">{t_noDynamic('healthLibLastUpdatedLabel')}: {article.lastUpdated}</p>
                  <button
                      className="text-sm font-medium uppercase text-pink-600 hover:text-pink-700"
                      aria-expanded={expandedArticleId === article.id}
                    >
                    {expandedArticleId === article.id ? t_noDynamic('physioCollapseButton') : t_noDynamic('physioExpandButton')}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                        className={`w-4 h-4 inline-block ml-1 transition-transform duration-200 ${expandedArticleId === article.id ? 'rotate-180' : 'rotate-0'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
              </div>
              {expandedArticleId === article.id && (
                <div id={`physio-article-content-${article.id}`} className="px-6 pb-6 pt-2 border-t border-pink-200/80">
                  <div
                      className="prose prose-sm max-w-none article-content prose-slate text-slate-700"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                  <p className="text-xs mt-4 text-slate-400">{t_noDynamic('healthLibKeywordsLabel')}: {article.keywords.join(', ')}</p>
                  <button
                    onClick={() => handleShareArticle(article.title, window.location.href + `#physio-article-${article.id}` )}
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
            {t_noDynamic('physioDisclaimer')}
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

export default PhysiotherapyMode;