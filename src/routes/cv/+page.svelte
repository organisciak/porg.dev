<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import publications from './publications.json';
	import Publication from '$lib/cv/Publication.svelte';
	import type { CSLPublication, Award, Product, Course, Position, Education } from '$lib/cv/types';
	import { MetaTags } from 'svelte-meta-tags';
	import Fa from 'svelte-fa';
	import { faOrcid } from '@fortawesome/free-brands-svg-icons';
	import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
	import { onDestroy, onMount } from 'svelte';
	import SNESHeader from '$lib/header/SNESHeader.svelte';
	import { hideStandardHeader } from '$lib/stores/headerVisibility';

	const typedPublications: CSLPublication[] = publications;

	// Utility to normalize various grant number formats (e.g., remove PR/Award prefix)
	function cleanGrantNumber(id: string) {
		return id.replace(/^PR\/?Award\s*#?\s*/i, '').trim();
	}

	let stars: { x: number; y: number; size: number; twinkleDelay: number; brightness: number }[] = [];
	let mounted = false;
	let lightTheme = false;

	function toggleTheme() {
		lightTheme = !lightTheme;
	}

	onMount(() => {
		hideStandardHeader.set(true);
		stars = Array.from({ length: 120 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() > 0.85 ? 3 : Math.random() > 0.5 ? 2 : 1,
			twinkleDelay: Math.random() * 4,
			brightness: 0.4 + Math.random() * 0.6
		}));
		mounted = true;
	});

	// Update body background when theme changes
	$: if (typeof document !== 'undefined') {
		document.body.style.background = lightTheme ? '#fbf7f1' : '#0a0a1a';
	}

	onDestroy(() => {
		hideStandardHeader.set(false);
	});

	// Collapsible config for awards section

	const awards: Award[] = [
		{
			title: "Innovative AI Systems for Nurturing and Assessing Creativity in K-12 Learning Environments",
			amount: "$898,326",
			funder: "National Science Foundation",
			grantNumber: "2507129",
			grantUrl: "https://www.nsf.gov/awardsearch/show-award?AWD_ID=2507129",
			investigators: [
				"Organisciak, P. (Principal Investigator)",
				"Acar, S. (Co-PI)",
				"Dong, Y. (Co-PI)"
			],
			timeframe: "2025-2028"
		},
		{
			title: "Measuring Original Thinking in Elementary School: A Computational Psychometric Approach",
			amount: "$964,081",
			funder: "Institute of Education Sciences",
			grantNumber: "R305A200519",
			grantUrl: "https://ies.ed.gov/funding/grantsearch/details.asp?ID=4477",
			investigators: ["Selcuk Acar (University of North Texas, Principal)", "Dumas, D. G. (Co-Principal)", "Organisciak, P. (Co-Principal)"],
			timeframe: "2020-2024",
			subgrant: "DU sub-grant: $451,988"
		},
		{
			title: "Collaborative Analysis Liaison Librarians (CALL)",
			amount: "$883,034",
			funder: "Institution of Library and Museum Services",
			grantNumber: "RE-13-19-0027-19",
			grantUrl: "https://www.imls.gov/grants/awarded/re-13-19-0027-19",
			investigators: ["Wade Bishop (Principal, University of Tennessee Knoxville)", "Carole Tenopir (UTK, Co-Principal)", "Suzie Allard (UTK, Co-Principal)", "Organisciak, P. (Director)"],
			timeframe: "2019-2022",
			subgrant: "DU total: $129,746.00"
		},
		{
			title: "Text Duplication and Similarity in Massive Digital Collections",
			amount: "$276,943",
			funder: "Institute of Museum and Library Services",
			grantNumber: "LG-86-18-0061-18",
			grantUrl: "https://www.imls.gov/grants/awarded/lg-86-18-0061-18",
			investigators: ["Organisciak, P. (Principal)"],
			timeframe: "2018-2021"
		},
		{
			title: "Exploring the Billions of Words in the HathiTrust Corpus with Bookworm: HathiTrust + Bookworm",
			amount: "$324,841",
			funder: "National Endowment for the Humanities",
			investigators: ["Downie, J. S. (Illinois, Principal)", "Aiden, E. L. (Rice University)"],
			timeframe: "2014-2017"
		}
	];

	// Collapsible config for awards section
	let showMoreAwards: boolean = false;
	const primaryAwards = awards.slice(0, 3);
	const extraAwards = awards.slice(3);

  const products: Product[] = [
    {
      category: "Research Websites and Tools",
      items: [
        {
          name: "Open Creativity Scoring (OCS)",
          url: "https://openscoring.du.edu",
          description: "(2207 unique users, June 2020-August 2022)"
        },
        {
          name: "SaDDL",
          url: "https://saddl.du.edu"
        },
        {
          name: "Bookworm",
          url: "https://bookworm.htrc.illinois.edu"
        },
        {
          name: "Bookworm Playground",
          url: "https://bookworm.htrc.illinois.edu/app/"
        }
      ]
    },
    {
      category: "Software",
      items: [
        {
          name: "HTRC Features Reader",
          url: "http://github.com/htrc/htrc-feature-reader",
          description: "A mature, long-developed library for working with non-consumptive book data."
        },
        {
          name: "Open Scoring",
          url: "https://github.com/massivetexts/open-scoring",
          description: "Tools for creativity scoring."
        }
      ]
    }
  ];

  const courses: Course[] = [
    {
      code: "LIS 4700AI",
      title: "AI/IA - Artificial Intelligence in the Information Age",
      credits: "3 credit hours",
      format: "in-person",
      materials: "https://ai.porg.dev"
    },
    {
      code: "LIS 4015",
      title: "User and Access Services",
      credits: "3 credit hours",
      format: "in-person"
    },
    {
      code: "LIS 4015",
      title: "User and Access Services",
      credits: "2 credit hours",
      format: "online"
    },
    {
      code: "LIS 4220",
      title: "Data Curation",
      credits: "3 credit hours"
    },
    {
      code: "LIS 4235",
      title: "Scripting for Large Databases",
      credits: "4 credit hours",
      materials: "https://github.com/organisciak/Scripting-Course"
    },
    {
      code: "LIS 4700DH",
      title: "Digital Humanities",
      credits: "3 credit hours"
    },
    {
      code: "590TXT, LIS4991TXT",
      title: "Text Mining",
      credits: "3 credit hours",
      materials: "https://github.com/organisciak/Text-Mining-Course",
      format: "Independent study at DU"
    }
  ];

  const source = `

### Directed Student Learning, Dissertation Committee Member

-   Matthew Durward . \"Audience Specific Text Recommendation for
    English Language Learners" University of Canterbury. (2021-)

-   Jill Talley. \"Paving pathways for success: The role of transition
    models and disability services in postsecondary education for
    students with disabilities\" (2021)

-   Paige Alfonso. \"Exploring the relations between identity and
    digital media activity processes: A mixed-methods psychological
    investigation into connective action\" (2019-2020)

### Capstone, Committee Chair

-   Michele Newman. \"A Taxonomy of Game Mechanics\" (2022)

-   Sarah Beals. \"Crowdsourced Data and Visualizing Theme Park Wait
    Times\" (2020)

-   Matthew Durward. \"Constructing a Platform to Assist English
    Language Learners with Film Selection\" (2020)

-   Kevin Stevens. \"Historiography as a Signature Pedagogical Approach
    to Information Literacy Instruction\" (2020)

-   Rita Zhang. \"A Framework of Active Exploratory Book
    Recommendation\" (2020)

-   Lee Howick. \"Faculty Opinions and Use of Open Access Publishing at
    the University of Denver\" (2020)

-   Nicolas Pares. The Effects of Research Data Management Services:
    Associating the Data Curation Lifecycle with Open Research Output\"
    (2020)

-   Vince Garin. \"How Digital Humanities Challenges Publishing and
    Academic Labor Paradigms\" (2019)

-   Micah Saxton. \"Best Practices for Topic Modeling,\" Library &
    Information Science. (2018)

-   Sheena Young. "Library Thunderdome: Fake News vs. Information
    Literacy" (2018)

### Capstone, Committee Member

-   Summer Shetenhelm. \"Copyright Statements in Plains to Peaks
    Collective Digital Collections\" (2019)

-   Fatih Gunaydin. \"Assessment of Current Research Data Services in
    Terms of Technical Services\" (2019)

### Thesis, Committee Chair

-   Nicolas Pares. \"Human-Centered Search Process: A Grounded Theory
    Study on the Modern Search Experience\" (2022)

## Non-Credit Instruction Taught

### Guest Lecture

-   Topic: "Introduction to Docker for Data Curation\". Data Curation,
    University of Illinois at Urbana-Champaign. Allen Renear. (Recorded
    for online course, 2018).

-   Topic: "Usability Design". Digital Libraries, University of Illinois
    at Urbana-Champaign, J. Stephen Downie.

### Guest Lecture, DU

-   Topic: "Digital Humanities", Organization of Information, University
    of Denver. Krystyna Matusiak (2017-18, recorded for online course
    2019-)

-   Topic: "Scholarly and Professional Communication", Foundations of
    Library and Information Science, University of Denver. Mary
    Stansbury (2017)

## Faculty Development Activities Attended

OTL Faculty Workshop or Training, \"Teaching@DU Short Course,\" Office
of Teaching and Learning, Denver, CO, NF. (August 1, 2017 - December 31,
2017).

# Professional Service

## University Service

Committee Member, Open Access Fund. (June 2021 - Present).

## Professional Memberships

Association for the Advancement of Artificial Intelligence. (November
2013 - Present).

American Society for Information Science and Technology. (2011 -
Present).

Association for Computing Machinery. (2011 - Present).

Alliance of Digital Humanities Organizations. (2010 - Present).

Canadian Society for Digital Humanities. (2009 - 2013).

Canadian Association for Information Science. (2009 - 2011).

## Committee Chair

Committee Chair, iSchools Conference Student Symposium Chair, Barcelona.
(July 1, 2022 - March 2023).

## Committee Member

Committee Member, Program Committee of Digital Humanities Workshop (DHW) 2021. (2021).

Committee Member, JCDL 2019 Outreach Committee. (May 2018 - June 2019).

Associate Chair, iConference 2019 Program Committee, College Park,
Maryland. (June 2018 - February 2019).

Committee Member, HCOMP Program Committee. (January 2018 - October
2018).

Committee Member, JCDL Program Committee. (January 2018 - July 2018).

### Guest Editor

Guest Co-Editor, Special Issue on "Conceptual Models of the
Sociotechnical", Journal of Association for Information Science and
Technology (JASIST) (2021-2022).

### Editorial Review Board Member

Editorial Review Board Member, Przegląd Biblioteczny, Warsaw. (August
2021 - Present).

Editorial Review Board Member, Journal of Open Humanities Data. (July
2015 - Present).

## Officer

President, Special Interest Group on Digital Libraries. (October 2020 -
October 2021).

## Conference Organizer

Organizer, First Digital Front Range Symposium, Digital Scholarship in
the Front Range, Denver, Colorado. (May 5, 2018).

## Reviewer, Grant Panelist

Panelist, National Endowment for the Humanities, Washington, D.C.
(August 2018).

## Reviewer, Conference Paper

*Since 2017.*

Association for Information Science and Technology. (2010 - 2019).

Digital Humanities. (2009 - 2021).

WebConf. (November 2018).

iConference. (September 2017 - October 2017).

Human-Centered Data Science and Social Computing. (October 2, 2017).

## Reviewer, Journal Article

*Since 2017*.

- Creativity Research Journal (2023-)

- Behavioral Research Methods (2022-)

- Journal of the Association for Information Science & Technology (2022).

- Advances in Cognitive Psychology (2022).

- Digital Humanities Quarterly. (April 2022).

- International Journal for Digital Libraries. (March 2022 -- August
2022).

- Data in Brief. (January 2022 - March 2022).

- Journal of Open Humanities Data. (January 2022).

- Symmetry. (January 2022).

- Electronics (June 2022).

- Mathematics. (December 2021).

- Applied Sciences. (August 2021 - November 2021).

- Entropy. (October 2021).

- Telematics and Informatics. (June 2019).

- Transactions on Information Systems. (October 2017).

# Consulting

Higher Education, University of North Texas, Denton, TX. (May 2022 -
July 2022).

Working with Dr. Selcuk Acar on developing a pilot of methods for
scoring originality and elaboration in figural (i.e., drawn) tests of
creativity.

Higher Education, Université du Québec à Montréal, Montreal, Canada.
(August 2021).

Working with Dr. Pier-Luc de Chantel to develop an API to Open
Creativity Scoring, making that system's scoring methods available to
use in other tools and websites, such as Qualtrics.
	`

	const bio = {
        name: "Dr. Peter Organisciak",
        title: "Department Chair and Associate Professor, University of Denver, Research Methods and Information Science",
        lab: "Massive Texts Lab",
        labUrl: "https://github.com/massivetexts",
        orcid: "https://orcid.org/0000-0002-9058-2280",
        email: "peter.organisciak@du.edu",
        gscholar: "https://scholar.google.com/citations?hl=en&user=RfHXG5EAAAAJ&view_op=list_works&sortby=pubdate",
    };

  const professionalPositions: Position[] = [
        {
      "position": "Department Chair, Research Methods and Information Science",
      "organization": "University of Denver",
      "timeframe": "January 2025-present"
    },
    {
      "position": "Associate Professor",
      "organization": "University of Denver",
      "timeframe": "September 2023-present"
    },
    {
      "position": "Assistant Professor",
      "organization": "University of Denver",
      "timeframe": "September 2017-August 2023"
    },
    {
      "position": "Postdoctoral Research Associate",
      "organization": "HathiTrust Research Center",
      "timeframe": "2015-2017"
    },
    {
      "position": "Research Intern",
      "organization": "Microsoft Research",
      "timeframe": "April 2013 - August 2013"
    }
  ]

