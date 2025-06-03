import React, { useState, useEffect, useRef } from 'react';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress indicator
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Custom hook for animated counter
  const useCounter = (end, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const counterRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            let startTime = null;
            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(easeOutQuart * (end - start) + start));
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        },
        { threshold: 0.1 }
      );

      if (counterRef.current) observer.observe(counterRef.current);
      return () => observer.disconnect();
    }, [end, duration, start]);

    return [count, counterRef];
  };

  const [resumeCount, resumeRef] = useCounter(50000);
  const [atsCount, atsRef] = useCounter(25000);
  const [templateCount, templateRef] = useCounter(150);
  const [successRate, successRef] = useCounter(98);

  // Intersection Observer for section animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = ['stats-section', 'features-section', 'how-it-works', 'testimonials-section', 'logos-section'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Testimonial Carousel
  useEffect(() => {
    const slider = new Glide('.glide-testimonial', {
      type: 'carousel',
      focusAt: 1,
      animationDuration: 1000,
      autoplay: 3000,
      rewind: true,
      perView: 3,
      gap: 16,
      classes: { nav: { active: '[&>*]:bg-purple-500' } },
      breakpoints: {
        1024: { perView: 2, gap: 12 },
        640: { perView: 1, gap: 8 },
      },
    }).mount();

    return () => slider.destroy();
  }, []);

  // Logo Carousel
  useEffect(() => {
    const slider = new Glide('.glide-logo', {
      type: 'carousel',
      autoplay: 2000,
      animationDuration: 1000,
      animationTimingFunc: 'linear',
      perView: 4,
      gap: 10,
      classes: { nav: { active: '[&>*]:bg-purple-500' } },
      breakpoints: {
        1024: { perView: 3, gap: 12 },
        640: { perView: 2, gap: 8 },
      },
    }).mount();

    return () => slider.destroy();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'HR Manager, TechCorp',
      image: 'https://i.pravatar.cc/40?img=11',
      text: 'ResumeAI simplified our hiring process, allowing us to find top talent quickly and efficiently.',
      rating: 4,
    },
    {
      name: 'Arjun Patel',
      position: 'Software Engineer, Grad',
      image: 'https://i.pravatar.cc/40?img=25',
      text: 'Applying to jobs through ResumeAI was a breeze, and I landed my dream role in no time!',
      rating: 4,
    },
    {
      name: 'Priya Sharma',
      position: 'Placement Officer',
      image: 'https://i.pravatar.cc/40?img=7',
      text: 'The automated verification feature in ResumeAI saved us countless hours during recruitment.',
      rating: 4,
    },
    {
      name: 'Michael Chen',
      position: 'Marketing Manager',
      image: 'https://i.pravatar.cc/40?img=15',
      text: 'The AI suggestions transformed my resume, tripling my interview calls!',
      rating: 5,
    },
  ];

  const features = [
    { icon: 'ri-file-text-line', title: 'Multiple Templates', description: 'Choose from 150+ vibrant, recruiter-friendly templates.' },
    { icon: 'ri-bar-chart-line', title: 'ATS Score Analysis', description: 'Detailed insights to boost your resume’s ATS ranking.' },
    { icon: 'ri-robot-line', title: 'AI Suggestions', description: 'Smart recommendations to enhance content and layout.' },
    { icon: 'ri-search-line', title: 'Skill Gap Detection', description: 'Spot missing skills and keywords employers seek.' },
    { icon: 'ri-download-line', title: 'Export to PDF & DOCX', description: 'Download in multiple formats with flawless formatting.' },
    { icon: 'ri-shield-check-line', title: 'Privacy Protected', description: 'Encrypted data, never shared with third parties.' },
    { icon: 'ri-article-line', title: 'Cover Letter Builder', description: 'Craft matching cover letters effortlessly.' },
    { icon: 'ri-linkedin-box-line', title: 'LinkedIn Optimization', description: 'Align your LinkedIn profile with your resume.' },
    { icon: 'ri-question-answer-line', title: 'Interview Prep', description: 'Practice with tailored interview questions.' },
  ];

  const steps = [
    { step: '01', title: 'Choose Template', description: 'Select from ATS-optimized templates designed by experts.', icon: 'ri-layout-grid-line' },
    { step: '02', title: 'Add Your Info', description: 'Input details with AI-driven optimization tips.', icon: 'ri-edit-line' },
    { step: '03', title: 'Download & Apply', description: 'Check ATS score, tweak, and download.', icon: 'ri-download-line' },
  ];

  const logos = [
    { src: 'https://logo.clearbit.com/mastercard.com', alt: 'Mastercard', name: 'Mastercard' },
    { src: 'https://logo.clearbit.com/reliance.com', alt: 'Reliance', name: 'Reliance' },
    { src: 'https://logo.clearbit.com/torrentpower.com', alt: 'Torrent Power', name: 'Torrent Power' },
    { src: 'https://logo.clearbit.com/hul.co.in', alt: 'Hindustan Unilever', name: 'Hindustan Unilever' },
    { src: 'https://logo.clearbit.com/adobe.com', alt: 'Adobe', name: 'Adobe' },
    { src: 'https://logo.clearbit.com/infosys.com', alt: 'Infosys', name: 'Infosys' },
  ];

  return (
    <>
      <style>
        {`
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          .animate-float { animation: float 3.5s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; }
          .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
          ::-webkit-scrollbar { width: 10px; }
          ::-webkit-scrollbar-track { background: #f3f4f6; }
          ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 5px; }
          ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
          html { transition: background-color 0.4s, color 0.4s; }
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
          @media (max-width: 640px) {
            .hero h1 { font-size: 2.25rem; line-height: 1.3; }
            .text-5xl { font-size: 2rem; }
            .text-4xl { font-size: 1.75rem; }
            .text-3xl { font-size: 1.5rem; }
            .text-xl { font-size: 1rem; }
            .text-lg { font-size: 0.875rem; }
          }
          @media (max-width: 768px) {
            .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          }
        `}
      </style>
      <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet" />
      <div className={`min-h-screen transition-colors duration-400 ${darkMode ? 'dark bg-gray-900' : 'bg-white'} font-sans`}>
        {/* Scroll Progress Indicator */}
        <div className="fixed top-0 left-0 h-1 bg-purple-500 z-50" style={{ width: `${scrollProgress}%`, transition: 'width 0.3s ease' }}></div>

        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-xl sticky top-0 z-40 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 transition-colors duration-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="#" className="flex items-center text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                  <i className="ri-file-text-line text-3xl mr-2"></i>
                  ResumeAI
                </a>
              </div>
              <div className="hidden lg:flex items-center space-x-6">
                <a onClick={() => scrollTo('features-section')} className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer font-medium">Features</a>
                <a onClick={() => scrollTo('how-it-works')} className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer font-medium">How It Works</a>
                <a onClick={() => scrollTo('testimonials-section')} className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer font-medium">Reviews</a>
                <a onClick={() => scrollTo('logos-section')} className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer font-medium">Partners</a>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  <i className={`ri-${darkMode ? 'sun' : 'moon'}-line text-2xl text-gray-700 dark:text-gray-200`}></i>
                </button>
                <a href="#" className="hidden sm:inline-flex px-5 py-2 text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 font-medium">Sign In</a>
                <a href="#" onClick={() => scrollTo('cta-section')} className="px-5 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium">Get Started</a>
                <button
                  className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <i className="ri-menu-line text-2xl text-gray-700 dark:text-gray-200"></i>
                </button>
              </div>
            </div>
            <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white dark:bg-gray-800 shadow-xl`}>
              <div className="px-3 pt-3 pb-4 space-y-2">
                <a onClick={() => scrollTo('features-section')} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 font-medium">Features</a>
                <a onClick={() => scrollTo('how-it-works')} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 font-medium">How It Works</a>
                <a onClick={() => scrollTo('testimonials-section')} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 font-medium">Reviews</a>
                <a onClick={() => scrollTo('logos-section')} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 font-medium">Partners</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/5 left-1/5 w-80 h-80 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
            <div className="absolute top-3/5 right-1/5 w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/5 left-1/3 w-88 h-88 bg-teal-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-2000"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row-reverse items-center relative z-10">
            <div className="lg:w-1/2 flex justify-center mb-12 lg:mb-0">
              <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Resume Preview"
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            </div>
            <div className="lg:w-1/2 text-center lg:text-left space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Craft Your
                <span className="text-purple-500"> Dream</span>
                <br />
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Resume
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-md mx-auto lg:mx-0">
                Build ATS-optimized resumes with AI-driven insights and vibrant templates that grab attention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollTo('cta-section')}
                  className="px-8 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all duration-300 flex items-center justify-center group shadow-lg"
                >
                  <i className="ri-file-add-line text-xl mr-2 group-hover:animate-bounce"></i>
                  Build Resume
                </button>
                <button
                  className="px-8 py-3 border border-purple-500 text-purple-500 dark:text-purple-400 dark:border-purple-400 rounded-xl hover:bg-purple-500 hover:text-white dark:hover:bg-purple-400 transition-all duration-300 flex items-center justify-center group shadow-lg"
                >
                  <i className="ri-bar-chart-line text-xl mr-2 group-hover:animate-pulse"></i>
                  Check ATS Score
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i + 10}`}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Join {resumeCount.toLocaleString()}+ job seekers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats-section" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center" ref={resumeRef}>
                <div className={`bg-purple-50 dark:bg-gray-700 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:scale-105 ${isVisible['stats-section'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
                  <i className="ri-file-text-line text-5xl text-purple-500 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Resumes Created</h3>
                  <p className="text-4xl font-bold text-purple-500">{resumeCount.toLocaleString()}+</p>
                </div>
              </div>
              <div className="text-center" ref={atsRef}>
                <div className={`bg-blue-50 dark:bg-gray-700 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:scale-105 ${isVisible['stats-section'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
                  <i className="ri-bar-chart-line text-5xl text-blue-500 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">ATS Scores Checked</h3>
                  <p className="text-4xl font-bold text-blue-500">{atsCount.toLocaleString()}+</p>
                </div>
              </div>
              <div className="text-center" ref={templateRef}>
                <div className={`bg-teal-50 dark:bg-gray-700 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:scale-105 ${isVisible['stats-section'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
                  <i className="ri-layout-grid-line text-5xl text-teal-500 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Templates Available</h3>
                  <p className="text-4xl font-bold text-teal-500">{templateCount}+</p>
                </div>
              </div>
              <div className="text-center" ref={successRef}>
                <div className={`bg-green-50 dark:bg-gray-700 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:scale-105 ${isVisible['stats-section'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
                  <i className="ri-checkbox-circle-line text-5xl text-green-500 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Success Rate</h3>
                  <p className="text-4xl font-bold text-green-500">{successRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                Features That
                <span className="text-purple-500"> Shine</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 mt-4 max-w-2xl mx-auto">
                Tools to craft a resume that stands out and beats ATS systems.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:scale-105 ${isVisible['features-section'] ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                    <i className={`${feature.icon} text-3xl text-purple-500`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                How It <span className="text-blue-500">Works</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 mt-4">
                Create your perfect resume in three easy steps.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative ${isVisible['how-it-works'] ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-blue-50 dark:bg-gray-700 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                      {step.step}
                    </div>
                    <i className={`${step.icon} text-5xl text-blue-500 mb-4`}></i>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <i className="ri-arrow-right-line text-4xl text-blue-500 animate-pulse"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials-section" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                What Our <span className="text-purple-500">Users Say</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 mt-4">
                Hear from job seekers who transformed their careers.
              </p>
            </div>
            <div className="glide-testimonial relative w-full overflow-hidden">
              <div data-glide-el="track">
                <ul className="whitespace-nowrap flex-nowrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0 pb-12">
                  {testimonials.map((testimonial, i) => (
                    <li key={i}>
                      <div className="h-full w-full">
                        <div className="h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg shadow-purple-200 dark:shadow-purple-900">
                          <div className="relative p-6">
                            <figure className="relative z-10">
                              <blockquote className="p-6 text-lg leading-relaxed">
                                <p>{testimonial.text}</p>
                              </blockquote>
                              <figcaption className="flex flex-col items-start gap-2 p-6 pt-0 text-sm text-purple-600 dark:text-purple-400">
                                <span className="flex gap-1 text-amber-500" role="img" aria-label={`rating: ${testimonial.rating} out of 5 stars`}>
                                  {[...Array(testimonial.rating)].map((_, j) => (
                                    <span key={j} aria-hidden="true">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.125 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ))}
                                  {[...Array(5 - testimonial.rating)].map((_, j) => (
                                    <span key={j + testimonial.rating} aria-hidden="true">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                      </svg>
                                    </span>
                                  ))}
                                </span>
                                <div className="flex items-center gap-4 pt-4 text-sm text-purple-600 dark:text-purple-400">
                                  <img src={testimonial.image} alt={testimonial.name} width="48" height="48" className="max-w-full shrink-0 rounded-full" />
                                  <div className="flex flex-col gap-1">
                                    <span className="font-bold uppercase">{testimonial.name}</span>
                                    <cite className="not-italic">
                                      <a href="#" className="hover:text-purple-800 dark:hover:text-purple-300">{testimonial.position}</a>
                                    </cite>
                                  </div>
                                </div>
                              </figcaption>
                            </figure>
                            <svg aria-hidden="true" className="absolute left-6 top-6 z-0 h-16" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.79187 3.83333C2.66179 3.83333 2.53696 3.85316 2.41271 3.87125C2.45296 3.73591 2.49437 3.59825 2.56087 3.47458C2.62737 3.29491 2.73121 3.13916 2.83446 2.98225C2.92079 2.8125 3.07304 2.69758 3.18504 2.55233C3.30229 2.41116 3.46212 2.31725 3.58871 2.2C3.71296 2.0775 3.87571 2.01625 4.00521 1.92991C4.14054 1.85233 4.25837 1.76658 4.38437 1.72575L4.69879 1.59625L4.97529 1.48133L4.69237 0.35083L4.34412 0.43483C4.23271 0.46283 4.09679 0.495496 3.94221 0.53458C3.78412 0.563746 3.61554 0.643663 3.42771 0.71658C3.24221 0.799413 3.02754 0.855413 2.82804 0.988413C2.62737 1.11558 2.39579 1.22175 2.19162 1.39208C1.99387 1.56766 1.75529 1.71991 1.57912 1.94333C1.38662 2.15216 1.19646 2.3715 1.04887 2.62116C0.877957 2.85916 0.761873 3.1205 0.639373 3.37891C0.52854 3.63733 0.43929 3.90158 0.366373 4.15825C0.228123 4.67275 0.16629 5.16158 0.142373 5.57983C0.12254 5.99866 0.134207 6.34691 0.158707 6.59891C0.167457 6.71791 0.18379 6.83341 0.195457 6.91333L0.21004 7.01133L0.225207 7.00783C0.328959 7.49248 0.567801 7.93786 0.914102 8.29243C1.2604 8.64701 1.70001 8.89631 2.18208 9.01148C2.66415 9.12665 3.16897 9.10299 3.63815 8.94323C4.10733 8.78348 4.52169 8.49416 4.83331 8.10874C5.14493 7.72333 5.34107 7.25757 5.39903 6.76534C5.457 6.27311 5.37443 5.77452 5.16087 5.32726C4.94731 4.88 4.61149 4.50233 4.19225 4.23796C3.77302 3.97358 3.28751 3.8333 2.79187 3.83333V3.83333ZM9.20854 3.83333C9.07846 3.83333 8.95362 3.85316 8.82937 3.87125C8.86962 3.73591 8.91104 3.59825 8.97754 3.47458C9.04404 3.29491 9.14787 3.13916 9.25112 2.98225C9.33746 2.8125 9.48971 2.69758 9.60171 2.55233C9.71896 2.41116 9.87879 2.31725 10.0054 2.2C10.1296 2.0775 10.2924 2.01625 10.4219 1.92991C10.5572 1.85233 10.675 1.76658 10.801 1.72575L11.1155 1.59625L11.392 1.48133L11.109 0.35083L10.7608 0.43483C10.6494 0.46283 10.5135 0.495496 10.3589 0.53458C10.2008 0.563746 10.0322 0.643663 9.84437 0.71658C9.65946 0.799997 9.44421 0.855413 9.24471 0.988997C9.04404 1.11616 8.81246 1.22233 8.60829 1.39266C8.41054 1.56825 8.17196 1.7205 7.99579 1.94333C7.80329 2.15216 7.61312 2.3715 7.46554 2.62116C7.29462 2.85916 7.17854 3.1205 7.05604 3.37891C6.94521 3.63733 6.85596 3.90158 6.78304 4.15825C6.64479 4.67275 6.58296 5.16158 6.55904 5.57983C6.53921 5.99866 6.55087 6.34691 6.57537 6.59891C6.58412 6.71791 6.60046 6.83341 6.61212 6.91333L6.62671 7.01133L6.64187 7.00783C6.74563 7.49248 6.98447 7.93786 7.33077 8.29243C7.67707 8.64701 8.11668 8.89631 8.59875 9.01148C9.08081 9.12665 9.58563 9.10299 10.0548 8.94323C10.524 8.78348 10.9384 8.49416 11.25 8.10874C11.5616 7.72333 11.7577 7.25757 11.8157 6.76534C11.8737 6.27311 11.7911 5.77452 11.5775 5.32726C11.364 4.88 11.0282 4.50233 10.6089 4.23796C10.1897 3.97358 9.70417 3.8333 9.20854 3.83333V3.83333Z" className="fill-purple-100 dark:fill-purple-900" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="-mt-6 flex w-full items-center justify-center gap-2" data-glide-el="controls[nav]">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className="group p-4"
                    data-glide-dir={`=${i}`}
                    aria-label={`goto slide ${i + 1}`}
                  >
                    <span className="block h-2 w-2 rounded-full bg-white/20 dark:bg-gray-700 opacity-70 ring-1 ring-purple-500 transition-colors duration-300 focus:outline-none"></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Logo Carousel Section */}
        <section id="logos-section" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                Trusted by <span className="text-blue-500">Industry Leaders</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 mt-4">
                Companies that rely on ResumeAI for talent acquisition.
              </p>
            </div>
            <div className="glide-logo relative w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <div data-glide-el="track">
                <ul className="whitespace-nowrap flex-nowrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
                  {logos.map((logo, i) => (
                    logo.src ? (
                      <li key={i} className="flex flex-col items-center justify-center px-4">
                        <img
                          src={logo.src}
                          alt={logo.alt || logo.name}
                          className="m-auto h-20 max-h-full w-auto max-w-full rounded-full shadow-md"
                        />
                        <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">{logo.name}</p>
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-purple-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Stay Ahead with Resume Tips</h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Subscribe for the latest resume trends, ATS tips, and career advice.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-5 py-3 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-md"
                disabled={subscribed}
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            <p className="text-sm mt-4 opacity-80">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section id="cta-section" className="py-20 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">Ready to Land Your Dream Job?</h2>
            <p className="text-lg sm:text-xl mb-8">
              Join thousands of professionals thriving with our AI-powered resume builder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollTo('cta-section')}
                className="px-8 py-3 bg-white text-purple-500 rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <i className="ri-rocket-line text-xl mr-2"></i>
                Start Building Now
              </button>
              <button
                className="px-8 py-3 border border-white text-white rounded-xl hover:bg-white hover:text-purple-500 transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <i className="ri-play-circle-line text-xl mr-2"></i>
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                Frequently Asked <span className="text-purple-500">Questions</span>
              </h2>
              <div className="space-y-4 mt-6">
                {[
                  {
                    question: 'What is an ATS and why does it matter?',
                    answer: 'An ATS (Applicant Tracking System) filters resumes for recruiters. Over 90% of top companies use it. Our tool optimizes your resume to pass with ease.'
                  },
                  {
                    question: 'How does the AI Resume Builder work?',
                    answer: 'Our AI analyzes your content, suggests ATS-friendly tweaks, identifies skill gaps, and provides real-time feedback to make your resume shine.'
                  },
                  {
                    question: 'Is it free to use?',
                    answer: 'Yes! Download your resume in PDF with basic templates for free. Unlock premium templates and features with an upgrade.'
                  },
                  {
                    question: 'Is my data secure with ResumeAI?',
                    answer: 'We use AES-256 encryption and never share your data. Delete your account and data anytime.'
                  },
                  {
                    question: 'Can I get help with my resume?',
                    answer: 'Access our expert guides and examples for free. Premium users get 1-on-1 consultations.'
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-purple-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <input 
                      type="radio" 
                      name="faq-accordion" 
                      id={`accordion-${index}`} 
                      className="hidden" 
                    />
                    <label
                      htmlFor={`accordion-${index}`}
                      className="flex justify-between items-center p-4 cursor-pointer text-lg sm:text-xl font-medium text-gray-900 dark:text-white"
                    >
                      {faq.question}
                      <i className="ri-arrow-down-s-line text-xl"></i>
                    </label>
                    <div className="hidden p-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="sm:col-span-2">
                <div className="flex items-center sm:items-start justify-center sm:justify-between mb-4">
                  <i className="ri-file-text-line text-4xl text-purple-400 mr-3"></i>
                  <span className="text-2xl font-extrabold">ResumeAI</span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base text-center sm:text-left">
                  Create ATS-optimized resumes with AI-powered tools trusted by professionals globally.
                </p>
              </div>
            <div>
  <h3 className="text-lg font-semibold text-purple-400 mb-3">Product</h3>
  <div className="space-y-2">
    <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">Resume Builder</a>
    <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">Cover Letters</a>
    <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">Templates</a>
    <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">ATS Checker</a>
  </div>
</div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Company</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">About</a>
                  <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">Careers</a>
                  <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">Contact</a>
                  <a href="#" className="block text-sm text-gray-300 hover:text-purple-400">Press</a>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm">
              <div className="flex space-x-4 mb-4 sm:mb-0">
                <a href="#" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <i className="ri-facebook-fill text-xl text-gray-300"></i>
                </a>
                <a href="#" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <i className="ri-twitter-x-fill text-xl text-gray-300"></i>
                </a>
                <a href="#" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <i className="ri-linkedin-fill text-xl text-gray-300"></i>
                </a>
                <a href="#" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <i className="ri-instagram-line text-xl text-gray-300"></i>
                </a>
              </div>
              <div className="text-gray-500">
                <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
              </div>
              <div className="flex space-x-4 mt-3 sm:mt-0">
                <a href="#" className="text-sm text-gray-300 hover:text-purple-400">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-300 hover:text-purple-400">Terms of Service</a>
                <a href="#" className="text-sm text-gray-300 hover:text-purple-400">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;