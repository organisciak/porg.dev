<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
  import publications from './publications.json';
  import Publication from '$lib/cv/Publication.svelte';
  import type { CSLPublication } from '$lib/cv/types';

  const typedPublications: CSLPublication[] = publications;

  const funding = `
  ### Awarded

\"Measuring Original Thinking in Elementary School: A Computational
Psychometric Approach\" (2020-2023) \
\$964,081 \
Institute of Education Sciences
[#R305A200519](https://ies.ed.gov/funding/grantsearch/details.asp?ID=4477) \
Selcuk Acar (University of North Texas, Principal), Dumas, D. G.
(Co-Principal), **Organisciak, P.** (Co-Principal) \
DU sub-grant: \$451,988.


\"Collaborative Analysis Liaison Librarians (CALL)\" (2019-2022)\
\$883,034 \
Institution of Library and Museum Services.
[#RE-13-19-0027-19](https://www.imls.gov/grants/awarded/re-13-19-0027-19) \ 
Wade Bishop (Principal, University of Tennessee Knoxville), Carole
Tenopir (UTK, Co-Principal), Suzie Allard (UTK, Co-Principal),
**Organisciak, P.** (Director). \
DU total: \$129,746.00.


\"Text Duplication and Similarity in Massive Digital Collections\"
(2018-2021) \
\$276,943 (Total value: \$351,031) \
Institute of Museum and Library Services.
[#LG-86-18-0061-18](https://www.imls.gov/grants/awarded/lg-86-18-0061-18) \
**Organisciak, P.** (Principal)


"Exploring the Billions of Words in the HathiTrust Corpus with Bookworm:
HathiTrust + Bookworm" (2014-2017) \
\$324,841 (Total value: \$504,373). \
National Endowment for the Humanities. \
Downie, J. S. (Illinois, Principal), Aiden, E. L. (Rice University).
\$324,841. NEH implementation grant. Sept 2014-Aug 2017.


**DU Sponsored - Awarded**


Dumas, D. G., **Organisciak, P.**, 84335, Internal Awards, \"FB-Dumas
Organisciak\", \$6,486.00. (start: April 1, 2019, end: June 30, 2020).


**Organisciak, P.**, Internal Awards, \"MOODs: Identifying Outlier
Passages and Texts in the Legislative Process\", \$5,040.56, Awarded,
peer-reviewed/refereed. (sub: April 2, 2018, start: July 2018, end: June
2019).
  `

	const source = `
## Panels


Acar, S., Lee, L. E., Rinn-McCann, A., Mun, R., Rambo-Hernandez, K., Berthiaume, K., Dumas, D.,
**Organisciak, P.**, Flemister, T., Grajzel, K., Newman, M., Eby, D., Deshayes, C., Puryear, J. (2023).
"Classic and Novel Approaches in Creativity Assessment and Programming: Implications for Gifted Education,"
Annual Meeting, AERA, Chicago, IL.


Boughida, K., Zhang, B., **Organisciak, P.**, D’Agostino, S., (2023)
"ChatGPT: The Future of Higher Ed and Libraries, Brought to You by AI,"
CNI Spring 2023 Membership Meeting,  Coalition for Networked Information, Denver, CO, USA.


Booth, K., Sanchez, J., Bishop, B. W., **Organisciak, P.** (2023).
"Resilience in iSchools cohort education during a turbulent time: Improved normalcy through systemic inclusivity and other lessons learned to optimize virtual and physical spaces,"
iConference 2023, iSchools Consortium, Barcelona, Spain.


Bishop, B. W., **Organisciak, P.**, Mayernik M., Cowan, M. (2021).
\"Assessing the Research Data Management Landscape Through Practice and
Education,\" Federation of Earth Science Information Partners, Online.


Ruecker, S., Rockwell, G., **Organisciak, P.**, Meunier, J.-G.,
Eberle-Sinatra, M., Galey, A., Morrison, A., Siemens, R. (2009). Annual
Meeting of the Society for Digital Humanities, \"Graduate Education in
the Digital Humanities,\" Carleton University, Ottawa, Canada.


## Posters


*Conference posters associated with a peer-reviewed short abstract.*


Durward, M., **Organisciak, P.**, Matusiak, K. (2020). \"Advancing
Technologies for Traditional Library Services: Utilizing Content Based
Recommendation to Assist in Readers\' Advisory,\" World Library and
Information Congress (WLIC), International Federation of Library
Associations and Institutions, Dublin, Ireland.


Ryan, M., Gypin, L., Matusiak, K., Schmidt, B. M., **Organisciak, P.**,
(2020). \"Conceptual Modeling of Similarities and Duplication in
Large-Scale Digital Libraries,\" Digital Humanities 2020, Alliance for
Digital Humanities Organization, Ottawa.


**Organisciak, P.**, Pares, N. (2020). \"MOODs: Identifying Outlier
Passages and Texts in the Legislative Process,\" 6th International
Conference on Computational Social Science. Cambridge, MA/Online.


**Organisciak, P.** (2018). \"Including Phrases in Bags of Words,\"
Uncamp 2018, HathiTrust Research Center, Berkeley.


**Organisciak, P.**, Teevan, J., Twidale, M. B. (2018). \"Asking the
Right Way: Design Interventions for Microtasks,\" The sixth AAAI
Conference on Human Computation and Crowdsourcing, Association for
Advancement of Artificial Intelligence, Quebec City, Canada.


**Organisciak, P.**, Teevan, J., Dumais, S., Miller, R. C., Kalai, A.
(2013), \"Personalized Human Computation,\" Conference on Human
Computation and Crowdsourcing (HCOMP 2013). AAAI, Palm Springs, CA.


**Organisciak, P.**, Rockwell, G., Sinclair, S., Ruecker, S., (2009).
\"Text Analysis for me Too: An embeddable text analysis widget,\" Annual
Meeting of the Society for Digital Humanities, SDH/SEMI.


Sinclair, S., Beacon, D., Brown, S., Downie, J. S., Fiorentino, C.,
Juola, P., **Organisciak, P.**, Rockwell, G., Schreibman, S., Uszkalo,
K. (2009). \"TADA Research Evaluation Exchange: Winning 2008
Submissions,\" Digital Humanities 2009, University of Maryland, USA.


# Products


## Research Websites and Tools


Open Creativity Scoring (OCS) -- <https://openscoring.du.edu>\
(2207 unique users, June 2020-August 2022)
SaDDL -- [https://saddl.du.edu](https://saddl.du.edu/)
Bookworm -- <https://bookworm.htrc.illinois.edu>\
Bookworm Playground - <https://bookworm.htrc.illinois.edu/app/>


## Software


HTRC Features Reader - <http://github.com/htrc/htrc-feature-reader>\
A mature, long-developed library for working with non-consumptive book
data.


Open Scoring - <https://github.com/massivetexts/open-scoring>\
Tools for creativity scoring.


# Teaching


## Teaching Experience


### Courses


LIS 4015 -- User and Access Services


3 credit hours (in-person). 2 credit hours (online).


LIS 4220 -- Data Curation

3 credit hours.


LIS 4235 -- Scripting for Large Databases

4 credit hours. Course materials available at
<https://github.com/organisciak/Scripting-Course>.

LIS 4700DH -- Digital Humanities

3 credit hours.

590TXT, LIS4991TXT -- Text Mining

Course materials available at
<https://github.com/organisciak/Text-Mining-Course> (Alt metrics: 98
stars, 29 forks). Originally taught at University of Illinois, this
course is only taught at DU as an independent study, LIS 4991.

## Directed Student Learning

### Dissertation, Committee Member

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

Committee Member, Program Committee of Digital Humanities Workshop (DHW)
2021. (2021).

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

# Products

## Research Websites and Tools

- Open Creativity Scoring (OCS) -- <https://openscoring.du.edu>\
(2207 unique users, June 2020-August 2022)
- SaDDL -- [https://saddl.du.edu](https://saddl.du.edu/)
- Bookworm -- <https://bookworm.htrc.illinois.edu>\
- Bookworm Playground - <https://bookworm.htrc.illinois.edu/app/>

## Software

HTRC Features Reader - <http://github.com/htrc/htrc-feature-reader>\
A mature, long-developed library for working with non-consumptive book
data.

Open Scoring - <https://github.com/massivetexts/open-scoring>\
Tools for creativity scoring.

# Teaching

## Teaching Experience

### Courses

LIS 4015 -- User and Access Services

3 credit hours (in-person). 2 credit hours (online).

LIS 4220 -- Data Curation

3 credit hours.

LIS 4235 -- Scripting for Large Databases

4 credit hours. Course materials available at
<https://github.com/organisciak/Scripting-Course>.

LIS 4700DH -- Digital Humanities

3 credit hours.

590TXT, LIS4991TXT -- Text Mining

Course materials available at
<https://github.com/organisciak/Text-Mining-Course> (Alt metrics: 98
stars, 29 forks). Originally taught at University of Illinois, this
course is only taught at DU as an independent study, LIS 4991.

## Directed Student Learning

### Dissertation, Committee Member

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

Committee Member, Program Committee of Digital Humanities Workshop (DHW)
2021. (2021).

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

Association for Information Science and Technology. (2010 - 2019),
Digital Humanities (2009 - 2021),
WebConf (2018-23),
iConference (2017),
Human-Centered Data Science and Social Computing (2017).

## Reviewer, Journal Article

*Since 2017*.

Behavior Research Methods (2023),
Social Network Analysis and Mining (2022-23),
Journal of the Association for Information Science & Technology (2022),
Advances in Cognitive Psychology (2022), 
Digital Humanities Quarterly (2022),
International Journal for Digital Libraries. (2022),
Data in Brief (2022),
Journal of Open Humanities Data (2022),
Symmetry, (2022),
Electronics, (2022),
Mathematics, (2021, 2022),
Applied Sciences (2021, 2022),
Entropy (2021),
Telematics and Informatics (2019),
Transactions on Information Systems.(2017).

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
        title: "Associate Professor, University of Denver, Research Methods and Information Science",
        lab: "Massive Texts Lab",
        labUrl: "http://portfolio.du.edu/massivetexts",
        orcid: "https://orcid.org/0000-0002-9058-2280"
    };

    type positions = {
        position: string,
        organization: string,
        timeframe: string
    }

    const professionalPositions: positions[] = [
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

  type education = {
        degree: string,
        university: string,
        year: string,
        additionalDetails: {
            major?: string,
            dissertationTitle?: string,
            thesisTitle?: string,
            committee?: string[]
        }
  }

const degrees: education[]= [
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
            heading: "Book Chapters",
            entries: typedPublications.filter(p => p.type === 'chapter')
          },
          {
            heading: "Journal Articles",
            entries: typedPublications.filter(p => p.type === 'article-journal')
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
          }
  ]

	const headings = source.split('\n').filter((x)=> (x[0] === '#'));

	function head2md(x: string) { 
		const indent = x.split(' ')[0].replaceAll('#', '  ') + '- ';
		const text = x.replaceAll('#', ' ').trim()
		const id = '#' + x.replaceAll('#', ' ').trim().toLowerCase().replaceAll(' ', '-')
		return `${indent}[${text}](${id})`
	}	
	const test = headings.map(head2md).join('\n').trim().replaceAll('\n  ', '\n')

</script>

<svelte:head>
	<title>Curriculum Vitae</title>
	<meta name="description" content="Peter Organisciak's Curriculum Vitae" />
</svelte:head>

<div class="container mx-auto">
<section>
    <h1>{bio.name}</h1>
    <p><strong>{bio.title}</strong></p>
    <p>{bio.lab}: <a href={bio.labUrl} target="_blank">{bio.labUrl}</a></p>
    <p>ORCID: <a href={bio.orcid} target="_blank">{bio.orcid}</a></p>
</section>

<section>
    <h2>Professional Positions</h2>
    <div class="flex flex-wrap">
      {#each professionalPositions as position}
        <div class="flex-none w-48 dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5"> 
            <span class="dark:text-slate-300">{position.position}</span><br/> {position.organization}. ({position.timeframe})
        </div>
      {/each}
    </div>
</section>

<section>
    <h2>Education</h2>
    <div class="flex flex-wrap">
      {#each degrees as edu}
      <div class="flex-none w-48 dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5">
          <span class="dark:text-slate-300"><span class="font-bold">{edu.degree}</span>, {edu.university}, {edu.year}</span>
          <div class="text-sm p-0 m-0">
          {#if edu.additionalDetails.major}
            <p class='my-2 italic ml-4'>Major: {edu.additionalDetails.major}</p>
          {/if}
          {#if edu.additionalDetails.dissertationTitle || edu.additionalDetails.thesisTitle}
            <p class='my-2 italic ml-4'>{edu.additionalDetails.dissertationTitle ? 'Dissertation' : 'Thesis'}: {edu.additionalDetails.dissertationTitle || edu.additionalDetails.thesisTitle}</p>
          {/if}
          {#if edu.additionalDetails.committee}
            <p class='my-2 italic ml-4'>Committee: {edu.additionalDetails.committee.join(', ')}</p>
          {/if}
          </div></div> 
        
      {/each}

</div>
  </section>

  <section>
    <h2>Funding</h2>
    <div class="flex flex-row">
      <div class="w-full md:w-11/12">
          <SvelteMarkdown source={funding} />
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

<section id="cv">
    <div class="container mx-auto mt-5">
      <div class="flex flex-row">
        <div class="w-1/12 hidden md:hidden"><SvelteMarkdown source={test} /></div>
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