const degrees: Education[]= [
    {
      "degree": "Ph.D.",
      "university": "University of Illinois at Urbana-Champaign",
      "year": "2015",
      "additionalDetails": {
        "major": "Library and Information Science",
        "dissertationTitle": "Design Problems in Crowdsourcing: Improving the Quality of Crowd-Based Data Collection",
        "committee": ["Michael Twidale", "J. Stephen Downie", "Miles Efron", "Jaime Teevan"]
      }
    },
    {
      "degree": "MA",
      "university": "University of Alberta",
      "year": "2010",
      "additionalDetails": {
        "major": "Humanities Computing - Library and Information Studies",
        "thesisTitle": "Why Bother? Examining the motivations of users in large-scale crowd-powered online initiatives",
        "committee": ["Lisa Given", "Geoffrey Rockwell", "Stan Ruecker"]
      }
    },
    {
      "degree": "BA",
      "university": "McMaster University",
      "year": "2008",
      "additionalDetails": {
        "major": "Communication Studies and Multimedia"
      }
    }
  ]

const bioData = {
  "awards": [
    {
      "name": "Teaching Appreciation Dinner, University of Denver",
      "date": "March 2020"
    },
    {
      "name": "Best Short Research Paper Winner, iSchools Conference",
      "date": "June 2019"
    },
    {
      "name": "Notable Paper, Conference on Human Computation and Crowdsourcing",
      "date": "2014"
    },
    {
      "name": "Outstanding Contribution Award, Canadian Society for Digital Humanities",
      "date": "2014"
    },
    {
      "name": "Best Paper, Association for Information Science and Technology",
      "date": "2011"
    },
    {
      "name": "Best Student Paper, Canadian Society for Digital Humanities",
      "date": "2011"
    }
  ],
  "media": [
    {
      "title": "It's Out of Africa meets Pretty Woman! The Art and Science of Mixture Descriptions",
      "source": "Katy Waldman, Slate (Lexicon Valley: A Blog about Language)",
      "date": "November 23, 2015"
    },
    {
      "title": "Online crowds can guess what you want to watch or buy.",
      "source": "Hal Hodson, New Scientist, 2989",
      "date": "October 2, 2014"
    }
  ]
}

