export interface IOauthEmail {
    value: string;
    verified: boolean;
}
  
export interface IOauthUser {
    id: string;
    emails: IOauthEmail[];
    name: { familyName: string; givenName: string };
    provider: string;
}