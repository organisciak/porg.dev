export type UrlMapping = {
  shorturl: string;
  destination: string;
  description?: string;
};

export const urlMappings: UrlMapping[] = [
  {
    shorturl: "lis4015",
    description: "Course reserves link for LIS 4015",
    destination:
      "https://du.leganto.exlibrisgroup.com/leganto/public/01UODE_INST/lists/52628494590002766?auth=SAML",
  },
  {
    shorturl: "acquisitions",
    description: "Digital version of acquisitions exercise for LIS 4015",
    destination: "https://claude.site/artifacts/66930404-85cb-4014-b4f7-24def8ae917f",
  },
  {
    shorturl: "poster",
    destination:
      "https://chat.openai.com/g/g-md7NjNgW7-poster-parser",
  },
  {
    shorturl: "chat-strategies",
    destination:
      "https://github.com/organisciak/Scripting-Course/blob/master/docs/chat-model-strategies.md",
  },
  {
    shorturl: "book",
    destination:
      "https://outlook.office.com/bookwithme/user/c18251ee829c449d93137a48095330c2@du.edu?anonymous&ep=plink",
  },
];