type ExtendedAbstractExtension = {
  genre: 'Long Paper Talk' | 'Poster';
};

type AbstractExtension = {
  genre: 'Proceedings Short Article' | 'Proceedings Long Article';
};

type PresentationExtension = {
  genre: "Conference Presentation"
}

const pubSections: {heading:string, entries:CSLPublication[], comment?:string}[] =
        [
          {
            heading: "Journal Articles",
            entries: typedPublications.filter(p => p.type === 'article-journal')
          },
          {
            heading: "Book Chapters",
            entries: typedPublications.filter(p => p.type === 'chapter')
          },
          {
            heading: "Proceedings Paper",
            entries: typedPublications.filter(function(p) {
              return p.type === "paper-conference"  && (p.genre === 'Proceedings Short Article' || p.genre === 'Proceedings Long Article')
              }) as (CSLPublication & AbstractExtension)[]
          },
          {
            heading: "Reports",
            entries: typedPublications.filter(p => p.type === "report")
          },
          {
            heading: "Extended Abstracts",
            comment: "Long paper abstracts at certain Humanities and Social Science venues, and poster extended-abstracts in Computer and Information Science proceedings.",
            entries: typedPublications.filter(function (pub) {
              return pub.type === 'speech' && (pub.genre === 'Long Paper Talk' || pub.genre === 'Poster')
            }) as (CSLPublication & ExtendedAbstractExtension)[]
          },
          {
            heading: "Presentations (refereed)",
            comment: "Conference presentations refereed from peer-reviewed short abstracts, as at Education conferences and some Social Science and Humanities conferences.",
            entries: typedPublications.filter(function (pub) {
              return (pub.type === 'speech' && 
                      (pub.genre === 'Conference Presentation')
              )
            }) as (CSLPublication & PresentationExtension)[]
          },
          {
            heading: "Presentations (invited)",
            entries: typedPublications.filter(function (pub) {
              return (pub.type === 'speech' && 
                      (pub.genre === 'Invited Talk')
              )
            }) as (CSLPublication & {"genre": "Invited Talk"})[]
          },
          {
            heading: "Presentations (other)",
            entries: typedPublications.filter(function (pub) {
              return (pub.type === 'speech' && 
                      (pub.genre === 'Talk (Other)')
              )
            }) as (CSLPublication & {"genre": "Talk (Other)"})[]
          },
          {
            heading: "Workshops (refereed)",
            entries: typedPublications.filter(function (pub) {
              return (pub.type === 'event' && 
                      (pub.genre === 'Refereed Workshop')
              )
            }) as (CSLPublication & {"genre": 'Refereed Workshop'})[]
          },
          {
            heading: "Teaching Workshops",
            entries: typedPublications.filter(function (pub) {
              return (pub.type === 'event' && 
                      (pub.genre === 'Invited Teaching Workshop')
              )
            }) as (CSLPublication & {"genre": 'Invited Teaching Workshop'})[]
          },
          {
            heading: "Panels",
            entries: typedPublications.filter(function (pub) {
              return (pub.type === 'speech' && 
                      (pub.genre === 'Panel')
              )
            }) as (CSLPublication & {"genre": 'Panel'})[]
          },
          {
            heading: "Posters",
            comment: "Conference posters associated with a peer-reviewed short abstract.",
            entries: typedPublications.filter(function (pub) {
              return (pub.type === 'paper-conference' && 
                      (pub.extra === 'Poster')
              )
            }) as (CSLPublication & {"genre": 'Poster'})[]
          }
  ]

  // Publication section show-more controls and limits
  let pubShowMore: Record<string, boolean> = {};
  const pubLimits: Record<string, number> = {
    'Journal Articles': 8,
    'Book Chapters': 4,
    'Proceedings Paper': 8,
    'Reports': 4,
    'Extended Abstracts': 6,
    'Presentations (refereed)': 8,
    'Presentations (invited)': 6,
    'Presentations (other)': 6,
    'Workshops (refereed)': 6,
    'Teaching Workshops': 6,
    'Panels': 6,
    'Posters': 6
  };
  pubSections.forEach(s => pubShowMore[s.heading] = false);

  const meta = {
			title: 'Curriculum Vitae',
			description: 'CV for Dr. Peter Oragnisciak, Associate Professor and Applied AI Researcher',
			url: 'https://www.porg.dev'
		}

  // Global expand/collapse across collapsible sections
  let expandAll: boolean = false;
  function setAllCollapsed(expanded: boolean) {
    expandAll = expanded;
    showMoreAwards = expanded;
    // publications
    pubSections.forEach((s) => (pubShowMore[s.heading] = expanded));
  }

  // Toggle group: newer vs all
  let displayMode: 'newer' | 'all' = 'newer';
  $: setAllCollapsed(displayMode === 'all');

  function setDisplayMode(mode: 'newer' | 'all', reapply = false) {
    const changed = displayMode !== mode;
    displayMode = mode;
    if (reapply || changed) {
      setAllCollapsed(mode === 'all');
    }
  }
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Press+Start+2P&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">

	<MetaTags 
		title="{meta.title}"
		canonical="{meta.url}"
		description="{meta.description}"
		openGraph={{
			siteName: 'porg.dev',
			type: 'website',
			url: meta.url,
			locale: 'en_US',
			title: meta.title,
			description: meta.description,
			images: [
			  {
				url: 'https://en.gravatar.com/userimage/77028/c3830b8a81f001e01a2f5e96ade157b8.jpg?size=200',
				alt: 'Photo of Dr. Peter Organisciak',
				width: 200,
				height: 200,
				type: 'image/png'
			  }
			]
		}}
		twitter={{
			handle: '@porg',
			site: '@porg',
			cardType: 'summary_large_image',
			title: meta.title,
			description: meta.description,
			image: 'https://en.gravatar.com/userimage/77028/c3830b8a81f001e01a2f5e96ade157b8.jpg?size=200',
			imageAlt: 'Photo of Dr. Peter Organisciak'
		  }}
		/>
