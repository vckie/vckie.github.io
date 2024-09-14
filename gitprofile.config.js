// gitprofile.config.js

const config = {
  github: {
    username: 'vckie', // Your GitHub org/user name. (Required)
    sortBy: 'stars', // stars | updated
    limit: 10, // How many projects to display.
    exclude: {
      forks: false, // Forked projects will not be displayed if set to true.
      projects: ['vckie.github.io'], // These projects will not be displayed. example: ['my-project1', 'my-project2']
    },
  },
  social: {
    linkedin: 'vcky',
    twitter: 'vckie_',
    mastodon: '',
    facebook: '',
    instagram: 'vky.pic',
    youtube: '', // example: 'pewdiepie'
    dribbble: '',
    behance: '',
    medium: 'vckie',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    skype: '',
    telegram: '',
    website: 'https://vckie.github.io',
    phone: '',
    email: 'vignsh@pm.me',
  },
  resume: {
    fileUrl:
      'https://rxresu.me/vignsh0104/vigneshwaran-j', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'IBM Qradar',
    'Web Application Pentest',
    'IT Security Operations',
    'Red Teaming',
    'Splunk',
    'Wazuh',
    'VAPT',
    'Incident Response',
    'Log Analysis',
    'Threat Analysis',
    'OWASP Top 10',
    'OSINT',
    'Malware Analysis',
    'Burp Suite',
    'Owasp ZAP',
    'Nessus',
    'Wireshark',
    'Wordpress',
    'Python',
    'Bash',
    'Azure',
    'AWS',
    'Vultr',
    'GCP',
    'Docker',
    'Linux',
    'Illustrator',
    'Photoshop',
    'After Effects',
    'Adobe XD',
    'Figma',
    'Premiere Pro',    
    'Bash',    
  ],
  experiences: [
    {
      company: 'QCS',
      position: 'L1- Threat Intelligence Specialist & Incident Responder',
      from: 'June 2024',
      to: 'Present',
      companyLink: 'https://www.qcs-qatar.com/',
    },
    {
      company: 'Inspira Enterprise',
      position: 'Cybersecurity Analyst',
      from: 'Jan 2022',
      to: 'June 2024',
      companyLink: 'https://inspiraenterprise.com/',
    },
    {
      company: 'Easycybersec',
      position: 'Voluntary Experience',
      from: 'Jan 2021',
      to: 'Apr 2021',
      companyLink: 'https://easycybersec.com',
    },
  ],
  
  education: [
    {
      institution: 'Karpagam University',
      degree: 'B.Tech',
      from: '2015',
      to: '2019',
    },
    /*{
      institution: 'Institution Name',
      degree: 'Degree',
      from: '2012',
      to: '2014',
    },*/
  ],

  // To hide the `My Projects` section, keep it empty.
  externalProjects: [
    {
      title: '',
      description:
        '',
      imageUrl: '',
      link: '',
    },
    {
      title: '',
      description:
        '',
      imageUrl: '',
      link: '',
    },
  ],

  certifications: [
    {
      name: 'Practical Ethical Hacking',
      body: 'By TCM Security',
      year: '',
      link: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course'
    },
    {
      name: 'Practical Web Application Security & Testing',
      body: 'By The Taggart Institute',
      year: '',
      link: 'https://taggartinstitute.org/p/pwst'
    },
    {
      name: 'Intro to Bug Bounty Hunting and Web Application Hacking',
      body: 'By TheXSSRat',
      year: '',
      link: 'https://inspira.udemy.com/course/uncle-rats-bug-bounty-guide/'
    },
    {
      name: 'Practical Malware Analysis & Triage',
      body: 'By TCM Security',
      year: '',
      link: 'https://academy.tcm-sec.com/p/practical-malware-analysis-triage'
    },
    {
      name: 'Intro to Regular Expression',
      body: 'By The Taggart Institute',
      year: '',
      link: 'https://taggartinstitute.org/p/intro-to-regular-expressions'
    },
     {
      name: 'Cybersecurity Fundamentals',
      body: 'By IBM',
      year: '',
      link: 'https://www.ibm.com/training/collection/cybersecurityfundamentals'
    },
     {
      name: 'NSE 1 Network Security Associate',
      body: 'By Fortinet',
      year: '',
      link: 'https://training.fortinet.com/local/staticpage/view.php?page=nse_1'
    },
     {
      name: 'NSE 2 Network Security Associate',
      body: 'By Fortinet',
      year: '',
      link: 'https://training.fortinet.com/local/staticpage/view.php?page=nse_2'
    },
     {
      name: 'Practical Phishing Assessments',
      body: 'By Graham Helton',
      year: '',
      link: ''
    },
     {
      name: 'External Pentest Playbook',
      body: 'By TCM Security',
      year: '',
      link: 'https://academy.tcm-sec.com/p/external-pentest-playbook'
    },
     {
      name: 'Google IT Support',
      body: 'By Google',
      year: '',
      link: 'https://www.coursera.org/professional-certificates/google-it-support'
    },
     {
      name: 'Movement, Pivoting and Persistence',
      body: 'By Joe helle',
      year: '',
      link: ''
    },
     {
      name: 'Google Digital Unlocked',
      body: 'By Google',
      year: '',
      link: ''
    },
     {
      name: 'Jr Penetration Tester Learning Path',
      body: 'By TryHackMe',
      year: '',
      link: ''
    },
  ], 
  // Display blog posts from your medium or dev account. (Optional)
  blog: {
    source: 'medium', // medium | dev
    username: 'vckie', // to hide blog section, keep it empty
    limit: 10, // How many posts to display. Max is 10.
  },
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: {
    id: '',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'winter',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: true,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Hide the ring in Profile picture
    hideAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'procyon',
    ],

    // Custom theme
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  },
blog: {
    source: 'medium',
    username: 'vckie',
    limit: 5,
  },
  
  // Optional Footer. Supports plain text or HTML.
  footer: `❣️`,
};

export default config;
