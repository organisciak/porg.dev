export type UrlMapping = {
  shorturl: string;
  destination: string;
};

export const urlMappings: UrlMapping[] = [
  {
    shorturl: "lis4015",
    destination:
      "https://du.leganto.exlibrisgroup.com/leganto/public/01UODE_INST/lists/47414179690002766?auth=SAML",
  },
  {
    shorturl: "book",
    destination:
      "https://outlook.office.com/bookwithme/user/c18251ee829c449d93137a48095330c2@du.edu?anonymous&ep=plink",
  },
];
