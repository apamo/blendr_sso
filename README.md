# SSO integration for SaaS partners using Blendr
SSO can be implemented to offer a seamless integration for SaaS partners using Blendr to provide native integrations to their end-customers

The SaaS partner of Blendr can add a link to Blendr's Hub (the marketplace) inside their own platform, which opens their white-labeled front-end of Blendr. Inside the URL you can add SSO information so that the user is automatically logged in, and does not need separate credentials for Blendr.

Blendr offers 3 different SSO methods:

1. JWT (preferred method)
2. Hash
3. oAuth2

Example SSO link using a JWT: https://saaspartner.admin.[ca|us|au].blendr.io/sso?jwt=xxx
Where xxx is the signed token that must be generated using your tenant's API key.

To test this project please follow the instructions outlined in the PDF document included with the project files.

More info: https://help.qlik.com/en-US/blendr/Content/documentation/sso-integration-for-saas-partners.htm
