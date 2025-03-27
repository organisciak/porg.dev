export type UrlMapping = {
  shorturl: string;
  destination: string;
  description?: string;
  category?: 'teaching' | 'tools' | 'presentations' | 'research' | "fun" | 'other';
};

export const urlMappings: UrlMapping[] = [
  {
    shorturl: "lis4015",
    description: "Course reserves link for LIS 4015",
    destination:
      "https://du.leganto.exlibrisgroup.com/leganto/public/01UODE_INST/lists/55033087480002766?auth=SAML",
    category: "teaching",
  },
  {
    shorturl: "acquisitions",
    description: "Digital version of acquisitions exercise for LIS 4015",
    destination: "https://claude.site/artifacts/66930404-85cb-4014-b4f7-24def8ae917f?fullscreen=true",
    category: "teaching",
  },
  {
    shorturl: "patterns",
    description: "Randomized pattern generator",
    destination: "https://claude.site/artifacts/73b647e6-ce28-4d6b-8265-51c67f6f39f5",
    category: "fun"
  },
  {
    shorturl: "poster",
    description: "Poster Parser custom GPT - upload a poster picture and can a custom calendar invite",
    destination:
      "https://chat.openai.com/g/g-md7NjNgW7-poster-parser",
    category: "tools",
  },
  {
    shorturl: "chat-strategies",
    description: "Strategies for using chat models",
    destination:
      "https://github.com/organisciak/Scripting-Course/blob/master/docs/chat-model-strategies.md",
    category: "teaching",
  },
  {
    shorturl: "book",
    description: "Book an appointment with me",
    destination:
      "https://outlook.office.com/bookwithme/user/c18251ee829c449d93137a48095330c2@du.edu?anonymous&ep=plink",
    category: "teaching",
  },
];