</svelte:head>

<SNESHeader />

<div class="snes-page" class:light-theme={lightTheme}>
	<div class="stars-container">
		{#if mounted}
			{#each stars as star}
				<div
					class="star"
					style="left: {star.x}%; top: {star.y}%; width: {star.size}px; height: {star.size}px; animation-delay: {star.twinkleDelay}s; opacity: {star.brightness};"
				></div>
			{/each}
		{/if}
	</div>

	<div class="scanlines"></div>

	<div class="content">
		<div class="pixel-border-top"></div>

		<section class="hero" itemscope itemtype="http://schema.org/Person">
			<h1 class="hero-name" itemprop="name">{bio.name}</h1>
			<p class="hero-title"><strong itemprop="jobTitle">{bio.title}</strong></p>

			<div class="hero-panel">
				<div class="hero-item" itemprop="worksFor" itemscope itemtype="http://schema.org/Organization">
					<span itemprop="name">University of Denver</span>
					<meta itemprop="url" content="https://www.du.edu/" />
				</div>
				<div class="hero-item" itemprop="memberOf" itemscope itemtype="http://schema.org/ResearchOrganization">
					<a href={bio.labUrl} target="_blank" itemprop="name" rel="noopener noreferrer">{bio.lab}</a>
					<meta itemprop="url" content={bio.labUrl} />
				</div>
				<div class="hero-item">
					<Fa class="orcid-icon" icon={faOrcid} />
					<a href={bio.orcid} target="_blank" itemprop="identifier" rel="noopener noreferrer">{bio.orcid.split('https://orcid.org/')[1]}</a>
					<meta itemprop="sameAs" content={bio.orcid} />
				</div>
				<div class="hero-item">
					<a href={bio.gscholar} target="_blank" itemprop="sameAs" rel="noopener noreferrer">Google Scholar</a>
					<meta itemprop="sameAs" content={bio.gscholar} />
				</div>
				<div class="hero-item">
					<a href={"mailto:" + bio.email} itemprop="email">{bio.email}</a>
				</div>
			</div>
		</section>

		<div class="toggle-row">
			<button
				type="button"
				class="theme-toggle"
				on:click={toggleTheme}
				aria-label={lightTheme ? 'Switch to dark mode' : 'Switch to light mode'}
			>
				<Fa icon={lightTheme ? faMoon : faSun} />
			</button>
			<nav aria-label="Display range" class="toggle-nav">
				<button
					type="button"
					on:click={() => setDisplayMode('newer', true)}
					class={`toggle-link ${displayMode==='newer' ? 'active' : ''}`}
					aria-current={displayMode==='newer' ? 'true' : 'false'}
				>Show newer</button>
				<span class="toggle-divider">·</span>
				<button
					type="button"
					on:click={() => setDisplayMode('all', true)}
					class={`toggle-link ${displayMode==='all' ? 'active' : ''}`}
					aria-current={displayMode==='all' ? 'true' : 'false'}
				>Show all</button>
			</nav>
		</div>

		<section class="cv-section">
			<h2 class="section-title">Professional Positions</h2>
			<div class="panel">
				<ul class="stack-list">
					{#each professionalPositions as position}
						<li class="stack-item" itemprop="workExperience" itemscope itemtype="http://schema.org/OrganizationRole">
							<div class="stack-row">
								<div>
									<span class="stack-title" itemprop="roleName">{position.position}</span> at
									<span itemprop="memberOf" itemscope itemtype="http://schema.org/Organization">
										<span itemprop="name">{position.organization}</span>
									</span>
								</div>
								<div class="stack-meta">
									<span class="chip">
										{position.timeframe}
									</span>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="cv-section">
			<h2 class="section-title">Education</h2>
			<div class="panel">
				<ul class="stack-list">
					{#each degrees as edu}
						<li class="stack-item" itemprop="alumniOf" itemscope itemtype="http://schema.org/EducationalOrganization">
							<div class="stack-row">
								<div>
									<span class="stack-title" itemprop="degreeType">{edu.degree}</span> at
									<span itemprop="name">{edu.university}</span>
								</div>
								<div class="stack-meta">
									<span class="chip" itemprop="graduationYear">{edu.year}</span>
								</div>
							</div>
							<div class="stack-details">
								{#if edu.additionalDetails.major}
									<span class="detail-item">Major: <span itemprop="educationalProgram">{edu.additionalDetails.major}</span></span>
								{/if}
								{#if edu.additionalDetails.dissertationTitle || edu.additionalDetails.thesisTitle}
									<span class="detail-item">{edu.additionalDetails.dissertationTitle ? 'Dissertation' : 'Thesis'}: <span itemprop="dissertationTitle">{edu.additionalDetails.dissertationTitle || edu.additionalDetails.thesisTitle}</span></span>
								{/if}
								{#if edu.additionalDetails.committee}
									<span class="detail-item">Committee: {edu.additionalDetails.committee.join(', ')}</span>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="cv-section">
			<h2 class="section-title">Awarded Grants</h2>
			<div class="panel">
				{#if awards && awards.length}
					<ul class="stack-list compact">
						{#each primaryAwards as award}
							<li class="stack-item">
								<p class="stack-title">{award.title}</p>
								<p class="stack-details">
									<span class="detail-item"><span class="detail-label">Funder:</span> {award.funder}</span>
									<span class="detail-item"><span class="detail-label">Amount:</span> {award.amount}</span>
									{#if award.grantNumber}
										<span class="detail-item"><span class="detail-label">Grant #:</span>
											{#if award.grantUrl}
												<a href={award.grantUrl} target="_blank" rel="noopener noreferrer">{cleanGrantNumber(award.grantNumber)}</a>
											{:else}
												{cleanGrantNumber(award.grantNumber)}
											{/if}
										</span>
									{/if}
									<span class="detail-item"><span class="detail-label">Timeframe:</span> {award.timeframe}</span>
									{#if award.subgrant}
										<span class="detail-item"><span class="detail-label">Subgrant:</span> {award.subgrant}</span>
									{/if}
									<span class="detail-item"><span class="detail-label">Investigators:</span> {award.investigators.join(', ')}</span>
								</p>
							</li>
						{/each}
						{#if extraAwards.length > 0}
							{#if showMoreAwards}
								{#each extraAwards as award}
									<li class="stack-item">
										<p class="stack-title">{award.title}</p>
										<p class="stack-details">
											<span class="detail-item"><span class="detail-label">Funder:</span> {award.funder}</span>
											<span class="detail-item"><span class="detail-label">Amount:</span> {award.amount}</span>
											{#if award.grantNumber}
												<span class="detail-item"><span class="detail-label">Grant #:</span>
													{#if award.grantUrl}
														<a href={award.grantUrl} target="_blank" rel="noopener noreferrer">{cleanGrantNumber(award.grantNumber)}</a>
													{:else}
														{cleanGrantNumber(award.grantNumber)}
													{/if}
												</span>
											{/if}
											<span class="detail-item"><span class="detail-label">Timeframe:</span> {award.timeframe}</span>
											{#if award.subgrant}
												<span class="detail-item"><span class="detail-label">Subgrant:</span> {award.subgrant}</span>
											{/if}
											<span class="detail-item"><span class="detail-label">Investigators:</span> {award.investigators.join(', ')}</span>
										</p>
									</li>
								{/each}
								<li class="stack-item">
									<button class="link-button" on:click={() => showMoreAwards = false}>Show fewer</button>
								</li>
							{:else}
								<li class="stack-item">
									<button class="link-button" on:click={() => showMoreAwards = true}>+{extraAwards.length} more</button>
								</li>
							{/if}
						{/if}
					</ul>
				{/if}
			</div>
		</section>



		<section class="cv-section">
			<h2 class="section-title">Publications</h2>
		</section>

		{#each pubSections as pubSection}
			<section class="cv-section">
				<h3 class="section-subtitle">{pubSection.heading}</h3>
				{#if pubSection.comment}
					<p class="section-comment">{pubSection.comment}</p>
				{/if}

				<div class="panel publications-panel">
					<div class="publication-grid">
						{#if pubShowMore[pubSection.heading]}
							{#each pubSection.entries as pub}
								<Publication data={pub} />
							{/each}
						{:else}
							{#each pubSection.entries.slice(0, (pubLimits[pubSection.heading] ?? 6)) as pub}
								<Publication data={pub} />
							{/each}
						{/if}
					</div>
					{#if pubSection.entries.length > (pubLimits[pubSection.heading] ?? 6)}
						<div class="panel-actions">
							<button class="link-button" on:click={() => pubShowMore[pubSection.heading] = !pubShowMore[pubSection.heading]}>
								{pubShowMore[pubSection.heading] ? 'Show fewer' : `+${pubSection.entries.length - (pubLimits[pubSection.heading] ?? 6)} more`}
							</button>
						</div>
					{/if}
				</div>
			</section>
		{/each}

		<section class="cv-section">
			<h2 class="section-title">Products</h2>
			{#each products as product}
				<h3 class="section-subtitle">{product.category}</h3>
				<div class="panel">
					<div class="card-grid">
						{#each product.items as item}
							<div class="card">
								<h4 class="card-title">
									{#if item.url}
										<a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
									{:else}
										{item.name}
									{/if}
								</h4>
								{#if item.description}
									<p class="card-body">{item.description}</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</section>
  
		<section class="cv-section">
			<h2 class="section-title">Teaching</h2>
			<h3 class="section-subtitle">Courses</h3>
			<div class="panel">
				<div class="card-grid">
					{#each courses as course}
						<div class="card">
							<h4 class="card-title">{course.code} - {course.title}</h4>
							<p class="card-body">{course.credits}</p>
							{#if course.format}
								<p class="card-body"><span class="detail-label">Format:</span> {course.format}</p>
							{/if}
							{#if course.materials}
								<p class="card-body">
									<span class="detail-label">Materials:</span>
									<a href={course.materials} target="_blank" rel="noopener noreferrer">Link</a>
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Move Awards and Media further down for concision near the top -->
		<section class="cv-section">
			<h2 class="section-title">Awards</h2>
			<div class="panel">
				<div class="card-grid compact">
					{#each bioData.awards as award}
						<div class="card">
							<span class="card-title">{award.name}</span>
							<p class="card-body">{award.date}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="cv-section">
			<h2 class="section-title">Media</h2>
			<div class="panel">
				<div class="card-grid wide">
					{#each bioData.media as media}
						<div class="card">
							<span class="card-title">{media.title}</span>
							<p class="card-body">{media.source}, {media.date}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section id="cv" class="cv-section">
			<h2 class="section-title">Additional Service</h2>
			<div class="panel prose-panel">
				<SvelteMarkdown source={source} />
			</div>
		</section>
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
		background: #0a0a1a;
	}

	.snes-page {
		font-family: 'Press Start 2P', monospace;
		min-height: 100vh;
		background: linear-gradient(180deg, #0a0a1a 0%, #161633 45%, #0a0a1a 100%);
		position: relative;
		color: #e6e6e6;
	}

	.stars-container {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.star {
		position: absolute;
		background: #fff;
		border-radius: 0;
		animation: twinkle 2s ease-in-out infinite;
	}

	@keyframes twinkle {
		0%, 100% { opacity: var(--star-opacity, 0.6); }
		50% { opacity: 0.2; }
	}

	.scanlines {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 50;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.15) 0px,
			rgba(0, 0, 0, 0.15) 1px,
			transparent 1px,
			transparent 2px
		);
	}

	.content {
		position: relative;
		z-index: 10;
		max-width: 1000px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.pixel-border-top {
		width: 100%;
		max-width: 920px;
		height: 8px;
		margin: 0 auto;
		background: repeating-linear-gradient(
			90deg,
			#ffcc00 0px,
			#ffcc00 8px,
			#ff6600 8px,
			#ff6600 16px,
			#ff0066 16px,
			#ff0066 24px,
			#cc00ff 24px,
			#cc00ff 32px,
			#00ccff 32px,
			#00ccff 40px
		);
		image-rendering: pixelated;
	}

	.hero {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.hero-name {
		margin: 0;
		font-size: clamp(1.2rem, 3.5vw, 2.2rem);
		color: #fff;
		text-shadow:
			3px 3px 0 #ff6600,
			-1px -1px 0 #00ccff,
			0 0 20px rgba(255, 102, 0, 0.5);
		letter-spacing: 0.12em;
	}

	.hero-title {
		margin: 0;
		font-size: 0.6rem;
		color: #88ccff;
		line-height: 1.6;
	}

	.hero-panel {
		margin-top: 0.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 0.75rem;
		background: rgba(10, 10, 26, 0.7);
		border: 2px solid #2c2c50;
		padding: 1rem;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
	}

	.hero-item {
		font-size: 0.55rem;
		color: #cfd6ff;
		background: #121228;
		border: 1px solid #2f2f58;
		padding: 0.5rem 0.75rem;
		text-align: left;
	}

	.hero-item a {
		color: #ffcc00;
		text-decoration: none;
	}

	.hero-item a:hover {
		text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
	}

	.orcid-icon {
		font-size: 0.7rem;
		color: #7cff6b;
		margin-right: 0.35rem;
	}

	.toggle-row {
		display: flex;
		justify-content: flex-end;
	}

	.toggle-nav {
		font-size: 0.5rem;
		color: #777;
		display: flex;
		align-items: center;
	}

	.toggle-link {
		color: #777;
		text-decoration: none;
		padding: 0.2rem 0.4rem;
		transition: color 0.15s ease;
		background: none;
		border: none;
		font-family: inherit;
		cursor: pointer;
	}

	.toggle-link.active {
		color: #ffcc00;
		text-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
	}

	.toggle-link:hover {
		color: #fff;
	}

	.toggle-divider {
		margin: 0 0.4rem;
		color: #444;
	}

	.cv-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section-title {
		font-size: 0.8rem;
		text-align: center;
		color: #fff;
		margin: 0;
		letter-spacing: 0.08em;
		text-shadow: 0 0 12px rgba(0, 204, 255, 0.4);
	}

	.section-subtitle {
		font-size: 0.65rem;
		color: #ffcc00;
		margin: 0.5rem 0 0;
		letter-spacing: 0.08em;
	}

	.section-comment {
		font-size: 0.5rem;
		color: #88ccff;
		margin: 0;
	}

	.panel {
		background: rgba(18, 18, 40, 0.9);
		border: 2px solid #2c2c50;
		padding: 1rem;
		box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
	}

	.publications-panel {
		padding: 0.75rem;
	}

	.prose-panel {
		font-size: 0.55rem;
		line-height: 1.7;
		color: #cfd6ff;
	}

	.prose-panel :global(p) {
		margin: 0.6rem 0;
	}

	.prose-panel :global(h3),
	.prose-panel :global(h2) {
		color: #ffcc00;
		margin: 1rem 0 0.4rem;
		font-size: 0.6rem;
	}

	.stack-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.stack-list.compact {
		gap: 0.5rem;
	}

	.stack-item {
		font-size: 0.55rem;
		color: #cfd6ff;
		border-bottom: 1px dashed #2a2a4a;
		padding-bottom: 0.75rem;
	}

	.stack-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.stack-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.stack-title {
		color: #fff;
	}

	.stack-meta {
		display: flex;
		justify-content: flex-end;
	}

	.chip {
		background: #22224a;
		border: 1px solid #3a3a6a;
		padding: 0.2rem 0.4rem;
		font-size: 0.45rem;
		color: #ffcc00;
	}

	.stack-details {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
		font-size: 0.5rem;
		color: #9fb7ff;
		margin-top: 0.35rem;
	}

	.detail-item {
		display: inline-block;
	}

	.detail-label {
		color: #fff;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 0.75rem;
	}

	.card-grid.compact {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	.card-grid.wide {
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.card {
		background: #161633;
		border: 1px solid #2f2f58;
		padding: 0.75rem;
	}

	.card-title {
		font-size: 0.6rem;
		color: #fff;
		display: block;
		margin-bottom: 0.35rem;
	}

	.card-body {
		font-size: 0.5rem;
		color: #9fb7ff;
		margin: 0.2rem 0 0;
	}

	.publication-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.panel-actions {
		margin-top: 0.5rem;
	}

	.link-button {
		background: none;
		border: none;
		color: #ffcc00;
		font-family: inherit;
		font-size: 0.5rem;
		cursor: pointer;
		padding: 0;
	}

	.link-button:hover {
		text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
	}

	:global(.snes-page .publication) {
		background: #161633;
		border: 1px solid #2f2f58;
		border-radius: 0;
		padding: 0.75rem;
		margin: 0;
		width: 100%;
		color: #cfd6ff;
	}

	:global(.snes-page .publication h2) {
		font-size: 0.55rem;
		color: #fff;
		margin: 0 0 0.35rem;
	}

	:global(.snes-page .publication p),
	:global(.snes-page .publication span),
	:global(.snes-page .publication strong) {
		font-size: 0.5rem;
		color: #9fb7ff;
	}

	:global(.snes-page .publication a) {
		color: #ffcc00;
		text-decoration: none;
	}

	:global(.snes-page .publication a:hover) {
		text-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
	}

	:global(.snes-page .publication .pub-button) {
		background: #22224a;
		border: 1px solid #3a3a6a;
		color: #ffcc00;
		font-size: 0.5rem;
		padding: 0.3rem 0.5rem;
		border-radius: 0;
	}

	:global(.snes-page .publication .pub-button:hover) {
		background: #2a2a5a;
		text-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
	}

	:global(.snes-page .publication .pub-button a) {
		color: #ffcc00;
	}

	@media (max-width: 720px) {
		.content {
			padding: 2rem 1rem 3rem;
		}

		.hero-panel {
			grid-template-columns: 1fr;
		}

		.toggle-row {
			justify-content: center;
		}

		.card-grid,
		.card-grid.compact,
		.card-grid.wide,
		.publication-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Theme toggle button */
	.theme-toggle {
		background: rgba(34, 34, 74, 0.8);
		border: 2px solid #3a3a6a;
		color: #ffcc00;
		font-size: 0.8rem;
		padding: 0.4rem 0.6rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.theme-toggle:hover {
		background: #2a2a5a;
		text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
	}

	/* Light theme overrides */
	.light-theme {
		--ink: #15152b;
		--muted-ink: #5b5b70;
		--paper: #fffdf8;
		--paper-edge: #e6dfd5;
		--paper-shadow: rgba(21, 21, 43, 0.12);
		--accent-warm: #ff9f1c;
		--accent-cool: #00b4d8;
		--accent-ink: #7c3aed;
		background:
			radial-gradient(circle at 12% 12%, rgba(255, 159, 28, 0.12), transparent 45%),
			radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.12), transparent 45%),
			linear-gradient(180deg, #fbf7f1 0%, #f1f1f7 100%);
		color: var(--ink);
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.light-theme .stars-container {
		display: none;
	}

	.light-theme .scanlines {
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.03) 0px,
			rgba(0, 0, 0, 0.03) 1px,
			transparent 1px,
			transparent 2px
		);
	}

	.light-theme .hero-name {
		font-family: 'Fraunces', serif;
		letter-spacing: -0.02em;
		color: var(--ink);
		text-shadow:
			0 2px 0 rgba(255, 159, 28, 0.35),
			0 0 18px rgba(124, 58, 237, 0.15);
	}

	.light-theme .hero-title {
		color: var(--muted-ink);
	}

	.light-theme .hero-panel {
		background: linear-gradient(135deg, #ffffff 0%, #fff6ef 100%);
		border-color: var(--paper-edge);
		box-shadow: 6px 6px 0 var(--paper-shadow);
		border-radius: 12px;
	}

	.light-theme .hero-item {
		background: #fffdf8;
		border-color: var(--paper-edge);
		color: var(--muted-ink);
		border-radius: 10px;
	}

	.light-theme .hero-item a {
		color: var(--accent-ink);
	}

	.light-theme .section-title {
		font-family: 'Fraunces', serif;
		letter-spacing: 0.02em;
		color: var(--ink);
		text-shadow: 0 0 8px rgba(124, 58, 237, 0.15);
	}

	.light-theme .section-subtitle {
		color: var(--accent-warm);
	}

	.light-theme .section-comment {
		color: var(--muted-ink);
	}

	.light-theme .panel {
		background: linear-gradient(135deg, #ffffff 0%, #fff6ef 100%);
		border-color: var(--paper-edge);
		box-shadow: 6px 6px 0 var(--paper-shadow);
		border-radius: 12px;
	}

	.light-theme .stack-item {
		color: var(--muted-ink);
		border-bottom-color: var(--paper-edge);
	}

	.light-theme .stack-title {
		color: var(--ink);
	}

	.light-theme .chip {
		background: rgba(255, 159, 28, 0.16);
		border-color: rgba(255, 159, 28, 0.4);
		color: #7a4a00;
		border-radius: 999px;
	}

	.light-theme .stack-details {
		color: var(--muted-ink);
	}

	.light-theme .detail-label {
		color: var(--ink);
	}

	.light-theme .card {
		background: #fffdf8;
		border-color: var(--paper-edge);
		border-radius: 10px;
	}

	.light-theme .card-title {
		color: var(--ink);
	}

	.light-theme .card-body {
		color: var(--muted-ink);
	}

	.light-theme .link-button {
		color: var(--accent-ink);
	}

	.light-theme .prose-panel {
		color: var(--muted-ink);
	}

	.light-theme .prose-panel :global(h3),
	.light-theme .prose-panel :global(h2) {
		color: var(--accent-ink);
	}

	.light-theme .toggle-link {
		color: var(--muted-ink);
	}

	.light-theme .toggle-link.active {
		color: var(--accent-ink);
		text-shadow: none;
	}

	.light-theme .toggle-link:hover {
		color: var(--ink);
	}

	.light-theme .theme-toggle {
		background: #fffdf8;
		border-color: var(--paper-edge);
		color: var(--muted-ink);
	}

	.light-theme .theme-toggle:hover {
		background: #fff0e1;
		color: var(--ink);
	}

	/* Light theme publication overrides */
	:global(.light-theme .publication) {
		background: #fffdf8;
		border-color: var(--paper-edge);
		color: var(--muted-ink);
		border-radius: 10px;
	}

	:global(.light-theme .publication h2) {
		color: var(--ink);
	}

	:global(.light-theme .publication p),
	:global(.light-theme .publication span),
	:global(.light-theme .publication strong) {
		color: var(--muted-ink);
	}

	:global(.light-theme .publication a) {
		color: var(--accent-ink);
	}

	:global(.light-theme .publication .pub-button) {
		background: rgba(255, 159, 28, 0.16);
		border-color: rgba(255, 159, 28, 0.4);
		color: #7a4a00;
	}

	:global(.light-theme .publication .pub-button:hover) {
		background: rgba(255, 159, 28, 0.25);
	}

	:global(.light-theme .publication .pub-button a) {
		color: #7a4a00;
	}
</style>
