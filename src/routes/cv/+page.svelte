<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
  import publications from './publications.json';
  import Publication from '$lib/cv/Publication.svelte';
  import type { CSLPublication, Award, Product, Course, Position, Education } from '$lib/cv/types';
  import { MetaTags } from 'svelte-meta-tags';
  import Fa from 'svelte-fa';
  import { faOrcid } from '@fortawesome/free-brands-svg-icons';

  const typedPublications: CSLPublication[] = publications;

  const awards: Award[] = [
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
        labUrl: "http://portfolio.du.edu/massivetexts",
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

  const meta = {
		title: 'Curriculum Vitae',
		description: 'CV for Dr. Peter Oragnisciak, Associate Professor and Applied AI Researcher',
		url: 'https://www.porg.dev'
	}
</script>

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

<div class="container mx-auto">
  <section itemscope itemtype="http://schema.org/Person">
    <h1 itemprop="name">{bio.name}</h1>
    <p><strong itemprop="jobTitle">{bio.title}</strong></p>
    
    <div class="flex flex-row">
      <p itemprop="worksFor" itemscope itemtype="http://schema.org/Organization">
        <span itemprop="name">University of Denver</span>
        <meta itemprop="url" content="https://www.du.edu/" />
      </p>
      <p itemprop="memberOf" itemscope itemtype="http://schema.org/ResearchOrganization"> 
        <a href={bio.labUrl} target="_blank" itemprop="name">{bio.lab}</a>
        <meta itemprop="url" content={bio.labUrl} />
      </p>
      <p>
        <Fa class='inline text-lg text-lime-500' icon={faOrcid} /> <a href={bio.orcid} target="_blank" itemprop="identifier">{bio.orcid.split('https://orcid.org/')[1]}</a>
        <meta itemprop="sameAs" content={bio.orcid} />
      </p>
      <p>
        <a href={bio.gscholar} target="_blank" itemprop="sameAs">Google Scholar</a>
        <meta itemprop="sameAs" content={bio.gscholar} />
      </p>
      <p>
        <a href={"mailto:" + bio.email} itemprop="email">{bio.email}</a>
      </p>
    </div>
  </section>

<section>
    <h2>Professional Positions</h2>
    <div class="flex flex-wrap text-sm">
      {#each professionalPositions as position}
        <div class="flex-none basis-1/4 sm:basis-1/2" itemprop="workExperience" itemscope itemtype="http://schema.org/OrganizationRole"> 
          <div class="dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5"> 
            <span class="dark:text-slate-300 font-semibold" itemprop="roleName">{position.position}</span><br/> 
            <span itemprop="memberOf" itemscope itemtype="http://schema.org/Organization">
              <span itemprop="name">{position.organization}</span>
            </span>. 
            (<span itemprop="startDate">{position.timeframe.split('-')[0]}</span>
            {#if position.timeframe.includes('-')}
              - <span itemprop="endDate">{position.timeframe.split('-')[1]}</span>
            {/if})
          </div>
        </div>
      {/each}
    </div>
</section>

<section>
    <h2>Education</h2>
    <div class="flex flex-wrap">
      {#each degrees as edu}
      <div class="flex-none basis-1/3" itemprop="alumniOf" itemscope itemtype="http://schema.org/EducationalOrganization">
        <div class="dark:bg-slate-700 m-2 rounded-lg bg-slate-200 p-5">
          <span class="dark:text-slate-300">
            <span class="font-bold" itemprop="degreeType">{edu.degree}</span>, 
            <span itemprop="name">{edu.university}</span>, 
            <span itemprop="graduationYear">{edu.year}</span>
          </span>
          <div class="text-sm p-0 m-0">
          {#if edu.additionalDetails.major}
            <p class='my-2 italic ml-4'>Major: <span itemprop="educationalProgram">{edu.additionalDetails.major}</span></p>
          {/if}
          {#if edu.additionalDetails.dissertationTitle || edu.additionalDetails.thesisTitle}
            <p class='my-2 italic ml-4'>{edu.additionalDetails.dissertationTitle ? 'Dissertation' : 'Thesis'}: <span itemprop="dissertationTitle">{edu.additionalDetails.dissertationTitle || edu.additionalDetails.thesisTitle}</span></p>
          {/if}
          {#if edu.additionalDetails.committee}
            <p class='my-2 italic ml-4'>Committee: {edu.additionalDetails.committee.join(', ')}</p>
          {/if}
          </div></div> 
        </div>
        
      {/each}

</div>
  </section>

  <section>
    <h2>Awards</h2>
    <div class="flex flex-wrap">
      {#each bioData.awards as award}
      <div class="flex-initial basis-48">
        <div class="text-sm dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5 dark:text-slate-300">
          <span class='font-semibold'>{award.name}</span>, {award.date}
        </div>
      </div>
      {/each}
    </div>
  </section>


  <section>
    <h2>Media</h2>
    <div class="flex flex-wrap">
      {#each bioData.media as media}
      <div class="flex-initial basis-96">
        <div class="text-sm dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5 dark:text-slate-300">
          <span class="font-semibold">{media.title}</span><br /><span class='italic'>{media.source}, {media.date}</span>
        </div>
      </div>
      {/each}
    </div> 
  </section>

  <section>
    <h2>Awarded Grants</h2>
    <div class="flex flex-wrap">
      {#each awards as award}
        <div class="flex-initial basis-72">
          <div class="dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5">
            <p class="font-bold text-base mb-2">{award.title}</p>
            <p class="text-xs"><span class="font-semibold">Amount:</span> {award.amount}</p>
            <p class="text-xs"><span class="font-semibold">Funder:</span> {award.funder}</p>
            {#if award.grantNumber}
              <p class="text-xs">
                <span class="font-semibold">Grant Number:</span> 
                {#if award.grantUrl}
                  <a href={award.grantUrl} target="_blank" rel="noopener noreferrer">{award.grantNumber}</a>
                {:else}
                  {award.grantNumber}
                {/if}
              </p>
            {/if}
            <p class="text-xs"><span class="font-semibold">Investigators:</span> {award.investigators.join(', ')}</p>
            <p class="text-xs"><span class="font-semibold">Timeframe:</span> {award.timeframe}</p>
            {#if award.subgrant}
              <p class="text-xs"><span class="font-semibold">Subgrant:</span> {award.subgrant}</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>



  <section>
    <h2>Publications</h2>
  </section>

  {#each pubSections as pubSection}

    <section>
      <h3>{pubSection.heading}</h3>
      {#if pubSection.comment}
        <p class="italic text-sm">{pubSection.comment}</p>
      {/if}

      <div class="flex flex-wrap">
        {#each pubSection.entries as pub}
          <Publication data={pub} />
        {/each}
      </div>
    </section>
  {/each}

  <section>
    <h2>Products</h2>
    {#each products as product}
      <h3 class="mt-4 mb-2 font-semibold">{product.category}</h3>
      <div class="flex flex-wrap">
        {#each product.items as item}
          <div class="flex-initial basis-64">
            <div class="dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5">
              <h4 class="font-bold mb-2">
                {#if item.url}
                  <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                {:else}
                  {item.name}
                {/if}
              </h4>
              {#if item.description}
                <p class="text-sm">{item.description}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </section>
  
  <section>
    <h2>Teaching</h2>
    <h3 class="mt-4 mb-2 font-semibold">Courses</h3>
    <div class="flex flex-wrap">
      {#each courses as course}
        <div class="flex-initial basis-64">
          <div class="dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5">
            <h4 class="font-bold mb-2">{course.code} - {course.title}</h4>
            <p class="text-sm">{course.credits}</p>
            {#if course.format}
              <p class="text-sm"><span class="font-semibold">Format:</span> {course.format}</p>
            {/if}
            {#if course.materials}
              <p class="text-sm">
                <span class="font-semibold">Materials:</span> 
                <a href={course.materials} target="_blank" rel="noopener noreferrer">Link</a>
              </p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

<section id="cv">
    <div class="container mx-auto mt-5">
      <div class="flex flex-row">
        <!--<div class="w-1/12 hidden md:hidden"><SvelteMarkdown source={test} /></div>-->
        <div class="w-full md:w-11/12">
            <SvelteMarkdown source={source} />
        </div>
      </div><p></p>
    </div>
  </section>
</div>

<style lang="postcss">
    p {
        @apply mx-auto my-3;
    }

    h2 {
      @apply text-center my-5;
    }

</style>